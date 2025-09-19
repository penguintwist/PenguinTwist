// shared/lesson2-logic.js
// Main logic for Lesson 2 - Variables (ES5 Compatible) 
// VERSION: Analytics + Animation Integration

(function() {
    'use strict';
    
    console.log('=== Lesson 2 Logic Loading ===');
    
    // Track lesson start time for analytics
    var lessonStartTime = Date.now();
    var masteryAttempts = {};
    
    // Challenge data with simple validation
    var challengeConfigs = {
        challenge1: {
            title: 'Create Your Profile',
            defaultCode: '# Create three variables:\nname = "Your Name Here"\nage = 16\ncolor = "blue"\n\n# Print them:\nprint(name)\nprint(age)\nprint(color)',
            showMemory: true
        },
        challenge2: {
            title: 'Numbers and Text Practice',
            defaultCode: '# Text variable (use quotes):\nname = "Alex"\n\n# Number variable (no quotes):\nscore = 95\n\n# Print both:\nprint(name)\nprint(score)',
            showMemory: true
        },
        challenge3: {
            title: 'Character Creator',
            defaultCode: '# Create your superhero character:\nhero_name = "Lightning Bolt"\npower = "Super Speed"\ncity = "Metro City"\n\n# Print character profile:\nprint(hero_name)\nprint(power)\nprint(city)',
            showMemory: true
        },
        challenge4: {
            title: 'School Timetable',
            defaultCode: '# Your school subjects:\nperiod1 = "Mathematics"\nperiod2 = "Computer Science"\nperiod3 = "English"\n\n# Print your timetable:\nprint(period1)\nprint(period2)\nprint(period3)',
            showMemory: true
        },
        challenge5: {
            title: 'Mixed Data Challenge',
            defaultCode: '# Different data types:\nstudent_name = "Jamie"\ntest_score = 87\nsubject_code = "CS101"\nmax_score = 100\n\n# Print information:\nprint(student_name)\nprint(test_score)\nprint(subject_code)\nprint(max_score)',
            showMemory: true
        },
        challenge6: {
            title: 'Variable Update Challenge',
            defaultCode: '# Create and print a variable:\nscore = 50\nprint(score)\n\n# Update the variable:\nscore = 75\nprint(score)\n\n# Update it again:\nscore = 100\nprint(score)',
            showMemory: true
        }
    };
    
    console.log('Challenge configs defined:', Object.keys(challengeConfigs));
    
    // Enhanced Python Interpreter with Analytics
    function createAnalyticsEnhancedPlayground(containerId, type, config) {
        var playground = window.PenguinTwistInterpreter.createPlayground(containerId, type, config);
        
        // Override runCode to add analytics
        var originalRunCode = playground.runCode;
        playground.runCode = function() {
            var code = this.editor.getValue();
            var codeLength = code.length;
            var hasOutput = false;
            var hasError = false;
            var errorType = null;
            
            // Track code execution attempt
            if (window.penguinAnalytics) {
                window.penguinAnalytics.trackCodeExecution('lesson2', containerId, codeLength, hasOutput, hasError, errorType);
            }
            
            // Call original function
            originalRunCode.call(this);
            
            // Check for common errors after execution
            setTimeout(function() {
                var outputElement = document.getElementById(containerId + 'Output');
                if (outputElement && outputElement.innerHTML.includes('error-output')) {
                    hasError = true;
                    if (outputElement.innerHTML.includes('NameError')) {
                        errorType = 'NameError';
                    } else if (outputElement.innerHTML.includes('SyntaxError')) {
                        errorType = 'SyntaxError';
                    }
                    
                    // Track error for improvement
                    if (window.penguinAnalytics) {
                        window.penguinAnalytics.trackCommonError('lesson2', containerId, errorType, 'Variable assignment error');
                    }
                } else if (outputElement && outputElement.innerHTML.trim() !== '') {
                    hasOutput = true;
                }
            }, 1000);
        };
        
        return playground;
    }
    
    // Main initialization function
    function initializeLesson() {
        console.log('🎯 Initializing PenguinTwist Lesson 2...');
        console.log('  Timestamp:', new Date().toISOString());
        
        // Track lesson start
        if (window.penguinAnalytics) {
            window.penguinAnalytics.trackLessonStart('lesson2');
        }
        
        try {
            // Check for required components
            if (!window.PenguinTwistComponents) {
                console.error('❌ PenguinTwistComponents not loaded');
                return;
            }
            console.log('✅ PenguinTwistComponents found');
            
            if (!window.PenguinTwistInterpreter) {
                console.error('❌ PenguinTwistInterpreter not loaded');
                return;
            }
            console.log('✅ PenguinTwistInterpreter found');
            
            // Initialize dark mode
            window.PenguinTwistComponents.setupDarkMode();
            console.log('✅ Dark mode initialized');
            
            // Track dark mode usage
            var isDarkMode = document.body.classList.contains('dark-mode');
            if (window.penguinAnalytics) {
                window.penguinAnalytics.trackFeatureUsage('dark_mode', 'lesson2', { enabled: isDarkMode });
            }
            
            // Create enhanced memory visualization with animation
            console.log('📦 Creating memory visualization...');
            var memoryViz = window.PenguinTwistComponents.createMemoryVisualization(
                'memoryBoxDemo',
                {
                    title: 'Think of Variables as Memory Boxes',
                    boxes: [
                        { label: 'name', value: 'Empty' },
                        { label: 'age', value: 'Empty' },
                        { label: 'subject', value: 'Empty' }
                    ]
                }
            );
            memoryViz.init();
            console.log('✅ Memory visualization created');
            
            // Add variable assignment animation
            console.log('🎬 Creating variable assignment animation...');
            createVariableAssignmentDemo();
            
            // Create main Python playgrounds with analytics
            console.log('🎮 Creating practice playground...');
            var playground1Config = {
                title: 'Python Variable Creator',
                defaultCode: '# Create your first variables here!\nname = "Alex"\nage = 16\n\n# Try creating more variables:\n# favorite_color = "blue"\n# lucky_number = 7',
                showMemory: true
            };
            
            var playground1 = createAnalyticsEnhancedPlayground(
                'variablePracticePlayground',
                'variables',
                playground1Config
            );
            playground1.init();
            console.log('✅ Practice playground created');
            
            console.log('🎮 Creating print playground...');
            var playground2Config = {
                title: 'Variables and Print Practice',
                defaultCode: '# Variables with different data types\nname = "Alex"\nage = 15\nsubject = "Computer Science"\n\n# Print them to see the output\nprint(name)\nprint(age)\nprint(subject)\n\n# Try creating your own!',
                showMemory: true
            };
            
            var playground2 = createAnalyticsEnhancedPlayground(
                'variablePrintPlayground',
                'variables',
                playground2Config
            );
            playground2.init();
            console.log('✅ Print playground created');
            
            // Create mastery check with analytics
            console.log('📝 Creating mastery check...');
            var masteryCheck = window.PenguinTwistComponents.createMasteryCheck(
                'masteryCheck',
                [
                    {
                        question: 'To store "Computer Science" in a variable called subject, what code do you write?',
                        placeholder: 'Type your Python code here',
                        validateAnswer: function(answer) {
                            var isCorrect = /subject\s*=\s*["']computer science["']/i.test(answer.trim());
                            trackMasteryAttempt(0, isCorrect);
                            return isCorrect;
                        },
                        hint: 'Remember: subject = "Computer Science" (with quotes around the text!)'
                    },
                    {
                        question: 'Create a variable called "score" that stores the number 95.',
                        placeholder: 'Type your code here',
                        validateAnswer: function(answer) {
                            var isCorrect = /score\s*=\s*95/.test(answer.trim());
                            trackMasteryAttempt(1, isCorrect);
                            return isCorrect;
                        },
                        hint: 'Numbers don\'t need quotes: score = 95'
                    },
                    {
                        question: 'If you run: name = "Jamie" then print(name), what appears on screen?',
                        placeholder: 'What gets displayed?',
                        validateAnswer: function(answer) {
                            var isCorrect = answer.toLowerCase().trim() === 'jamie';
                            trackMasteryAttempt(2, isCorrect);
                            return isCorrect;
                        },
                        hint: 'The variable contains "Jamie", so print(name) displays: Jamie'
                    },
                    {
                        question: 'What\'s the difference between print("age") and print(age)?',
                        placeholder: 'Explain the difference',
                        validateAnswer: function(answer) {
                            var cleaned = answer.toLowerCase();
                            var isCorrect = (cleaned.includes('quotes') || cleaned.includes('"age"')) && 
                                           (cleaned.includes('variable') || cleaned.includes('contents') || cleaned.includes('value'));
                            trackMasteryAttempt(3, isCorrect);
                            return isCorrect;
                        },
                        hint: 'print("age") displays the word "age", print(age) displays the contents of the variable age'
                    }
                ],
                {
                    title: 'Check Your Understanding',
                    onComplete: function() {
                        console.log('🎉 Mastery check completed!');
                        
                        // Track lesson completion
                        var timeSpent = Date.now() - lessonStartTime;
                        var totalAttempts = Object.values(masteryAttempts).reduce(function(sum, attempts) {
                            return sum + attempts.length;
                        }, 0);
                        var score = Object.keys(masteryAttempts).length;
                        
                        if (window.penguinAnalytics) {
                            window.penguinAnalytics.trackMasteryComplete('lesson2', totalAttempts, timeSpent, score);
                            window.penguinAnalytics.trackLessonComplete('lesson2', timeSpent);
                        }
                        
                        window.unlockNextLesson();
                        window.showPracticeSection();
                        
                        console.log('⏰ Scheduling challenge initialization in 600ms...');
                        setTimeout(function() {
                            console.log('⏰ Timer fired, initializing challenges...');
                            initializeChallenges();
                        }, 600);
                    }
                }
            );
            masteryCheck.init();
            console.log('✅ Mastery check created');
            
            console.log('🎊 Lesson 2 initialization complete!');
            
        } catch (error) {
            console.error('❌ Lesson initialization failed:', error);
            console.error('  Stack trace:', error.stack);
            
            // Track initialization errors
            if (window.penguinAnalytics) {
                window.penguinAnalytics.trackCommonError('lesson2', 'initialization', 'InitializationError', error.message);
            }
        }
    }
    
    function trackMasteryAttempt(questionIndex, isCorrect) {
        if (!masteryAttempts[questionIndex]) {
            masteryAttempts[questionIndex] = [];
        }
        masteryAttempts[questionIndex].push({
            timestamp: Date.now(),
            isCorrect: isCorrect
        });
        
        // Track individual attempts
        if (window.penguinAnalytics) {
            window.penguinAnalytics.trackMasteryAttempt('lesson2', questionIndex, isCorrect, masteryAttempts[questionIndex].length);
        }
    }
    
    function createVariableAssignmentDemo() {
        // Check if animation container exists
        var demoContainer = document.getElementById('variableAssignmentDemo');
        if (!demoContainer) {
            console.log('No animation demo container found, skipping animation creation');
            return;
        }
        
        console.log('🎬 Creating variable assignment animation');
        
        // Check if animator is available
        if (!window.VariableAssignmentAnimator) {
            console.warn('Variable animator not loaded, adding fallback');
            demoContainer.innerHTML = '<div class="tip">' +
                '<strong>Interactive Demo Coming Soon:</strong> ' +
                'We\'re working on an animated demonstration of how variables work in memory. ' +
                'For now, imagine Python creating a labeled box called "name" and putting "Alex" inside it!' +
                '</div>';
            return;
        }
        
        try {
            var animator = new window.VariableAssignmentAnimator('variableAssignmentDemo', {
                animationSpeed: 1000,
                autoPlay: false,
                showControls: true
            });
            
            if (animator.init()) {
                animator.createAssignmentAnimation('name', '"Alex"', 'string');
                console.log('✅ Variable assignment animation created');
                
                // Track animation creation
                if (window.penguinAnalytics) {
                    window.penguinAnalytics.trackFeatureUsage('variable_animation', 'lesson2', { created: true });
                }
            }
        } catch (error) {
            console.error('❌ Animation creation failed:', error);
            demoContainer.innerHTML = '<div class="tip">' +
                '<strong>Visual Demo:</strong> ' +
                'Think of creating a variable like putting a value in a labeled box. ' +
                'When you write <code>name = "Alex"</code>, Python creates a box labeled "name" and stores "Alex" inside it.' +
                '</div>';
        }
    }
    
    function initializeChallenges() {
        console.log('🏆 Initializing challenge playgrounds...');
        console.log('  Challenge IDs to create:', Object.keys(challengeConfigs));
        
        var successCount = 0;
        var failCount = 0;
        
        for (var challengeId in challengeConfigs) {
            if (challengeConfigs.hasOwnProperty(challengeId)) {
                var config = challengeConfigs[challengeId];
                console.log('🎯 Creating challenge:', challengeId);
                console.log('  Config for', challengeId + ':', JSON.stringify(config, null, 2));
                
                try {
                    // Check if container exists
                    var container = document.getElementById(challengeId);
                    if (!container) {
                        console.warn('  ⚠️ Container not found for:', challengeId);
                        failCount++;
                        continue;
                    } else {
                        console.log('  ✅ Container found for:', challengeId);
                    }
                    
                    // Create analytics-enhanced playground
                    var playground = createAnalyticsEnhancedPlayground(challengeId, 'variables', config);
                    
                    console.log('  Playground instance created for:', challengeId);
                    console.log('  Instance options:', playground.options);
                    console.log('  showMemory value:', playground.options.showMemory);
                    
                    var initResult = playground.init();
                    console.log('  Init result for', challengeId + ':', initResult);
                    
                    if (initResult) {
                        console.log('✅ Challenge playground initialized:', challengeId);
                        successCount++;
                        
                        // Track challenge playground creation
                        if (window.penguinAnalytics) {
                            window.penguinAnalytics.trackFeatureUsage('challenge_playground', 'lesson2', {
                                challengeId: challengeId,
                                title: config.title
                            });
                        }
                        
                        // Verify memory section was created - wait a moment for DOM
                        setTimeout(function(id) {
                            return function() {
                                var memorySection = document.querySelector('#' + id + ' .memory-section');
                                var memoryTracker = document.querySelector('#' + id + ' .memory-tracker');
                                
                                console.log('🔍 DOM verification for', id + ':');
                                console.log('  .memory-section found:', memorySection !== null);
                                console.log('  .memory-tracker found:', memoryTracker !== null);
                                
                                if (memorySection) {
                                    console.log('  Memory section HTML:', memorySection.outerHTML.substring(0, 200));
                                } else {
                                    console.error('  ❌ Memory section missing for:', id);
                                    
                                    // Debug: show what was actually created
                                    var actualContainer = document.getElementById(id);
                                    if (actualContainer) {
                                        console.log('  Container HTML:', actualContainer.innerHTML.substring(0, 500));
                                    }
                                }
                            };
                        }(challengeId), 100);
                        
                    } else {
                        console.error('  ❌ Init failed for:', challengeId);
                        failCount++;
                    }
                    
                } catch (error) {
                    console.error('  ❌ Error creating challenge', challengeId + ':', error);
                    console.error('    Error details:', error.message);
                    console.error('    Stack:', error.stack);
                    failCount++;
                }
            }
        }
        
        console.log('🏆 Challenge initialization summary:');
        console.log('  ✅ Successful:', successCount);
        console.log('  ❌ Failed:', failCount);
        console.log('  📊 Total attempted:', Object.keys(challengeConfigs).length);
        
        // Track challenge initialization results
        if (window.penguinAnalytics) {
            window.penguinAnalytics.trackFeatureUsage('challenges_initialized', 'lesson2', {
                successful: successCount,
                failed: failCount,
                total: Object.keys(challengeConfigs).length
            });
        }
        
        if (failCount > 0) {
            console.warn('⚠️ Some challenges failed to initialize. Check containers exist in HTML.');
        }
    }
    
    // Struggle Detection System
    function detectUserStruggle() {
        var runCounts = {};
        var errorCounts = {};
        var lastActivity = Date.now();
        
        // Monitor playground usage for struggle indicators
        setInterval(function() {
            var now = Date.now();
            var idleTime = now - lastActivity;
            
            // Detect long idle periods (over 5 minutes on same playground)
            if (idleTime > 300000) { // 5 minutes
                if (window.penguinAnalytics) {
                    window.penguinAnalytics.trackUserStruggle('lesson2', 'long_idle', {
                        idleTime: Math.floor(idleTime / 1000)
                    });
                }
                lastActivity = now; // Reset to avoid repeated triggers
            }
        }, 60000); // Check every minute
        
        // Track activity
        document.addEventListener('click', function() {
            lastActivity = Date.now();
        });
        
        document.addEventListener('keypress', function() {
            lastActivity = Date.now();
        });
    }
    
    // Enhanced Error Tracking
    function enhanceErrorTracking() {
        // Override console.error to catch JavaScript errors
        var originalError = console.error;
        console.error = function() {
            originalError.apply(console, arguments);
            
            // Track JavaScript errors that might indicate platform issues
            if (window.penguinAnalytics && arguments[0]) {
                var errorMsg = arguments[0].toString();
                if (errorMsg.includes('Skulpt') || errorMsg.includes('Python') || errorMsg.includes('playground')) {
                    window.penguinAnalytics.trackCommonError('lesson2', 'javascript', 'PlatformError', errorMsg.substring(0, 100));
                }
            }
        };
    }
    
    // Export for global access
    window.initializeLesson2 = initializeLesson;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeLesson();
            detectUserStruggle();
            enhanceErrorTracking();
        });
    } else {
        // DOM already loaded, initialize immediately
        setTimeout(function() {
            initializeLesson();
            detectUserStruggle();
            enhanceErrorTracking();
        }, 100);
    }
    
    console.log('=== Lesson 2 Logic Ready (Analytics Enhanced) ===');
    
})();
