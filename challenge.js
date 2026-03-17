/**
 * challenge.js — V2 Challenge UI Engine
 *
 * Exports (on window):
 *   loadChallenge(challengeId)   — render a challenge and reset all engines
 *   HintEngine                   — progressive hint state machine
 *
 * Requires (loaded before this file):
 *   window.lesson01Challenges    (and future lessonNN files)
 *   ChallengeAnalytics           (shared/challenge-analytics.js)
 *
 * DOM contract — the host page must supply these IDs:
 *   #challenge-title
 *   #challenge-objective
 *   #challenge-starter-code      (textarea)
 *   #challenge-output            (read-only display)
 *   #hint-btn                    (the single morphing hint button)
 *   #hint-container              (empty <div> where hints are injected)
 *   #review-lesson-btn           (the "Review Lesson" link/button to pulse)
 *   #criteria-list               (empty <ul> for criterion chips)
 */

(function () {
    'use strict';

    // ── Challenge Registry ─────────────────────────────────────────────────────
    // Merge all loaded lessonNN objects into a single flat map keyed by ID.

    function buildRegistry() {
        var registry = {};
        var keys = Object.keys(window).filter(function (k) {
            return /^lesson\d+Challenges$/.test(k);
        });
        keys.forEach(function (k) {
            var lesson = window[k];
            Object.keys(lesson).forEach(function (id) {
                registry[id] = lesson[id];
            });
        });
        return registry;
    }

    // ── HintEngine ─────────────────────────────────────────────────────────────
    //
    // State machine for the single morphing "Get Hint" button.
    //
    // Click sequence for a challenge with 4 hints (H0, H1, H2, Solution):
    //
    //   Click 0 → (initial state)  btn = "💡 Get a Hint"
    //   Click 1 → WARN phase       btn = "💡 Show Hint 1"   + pulse Review Lesson btn
    //   Click 2 → hints[0] shown   btn = "💡 Show Hint 2"   + recordHint()
    //   Click 3 → hints[1] shown   btn = "💡 Show Hint 3"   + recordHint()
    //   Click 4 → hints[2] shown   btn = "🔑 Show Solution" + recordHint()
    //   Click 5 → hints[3] shown   btn disabled/hidden       + recordHint()

    var HintEngine = (function () {

        var _hints       = [];      // reference to current challenge's hints[]
        var _clickCount  = 0;       // how many times hint btn has been pressed
        var _hintBtn     = null;    // the morphing button element
        var _container   = null;    // #hint-container DOM node
        var _reviewBtn   = null;    // #review-lesson-btn DOM node

        var LABELS = [
            '\uD83D\uDCA1 Get a Hint',     // 0 — initial
            '\uD83D\uDCA1 Show Hint 1',    // 1 — after warn click
            '\uD83D\uDCA1 Show Hint 2',    // 2 — after H1 revealed
            '\uD83D\uDCA1 Show Hint 3',    // 3 — after H2 revealed
            '\uD83D\uDD11 Show Solution'   // 4 — after H3 revealed
        ];

        // ── private helpers ────────────────────────────────────────────────────

        function _appendHint(text, isSolution) {
            var wrapper = document.createElement('div');
            wrapper.className = 'ch-hint-wrapper' + (isSolution ? ' ch-hint-solution' : '');

            if (isSolution) {
                var label = document.createElement('p');
                label.className = 'ch-hint-label';
                label.textContent = '# Complete solution:';
                wrapper.appendChild(label);

                var pre = document.createElement('pre');
                pre.className = 'ch-hint-code';
                pre.textContent = text;
                wrapper.appendChild(pre);
            } else {
                var p = document.createElement('p');
                p.className = 'ch-hint-text';
                p.textContent = text;
                wrapper.appendChild(p);
            }

            _container.appendChild(wrapper);
            // Trigger entrance animation on next frame
            requestAnimationFrame(function () {
                wrapper.classList.add('ch-hint-visible');
            });
        }

        function _pulseReviewBtn() {
            if (!_reviewBtn) { return; }
            _reviewBtn.classList.remove('ch-pulse');
            // Force reflow to restart animation
            void _reviewBtn.offsetWidth;
            _reviewBtn.classList.add('ch-pulse');
            _reviewBtn.addEventListener('animationend', function onEnd() {
                _reviewBtn.classList.remove('ch-pulse');
                _reviewBtn.removeEventListener('animationend', onEnd);
            });
        }

        function _updateBtnLabel() {
            if (!_hintBtn) { return; }
            var labelIndex = Math.min(_clickCount, LABELS.length - 1);
            _hintBtn.textContent = LABELS[labelIndex];
        }

        // ── public API ─────────────────────────────────────────────────────────

        /**
         * Initialise the engine for a new challenge.
         * Call this inside loadChallenge() — BEFORE any user interaction.
         *
         * @param {string[]} hints      The challenge's hints[] array (4 elements)
         * @param {Element}  hintBtn    The morphing button element
         * @param {Element}  container  The hint display container
         * @param {Element}  reviewBtn  The "Review Lesson" link to pulse
         */
        function init(hints, hintBtn, container, reviewBtn) {
            _hints      = hints      || [];
            _hintBtn    = hintBtn    || null;
            _container  = container  || null;
            _reviewBtn  = reviewBtn  || null;
            _clickCount = 0;

            if (_hintBtn) {
                _hintBtn.textContent = LABELS[0];
                _hintBtn.disabled    = false;
                _hintBtn.classList.remove('ch-hint-btn--exhausted');
            }
            if (_container) {
                _container.innerHTML = '';
            }
        }

        /**
         * Handle a click on the hint button.
         * Attach this as the onclick handler for #hint-btn.
         */
        function handleClick() {
            _clickCount++;

            if (_clickCount === 1) {
                // Phase: WARN — nudge student to review lesson before spending hints
                _pulseReviewBtn();
                _updateBtnLabel(); // → "💡 Show Hint 1"
                return;
            }

            // Phase: REVEAL — clickCount 2..5 map to hints[0..3]
            var hintIndex = _clickCount - 2;          // 0-based index into hints[]

            if (hintIndex >= _hints.length) {
                // All hints exhausted — nothing more to show
                return;
            }

            var isSolution = (hintIndex === _hints.length - 1);  // index 3 = solution
            _appendHint(_hints[hintIndex], isSolution);
            ChallengeAnalytics.recordHint();

            if (isSolution) {
                // Morph button to exhausted state
                if (_hintBtn) {
                    _hintBtn.textContent = 'All hints used';
                    _hintBtn.disabled    = true;
                    _hintBtn.classList.add('ch-hint-btn--exhausted');
                }
            } else {
                // Advance label to next hint
                _updateBtnLabel();
            }
        }

        /**
         * Alias for init() — called explicitly if you want to reset
         * without re-binding DOM references.
         */
        function reset() {
            init(_hints, _hintBtn, _container, _reviewBtn);
        }

        return { init: init, handleClick: handleClick, reset: reset };

    }());

    // ── loadChallenge ──────────────────────────────────────────────────────────

    /**
     * Render a challenge into the DOM and reset all engines.
     *
     * @param {string} challengeId  e.g. "1a"
     */
    function loadChallenge(challengeId) {
        var registry  = buildRegistry();
        var challenge = registry[challengeId];

        if (!challenge) {
            console.error('[challenge.js] Unknown challengeId:', challengeId);
            return;
        }

        // ── 1. Populate static fields ──────────────────────────────────────────
        var title     = document.getElementById('challenge-title');
        var objective = document.getElementById('challenge-objective');
        var starter   = document.getElementById('challenge-starter-code');
        var output    = document.getElementById('challenge-output');
        var criteria  = document.getElementById('criteria-list');

        if (title)     { title.textContent     = challenge.title; }
        if (objective) { objective.textContent = challenge.objective; }
        if (starter)   { starter.value         = challenge.starterCode || ''; }
        if (output)    { output.textContent    = ''; }

        if (criteria) {
            criteria.innerHTML = '';
            (challenge.criteria || []).forEach(function (c) {
                var li = document.createElement('li');
                li.className    = 'ch-criterion';
                li.dataset.id   = c.id;
                li.textContent  = c.text;
                criteria.appendChild(li);
            });
        }

        // ── 2. Reset HintEngine ────────────────────────────────────────────────
        var hintBtn    = document.getElementById('hint-btn');
        var hintCont   = document.getElementById('hint-container');
        var reviewBtn  = document.getElementById('review-lesson-btn');

        HintEngine.init(challenge.hints, hintBtn, hintCont, reviewBtn);

        // Wire click handler (remove old listener by cloning the node)
        if (hintBtn) {
            var freshBtn = hintBtn.cloneNode(true);
            hintBtn.parentNode.replaceChild(freshBtn, hintBtn);
            freshBtn.addEventListener('click', function () {
                HintEngine.handleClick();
            });
        }

        // ── 3. Reset Analytics ─────────────────────────────────────────────────
        if (typeof ChallengeAnalytics !== 'undefined') {
            ChallengeAnalytics.reset(challengeId);
        }

        console.log('[challenge.js] Loaded:', challengeId, '-', challenge.title);
    }

    // ── Expose globals ─────────────────────────────────────────────────────────
    window.HintEngine    = HintEngine;
    window.loadChallenge = loadChallenge;

}());
