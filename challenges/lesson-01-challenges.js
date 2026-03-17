/**
 * V2 Challenge Data — Lesson 01: Print Statements
 *
 * SCHEMA CONTRACT (enforced by HintEngine in challenge.js):
 *   hints[]  — exactly 4 strings
 *              [0] Conceptual question  — makes student think first
 *              [1] Mechanism guidance   — points to the right construct
 *              [2] Syntax near-complete — near-final form, still requires effort
 *              [3] Solution             — raw, runnable Python only
 *                                        (HintEngine renders this in a <pre> block)
 *
 *   validate(code, output) — returns { pass1, pass2, ..., feedback }
 *
 * SOURCE: Auto-migrated from https://www.pythoncoach.org/js/challenges/lesson-01-challenges.js
 * MIGRATION DATE: 2026-03-17
 */

(function () {
    'use strict';

    var lesson01Challenges = {

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
                var stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                var pass1 = /print\s*\(/i.test(stripped);
                var pass2 = /hello.*world/i.test(output);
                var feedback = null;
                if (pass1 && /print\s+\(/.test(stripped)) {
                    feedback = '\u2713 Great! (Tip: Write `print()` instead of `print ()` for cleaner code)';
                } else if (pass1 && /(print\s*\(\s+['"]|['"]\s+\))/.test(stripped)) {
                    feedback = "\u2713 Great! (Tip: Remove spaces between the parentheses and the quotes: `print('Hello')`)";
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
            hints: [
                "What's different about displaying a number versus text? Does Python needs any special instructions to understand it's a number?",
                "You'll use the same display command, but numbers are treated differently than text - they don't need wrapping.",
                "Use print(2025) - notice no quotes around the number. Quotes would make Python treat it as text, not a number.",
                "print(2025)"
            ],
            criteria: [
                { id: 'criterion1', text: 'Uses print() function' },
                { id: 'criterion2', text: 'Prints 2025 without quotes' }
            ],
            validate: function (code, output) {
                var stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                var pass1 = /print\s*\(/i.test(stripped);
                var pass2 = output.trim() === '2025' && !/print\s*\(\s*['"]/.test(stripped);
                return { pass1: pass1, pass2: pass2, feedback: null };
            }
        },

        '1c': {
            title: 'Print Multiple Lines',
            objective: 'Print three different lines of text',
            expectedOutput: 'First line\nSecond line\nThird line',
            category: 'variables',
            difficulty: 'beginner',
            lessonId: 1,
            lessonTitle: 'Lesson 1: Print Statements',
            starterCode: '# Print 3 different messages\n',
            hints: [
                "How could you make Python perform the same action multiple times? What happens each time you ask Python to display something?",
                "You'll need to use the display command more than once. Each time you use it creates a new line in the output.",
                "Write print() three separate times, each on its own line. Each can contain different text in quotes.",
                "print('First line')\nprint('Second line')\nprint('Third line')"
            ],
            criteria: [
                { id: 'criterion1', text: 'Uses print() at least 3 times' },
                { id: 'criterion2', text: 'Each print() produces a separate line' }
            ],
            validate: function (code, output) {
                var stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                var printMatches = stripped.match(/print\s*\(/gi) || [];
                var pass1 = printMatches.length >= 3;
                var outputLines = output.trim().split('\n').filter(function (l) { return l.trim() !== ''; });
                var pass2 = outputLines.length >= 3;
                return { pass1: pass1, pass2: pass2, feedback: null };
            }
        },

        '1d': {
            title: 'Print Name and Age',
            objective: 'Print your name (with quotes) and your age (without quotes)',
            expectedOutput: 'Alex\n25',
            category: 'variables',
            difficulty: 'beginner',
            lessonId: 1,
            lessonTitle: 'Lesson 1: Print Statements',
            starterCode: '# Print a name, then an age\n# Remember: text needs quotes, numbers don\'t!\n',
            hints: [
                "Why would you handle a name differently than an age in Python? What's the fundamental difference between text and numbers?",
                "You need two separate commands: one to display text (which needs wrapping) and one to display a number (which doesn't).",
                "Use print('YourName') for text with quotes, then print(25) for a number without quotes. Two separate print() statements.",
                "print('Alex')\nprint(25)"
            ],
            criteria: [
                { id: 'criterion1', text: 'Prints a name using quotes' },
                { id: 'criterion2', text: 'Prints a number without quotes' }
            ],
            validate: function (code, output) {
                var stripped = code.split('\n').map(function (l) { return l.split('#')[0]; }).join('\n');
                var pass1 = /print\s*\(\s*['"]/.test(stripped);
                var pass2 = /print\s*\(\s*\d+\s*\)/.test(stripped);
                return { pass1: pass1, pass2: pass2, feedback: null };
            }
        }

    };

    window.lesson01Challenges = lesson01Challenges;

}());
