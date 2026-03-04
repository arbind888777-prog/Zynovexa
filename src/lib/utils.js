// ============================================================
// Zynovexa - Utility Functions Library
// Shared helpers for ID generation, auth, and response formatting
// ============================================================
/** Generate a unique ID with optional prefix */
export function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}
/** Simple password hash (production would use bcrypt via external service) */
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'Zynovexa_salt_2026');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
/** Verify password against hash */
export async function verifyPassword(password, hash) {
    const computed = await hashPassword(password);
    return computed === hash;
}
/** Create a JWT-like session token (using Web Crypto for Cloudflare Workers) */
export async function createToken(payload, secret) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`));
    const sig = btoa(String.fromCharCode(...new Uint8Array(signature)));
    return `${header}.${body}.${sig}`;
}
/** Verify and decode a token */
export async function verifyToken(token, secret) {
    try {
        const [header, body, sig] = token.split('.');
        if (!header || !body || !sig)
            return null;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
        const signatureBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
        const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(`${header}.${body}`));
        if (!valid)
            return null;
        const payload = JSON.parse(atob(body));
        if (payload.exp && payload.exp < Date.now())
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
/** Standard API success response */
export function apiSuccess(data, message = 'Success') {
    return { success: true, message, data };
}
/** Standard API error response */
export function apiError(message, code = 400) {
    return { success: false, message, error: code };
}
/** Get pagination params from request */
export function getPagination(url) {
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    return { page, limit, offset: (page - 1) * limit };
}
