// shared/lesson-components.js
// PenguinTwist Reusable Lesson Components
// ES5 compatible for maximum school network compatibility

(function() {
    'use strict';
    
    // Main components library
    window.PenguinTwistComponents = {
        version: '1.0.0',
        
        // Factory methods for different component types
        createVisualMetaphor: function(containerId, metaphorType, options) {
            return new VisualMetaphor(containerId, metaphorType, options);
        },
        
        createAnimationDemo: function(containerId, demoType, options) {
            return new AnimationDemo(containerId, demoType, options);
        },
        
        createChallengeSystem: function(containerId, challenges, options) {
            return new ChallengeSystem(containerId, challenges, options);
        },
        
        createMasteryCheck: function(containerId, questions, options) {
            return new MasteryCheck(containerId, questions, options);
        },
        
        // Utility functions
        setupDarkMode: function(toggleId) {
            return new DarkModeController(toggleId);
        },
        
        createProgressTracker: function(containerId, totalLessons, currentLesson) {
            return new ProgressTracker(containerId, totalLessons, currentLesson);
        }
    };
    
    // Visual Metaphor Component - creates rich visual explanations
    function VisualMetaphor(containerId, metaphorType, options) {
        this.container = document.getElementById(containerId);
        this.type = metaphorType;
        this.options = options || {};
        
        if (!this.container) {
            throw new Error('Container element not found: ' + containerId);
        }
        
        this.init = function() {
            switch(this.type) {
                case 'message_delivery':
                    this.createMessageDeliveryMetaphor();
                    break;
                case 'storage_boxes':
                    this.createStorageBoxesMetaphor();
                    break;
                case 'conversation_flow':
                    this.createConversationFlowMetaphor();
                    break;
                case 'text_joining':
                    this.createTextJoiningMetaphor();
                    break;
                default:
                    throw new Error('Unknown metaphor type: ' + this.type);
            }
            return this;
        };
        
        this.createMessageDeliveryMetaphor = function() {
            this.container.innerHTML = [
                '<div class="print-metaphor">',
                    '<div class="metaphor-title">' + (this.options.title || 'Think of print() as a Message Delivery Service') + '</div>',
                    '<div class="flow-diagram">',
                        '<div class="flow-step">',
                            '<div class="flow-box">',
                                '<div class="flow-icon">📝</div>',
                                '<div class="flow-label">1. You Write</div>',
                                '<div class="flow-description">You write your message in quotes</div>',
                                '<div class="code-sample">print("Hello!")</div>',
                            '</div>',
                        '</div>',
                        '<div class="flow-arrow">→</div>',
                        '<div class="flow-step">',
                            '<div class="flow-box">',
                                '<div class="flow-icon">🐍</div>',
                                '<div class="flow-label">2. Python Reads</div>',
                                '<div class="flow-description">Python finds your message and prepares to deliver it</div>',
                                '<div class="message-box">Hello!</div>',
                            '</div>',
                        '</div>',
                        '<div class="flow-arrow">→</div>',
                        '<div class="flow-step">',
                            '<div class="flow-box">',
                                '<div class="flow-icon">🖥️</div>',
                                '<div class="flow-label">3. Screen Shows</div>',
                                '<div class="flow-description">Your message appears on the screen</div>',
                                '<div class="output-sample">Hello!</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
        };
        
        this.createStorageBoxesMetaphor = function() {
            var variableName = this.options.variableName || 'name';
            var variableValue = this.options.variableValue || 'Alex';
            
            this.container.innerHTML = [
                '<div class="storage-metaphor">',
                    '<div class="metaphor-title">' + (this.options.title || 'Variables are like Labeled Storage Boxes') + '</div>',
                    '<div class="storage-diagram">',
                        '<div class="storage-step">',
                            '<div class="storage-box">',
                                '<div class="box-label">' + variableName + '</div>',
                                '<div class="box-content">"' + variableValue + '"</div>',
                                '<div class="box-description">Information stored safely inside</div>',
                            '</div>',
                        '</div>',
                        '<div class="storage-arrow">↓</div>',
                        '<div class="storage-step">',
                            '<div class="retrieval-box">',
                                '<div class="retrieval-action">print(' + variableName + ')</div>',
                                '<div class="retrieval-result">' + variableValue + '</div>',
                                '<div class="retrieval-description">Retrieve and display the stored value</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
        };
        
        this.createConversationFlowMetaphor = function() {
            this.container.innerHTML = [
                '<div class="conversation-metaphor">',
                    '<div class="metaphor-title">' + (this.options.title || 'input() Creates a Conversation') + '</div>',
                    '<div class="conversation-diagram">',
                        '<div class="conversation-bubble computer">',
                            '<div class="bubble-content">What is your name?</div>',
                            '<div class="bubble-label">Computer asks</div>',
                        '</div>',
                        '<div class="conversation-arrow">→</div>',
                        '<div class="conversation-bubble user">',
                            '<div class="bubble-content">Alex</div>',
                            '<div class="bubble-label">You respond</div>',
                        '</div>',
                        '<div class="conversation-arrow">→</div>',
                        '<div class="conversation-bubble computer">',
                            '<div class="bubble-content">Hello Alex!</div>',
                            '<div class="bubble-label">Computer uses your answer</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
        };
        
        this.createTextJoiningMetaphor = function() {
            this.container.innerHTML = [
                '<div class="joining-metaphor">',
                    '<div class="metaphor-title">' + (this.options.title || 'String Concatenation is like Joining Train Cars') + '</div>',
                    '<div class="joining-diagram">',
                        '<div class="train-car">',
                            '<div class="car-content">"Hello"</div>',
                            '<div class="car-label">First piece</div>',
                        '</div>',
                        '<div class="train-connector">+</div>',
                        '<div class="train-car">',
                            '<div class="car-content">" "</div>',
                            '<div class="car-label">Space</div>',
                        '</div>',
                        '<div class="train-connector">+</div>',
                        '<div class="train-car">',
                            '<div class="car-content">name</div>',
                            '<div class="car-label">Variable</div>',
                        '</div>',
                        '<div class="joining-arrow">→</div>',
                        '<div class="joined-result">',
                            '<div class="result-content">"Hello Alex"</div>',
                            '<div class="result-label">Combined result</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
        };
    }
    
    // Animation Demo Component - creates interactive step-by-step demonstrations
    function AnimationDemo(containerId, demoType, options) {
        this.container = document.getElementById(containerId);
        this.type = demoType;
        this.options = options || {};
        this.currentStep = 0;
        this.isPlaying = false;
        
        if (!this.container) {
            throw new Error('Container element not found: ' + containerId);
        }
        
        this.init = function() {
            this.createDemoStructure();
            this.attachEventListeners();
            return this;
        };
        
        this.createDemoStructure = function() {
            this.container.innerHTML = [
                '<div class="animation-demo">',
                    '<div class="demo-controls">',
                        '<button class="demo-btn">▶ ' + (this.options.buttonText || 'Watch Demo') + '</button>',
                    '</div>',
                    '<div class="execution-steps" id="' + this.container.id + '_steps">',
                        // Steps will be populated based on demo type
                    '</div>',
                '</div>'
            ].join('');
            
            this.populateSteps();
        };
        
        this.populateSteps = function() {
            var stepsContainer = document.getElementById(this.container.id + '_steps');
            var steps = this.getStepsForType();
            
            stepsContainer.innerHTML = steps.map(function(step, index) {
                return [
                    '<div class="step" id="step_' + index + '">',
                        '<div class="step-number">' + (index + 1) + '</div>',
                        '<div class="step-title">' + step.title + '</div>',
                        '<div class="step-description">' + step.description + '</div>',
                    '</div>'
                ].join('');
            }).join('');
        };
        
        this.getStepsForType = function() {
            switch(this.type) {
                case 'print_execution':
                    return [
                        { title: 'Code Written', description: 'You type: print("Hello, World!")' },
                        { title: 'Python Reads', description: 'Python interprets your code and finds the print statement' },
                        { title: 'Message Extracted', description: 'Python takes the text from between the quotes' },
                        { title: 'Output Displayed', description: 'The message appears on your screen: Hello, World!' }
                    ];
                case 'variable_assignment':
                    return [
                        { title: 'Variable Created', description: 'Python creates a storage box labeled "name"' },
                        { title: 'Value Stored', description: 'The text "Alex" is placed inside the box' },
                        { title: 'Variable Used', description: 'print(name) retrieves the stored value' },
                        { title: 'Output Shown', description: 'Alex appears on the screen' }
                    ];
                case 'input_process':
                    return [
                        { title: 'Prompt Displayed', description: 'Computer shows: "What is your name?"' },
                        { title: 'Waiting for Input', description: 'Program pauses and waits for your response' },
                        { title: 'Input Received', description: 'You type your answer and press Enter' },
                        { title: 'Value Stored', description: 'Your answer is saved in the variable' }
                    ];
                case 'concatenation_process':
                    return [
                        { title: 'Parts Identified', description: 'Python finds each piece to join: "Hello", " ", name' },
                        { title: 'Values Retrieved', description: 'Variable values are looked up: name = "Alex"' },
                        { title: 'Joining Process', description: 'All pieces are combined left to right' },
                        { title: 'Result Created', description: 'Final text "Hello Alex" is formed and displayed' }
                    ];
                default:
                    return [];
            }
        };
        
        this.attachEventListeners = function() {
            var self = this;
            var button = this.container.querySelector('.demo-btn');
            button.addEventListener('click', function() { self.playDemo(); });
        };
        
        this.playDemo = function() {
            if (this.isPlaying) return;
            
            this.isPlaying = true;
            this.currentStep = 0;
            var button = this.container.querySelector('.demo-btn');
            var steps = this.container.querySelectorAll('.step');
            
            button.disabled = true;
            button.textContent = '⏳ Running Demo...';
            
            // Reset all steps
            steps.forEach(function(step) { step.classList.remove('active'); });
            
            // Animate steps with smart timing
            var stepTimings = this.getTimingsForType();
            var cumulativeTime = 0;
            var self = this;
            
            steps.forEach(function(step, index) {
                setTimeout(function() {
                    step.classList.add('active');
                    
                    if (index === steps.length - 1) {
                        setTimeout(function() {
                            button.disabled = false;
                            button.textContent = '▶ ' + (self.options.buttonText || 'Watch Demo');
                            self.isPlaying = false;
                            
                            setTimeout(function() {
                                steps.forEach(function(s) { s.classList.remove('active'); });
                            }, 3000);
                        }, 500);
                    }
                }, cumulativeTime);
                
                cumulativeTime += stepTimings[index] || 3000;
            });
        };
        
        this.getTimingsForType = function() {
            switch(this.type) {
                case 'print_execution':
                    return [3000, 5000, 5000, 4000];
                case 'variable_assignment':
                    return [4000, 4000, 4000, 3000];
                case 'input_process':
                    return [3000, 4000, 3000, 3000];
                case 'concatenation_process':
                    return [4000, 4000, 5000, 3000];
                default:
                    return [3000, 3000, 3000, 3000];
            }
        };
    }
    
    // Challenge System Component - creates tiered practice challenges
    function ChallengeSystem(containerId, challenges, options) {
        this.container = document.getElementById(containerId);
        this.challenges = challenges;
        this.options = options || {};
        this.currentDifficulty = null;
        this.currentChallengeIndex = 0;
        
        if (!this.container) {
            throw new Error('Container element not found: ' + containerId);
        }
        
        this.init = function() {
            this.createChallengeSelector();
            this.createChallengeArea();
            this.attachEventListeners();
            return this;
        };
        
        this.createChallengeSelector = function() {
            var selectorHTML = [
                '<div class="practice-section">',
                    '<h4>' + (this.options.title || 'Additional Practice') + '</h4>',
                    '<div class="practice-grid">'
            ];
            
            var difficulties = Object.keys(this.challenges);
            difficulties.forEach(function(difficulty) {
                var difficultyInfo = {
                    basic: { label: 'More Practice', description: 'Need extra practice? Try more examples.', badge: 'Beginner' },
                    creative: { label: 'Creative Challenges', description: 'Make your programs more interesting and personal.', badge: 'Creative' },
                    advanced: { label: 'Extension Tasks', description: 'Ready for something more challenging?', badge: 'Advanced' }
                };
                
                var info = difficultyInfo[difficulty] || { label: difficulty, description: '', badge: difficulty };
                
                selectorHTML.push([
                    '<div class="practice-card" data-difficulty="' + difficulty + '">',
                        '<h5>' + info.label + '</h5>',
                        '<p>' + info.description + '</p>',
                        '<div class="difficulty-badge ' + difficulty + '">' + info.badge + '</div>',
                    '</div>'
                ].join(''));
            });
            
            selectorHTML.push('</div></div>');
            this.container.innerHTML = selectorHTML.join('');
        };
        
        this.createChallengeArea = function() {
            var challengeAreaHTML = [
                '<div class="challenge-area" style="display: none;">',
                    '<div class="challenge-header">',
                        '<h4 class="challenge-title">Challenge Task</h4>',
                        '<button class="close-challenge-btn">× Close</button>',
                    '</div>',
                    '<div class="challenge-description"></div>',
                    '<div class="challenge-playground-container"></div>',
                    '<div class="challenge-navigation">',
                        '<button class="nav-challenge-btn prev-btn">← Previous</button>',
                        '<span class="challenge-counter">1 of 3</span>',
                        '<button class="nav-challenge-btn next-btn">Next →</button>',
                    '</div>',
                '</div>'
            ].join('');
            
            this.container.insertAdjacentHTML('beforeend', challengeAreaHTML);
        };
        
        this.attachEventListeners = function() {
            var self = this;
            
            // Practice card clicks
            this.container.addEventListener('click', function(e) {
                var card = e.target.closest('.practice-card');
                if (card) {
                    var difficulty = card.getAttribute('data-difficulty');
                    self.loadDifficulty(difficulty);
                }
                
                // Challenge navigation
                if (e.target.classList.contains('close-challenge-btn')) {
                    self.closeChallengeArea();
                }
                if (e.target.classList.contains('prev-btn')) {
                    self.previousChallenge();
                }
                if (e.target.classList.contains('next-btn')) {
                    self.nextChallenge();
                }
            });
        };
        
        this.loadDifficulty = function(difficulty) {
            this.currentDifficulty = difficulty;
            this.currentChallengeIndex = 0;
            
            var practiceSection = this.container.querySelector('.practice-section');
            var challengeArea = this.container.querySelector('.challenge-area');
            
            practiceSection.style.display = 'none';
            challengeArea.style.display = 'block';
            
            this.loadCurrentChallenge();
            challengeArea.scrollIntoView({ behavior: 'smooth' });
        };
        
        this.loadCurrentChallenge = function() {
            var challenge = this.challenges[this.currentDifficulty][this.currentChallengeIndex];
            var challengeArea = this.container.querySelector('.challenge-area');
            
            challengeArea.querySelector('.challenge-title').textContent = challenge.title;
            challengeArea.querySelector('.challenge-description').innerHTML = [
                '<div class="challenge-task">',
                    '<strong>Task:</strong> ' + challenge.description,
                    challenge.hint ? '<div class="challenge-hint"><strong>Hint:</strong> ' + challenge.hint + '</div>' : '',
                '</div>'
            ].join('');
            
            // Create playground for this challenge
            var playgroundContainer = challengeArea.querySelector('.challenge-playground-container');
            playgroundContainer.innerHTML = '<div id="challenge-playground"></div>';
            
            var playground = PenguinTwistInterpreter.createPlayground('challenge-playground', this.options.interpreterType || 'print', {
                defaultCode: challenge.starter || '',
                title: 'Challenge Practice Area'
            });
            playground.init();
            
            // Update navigation
            var challengeSet = this.challenges[this.currentDifficulty];
            challengeArea.querySelector('.challenge-counter').textContent = (this.currentChallengeIndex + 1) + ' of ' + challengeSet.length;
            challengeArea.querySelector('.prev-btn').disabled = this.currentChallengeIndex === 0;
            challengeArea.querySelector('.next-btn').disabled = this.currentChallengeIndex === challengeSet.length - 1;
        };
        
        this.previousChallenge = function() {
            if (this.currentChallengeIndex > 0) {
                this.currentChallengeIndex--;
                this.loadCurrentChallenge();
            }
        };
        
        this.nextChallenge = function() {
            var challengeSet = this.challenges[this.currentDifficulty];
            if (this.currentChallengeIndex < challengeSet.length - 1) {
                this.currentChallengeIndex++;
                this.loadCurrentChallenge();
            }
        };
        
        this.closeChallengeArea = function() {
            var practiceSection = this.container.querySelector('.practice-section');
            var challengeArea = this.container.querySelector('.challenge-area');
            
            challengeArea.style.display = 'none';
            practiceSection.style.display = 'block';
        };
    }
    
    // Mastery Check Component - creates interactive assessment questions
    function MasteryCheck(containerId, questions, options) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.options = options || {};
        this.completed = false;
        
        if (!this.container) {
            throw new Error('Container element not found: ' + containerId);
        }
        
        this.init = function() {
            this.createMasteryHTML();
            this.attachEventListeners();
            return this;
        };
        
        this.createMasteryHTML = function() {
            var questionsHTML = this.questions.map(function(question, index) {
                return [
                    '<div class="mastery-question">',
                        '<p><strong>Question ' + (index + 1) + ':</strong> ' + question.question + '</p>',
                        '<input type="text" class="mastery-input" data-question="' + index + '" placeholder="' + (question.placeholder || 'Type your answer') + '">',
                    '</div>'
                ].join('');
            }).join('');
            
            this.container.innerHTML = [
                '<div class="mastery-check">',
                    '<h4>' + (this.options.title || 'Check Your Understanding') + '</h4>',
                    questionsHTML,
                    '<button class="check-answer-btn">Check Answers</button>',
                    '<div class="feedback" style="display: none;"></div>',
                '</div>'
            ].join('');
        };
        
        this.attachEventListeners = function() {
            var self = this;
            var button = this.container.querySelector('.check-answer-btn');
            button.addEventListener('click', function() { self.checkAnswers(); });
        };
        
        this.checkAnswers = function() {
            var inputs = this.container.querySelectorAll('.mastery-input');
            var answers = [];
            var correct = 0;
            
            inputs.forEach(function(input, index) {
                var answer = input.value.trim();
                var question = self.questions[index];
                var isCorrect = self.validateAnswer(answer, question);
                
                answers.push({ answer: answer, correct: isCorrect, question: question });
                if (isCorrect) correct++;
            });
            
            this.displayFeedback(correct, answers);
            
            if (correct === this.questions.length) {
                this.completed = true;
                if (this.options.onComplete) {
                    this.options.onComplete();
                }
            }
        };
        
        this.validateAnswer = function(answer, question) {
            if (question.validator) {
                return question.validator(answer);
            }
            
            // Default validation based on question type
            if (question.type === 'code') {
                return question.expectedPattern.test(answer);
            } else if (question.type === 'concept') {
                return question.keywords.some(function(keyword) {
                    return answer.toLowerCase().includes(keyword.toLowerCase());
                });
            }
            
            return answer.toLowerCase() === question.expectedAnswer.toLowerCase();
        };
        
        this.displayFeedback = function(correct, answers) {
            var feedbackEl = this.container.querySelector('.feedback');
            var total = this.questions.length;
            
            if (correct === total) {
                feedbackEl.innerHTML = this.options.successMessage || 'Perfect! You understand completely. Ready for the next lesson!';
                feedbackEl.className = 'feedback correct';
            } else {
                var feedback = 'Keep trying:<br>';
                answers.forEach(function(answer, index) {
                    if (!answer.correct) {
                        var questionFeedback = 'Please review this concept';
                        if (answer.question && answer.question.feedback) {
                            questionFeedback = answer.question.feedback;
                        } else if (self.questions[index] && self.questions[index].feedback) {
                            questionFeedback = self.questions[index].feedback;
                        }
                        feedback += '• Q' + (index + 1) + ': ' + questionFeedback + '<br>';
                    }
                });
                feedbackEl.innerHTML = feedback;
                feedbackEl.className = 'feedback incorrect';
            }
            
            feedbackEl.style.display = 'block';
        };
        
        this.isCompleted = function() {
            return this.completed;
        };
    }
    
    // Dark Mode Controller - manages theme switching
    function DarkModeController(toggleId) {
        this.toggle = document.getElementById(toggleId);
        this.body = document.body;
        
        if (!this.toggle) {
            throw new Error('Dark mode toggle element not found: ' + toggleId);
        }
        
        this.init = function() {
            this.loadSavedPreference();
            this.attachEventListeners();
            return this;
        };
        
        this.loadSavedPreference = function() {
            var isDarkMode = localStorage.getItem('penguintwist_darkMode') === 'true';
            if (isDarkMode) {
                this.body.classList.add('dark-mode');
                this.toggle.innerHTML = '☀️ Light Mode';
            } else {
                this.toggle.innerHTML = '🌙 Dark Mode';
            }
        };
        
        this.attachEventListeners = function() {
            var self = this;
            this.toggle.addEventListener('click', function() {
                self.toggleMode();
            });
        };
        
        this.toggleMode = function() {
            this.body.classList.toggle('dark-mode');
            var isDarkMode = this.body.classList.contains('dark-mode');
            
            this.toggle.innerHTML = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
            localStorage.setItem('penguintwist_darkMode', isDarkMode);
            
            // Update CodeMirror themes if present
            this.updateCodeMirrorThemes(isDarkMode);
        };
        
        this.updateCodeMirrorThemes = function(isDarkMode) {
            if (typeof CodeMirror !== 'undefined') {
                var editors = document.querySelectorAll('.CodeMirror');
                editors.forEach(function(editorEl) {
                    var editor = editorEl.CodeMirror;
                    if (editor) {
                        editor.setOption('theme', isDarkMode ? 'monokai' : 'default');
                    }
                });
            }
        };
    }
    
    // Progress Tracker - shows lesson progression
    function ProgressTracker(containerId, totalLessons, currentLesson) {
        this.container = document.getElementById(containerId);
        this.total = totalLessons;
        this.current = currentLesson;
        
        if (!this.container) {
            throw new Error('Container element not found: ' + containerId);
        }
        
        this.init = function() {
            this.createProgressHTML();
            return this;
        };
        
        this.createProgressHTML = function() {
            var percentage = Math.round((this.current / this.total) * 100);
            
            this.container.innerHTML = [
                '<div class="progress-tracker">',
                    '<div class="progress-label">Lesson ' + this.current + ' of ' + this.total + '</div>',
                    '<div class="progress-bar">',
                        '<div class="progress-fill" style="width: ' + percentage + '%"></div>',
                    '</div>',
                    '<div class="progress-percentage">' + percentage + '% Complete</div>',
                '</div>'
            ].join('');
        };
        
        this.updateProgress = function(newCurrent) {
            this.current = newCurrent;
            this.createProgressHTML();
        };
    }
    
})();

// Export for Node.js testing if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PenguinTwistComponents;
}
