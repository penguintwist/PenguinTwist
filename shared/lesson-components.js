// shared/lesson-components.js
// PenguinTwist Reusable Lesson Components
// ES5 compatible for maximum school network compatibility

(function() {
    'use strict';
    
    // Main components library
    window.PenguinTwistComponents = {
        
        // Create visual metaphor components - SPEC COMPLIANT
        createVisualMetaphor: function(containerId, metaphorType, options) {
            options = options || {};
            
            // Return object with init() method as required by spec
            return {
                containerId: containerId,
                metaphorType: metaphorType,
                options: options,
                
                init: function() {
                    var container = document.getElementById(this.containerId);
                    
                    if (!container) {
                        console.error('Container not found:', this.containerId);
                        return false;
                    }
                    
                    var html = '<div class="visual-metaphor-container">';
                    
                    if (this.metaphorType === 'memory_boxes') {
                        html += this.createMemoryBoxesHTML();
                    } else if (this.metaphorType === 'storage_boxes') {
                        html += this.createStorageBoxesHTML();
                    } else {
                        html += '<div class="metaphor-placeholder">Visual metaphor: ' + this.metaphorType + '</div>';
                    }
                    
                    html += '</div>';
                    container.innerHTML = html;
                    
                    // Set up demo functionality if requested
                    if (this.options.demoButton && this.options.demoScript) {
                        this.setupDemo(container);
                    }
                    
                    return true;
                },
                
                // Create memory boxes visualization
                createMemoryBoxesHTML: function() {
                    var boxes = this.options.boxes || [
                        { label: 'name', value: 'Empty' },
                        { label: 'age', value: 'Empty' }
                    ];
                    
                    var html = '<div class="memory-boxes-visualization">';
                    html += '<div class="memory-explanation">';
                    html += '<h4>' + (this.options.title || 'Variables as Memory Boxes') + '</h4>';
                    html += '<p>Variables are like labeled boxes in your computer\'s memory:</p>';
                    html += '</div>';
                    
                    html += '<div class="memory-boxes-row">';
                    for (var i = 0; i < boxes.length; i++) {
                        var box = boxes[i];
                        html += '<div class="memory-box" style="border-color: ' + (box.color || '#666') + '">';
                        html += '<div class="box-label">' + box.label + '</div>';
                        html += '<div class="box-content">' + box.value + '</div>';
                        html += '</div>';
                        
                        if (i < boxes.length - 1) {
                            html += '<div class="box-separator"></div>';
                        }
                    }
                    html += '</div>';
                    
                    if (this.options.demoButton) {
                        html += '<div class="demo-controls">';
                        html += '<button class="demo-button">Watch Demo</button>';
                        html += '</div>';
                    }
                    
                    html += '</div>';
                    return html;
                },
                
                // Create storage boxes visualization with arrow
                createStorageBoxesHTML: function() {
                    var variableName = this.options.variableName || 'name';
                    var variableValue = this.options.variableValue || 'Alex';
                    
                    var html = '<div class="storage-visualization">';
                    html += '<div class="storage-explanation">';
                    html += '<h4>' + (this.options.title || 'Variable Storage & Retrieval') + '</h4>';
                    html += '<p>When you create a variable, Python stores the value. When you print it, Python retrieves the value:</p>';
                    html += '</div>';
                    
                    html += '<div class="storage-flow">';
                    
                    // Storage box
                    html += '<div class="storage-box">';
                    html += '<div class="box-label">' + variableName + '</div>';
                    html += '<div class="box-content">"' + variableValue + '"</div>';
                    html += '</div>';
                    
                    // Arrow
                    html += '<div class="flow-arrow">→</div>';
                    
                    // Print output
                    html += '<div class="print-output">';
                    html += '<div class="output-label">print(' + variableName + ')</div>';
                    html += '<div class="output-content">' + variableValue + '</div>';
                    html += '</div>';
                    
                    html += '</div>';
                    html += '</div>';
                    
                    return html;
                },
                
                // Set up demo functionality
                setupDemo: function(container) {
                    var demoButton = container.querySelector('.demo-button');
                    var self = this;
                    
                    if (demoButton && this.options.demoScript) {
                        function runDemo() {
                            try {
                                for (var i = 0; i < self.options.demoScript.length; i++) {
                                    var step = self.options.demoScript[i];
                                    if (step.action === 'assign') {
                                        setTimeout(function(step) {
                                            return function() {
                                                var box = container.querySelector('.box-label:contains(' + step.box + ')');
                                                if (box) {
                                                    var content = box.parentNode.querySelector('.box-content');
                                                    content.textContent = step.value;
                                                    content.classList.add('updated');
                                                }
                                            };
                                        }(step), step.delay || 1000);
                                    }
                                }
                            } catch (error) {
                                console.error('Demo script error:', error);
                            }
                        }
                        
                        // Event listener with IE8+ compatibility
                        if (demoButton.addEventListener) {
                            demoButton.addEventListener('click', runDemo);
                        } else {
                            demoButton.attachEvent('onclick', runDemo);
                        }
                    }
                }
            };
        },
        
        // Create mastery check component - SPEC COMPLIANT
        createMasteryCheck: function(containerId, questions, options) {
            options = options || {};
            
            // Return object with init() method as required by spec
            return {
                containerId: containerId,
                questions: questions,
                options: options,
                
                init: function() {
                    var container = document.getElementById(this.containerId);
                    
                    if (!container) {
                        console.error('Container not found:', this.containerId);
                        return false;
                    }
                    
                    var html = '<div class="mastery-check">';
                    html += '<div class="mastery-header">';
                    html += '<h3>' + (this.options.title || 'Check Understanding') + '</h3>';
                    html += '<p>Complete these questions to unlock the next lesson:</p>';
                    html += '</div>';
                    
                    // Create questions
                    for (var i = 0; i < this.questions.length; i++) {
                        var question = this.questions[i];
                        html += '<div class="mastery-question" data-question="' + i + '">';
                        html += '<p><strong>Question ' + (i + 1) + ':</strong> ' + question.question + '</p>';
                        
                        if (question.type === 'multiple-choice') {
                            html += '<div class="answer-options">';
                            for (var j = 0; j < question.options.length; j++) {
                                html += '<label class="option-label">';
                                html += '<input type="radio" name="question' + i + '" value="' + j + '">';
                                html += '<span>' + question.options[j] + '</span>';
                                html += '</label>';
                            }
                            html += '</div>';
                        } else if (question.type === 'code') {
                            html += '<div class="code-answer">';
                            html += '<textarea class="answer-input" placeholder="' + (question.placeholder || 'Enter your Python code here...') + '"></textarea>';
                            html += '</div>';
                        } else {
                            html += '<div class="text-answer">';
                            html += '<input type="text" class="answer-input" placeholder="' + (question.placeholder || 'Enter your answer here...') + '">';
                            html += '</div>';
                        }
                        
                        html += '<div class="feedback"></div>';
                        html += '</div>';
                    }
                    
                    html += '<div class="mastery-controls">';
                    html += '<button class="check-answers-btn">Check Answers</button>';
                    html += '<div class="mastery-results"></div>';
                    html += '</div>';
                    html += '</div>';
                    
                    container.innerHTML = html;
                    
                    // Set up event handlers
                    this.setupMasteryCheck(container);
                    
                    return true;
                },
                
                // Set up mastery check functionality
                setupMasteryCheck: function(container) {
                    var checkButton = container.querySelector('.check-answers-btn');
                    var resultsDiv = container.querySelector('.mastery-results');
                    var self = this;
                    
                    function checkAnswers() {
                        var score = 0;
                        var totalQuestions = self.questions.length;
                        
                        for (var i = 0; i < self.questions.length; i++) {
                            var question = self.questions[i];
                            var questionDiv = container.querySelector('[data-question="' + i + '"]');
                            var feedbackDiv = questionDiv.querySelector('.feedback');
                            var isCorrect = false;
                            
                            if (question.type === 'multiple-choice') {
                                var selectedOption = questionDiv.querySelector('input[type="radio"]:checked');
                                if (selectedOption) {
                                    var selectedValue = parseInt(selectedOption.value);
                                    isCorrect = selectedValue === question.correct;
                                }
                            } else {
                                var answerInput = questionDiv.querySelector('.answer-input');
                                var userAnswer = answerInput.value.trim();
                                
                                // Use custom validator if provided - SPEC COMPLIANT FLEXIBLE VALIDATION
                                if (question.validateAnswer) {
                                    isCorrect = question.validateAnswer(userAnswer);
                                } else if (question.answer) {
                                    // Simple string comparison (case-insensitive)
                                    isCorrect = userAnswer.toLowerCase() === question.answer.toLowerCase();
                                }
                            }
                            
                            // Update feedback
                            feedbackDiv.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
                            feedbackDiv.innerHTML = isCorrect ? 'Correct!' : (question.hint || 'Try again!');
                            
                            if (isCorrect) {
                                score++;
                            }
                        }
                        
                        // Show results
                        var passingScore = totalQuestions;
                        var passed = score >= passingScore;
                        resultsDiv.innerHTML = 
                            '<div class="score-display">Score: ' + score + '/' + totalQuestions + '</div>' +
                            '<div class="result-message ' + (passed ? 'passed' : 'failed') + '">' +
                                (passed ? 
                                    'Congratulations! You\'ve mastered this lesson. The next lesson is now unlocked!' :
                                    'Keep practicing! You need ' + passingScore + ' correct answers to pass.') +
                            '</div>';
                        
                        if (passed && self.options.onComplete) {
                            self.options.onComplete();
                        }
                        
                        // Unlock challenges if passed
                        if (passed) {
                            window.PenguinTwistComponents.unlockChallenges();
                        }
                    }
                    
                    // Event listener with IE8+ compatibility
                    if (checkButton.addEventListener) {
                        checkButton.addEventListener('click', checkAnswers);
                    } else {
                        checkButton.attachEvent('onclick', checkAnswers);
                    }
                }
            };
        },
        
        // Create challenge system - SPEC COMPLIANT
        createChallengeSystem: function(containerId, challenges, options) {
            options = options || {};
            
            // Return object with init() method as required by spec
            return {
                containerId: containerId,
                challenges: challenges,
                options: options,
                
                init: function() {
                    var container = document.getElementById(this.containerId);
                    
                    if (!container) {
                        console.error('Container not found:', this.containerId);
                        return false;
                    }
                    
                    var html = '<div class="challenge-system">';
                    html += '<div class="challenge-header">';
                    html += '<h3>' + (this.options.title || 'Practice Challenges') + '</h3>';
                    html += '<p>Try these additional exercises to strengthen your understanding:</p>';
                    html += '</div>';
                    
                    // Create challenge sections
                    var difficulties = ['basic', 'creative', 'advanced'];
                    
                    for (var i = 0; i < difficulties.length; i++) {
                        var difficulty = difficulties[i];
                        var challengeList = this.challenges[difficulty] || [];
                        
                        if (challengeList.length > 0) {
                            html += '<div class="challenge-section">';
                            html += '<h4>' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + ' Challenges</h4>';
                            html += '<div class="challenge-grid">';
                            
                            for (var j = 0; j < challengeList.length; j++) {
                                var challenge = challengeList[j];
                                var challengeId = 'challenge-' + difficulty + '-' + j;
                                
                                html += '<div class="challenge-card" data-challenge="' + challengeId + '">';
                                html += '<h5>' + challenge.title + '</h5>';
                                html += '<p>' + challenge.description + '</p>';
                                html += '<div class="challenge-content">';
                                html += '<textarea class="challenge-code" placeholder="Enter your solution here...">';
                                html += (challenge.starter || '') + '</textarea>';
                                html += '<button class="test-challenge">Test Solution</button>';
                                html += '<div class="challenge-feedback"></div>';
                                html += '</div>';
                                html += '</div>';
                            }
                            
                            html += '</div>';
                            html += '</div>';
                        }
                    }
                    
                    html += '</div>';
                    container.innerHTML = html;
                    
                    // Set up challenge testing
                    this.setupChallenges(container);
                    
                    return true;
                },
                
                // Set up challenge functionality
                setupChallenges: function(container) {
                    var testButtons = container.querySelectorAll('.test-challenge');
                    var self = this;
                    
                    for (var i = 0; i < testButtons.length; i++) {
                        function setupButton(button) {
                            function testChallenge() {
                                var challengeCard = button.parentNode.parentNode;
                                var challengeCode = challengeCard.querySelector('.challenge-code');
                                var feedbackDiv = challengeCard.querySelector('.challenge-feedback');
                                var challengeId = challengeCard.getAttribute('data-challenge');
                                
                                // Find the corresponding challenge
                                var challenge = self.findChallengeById(challengeId);
                                
                                if (challenge && challenge.test) {
                                    var userCode = challengeCode.value;
                                    var result = challenge.test(userCode);
                                    
                                    feedbackDiv.className = 'challenge-feedback ' + (result.passed ? 'success' : 'error');
                                    feedbackDiv.innerHTML = result.message;
                                } else {
                                    feedbackDiv.className = 'challenge-feedback info';
                                    feedbackDiv.innerHTML = 'Great practice! Keep experimenting with variables.';
                                }
                            }
                            
                            // Event listener with IE8+ compatibility
                            if (button.addEventListener) {
                                button.addEventListener('click', testChallenge);
                            } else {
                                button.attachEvent('onclick', testChallenge);
                            }
                        }
                        
                        setupButton(testButtons[i]);
                    }
                },
                
                // Helper to find challenge by ID
                findChallengeById: function(challengeId) {
                    var parts = challengeId.split('-');
                    var difficulty = parts[1];
                    var index = parseInt(parts[2]);
                    
                    if (this.challenges[difficulty] && this.challenges[difficulty][index]) {
                        return this.challenges[difficulty][index];
                    }
                    return null;
                }
            };
        },
        
        // Dark mode setup - SPEC COMPLIANT
        setupDarkMode: function() {
            var darkModeToggle = document.getElementById('dark-mode-toggle');
            
            if (!darkModeToggle) {
                return;
            }
            
            // Check for saved preference (fallback for older browsers)
            var isDarkMode = false;
            try {
                isDarkMode = localStorage.getItem('darkMode') === 'true';
            } catch (e) {
                // LocalStorage not supported, use default
            }
            
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
            
            function toggleDarkMode() {
                if (darkModeToggle.checked) {
                    document.body.classList.add('dark-mode');
                    try {
                        localStorage.setItem('darkMode', 'true');
                    } catch (e) {
                        // LocalStorage not supported
                    }
                } else {
                    document.body.classList.remove('dark-mode');
                    try {
                        localStorage.setItem('darkMode', 'false');
                    } catch (e) {
                        // LocalStorage not supported
                    }
                }
                
                // Notify components of theme change
                if (document.createEvent) {
                    var event = document.createEvent('Event');
                    event.initEvent('themeChanged', true, true);
                    document.dispatchEvent(event);
                } else if (document.createEventObject) {
                    // IE8 compatibility
                    var event = document.createEventObject();
                    event.eventType = 'themeChanged';
                    document.fireEvent('onthemeChanged', event);
                }
            }
            
            // Event listener with IE8+ compatibility
            if (darkModeToggle.addEventListener) {
                darkModeToggle.addEventListener('change', toggleDarkMode);
            } else {
                darkModeToggle.attachEvent('onchange', toggleDarkMode);
            }
        },
        
        // Unlock challenges (called when mastery check is passed)
        unlockChallenges: function() {
            var challengeSection = document.querySelector('.challenge-system');
            if (challengeSection) {
                challengeSection.classList.add('unlocked');
                if (challengeSection.scrollIntoView) {
                    challengeSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Fallback for older browsers
                    challengeSection.scrollIntoView();
                }
            }
        },
        
        // Setup fallback system - SPEC REQUIRED
        setupFallbacks: function() {
            console.log('Setting up component fallbacks...');
            
            // Find containers that need components
            var containers = [
                'memoryBoxDemo', 
                'playgroundBasic', 
                'playgroundAdvanced', 
                'masteryCheck',
                'challengeSystem'
            ];
            
            for (var i = 0; i < containers.length; i++) {
                var container = document.getElementById(containers[i]);
                if (container && !container.innerHTML.trim()) {
                    container.innerHTML = 
                        '<div class="fallback-message">' +
                            '<p>Interactive component loading...</p>' +
                            '<p>If this message persists, please check your connection and refresh the page.</p>' +
                        '</div>';
                }
            }
        }
    };
    
    // Initialize dark mode when the page loads - SPEC COMPLIANT INITIALIZATION
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function() {
            window.PenguinTwistComponents.setupDarkMode();
        });
    } else {
        // IE8 compatibility
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState === 'complete') {
                window.PenguinTwistComponents.setupDarkMode();
            }
        });
    }
    
    // Export for testing purposes
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.PenguinTwistComponents;
    }
    
})();
