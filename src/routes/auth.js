// ============================================================
// Zynovexa - Auth API Routes
// Handles: signup, login, logout, session check, onboarding
// ============================================================
import { Hono } from 'hono';
import { generateId, hashPassword, verifyPassword, createToken, apiSuccess, apiError } from '../lib/utils';
import { JWT_SECRET } from '../lib/auth';
const auth = new Hono();
// POST /api/auth/signup - Create new account
auth.post('/signup', async (c) => {
    try {
        const { email, name, password } = await c.req.json();
        if (!email || !name || !password) {
            return c.json(apiError('Email, name, and password are required'), 400);
        }
        if (password.length < 6) {
            return c.json(apiError('Password must be at least 6 characters'), 400);
        }
        const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (existing) {
            return c.json(apiError('Email already registered'), 409);
        }
        const userId = generateId('usr');
        const passwordHash = await hashPassword(password);
        await c.env.DB.prepare('INSERT INTO users (id, email, name, password_hash, provider) VALUES (?, ?, ?, ?, ?)').bind(userId, email.toLowerCase(), name, passwordHash, 'email').run();
        await c.env.DB.prepare('INSERT INTO subscriptions (id, user_id, plan, status, current_period_start) VALUES (?, ?, ?, ?, ?)').bind(generateId('sub'), userId, 'free', 'active', new Date().toISOString()).run();
        const token = await createToken({ userId, role: 'user' }, JWT_SECRET);
        c.header('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`);
        return c.json(apiSuccess({ token, user: { id: userId, email: email.toLowerCase(), name, role: 'user', onboarded: 0, plan: 'free' } }, 'Account created'));
    }
    catch (e) {
        return c.json(apiError(e.message || 'Signup failed'), 500);
    }
});
// POST /api/auth/login - Login with email/password
auth.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();
        if (!email || !password) {
            return c.json(apiError('Email and password are required'), 400);
        }
        const user = await c.env.DB.prepare('SELECT id, email, name, password_hash, role, niche, onboarded, plan, avatar_url, timezone FROM users WHERE email = ?').bind(email.toLowerCase()).first();
        if (!user) {
            return c.json(apiError('Invalid credentials'), 401);
        }
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return c.json(apiError('Invalid credentials'), 401);
        }
        const token = await createToken({ userId: user.id, role: user.role }, JWT_SECRET);
        c.header('Set-Cookie', `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`);
        await c.env.DB.prepare('INSERT INTO activity_logs (id, user_id, action, details) VALUES (?, ?, ?, ?)')
            .bind(generateId('log'), user.id, 'login', 'User logged in').run();
        return c.json(apiSuccess({
            token, user: {
                id: user.id, email: user.email, name: user.name, role: user.role,
                niche: user.niche, onboarded: user.onboarded, plan: user.plan,
                avatar_url: user.avatar_url, timezone: user.timezone
            }
        }, 'Login successful'));
    }
    catch (e) {
        return c.json(apiError(e.message || 'Login failed'), 500);
    }
});
// GET /api/auth/me - Get current session user
auth.get('/me', async (c) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '') || '';
    if (!token)
        return c.json(apiError('No session'), 401);
    const { verifyToken } = await import('../lib/utils');
    const payload = await verifyToken(token, JWT_SECRET);
    if (!payload)
        return c.json(apiError('Invalid session'), 401);
    const user = await c.env.DB.prepare('SELECT id, email, name, role, niche, onboarded, plan, avatar_url, timezone FROM users WHERE id = ?').bind(payload.userId).first();
    if (!user)
        return c.json(apiError('User not found'), 404);
    return c.json(apiSuccess({ user }));
});
// POST /api/auth/onboard - Complete onboarding
auth.post('/onboard', async (c) => {
    try {
        const token = c.req.header('Authorization')?.replace('Bearer ', '') || '';
        const { verifyToken } = await import('../lib/utils');
        const payload = await verifyToken(token, JWT_SECRET);
        if (!payload)
            return c.json(apiError('Auth required'), 401);
        const { niche, goals, plan } = await c.req.json();
        await c.env.DB.prepare('UPDATE users SET niche = ?, onboarded = 1, plan = ?, updated_at = datetime("now") WHERE id = ?').bind(niche || '', plan || 'free', payload.userId).run();
        if (plan && plan !== 'free') {
            await c.env.DB.prepare('UPDATE subscriptions SET plan = ?, updated_at = datetime("now") WHERE user_id = ?').bind(plan, payload.userId).run();
        }
        return c.json(apiSuccess({ onboarded: true }, 'Onboarding complete'));
    }
    catch (e) {
        return c.json(apiError(e.message || 'Onboarding failed'), 500);
    }
});
// POST /api/auth/logout
auth.post('/logout', async (c) => {
    c.header('Set-Cookie', 'session=; Path=/; HttpOnly; Max-Age=0');
    return c.json(apiSuccess(null, 'Logged out'));
});
export default auth;
