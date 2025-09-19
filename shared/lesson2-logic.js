// shared/lesson2-logic-fixed.js
// Main logic for Lesson 2 - Variables (ES5 Compatible) 
// VERSION: Stable - No Animation Dependencies, Analytics Optional

(function() {
    'use strict';
    
    console.log('=== Lesson 2 Logic Loading (Fixed) ===');
    
    // Track lesson start time for analytics (if available)
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
    
    // Safe analytics wrapper - won't break if analytics fails
    function safeTrackEvent(eventType, data) {
        try {
            if (window.penguinAnalytics) {
                window.penguinAnalytics.trackEvent(eventType, data);
            }
        } catch (e) {
            // Silently continue if analytics fails
            console.log('Analytics unavailable:', e.message);
        }
    }
    
    // Enhanced Python Interpreter with Optional Analytics
    function createEnhancedPlayground(containerId, type, config) {
        console.log('Creating enhanced playground:', containerId);
        
        var playground = window.PenguinTwistInterpreter.createPlayground(containerId, type, config);
        
        // Override runCode to add optional analytics
        var originalRunCode = playground.runCode;
        playground.runCode = function() {
            var code = this.editor.getValue();
            var codeLength = code.length;
            
            // Track code execution attempt (safely)
            safeTrackEvent('code_run', {
                lesson: 'lesson2',
                playground: containerId,
                codeLength: Math.floor(codeLength / 10) * 10
            });
            
            // Call original function
            try {
                originalRunCode.call(this);
            } catch (error) {
                console.error('Error in runCode:', error);
                
                // Show user-friendly error
                var outputElement = document.getElementById(containerId + 'Output');
                if (outputElement) {
                    outputElement.innerHTML = '<div class="error-output">' +
                        '<div class="error-title">❌ Something went wrong:</div>' +
                        '<div class="error-message">There was a problem running your code. Try refreshing the page or simplifying your code.</div>' +
                    '</div>';
                }
            }
        };
        
        return playground;
    }
    
    // Main initialization function
    function initializeLesson() {
        console.log('🎯 Initializing PenguinTwist Lesson 2...');
        console.log('  Timestamp:', new Date().toISOString());
        
        // Track lesson start (safely)
        safeTrackEvent('lesson_start', { lesson: 'lesson2' });
        
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
            
            // Create memory visualization (WORKING VERSION)
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
            
            // Create main Python playgrounds
            console.log('🎮 Creating practice playground...');
            var playground1Config = {
                title: 'Python Variable Creator',
                defaultCode: '# Create your first variables here!\nname = "Alex"\nage = 16\n\n# Try creating more variables:\n# favorite_color = "blue"\n# lucky_number = 7',
                showMemory: true
            };
            
            var playground1 = createEnhancedPlayground(
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
            
            var playground2 = createEnhancedPlayground(
                'variablePrintPlayground',
                'variables',
                playground2Config
            );
            playground2.init();
            console.log('✅ Print playground created');
            
            // Create mastery check with FIXED validation
            console.log('📝 Creating mastery check...');
            var masteryCheck = window.PenguinTwistComponents.createMasteryCheck(
                'masteryCheck',
                [
                    {
                        question: 'To store "Computer Science" in a variable called subject, what code do you write?',
                        placeholder: 'Type your Python code here',
                        validateAnswer: function(answer) {
                            try {
                                var isCorrect = /subject\s*=\s*["']computer science["']/i.test(answer.trim());
                                trackMasteryAttempt(0, isCorrect);
                                return isCorrect;
                            } catch (e) {
                                console.error('Validation error:', e);
                                return false;
                            }
                        },
                        hint: 'Remember: subject = "Computer Science" (with quotes around the text!)'
                    },
                    {
                        question: 'Create a variable called "score" that stores the number 95.',
                        placeholder: 'Type your code here',
                        validateAnswer: function(answer) {
                            try {
                                var isCorrect = /score\s*=\s*95/.test(answer.trim());
                                trackMasteryAttempt(1, isCorrect);
                                return isCorrect;
                            } catch (e) {
                                console.error('Validation error:', e);
                                return false;
                            }
                        },
                        hint: 'Numbers don\'t need quotes: score = 95'
                    },
                    {
                        question: 'If you run: name = "Jamie" then print(name), what appears on screen?',
                        placeholder: 'What gets displayed?',
                        validateAnswer: function(answer) {
                            try {
                                var isCorrect = answer.toLowerCase().trim() === 'jamie';
                                trackMasteryAttempt(2, isCorrect);
                                return isCorrect;
                            } catch (e) {
                                console.error('Validation error:', e);
                                return false;
                            }
                        },
                        hint: 'The variable contains "Jamie", so print(name) displays: Jamie'
                    },
                    {
                        question: 'What\'s the difference between print("age") and print(age)?',
                        placeholder: 'Explain the difference',
                        validateAnswer: function(answer) {
                            try {
                                var cleaned = answer.toLowerCase();
                                var isCorrect = (cleaned.includes('quotes') || cleaned.includes('"age"')) && 
                                               (cleaned.includes('variable') || cleaned.includes('contents') || cleaned.includes('value'));
                                trackMasteryAttempt(3, isCorrect);
                                return isCorrect;
                            } catch (e) {
                                console.error('Validation error:', e);
                                return false;
                            }
                        },
                        hint: 'print("age") displays the word "age", print(age) displays the contents of the variable age'
                    }
                ],
                {
                    title: 'Check Your Understanding',
                    onComplete: function() {
                        console.log('🎉 Mastery check completed!');
                        
                        try {
                            // Track lesson completion (safely)
                            var timeSpent = Date.now() - lessonStartTime;
                            var totalAttempts = Object.values(masteryAttempts).reduce(function(sum, attempts) {
                                return sum + attempts.length;
                            }, 0);
                            var score = Object.keys(masteryAttempts).length;
                            
                            safeTrackEvent('mastery_complete', {
                                lesson: 'lesson2',
                                totalAttempts: totalAttempts,
                                timeSpent: Math.floor(timeSpent / 1000),
                                score: score
                            });
                            
                            // Unlock next lesson and show practice
                            window.unlockNextLesson();
                            window.showPracticeSection();
                            
                            console.log('⏰ Scheduling challenge initialization in 600ms...');
                            setTimeout(function() {
                                console.log('⏰ Timer fired, initializing challenges...');
                                initializeChallenges();
                            }, 600);
                            
                        } catch (error) {
                            console.error('Error in mastery completion:', error);
                            
                            // Still try to unlock next lesson even if tracking fails
                            window.unlockNextLesson();
                            window.showPracticeSection();
                            
                            setTimeout(function() {
                                initializeChallenges();
                            }, 600);
                        }
                    }
                }
            );
            masteryCheck.init();
            console.log('✅ Mastery check created');
            
            console.log('🎊 Lesson 2 initialization complete!');
            
        } catch (error) {
            console.error('❌ Lesson initialization failed:', error);
            console.error('  Stack trace:', error.stack);
            
            // Track initialization errors (safely)
            safeTrackEvent('error', {
                lesson: 'lesson2',
                type: 'initialization',
                message: error.message
            });
            
            // Show fallback message to user
            showFallbackMessage();
        }
    }
    
    function trackMasteryAttempt(questionIndex, isCorrect) {
        try {
            if (!masteryAttempts[questionIndex]) {
                masteryAttempts[questionIndex] = [];
            }
            masteryAttempts[questionIndex].push({
                timestamp: Date.now(),
                isCorrect: isCorrect
            });
            
            // Track individual attempts (safely)
            safeTrackEvent('mastery_attempt', {
                lesson: 'lesson2',
                question: questionIndex,
                isCorrect: isCorrect,
                attempts: masteryAttempts[questionIndex].length
            });
            
        } catch (error) {
            console.error('Error tracking mastery attempt:', error);
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
                
                try {
                    // Check if container exists
                    var container = document.getElementById(challengeId);
                    if (!container) {
                        console.warn('  ⚠️ Container not found for:', challengeId);
                        failCount++;
                        continue;
                    }
                    
                    // Create enhanced playground
                    var playground = createEnhancedPlayground(challengeId, 'variables', config);
                    
                    var initResult = playground.init();
                    
                    if (initResult) {
                        console.log('✅ Challenge playground initialized:', challengeId);
                        successCount++;
                        
                        // Track challenge creation (safely)
                        safeTrackEvent('challenge_created', {
                            lesson: 'lesson2',
                            challengeId: challengeId
                        });
                        
                    } else {
                        console.error('  ❌ Init failed for:', challengeId);
                        failCount++;
                    }
                    
                } catch (error) {
                    console.error('  ❌ Error creating challenge', challengeId + ':', error);
                    failCount++;
                }
            }
        }
        
        console.log('🏆 Challenge initialization summary:');
        console.log('  ✅ Successful:', successCount);
        console.log('  ❌ Failed:', failCount);
        
        // Track results (safely)
        safeTrackEvent('challenges_initialized', {
            lesson: 'lesson2',
            successful: successCount,
            failed: failCount,
            total: Object.keys(challengeConfigs).length
        });
        
        if (failCount > 0) {
            console.warn('⚠️ Some challenges failed to initialize. Check containers exist in HTML.');
        }
    }
    
    function showFallbackMessage() {
        try {
            var container = document.querySelector('.lesson-content');
            if (container) {
                container.innerHTML = '<div class="error-fallback">' +
                    '<h4>⚠️ Loading Issue</h4>' +
                    '<p>There was a problem loading this lesson. This can happen due to:</p>' +
                    '<ul>' +
                        '<li>Slow internet connection</li>' +
                        '<li>Browser compatibility issues</li>' +
                        '<li>Missing lesson files</li>' +
                    '</ul>' +
                    '<p><strong>Try:</strong></p>' +
                    '<ul>' +
                        '<li>Refresh the page (F5)</li>' +
                        '<li>Check your internet connection</li>' +
                        '<li>Try a different browser</li>' +
                        '<li>Contact your teacher for help</li>' +
                    '</ul>' +
                '</div>';
            }
        } catch (e) {
            console.error('Could not show fallback message:', e);
        }
    }
    
    // Export for global access
    window.initializeLesson2 = initializeLesson;
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLesson);
    } else {
        // DOM already loaded, initialize immediately
        setTimeout(initializeLesson, 100);
    }
    
    console.log('=== Lesson 2 Logic Ready (Fixed & Stable) ===');
    
})();
