// shared/lesson-components.js
// Modern lesson components (Chrome 70+, Firefox 60+, Safari 12+, Edge 79+)

(() => {
    'use strict';
    
    // Visual metaphor component
    class VisualMetaphor {
        constructor(containerId, type, options = {}) {
            this.containerId = containerId;
            this.type = type;
            this.options = options;
        }
        
        init() {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container not found: ${this.containerId}`);
                return false;
            }
            
            if (this.type === 'storage_boxes') {
                container.innerHTML = this.createStorageBoxes();
            } else {
                container.innerHTML = `<div class="visual-metaphor-container">Visual metaphor: ${this.type}</div>`;
            }
            
            return true;
        }
        
        createStorageBoxes() {
            const { variableName = 'name', variableValue = 'Alex' } = this.options;
            
            return `
                <div class="visual-metaphor-container">
                    <div class="storage-explanation">
                        <h4>Variable Storage & Retrieval</h4>
                        <p>When you create a variable, Python stores the value. When you print it, Python retrieves the value:</p>
                    </div>
                    <div class="storage-flow">
                        <div class="storage-box">
                            <div class="box-label">${variableName}</div>
                            <div class="box-content">"${variableValue}"</div>
                        </div>
                        <div class="flow-arrow">→</div>
                        <div class="print-output">
                            <div class="output-label">print(${variableName})</div>
                            <div class="output-content">${variableValue}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Mastery check component
    class MasteryCheck {
        constructor(containerId, questions, options = {}) {
            this.containerId = containerId;
            this.questions = questions;
            this.options = options;
        }
        
        init() {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container not found: ${this.containerId}`);
                return false;
            }
            
            container.innerHTML = this.createHTML();
            this.setupEvents(container);
            return true;
        }
        
        createHTML() {
            const questionsHTML = this.questions.map((q, i) => `
                <div class="mastery-question" data-question="${i}">
                    <p><strong>Question ${i + 1}:</strong> ${q.question}</p>
                    <input type="text" class="answer-input" placeholder="${q.placeholder || 'Enter your answer'}">
                    <div class="feedback"></div>
                </div>
            `).join('');
            
            return `
                <div class="mastery-check">
                    <div class="mastery-header">
                        <h3>${this.options.title || 'Check Your Understanding'}</h3>
                        <p>Complete these questions to unlock the next lesson:</p>
                    </div>
                    ${questionsHTML}
                    <div class="mastery-controls">
                        <button class="check-answers-btn">Check Answers</button>
                        <div class="mastery-results"></div>
                    </div>
                </div>
            `;
        }
        
        setupEvents(container) {
            const checkButton = container.querySelector('.check-answers-btn');
            const resultsDiv = container.querySelector('.mastery-results');
            
            checkButton.addEventListener('click', () => {
                let score = 0;
                const total = this.questions.length;
                
                this.questions.forEach((question, i) => {
                    const questionDiv = container.querySelector(`[data-question="${i}"]`);
                    const input = questionDiv.querySelector('.answer-input');
                    const feedback = questionDiv.querySelector('.feedback');
                    const answer = input.value.trim();
                    
                    const isCorrect = question.validateAnswer ? question.validateAnswer(answer) : false;
                    
                    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
                    feedback.textContent = isCorrect ? 'Correct!' : (question.hint || 'Try again!');
                    
                    if (isCorrect) score++;
                });
                
                const passed = score === total;
                resultsDiv.innerHTML = `
                    <div class="score-display">Score: ${score}/${total}</div>
                    <div class="result-message ${passed ? 'passed' : 'failed'}">
                        ${passed ? 'Great! You\'ve mastered this lesson.' : 'Keep trying! You need all questions correct.'}
                    </div>
                `;
                
                if (passed && this.options.onComplete) {
                    this.options.onComplete();
                }
            });
        }
    }
    
    // Challenge system component
    class ChallengeSystem {
        constructor(containerId, challenges, options = {}) {
            this.containerId = containerId;
            this.challenges = challenges;
            this.options = options;
        }
        
        init() {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container not found: ${this.containerId}`);
                return false;
            }
            
            container.innerHTML = this.createHTML();
            this.setupEvents(container);
            return true;
        }
        
        createHTML() {
            const levels = ['basic', 'creative', 'advanced'];
            
            const sectionsHTML = levels.map(level => {
                const levelChallenges = this.challenges[level] || [];
                if (levelChallenges.length === 0) return '';
                
                const challengesHTML = levelChallenges.map((challenge, j) => `
                    <div class="challenge-card" data-challenge="${level}-${j}">
                        <h5>${challenge.title}</h5>
                        <p>${challenge.description}</p>
                        <textarea class="challenge-code" placeholder="Enter your solution...">${challenge.starter || ''}</textarea>
                        <button class="test-challenge">Test Solution</button>
                        <div class="challenge-feedback"></div>
                    </div>
                `).join('');
                
                return `
                    <div class="challenge-section">
                        <h4>${level.charAt(0).toUpperCase() + level.slice(1)} Challenges</h4>
                        <div class="challenge-grid">${challengesHTML}</div>
                    </div>
                `;
            }).join('');
            
            return `
                <div class="challenge-system">
                    <div class="challenge-header">
                        <h3>${this.options.title || 'Practice Challenges'}</h3>
                        <p>Try these exercises to strengthen your understanding:</p>
                    </div>
                    ${sectionsHTML}
                </div>
            `;
        }
        
        setupEvents(container) {
            const testButtons = container.querySelectorAll('.test-challenge');
            
            testButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const card = event.target.closest('.challenge-card');
                    const challengeId = card.dataset.challenge;
                    const code = card.querySelector('.challenge-code').value;
                    const feedback = card.querySelector('.challenge-feedback');
                    
                    const challenge = this.findChallenge(challengeId);
                    if (challenge?.test) {
                        try {
                            const result = challenge.test(code);
                            feedback.className = `challenge-feedback ${result.passed ? 'success' : 'error'}`;
                            feedback.textContent = result.message;
                        } catch (e) {
                            feedback.className = 'challenge-feedback error';
                            feedback.textContent = `Error testing code: ${e.message}`;
                        }
                    } else {
                        feedback.className = 'challenge-feedback info';
                        feedback.textContent = 'Great practice! Keep experimenting.';
                    }
                });
            });
        }
        
        findChallenge(challengeId) {
            const [level, index] = challengeId.split('-');
            return this.challenges[level]?.[parseInt(index)];
        }
    }
    
    // Dark mode management
    class DarkModeManager {
        static setup() {
            const toggle = document.getElementById('dark-mode-toggle');
            const label = document.querySelector('.dark-mode-label');
            
            if (!toggle || !label) return;
            
            // Load saved preference
            const isDark = localStorage.getItem('darkMode') === 'true';
            if (isDark) {
                document.body.classList.add('dark-mode');
                toggle.checked = true;
            }
            
            const updateLabel = () => {
                label.textContent = toggle.checked ? '☀️ Light Mode' : '🌙 Dark Mode';
            };
            
            const toggleMode = () => {
                try {
                    if (toggle.checked) {
                        document.body.classList.add('dark-mode');
                        localStorage.setItem('darkMode', 'true');
                    } else {
                        document.body.classList.remove('dark-mode');
                        localStorage.setItem('darkMode', 'false');
                    }
                    updateLabel();
                    
                    // Notify other components
                    document.dispatchEvent(new CustomEvent('themeChanged'));
                } catch (e) {
                    console.warn('Could not save dark mode preference:', e);
                }
            };
            
            updateLabel();
            toggle.addEventListener('change', toggleMode);
        }
    }
    
    // Main API
    window.PenguinTwistComponents = {
        createVisualMetaphor: (containerId, type, options) => new VisualMetaphor(containerId, type, options),
        createMasteryCheck: (containerId, questions, options) => new MasteryCheck(containerId, questions, options),
        createChallengeSystem: (containerId, challenges, options) => new ChallengeSystem(containerId, challenges, options),
        setupDarkMode: () => DarkModeManager.setup()
    };
    
})();
