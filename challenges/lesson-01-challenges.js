/**
 * V2 Challenge Data — Lesson 01: Print Statements
 *
 * SCHEMA CONTRACT (enforced by challenge-ui in V2):
 *   hints[]  — exactly 4 plain-text strings, no HTML, no markdown
 *              [0] Conceptual question  — makes student think first
 *              [1] Mechanism guidance   — points to the right construct
 *              [2] Syntax near-complete — near-final form, still requires effort
 *              [3] Solution             — raw, runnable Python only
 *                                         (UI prepends "# Complete solution:" at render time)
 *
 *   validate(code, output) — returns { pass1, pass2, ..., feedback }
 *              Each passN corresponds to a criterion by array position.
 *              feedback is a string (or null) for optional style coaching.
 *
 * SOURCE: Migrated from https://www.pythoncoach.org/js/challenges/lesson-01-challenges.js
 * MIGRATION DATE: 2026-03-17
 * DO NOT hand-edit hint text — run the migration script to re-sync from V1 source.
 */

(function () {
    'use strict';

    const lesson01Challenges = {

        '1a': {
            title: 'Print Hello World',
            objective: "Print 'Hello, World!' to the screen",
            expectedOutput: 'Hello, World!',
            category: 'variables',
            difficulty: 'beginner',
            lessonId: 1,
            lessonTitle: 'Lesson 1: Print Statements',
            starterCode: '# Write your code here\n',
            hints: [
                "How do you tell Python to show something on screen? Think about what action you're asking Python to perform.",
                "You need to use a command that displays text. Text must be wrapped in something to tell Python 'this is words, not code'.",
                "Use print() with your text inside quotes: print('...'). Remember Python is case-sensitive - it's print not Print.",
                "print('Hello, World!')"
            ],
            criteria: [
                { id: 'criterion1', text: 'Uses print() function' },
                { id: 'criterion2', text: "Prints 'Hello' and 'World'" }
            ],
            validate: function (code, output) {
                const stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                const pass1 = /print\s*\(/i.test(stripped);
                const pass2 = /hello.*world/i.test(output);
                let feedback = null;
                if (pass1 && /print\s+\(/.test(stripped)) {
                    feedback = '✓ Great! (Tip: Write `print()` instead of `print ()` for cleaner code)';
                } else if (pass1 && /(print\s*\(\s+['"]|['"]\s+\))/.test(stripped)) {
                    feedback = "✓ Great! (Tip: Remove spaces between the parentheses and the quotes: `print('Hello')`)";
                }
                return { pass1: pass1, pass2: pass2, feedback: feedback };
            }
        },

        '1b': {
            title: 'Print a Number',
            objective: 'Print the number 2025 (no quotes)',
            expectedOutput: '2025',
            category: 'variables',
            difficulty: 'beginner',
            lessonId: 1,
            lessonTitle: 'Lesson 1: Print Statements',
            starterCode: '# Print the number 2025\n',
            // TODO: populate from migration script — run: migrateChallenges('01')
            hints: [],
            criteria: [
                { id: 'criterion1', text: 'Uses print() function' },
                { id: 'criterion2', text: 'Prints 2025 without quotes' }
            ],
            validate: function (code, output) {
                const stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                const pass1 = /print\s*\(/i.test(stripped);
                const pass2 = output.trim() === '2025';
                return { pass1: pass1, pass2: pass2, feedback: null };
            }
        },

        '1c': {
            title: 'Print Multiple Lines',
            objective: 'Print three different lines of text',
            expectedOutput: null,
            category: 'variables',
            difficulty: 'beginner',
            lessonId: 1,
            lessonTitle: 'Lesson 1: Print Statements',
            starterCode: '# Print three different lines\n',
            hints: [],
            criteria: [
                { id: 'criterion1', text: 'Uses print() at least 3 times' },
                { id: 'criterion2', text: 'Each print() is on its own line' }
            ],
            validate: function (code, output) {
                const stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                const printMatches = stripped.match(/print\s*\(/gi) || [];
                const pass1 = printMatches.length >= 3;
                const outputLines = output.trim().split('\n').filter(function (l) { return l.trim() !== ''; });
                const pass2 = outputLines.length >= 3;
                return { pass1: pass1, pass2: pass2, feedback: null };
            }
        },

        '1d': {
            title: 'Print Name and Age',
            objective: 'Print your name (with quotes) and your age (without quotes)',
            expectedOutput: null,
            category: 'variables',
            difficulty: 'beginner',
            lessonId: 1,
            lessonTitle: 'Lesson 1: Print Statements',
            starterCode: '# Print your name as text, then your age as a number\n',
            hints: [],
            criteria: [
                { id: 'criterion1', text: 'Prints a name using quotes' },
                { id: 'criterion2', text: 'Prints a number without quotes' }
            ],
            validate: function (code, output) {
                const stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                const pass1 = /print\s*\(\s*['"]/.test(stripped);
                const pass2 = /print\s*\(\s*\d+/.test(stripped);
                return { pass1: pass1, pass2: pass2, feedback: null };
            }
        }

    };

    // Expose to V2 app namespace.
    // challenge-loader.js merges all lessonNNChallenges into App.challenges.
    window.lesson01Challenges = lesson01Challenges;

}());
