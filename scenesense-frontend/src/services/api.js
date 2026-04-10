/**
 * services/api.js
 * Centralised Axios wrapper. All backend calls go through here.
 * In development, Vite proxies /upload /caption /translate /voice /history → Flask:5000.
 * In production (Vercel), VITE_API_URL must point to the deployed backend.
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 120_000, // models can take time on first load
})

// ── Interceptors ────────────────────────────────────────────────────
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.error ||
            err.message ||
            'An unknown error occurred.'
        return Promise.reject(new Error(message))
    },
)

// ── API methods ─────────────────────────────────────────────────────

/**
 * Upload an image file.
 * @param {File} file
 * @param {(progress: number) => void} onProgress
 * @returns {Promise<{ filename: string, preview_url: string }>}
 */
export function uploadImage(file, onProgress) {
    const form = new FormData()
    form.append('image', file)
    return api
        .post('/upload', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                if (onProgress && e.total) {
                    onProgress(Math.round((e.loaded / e.total) * 100))
                }
            },
        })
        .then((r) => r.data)
}

/**
 * Generate a caption for an uploaded image.
 * @param {string} filename
 * @param {'simple'|'detailed'|'story'} mode
 * @returns {Promise<{ caption: string, mode: string }>}
 */
export function generateCaption(filename, mode = 'simple') {
    return api.post('/caption', { filename, mode }).then((r) => r.data)
}

/**
 * Translate a caption to a target language.
 * @param {{ text: string, language: string, image_name?: string, original_caption?: string, mode?: string }} params
 * @returns {Promise<{ translated_text: string, language: string, history_id: string|null }>}
 */
export function translateCaption(params) {
    return api.post('/translate', params).then((r) => r.data)
}

/**
 * Generate a voice MP3 for the given text.
 * @param {string} text
 * @param {string} language
 * @returns {Promise<{ audio_url: string, filename: string }>}
 */
export function generateVoice(text, language) {
    return api.post('/voice', { text, language }).then((r) => r.data)
}

/**
 * Fetch caption history.
 * @param {{ limit?: number, skip?: number }} params
 * @returns {Promise<{ history: Array, count: number }>}
 */
export function fetchHistory(params = {}) {
    return api.get('/history', { params }).then((r) => r.data)
}

export default api
