import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // ── Server ──────────────────────────────────────────────────
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  // ── Database ────────────────────────────────────────────────
  DATABASE_URL: Joi.string().required().pattern(/^postgresql?:\/\//).messages({
    'any.required': 'DATABASE_URL is required (e.g., postgresql://user:pass@host:5432/db)',
    'string.pattern.base': 'DATABASE_URL must start with postgresql:// or postgres://',
  }),

  // ── Redis ───────────────────────────────────────────────────
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // ── JWT ─────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_ACCESS_SECRET must be at least 16 characters for security',
    'any.required': 'JWT_ACCESS_SECRET is required',
  }),
  JWT_REFRESH_SECRET: Joi.string().min(16).required().messages({
    'string.min': 'JWT_REFRESH_SECRET must be at least 16 characters for security',
    'any.required': 'JWT_REFRESH_SECRET is required',
  }),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  // ── Frontend ────────────────────────────────────────────────
  FRONTEND_URL: Joi.string().default('http://localhost:3001'),
  API_URL: Joi.string().default('http://localhost:4000'),

  // ── Google OAuth (optional in dev) ──────────────────────────
  GOOGLE_CLIENT_ID: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('placeholder-client-id'),
  }),
  GOOGLE_CLIENT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('placeholder-secret'),
  }),
  GOOGLE_CALLBACK_URL: Joi.string().optional(),

  // ── OpenAI ──────────────────────────────────────────────────
  OPENAI_API_KEY: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // ── Stripe (optional in dev) ────────────────────────────────
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),

  // ── Email (optional in dev) ─────────────────────────────────
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASS: Joi.string().optional(),
  MAIL_FROM: Joi.string().optional(),

  // ── Uploads ────────────────────────────────────────────────
  UPLOAD_DIR: Joi.string().optional(),

  // ── YouTube Data API v3 ─────────────────────────────────────
  YOUTUBE_DATA_API_KEY: Joi.string().optional(),

  // ── Token Encryption (AES-256-GCM) ───────────────────────────
  TOKEN_ENCRYPTION_KEY: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required().messages({ 'any.required': 'TOKEN_ENCRYPTION_KEY is required in production' }),
    otherwise: Joi.optional(),
  }),
}).options({ allowUnknown: true }); // allow extra env vars
