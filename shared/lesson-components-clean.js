// shared/lesson-components-clean.js
// Streamlined lesson components (ES5 Compatible)

(function() {
    'use strict';
    
    // Simple Memory Visualization Component
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
            { label: 'subject', value: 'Empty' }
        ];
        
        var boxesHTML = '';
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            boxesHTML += '<div class="memory-box">' +
                '<div class="box-label">' + box.label + '</div>' +
                '<div class="box-content" id="demoBox' + (i+1) + '">' + box.value + '</div>' +
            '</div>';
        }
        
        return '<div class="memory-visualization-title">' + 
                (this.options.title || 'Think of Variables as Memory Boxes') + 
               '</div>' +
               '<div class="memory-demo">' + boxesHTML + '</div>' +
               '<div class="demo-controls">' +
                   '<button onclick="playMemoryDemo()" style="' +
                   'background: linear-gradient(135deg, #06b6d4, #8b5cf6); ' +
                   'color: white; ' +
                   'border: 2px solid rgba(255, 255, 255, 0.2); ' +
                   'padding: 12px 24px; ' +
                   'border-radius: 25px; ' +
                   'cursor: pointer; ' +
                   'font-weight: 600; ' +
                   'font-size: 15px; ' +
                   'box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3); ' +
                   'transition: all 0.3s ease; ' +
                   'min-width: 200px; ' +
                   'font-family: inherit; ' +
                   'text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); ' +
                   '" onmouseover="this.style.transform=\'translateY(-2px)\'; this.style.boxShadow=\'0 6px 20px rgba(6, 182, 212, 0.4)\';" ' +
                   'onmouseout="this.style.transform=\'translateY(0px)\'; this.style.boxShadow=\'0 4px 15px rgba(6, 182, 212, 0.3)\';" ' +
                   '>▶ Watch Variables Fill Up</button>' +
               '</div>';
    };
    
    MemoryVisualization.prototype.setupEvents = function(container) {
        // Events handled by global function for simplicity
    };
    
    // Mastery Check Component
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
    
    // Dark Mode Manager
    function DarkModeManager() {}
    
    DarkModeManager.setup = function() {
        var container = document.getElementById('dark-mode-container');
        var label = document.getElementById('dark-mode-label');
        
        if (!container || !label) return;
        
        // Load saved preference
        var isDark = false;
        try {
            isDark = localStorage.getItem('darkMode') === 'true';
        } catch (e) {
            console.warn('Could not access localStorage for dark mode');
        }
        
        if (isDark) {
            document.body.classList.add('dark-mode');
            label.textContent = '☀️ Light Mode';
        } else {
            label.textContent = '🌙 Dark Mode';
        }
        
        // Click handler for the container
        container.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                var currentlyDark = document.body.classList.contains('dark-mode');
                
                if (currentlyDark) {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'false');
                    label.textContent = '🌙 Dark Mode';
                } else {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'true');
                    label.textContent = '☀️ Light Mode';
                }
            } catch (e) {
                console.warn('Could not save dark mode preference:', e);
                // Still toggle the class even if we can't save
                if (document.body.classList.contains('dark-mode')) {
                    document.body.classList.remove('dark-mode');
                    label.textContent = '🌙 Dark Mode';
                } else {
                    document.body.classList.add('dark-mode');
                    label.textContent = '☀️ Light Mode';
                }
            }
        });
    };
    
    // Global animation function for memory demo
    window.playMemoryDemo = function() {
        var boxes = [
            { element: document.getElementById('demoBox1'), value: '"Alex"' },
            { element: document.getElementById('demoBox2'), value: '16' },
            { element: document.getElementById('demoBox3'), value: '"Computer Science"' }
        ];
        
        var button = document.querySelector('.demo-btn');
        if (button) {
            button.disabled = true;
            button.textContent = 'Running Demo...';
        }
        
        // Reset boxes
        for (var i = 0; i < boxes.length; i++) {
            var box = boxes[i];
            if (box.element) {
                box.element.textContent = 'Empty';
                box.element.className = 'box-content';
            }
        }
        
        // Animate boxes filling
        for (var i = 0; i < boxes.length; i++) {
            (function(index) {
                var box = boxes[index];
                setTimeout(function() {
                    if (box.element) {
                        box.element.textContent = box.value;
                        box.element.className = 'box-content filled';
                        
                        // Add a brief highlight effect
                        box.element.style.transform = 'scale(1.1)';
                        setTimeout(function() {
                            box.element.style.transform = 'scale(1)';
                        }, 300);
                        
                        if (index === boxes.length - 1) {
                            setTimeout(function() {
                                if (button) {
                                    button.disabled = false;
                                    button.textContent = '▶ Watch Variables Fill Up';
                                }
                            }, 500);
                        }
                    }
                }, index * 1000);
            })(i);
        }
    };
    
    // Simple practice section show/hide
    window.showPracticeSection = function() {
        var practiceSection = document.getElementById('practiceSection');
        if (practiceSection) {
            practiceSection.style.display = 'block';
            setTimeout(function() {
                practiceSection.classList.add('show');
                practiceSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    };
    
    window.unlockNextLesson = function() {
        var nextBtn = document.getElementById('nextLessonBtn');
        if (nextBtn) {
            nextBtn.classList.remove('disabled');
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
            console.log('✅ Next lesson unlocked');
        }
    };
    
    // Main API
    window.PenguinTwistComponents = {
        createMemoryVisualization: function(containerId, options) {
            return new MemoryVisualization(containerId, options);
        },
        createMasteryCheck: function(containerId, questions, options) {
            return new MasteryCheck(containerId, questions, options);
        },
        setupDarkMode: function() {
            return DarkModeManager.setup();
        }
    };
    
})();
