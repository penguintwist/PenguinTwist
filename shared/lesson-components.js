// shared/lesson-components.js
// Modern lesson components (Chrome 70+, Firefox 60+, Safari 12+, Edge 79+)

(function() {
    'use strict';
    
    // Memory Visualization Component (from legacy lesson)
    function MemoryVisualization(containerId, options) {
        this.containerId = containerId;
        this.options = options || {};
    }
    
    MemoryVisualization.prototype.init = function() {
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found: ' + this.containerId);
            return false;
        }
        
        container.innerHTML = this.createHTML();
        this.setupEvents(container);
        return true;
    };
    
    MemoryVisualization.prototype.createHTML = function() {
        var boxes = this.options.boxes || [
            { label: 'name', value: 'Empty' },
            { label: 'age', value: 'Empty' },
            { label: 'pet', value: 'Empty' }
        ];
        
        var boxesHTML = '';
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            boxesHTML += '<div class="memory-box">' +
                '<div class="box-label">' + box.label + '</div>' +
                '<div class="box-content" id="demoBox' + (i+1) + '">' + box.value + '</div>' +
            '</div>';
        }
        
        var html = '<div class="memory-visualization">' +
            '<div class="memory-metaphor-title">' + (this.options.title || 'Think of Variables as Memory Boxes') + '</div>' +
            '<div class="memory-demo">' + boxesHTML + '</div>';
            
        if (this.options.showButton) {
            html += '<div class="demo-controls">' +
                '<button class="demo-btn" onclick="playAssignmentDemo()">▶ Watch Assignment Process</button>' +
            '</div>';
        }
        
        html += '</div>';
        return html;
    };
    
    MemoryVisualization.prototype.setupEvents = function(container) {
        // Animation methods handled by global functions for legacy compatibility
    };
    
    // Assignment Demo Component
    function AssignmentDemo(containerId, options) {
        this.containerId = containerId;
        this.options = options || {};
    }
    
    AssignmentDemo.prototype.init = function() {
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found: ' + this.containerId);
            return false;
        }
        
        container.innerHTML = this.createHTML();
        return true;
    };
    
    AssignmentDemo.prototype.createHTML = function() {
        var steps = [
            {
                title: 'Write Assignment',
                description: 'You type: name = "Alex"'
            },
            {
                title: 'Python Creates Box',
                description: 'Python sees "name =" and creates a memory box labeled "name"'
            },
            {
                title: 'Value Stored',
                description: 'Python puts "Alex" into the name box'
            },
            {
                title: 'Ready to Use',
                description: 'Now when you use "name", Python gets "Alex" from the box'
            }
        ];
        
        var stepsHTML = '';
        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];
            stepsHTML += '<div class="assignment-step" id="assignStep' + (i+1) + '">' +
                '<div class="step-number">' + (i+1) + '</div>' +
                '<div class="step-title">' + step.title + '</div>' +
                '<div class="step-description">' + step.description + '</div>' +
            '</div>';
        }
        
        return '<div class="assignment-demo">' +
            '<div class="demo-controls">' +
                '<button class="demo-btn" onclick="playDetailedDemo()">▶ Step-by-Step Assignment</button>' +
            '</div>' +
            '<div class="assignment-steps">' + stepsHTML + '</div>' +
        '</div>';
    };
    
    // Visual metaphor component
    function VisualMetaphor(containerId, type, options) {
        this.containerId = containerId;
        this.type = type;
        this.options = options || {};
    }
    
    VisualMetaphor.prototype.init = function() {
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found: ' + this.containerId);
            return false;
        }
        
        if (this.type === 'storage_boxes') {
            container.innerHTML = this.createStorageBoxes();
        } else {
            container.innerHTML = '<div class="visual-metaphor-container">Visual metaphor: ' + this.type + '</div>';
        }
        
        return true;
    };
    
    VisualMetaphor.prototype.createStorageBoxes = function() {
        var variableName = this.options.variableName || 'name';
        var variableValue = this.options.variableValue || 'Alex';
        
        return '<div class="visual-metaphor-container">' +
            '<div class="storage-explanation">' +
                '<h4>Variable Storage & Retrieval</h4>' +
                '<p>When you create a variable, Python stores the value. When you print it, Python retrieves the value:</p>' +
            '</div>' +
            '<div class="storage-flow">' +
                '<div class="storage-box">' +
                    '<div class="box-label">' + variableName + '</div>' +
                    '<div class="box-content">"' + variableValue + '"</div>' +
                '</div>' +
                '<div class="flow-arrow">→</div>' +
                '<div class="print-output">' +
                    '<div class="output-label">print(' + variableName + ')</div>' +
                    '<div class="output-content">' + variableValue + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    };
    
    // Mastery check component
    function MasteryCheck(containerId, questions, options) {
        this.containerId = containerId;
        this.questions = questions;
        this.options = options || {};
    }
    
    MasteryCheck.prototype.init = function() {
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found: ' + this.containerId);
            return false;
        }
        
        container.innerHTML = this.createHTML();
        this.setupEvents(container);
        return true;
    };
    
    MasteryCheck.prototype.createHTML = function() {
        var questionsHTML = '';
        for (var i = 0; i < this.questions.length; i++) {
            var q = this.questions[i];
            questionsHTML += '<div class="mastery-question" data-question="' + i + '">' +
                '<p><strong>Question ' + (i + 1) + ':</strong> ' + q.question + '</p>' +
                '<input type="text" class="answer-input" placeholder="' + (q.placeholder || 'Enter your answer') + '">' +
                '<div class="feedback"></div>' +
            '</div>';
        }
        
        return '<div class="mastery-check">' +
            '<div class="mastery-header">' +
                '<h3>' + (this.options.title || 'Check Your Understanding') + '</h3>' +
                '<p>Complete these questions to unlock the next lesson:</p>' +
            '</div>' +
            questionsHTML +
            '<div class="mastery-controls">' +
                '<button class="check-answers-btn">Check Answers</button>' +
                '<div class="mastery-results"></div>' +
            '</div>' +
        '</div>';
    };
    
    MasteryCheck.prototype.setupEvents = function(container) {
        var self = this;
        var checkButton = container.querySelector('.check-answers-btn');
        var resultsDiv = container.querySelector('.mastery-results');
        
        checkButton.addEventListener('click', function() {
            var score = 0;
            var total = self.questions.length;
            
            for (var i = 0; i < self.questions.length; i++) {
                var question = self.questions[i];
                var questionDiv = container.querySelector('[data-question="' + i + '"]');
                var input = questionDiv.querySelector('.answer-input');
                var feedback = questionDiv.querySelector('.feedback');
                var answer = input.value.trim();
                
                var isCorrect = question.validateAnswer ? question.validateAnswer(answer) : false;
                
                feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
                feedback.textContent = isCorrect ? 'Correct!' : (question.hint || 'Try again!');
                
                if (isCorrect) score++;
            }
            
            var passed = score === total;
            resultsDiv.innerHTML = '<div class="score-display">Score: ' + score + '/' + total + '</div>' +
                '<div class="result-message ' + (passed ? 'passed' : 'failed') + '">' +
                    (passed ? 'Great! You\'ve mastered this lesson.' : 'Keep trying! You need all questions correct.') +
                '</div>';
            
            if (passed && self.options.onComplete) {
                self.options.onComplete();
            }
        });
    };
    
    // Challenge system component
    function ChallengeSystem(containerId, challenges, options) {
        this.containerId = containerId;
        this.challenges = challenges;
        this.options = options || {};
    }
    
    ChallengeSystem.prototype.init = function() {
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found: ' + this.containerId);
            return false;
        }
        
        container.innerHTML = this.createHTML();
        this.setupEvents(container);
        return true;
    };
    
    ChallengeSystem.prototype.createHTML = function() {
        var levels = ['basic', 'creative', 'advanced'];
        var sectionsHTML = '';
        
        for (var l = 0; l < levels.length; l++) {
            var level = levels[l];
            var levelChallenges = this.challenges[level] || [];
            if (levelChallenges.length === 0) continue;
            
            var challengesHTML = '';
            for (var j = 0; j < levelChallenges.length; j++) {
                var challenge = levelChallenges[j];
                challengesHTML += '<div class="challenge-card" data-challenge="' + level + '-' + j + '">' +
                    '<h5>' + challenge.title + '</h5>' +
                    '<p>' + challenge.description + '</p>' +
                    '<textarea class="challenge-code" placeholder="Enter your solution...">' + (challenge.starter || '') + '</textarea>' +
                    '<button class="test-challenge">Test Solution</button>' +
                    '<div class="challenge-feedback"></div>' +
                '</div>';
            }
            
            sectionsHTML += '<div class="challenge-section">' +
                '<h4>' + level.charAt(0).toUpperCase() + level.slice(1) + ' Challenges</h4>' +
                '<div class="challenge-grid">' + challengesHTML + '</div>' +
            '</div>';
        }
        
        return '<div class="challenge-system">' +
            '<div class="challenge-header">' +
                '<h3>' + (this.options.title || 'Practice Challenges') + '</h3>' +
                '<p>Try these exercises to strengthen your understanding:</p>' +
            '</div>' +
            sectionsHTML +
        '</div>';
    };
    
    ChallengeSystem.prototype.setupEvents = function(container) {
        var self = this;
        var testButtons = container.querySelectorAll('.test-challenge');
        
        for (var i = 0; i < testButtons.length; i++) {
            testButtons[i].addEventListener('click', function(event) {
                var card = event.target.closest('.challenge-card');
                var challengeId = card.dataset.challenge;
                var code = card.querySelector('.challenge-code').value;
                var feedback = card.querySelector('.challenge-feedback');
                
                var challenge = self.findChallenge(challengeId);
                if (challenge && challenge.test) {
                    try {
                        var result = challenge.test(code);
                        feedback.className = 'challenge-feedback ' + (result.passed ? 'success' : 'error');
                        feedback.textContent = result.message;
                    } catch (e) {
                        feedback.className = 'challenge-feedback error';
                        feedback.textContent = 'Error testing code: ' + e.message;
                    }
                } else {
                    feedback.className = 'challenge-feedback info';
                    feedback.textContent = 'Great practice! Keep experimenting.';
                }
            });
        }
    };
    
    ChallengeSystem.prototype.findChallenge = function(challengeId) {
        var parts = challengeId.split('-');
        var level = parts[0];
        var index = parseInt(parts[1]);
        return this.challenges[level] ? this.challenges[level][index] : null;
    };
    
    // Updated Dark Mode Management (no checkbox visible)
    function DarkModeManager() {}
    
    DarkModeManager.setup = function() {
        var container = document.getElementById('dark-mode-container');
        var toggle = document.getElementById('dark-mode-toggle');
        var label = document.querySelector('.dark-mode-label');
        
        if (!container || !toggle || !label) return;
        
        // Load saved preference
        var isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            toggle.checked = true;
            label.textContent = '☀️ Light Mode';
        } else {
            label.textContent = '🌙 Dark Mode';
        }
        
        // Click handler for the entire container (no visible checkbox)
        container.addEventListener('click', function(e) {
            e.preventDefault();
            toggle.checked = !toggle.checked;
            
            try {
                if (toggle.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'true');
                    label.textContent = '☀️ Light Mode';
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'false');
                    label.textContent = '🌙 Dark Mode';
                }
                
                // Notify other components
                var event = document.createEvent('CustomEvent');
                event.initEvent('themeChanged', true, true);
                document.dispatchEvent(event);
            } catch (e) {
                console.warn('Could not save dark mode preference:', e);
            }
        });
    };
    
    // Global animation functions for legacy compatibility
    window.playAssignmentDemo = function() {
        var boxes = [
            { element: document.getElementById('demoBox1'), value: '"Alex"' },
            { element: document.getElementById('demoBox2'), value: '16' },
            { element: document.getElementById('demoBox3'), value: '"cat"' }
        ];
        
        var button = document.querySelector('.demo-btn');
        button.disabled = true;
        button.textContent = 'Running...';
        
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            if (box.element) {
                box.element.textContent = 'Empty';
                box.element.className = 'box-content';
            }
        }
        
        for (var i = 0; i < boxes.length; i++) {
            (function(index) {
                var box = boxes[index];
                setTimeout(function() {
                    if (box.element) {
                        box.element.textContent = box.value;
                        box.element.className = 'box-content filled';
                        box.element.parentElement.classList.add('animated');
                        
                        setTimeout(function() {
                            box.element.parentElement.classList.remove('animated');
                        }, 1000);
                        
                        if (index === boxes.length - 1) {
                            setTimeout(function() {
                                button.disabled = false;
                                button.textContent = '▶ Watch Assignment Process';
                            }, 1000);
                        }
                    }
                }, index * 1500);
            })(i);
        }
    };
    
    window.playDetailedDemo = function() {
        var steps = document.querySelectorAll('.assignment-step');
        var button = document.querySelectorAll('.demo-btn')[1];
        
        if (button) {
            button.disabled = true;
            button.textContent = 'Running...';
        }
        
        for (var i = 0; i < steps.length; i++) {
            steps[i].classList.remove('active');
        }
        
        var stepTimings = [2000, 2500, 2500, 2000];
        var cumulativeTime = 0;
        
        for (var i = 0; i < steps.length; i++) {
            (function(index) {
                setTimeout(function() {
                    steps[index].classList.add('active');
                    
                    if (index === steps.length - 1) {
                        setTimeout(function() {
                            if (button) {
                                button.disabled = false;
                                button.textContent = '▶ Step-by-Step Assignment';
                            }
                            
                            setTimeout(function() {
                                for (var j = 0; j < steps.length; j++) {
                                    steps[j].classList.remove('active');
                                }
                            }, 3000);
                        }, 500);
                    }
                }, cumulativeTime);
                
                cumulativeTime += stepTimings[index];
            })(i);
        }
    };
    
    // Main API
    window.PenguinTwistComponents = {
        createMemoryVisualization: function(containerId, options) {
            return new MemoryVisualization(containerId, options);
        },
        createAssignmentDemo: function(containerId, options) {
            return new AssignmentDemo(containerId, options);
        },
        createVisualMetaphor: function(containerId, type, options) {
            return new VisualMetaphor(containerId, type, options);
        },
        createMasteryCheck: function(containerId, questions, options) {
            return new MasteryCheck(containerId, questions, options);
        },
        createChallengeSystem: function(containerId, challenges, options) {
            return new ChallengeSystem(containerId, challenges, options);
        },
        setupDarkMode: function() {
            return DarkModeManager.setup();
        }
    };
    
})();
