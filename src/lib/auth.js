import { verifyToken } from '../lib/utils';
const JWT_SECRET = 'Zynovexa_jwt_secret_2026_production';
/** Auth middleware - attaches user to context */
export async function authMiddleware(c, next) {
    const token = c.req.header('Authorization')?.replace('Bearer ', '') ||
        getCookie(c, 'session');
    if (!token) {
        return c.json({ success: false, message: 'Authentication required' }, 401);
    }
    const payload = await verifyToken(token, JWT_SECRET);
    if (!payload) {
        return c.json({ success: false, message: 'Invalid or expired session' }, 401);
    }
    c.set('userId', payload.userId);
    c.set('userRole', payload.role || 'user');
    await next();
}
/** Admin-only middleware */
export async function adminMiddleware(c, next) {
    const role = c.get('userRole');
    if (role !== 'admin') {
        return c.json({ success: false, message: 'Admin access required' }, 403);
    }
    await next();
}
/** Optional auth - doesn't block, just sets user if available */
export async function optionalAuth(c, next) {
    const token = c.req.header('Authorization')?.replace('Bearer ', '') ||
        getCookie(c, 'session');
    if (token) {
        const payload = await verifyToken(token, JWT_SECRET);
        if (payload) {
            c.set('userId', payload.userId);
            c.set('userRole', payload.role || 'user');
        }
    }
    await next();
}
function getCookie(c, name) {
    const cookies = c.req.header('Cookie') || '';
    const match = cookies.match(new RegExp(`${name}=([^;]+)`));
    return match ? match[1] : '';
}
export { JWT_SECRET };
