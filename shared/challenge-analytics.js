/**
 * V2 Challenge Analytics Bridge
 *
 * Mirrors the exact V1 supabaseService.saveProgress() payload shape so that
 * when a real backend is wired the object can be passed through unchanged.
 *
 * V1 payload shape (source: pythoncoach.org/js/supabase-service.js):
 *   {
 *     challenge_id:     string,          // e.g. "1a"
 *     status:           string,          // "completed" | "attempted"
 *     best_code:        string | null,
 *     metrics: {
 *       attempts:       number,          // total Run/Validate presses
 *       hints_used:     number           // total hints revealed (NOT per-hint breakdown)
 *     },
 *     last_updated_at:  ISO string
 *   }
 *
 * CURRENT MODE: simulation — logs "Teacher Dashboard Sync" to console.
 * TO ACTIVATE REAL SYNC: uncomment the supabaseService block in saveProgress().
 *
 * USAGE:
 *   ChallengeAnalytics.reset('1a');           // call inside loadChallenge()
 *   ChallengeAnalytics.recordAttempt();       // call on every Run / Validate press
 *   ChallengeAnalytics.recordHint();          // call on every confirmed hint reveal
 *   ChallengeAnalytics.saveProgress('completed', userCode);  // call on solve
 */

var ChallengeAnalytics = (function () {
    'use strict';

    // ── Per-challenge state ────────────────────────────────────────────────────
    // Reset on every loadChallenge() call — never persists across challenges.

    var _challengeId = null;
    var _attempts    = 0;
    var _hintsUsed   = 0;
    var _startTime   = null;

    // ── Public API ─────────────────────────────────────────────────────────────

    /**
     * Reset all counters. Must be called at the top of loadChallenge().
     * @param {string} challengeId  e.g. "1a"
     */
    function reset(challengeId) {
        _challengeId = challengeId;
        _attempts    = 0;
        _hintsUsed   = 0;
        _startTime   = Date.now();
    }

    /**
     * Increment the attempt counter.
     * Call once per Run / Validate press — before validation logic runs.
     */
    function recordAttempt() {
        _attempts++;
    }

    /**
     * Increment the hint counter.
     * Call once per confirmed hint reveal — AFTER the friction gate passes
     * (i.e. the same point showHint() increments currentHintsUsed in V1).
     */
    function recordHint() {
        _hintsUsed++;
    }

    /**
     * Build the Teacher Dashboard payload and simulate a cloud sync.
     * Call once when the challenge is solved (all criteria pass).
     *
     * @param {string}      status    "completed" | "attempted"
     * @param {string|null} bestCode  The user's passing code, or null.
     * @returns {Object}  The exact payload object (useful for unit tests).
     */
    function saveProgress(status, bestCode) {
        var payload = {
            challenge_id:    _challengeId,
            status:          status,
            best_code:       bestCode || null,
            metrics: {
                attempts:   _attempts,
                hints_used: _hintsUsed   // integer total — matches V1 shape exactly
            },
            last_updated_at: new Date().toISOString()
        };

        // ── SIMULATION MODE ────────────────────────────────────────────────────
        // Remove / replace this block when real Supabase is wired.
        console.group('%c\uD83D\uDCCA Teacher Dashboard Sync', 'color:#7c3aed;font-weight:bold;font-size:13px;');
        console.log('challenge_id  :', payload.challenge_id);
        console.log('status        :', payload.status);
        console.log('attempts      :', payload.metrics.attempts);
        console.log('hints_used    :', payload.metrics.hints_used);
        console.log('best_code     :', payload.best_code);
        console.log('timestamp     :', payload.last_updated_at);
        console.log('%cFull payload  :', 'color:#64748b;', payload);
        console.groupEnd();
        // ── END SIMULATION ─────────────────────────────────────────────────────

        // ── REAL SUPABASE HOOK (uncomment when backend is ready) ───────────────
        // if (typeof supabaseService !== 'undefined' && supabaseService.user) {
        //     supabaseService.saveProgress(payload.challenge_id, {
        //         status:    payload.status,
        //         best_code: payload.best_code,
        //         metrics:   payload.metrics
        //     });
        // }
        // ── END SUPABASE HOOK ──────────────────────────────────────────────────

        return payload;
    }

    /**
     * Read-only snapshot of current counters.
     * Useful for debug panels or mid-session inspection.
     */
    function getState() {
        return {
            challengeId: _challengeId,
            attempts:    _attempts,
            hintsUsed:   _hintsUsed,
            elapsedMs:   _startTime ? Date.now() - _startTime : null
        };
    }

    return {
        reset:         reset,
        recordAttempt: recordAttempt,
        recordHint:    recordHint,
        saveProgress:  saveProgress,
        getState:      getState
    };

}());
