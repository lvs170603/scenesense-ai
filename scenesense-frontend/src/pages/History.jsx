/**
 * pages/History.jsx
 * Full-screen history view with pagination.
 */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi'
import HistoryPanel from '../components/HistoryPanel.jsx'
import { fetchHistory } from '../services/api.js'

const PAGE_SIZE = 10

export default function History() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [skip, setSkip] = useState(0)
    const [hasMore, setHasMore] = useState(true)

    const load = async (reset = false) => {
        setLoading(true)
        setError(null)
        const offset = reset ? 0 : skip
        try {
            const data = await fetchHistory({ limit: PAGE_SIZE, skip: offset })
            const newRecords = data.history || []
            setRecords(reset ? newRecords : (prev) => [...prev, ...newRecords])
            setSkip(offset + newRecords.length)
            setHasMore(newRecords.length === PAGE_SIZE)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load(true) }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleRefresh = () => {
        setSkip(0)
        load(true)
    }

    return (
        <div className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="p-2 rounded-xl border border-white/15 bg-white/5 text-white/60
                       hover:text-white hover:bg-white/15 transition-all duration-200"
                    >
                        <FiArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text">Caption History</h1>
                        <p className="text-white/40 text-sm">{records.length} record{records.length !== 1 ? 's' : ''} loaded</p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="btn-secondary flex items-center gap-2 text-sm"
                >
                    <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <HistoryPanel records={records} loading={loading && records.length === 0} error={error} />

            {/* Load more */}
            {!loading && hasMore && (
                <div className="text-center mt-6">
                    <button onClick={() => load()} className="btn-secondary text-sm">
                        Load More
                    </button>
                </div>
            )}

            {loading && records.length > 0 && (
                <p className="text-center mt-4 text-white/40 text-sm animate-pulse">Loading…</p>
            )}
        </div>
    )
}
