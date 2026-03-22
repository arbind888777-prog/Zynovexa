const fs = require('fs');
const path = require('path');

const root = process.cwd();

const files = {
  rootEnv: path.join(root, '.env'),
  apiEnv: path.join(root, 'apps', 'api', '.env'),
  webEnv: path.join(root, 'apps', 'web', '.env.local'),
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed[key] = value;
  }

  return parsed;
}

function isPlaceholder(value) {
  if (!value) {
    return true;
  }

  const lowered = value.toLowerCase();
  const markers = [
    'your_project_ref',
    '[your-project-ref]',
    'your_public_anon_key',
    'your_service_role_key',
    '[your-password]',
    'change_me',
    'placeholder',
    'your-app-password',
    'yourdomain.com',
    'your-google-client',
    'your-youtube-data-api-key',
    'your-base64-encoded',
    'your-super-secret',
    'sk-your-',
    'whsec_your-',
    'pk_test_your_',
    'your@gmail.com',
  ];

  return markers.some((marker) => lowered.includes(marker));
}

function collectMissing(env, keys) {
  return keys.filter((key) => !env[key]);
}

function collectPlaceholders(env, keys) {
  return keys.filter((key) => env[key] && isPlaceholder(env[key]));
}

function printSection(title) {
  console.log(`\n${title}`);
  console.log('-'.repeat(title.length));
}

function printList(prefix, items) {
  for (const item of items) {
    console.log(`${prefix} ${item}`);
  }
}

const apiEnv = parseEnvFile(files.apiEnv);
const webEnv = parseEnvFile(files.webEnv);
const rootEnv = parseEnvFile(files.rootEnv);

const requiredApiKeys = [
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
  'BACKEND_URL',
];

const requiredWebKeys = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const apiProblems = [];
const webProblems = [];
const sharedProblems = [];

if (!apiEnv) {
  apiProblems.push('apps/api/.env file is missing');
}

if (!webEnv) {
  webProblems.push('apps/web/.env.local file is missing');
}

if (!rootEnv) {
  sharedProblems.push('.env file is missing at the repository root');
}

if (apiEnv) {
  const missingApi = collectMissing(apiEnv, requiredApiKeys);
  const placeholderApi = collectPlaceholders(apiEnv, requiredApiKeys);

  if (!apiEnv.REDIS_URL && !(apiEnv.REDIS_HOST && apiEnv.REDIS_PORT)) {
    apiProblems.push('Redis config is incomplete: set REDIS_URL or REDIS_HOST + REDIS_PORT');
  }

  if (apiEnv.SUPABASE_URL && !/^https:\/\/.+\.supabase\.co$/i.test(apiEnv.SUPABASE_URL)) {
    apiProblems.push('SUPABASE_URL should look like https://PROJECT_REF.supabase.co');
  }

  if (apiEnv.DATABASE_URL && !apiEnv.DATABASE_URL.includes('sslmode=require')) {
    apiProblems.push('DATABASE_URL should include sslmode=require for Supabase');
  }

  if (apiEnv.DIRECT_URL && !apiEnv.DIRECT_URL.includes('sslmode=require')) {
    apiProblems.push('DIRECT_URL should include sslmode=require for Supabase');
  }

  apiProblems.push(...missingApi.map((key) => `Missing API value: ${key}`));
  apiProblems.push(...placeholderApi.map((key) => `Placeholder still present in API env: ${key}`));
}

if (webEnv) {
  const missingWeb = collectMissing(webEnv, requiredWebKeys);
  const placeholderWeb = collectPlaceholders(webEnv, requiredWebKeys);

  if (webEnv.NEXT_PUBLIC_SUPABASE_URL && !/^https:\/\/.+\.supabase\.co$/i.test(webEnv.NEXT_PUBLIC_SUPABASE_URL)) {
    webProblems.push('NEXT_PUBLIC_SUPABASE_URL should look like https://PROJECT_REF.supabase.co');
  }

  webProblems.push(...missingWeb.map((key) => `Missing web value: ${key}`));
  webProblems.push(...placeholderWeb.map((key) => `Placeholder still present in web env: ${key}`));
}

if (apiEnv && webEnv) {
  if (apiEnv.SUPABASE_URL && webEnv.NEXT_PUBLIC_SUPABASE_URL && apiEnv.SUPABASE_URL !== webEnv.NEXT_PUBLIC_SUPABASE_URL) {
    sharedProblems.push('API SUPABASE_URL and web NEXT_PUBLIC_SUPABASE_URL do not match');
  }

  if (apiEnv.SUPABASE_ANON_KEY && webEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY && apiEnv.SUPABASE_ANON_KEY !== webEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    sharedProblems.push('API SUPABASE_ANON_KEY and web NEXT_PUBLIC_SUPABASE_ANON_KEY do not match');
  }
}

printSection('Supabase setup check');
console.log(`Root env: ${fs.existsSync(files.rootEnv) ? 'found' : 'missing'}`);
console.log(`API env:  ${fs.existsSync(files.apiEnv) ? 'found' : 'missing'}`);
console.log(`Web env:  ${fs.existsSync(files.webEnv) ? 'found' : 'missing'}`);

if (apiProblems.length) {
  printSection('API issues');
  printList('x', apiProblems);
}

if (webProblems.length) {
  printSection('Web issues');
  printList('x', webProblems);
}

if (sharedProblems.length) {
  printSection('Cross-file issues');
  printList('x', sharedProblems);
}

const totalProblems = apiProblems.length + webProblems.length + sharedProblems.length;

if (totalProblems === 0) {
  printSection('Status');
  console.log('OK: Supabase-related env values look ready.');
  console.log('Next: run Prisma migrations and start Redis before using queues.');
  process.exit(0);
}

printSection('Next actions');
console.log('1. Fill the remaining placeholders in apps/api/.env and apps/web/.env.local.');
console.log('2. Keep API and web Supabase URL/anon key values identical.');
console.log('3. Make sure Redis is running because Bull queues do not use Supabase.');
console.log('4. Re-run: npm run supabase:check');

process.exit(1);