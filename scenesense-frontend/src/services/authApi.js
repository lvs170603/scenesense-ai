/**
 * src/services/authApi.js
 * Thin wrappers around the Flask auth endpoints.
 * Base URL is read from VITE_API_URL env var (falls back to localhost:5000).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
        // Throw with the server's message for easy display
        throw new Error(data.message || 'An unexpected error occurred');
    }
    return data;
}

/**
 * Create a new account.
 * @param {{ full_name, email, password, confirm_password }} payload
 */
export async function signup(payload) {
    return request('/auth/signup', payload);
}

/**
 * Verify the 6-digit OTP sent to the user's email.
 * @param {{ email, otp }} payload
 */
export async function verifyOtp(payload) {
    return request('/auth/verify-otp', payload);
}

/**
 * Request a new OTP to be sent to the user's email.
 * @param {{ email }} payload
 */
export async function resendOtp(payload) {
    return request('/auth/resend-otp', payload);
}

/**
 * Log in and receive a JWT token.
 * @param {{ email, password }} payload
 * @returns {{ token, user, verified, message }}
 */
export async function login(payload) {
    return request('/auth/login', payload);
}

/** Persist JWT + basic user info to localStorage. */
export function saveSession(token, user) {
    localStorage.setItem('ss_token', token);
    localStorage.setItem('ss_user', JSON.stringify(user));
}

/** Read the stored JWT token (or null). */
export function getToken() {
    return localStorage.getItem('ss_token');
}

/** Clear stored auth data (logout). */
export function clearSession() {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
}
