// shared/lesson2-logic.js
// Main logic for Lesson 2 - Variables (ES5 Compatible)
// VERSION: Complete Debug Edition

(function() {
    'use strict';
    
    console.log('=== Lesson 2 Logic Loading ===');
    
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
    
    // Main initialization function
    function initializeLesson() {
        console.log('🎯 Initializing PenguinTwist Lesson 2...');
        console.log('  Timestamp:', new Date().toISOString());
        
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
            
            // Create memory visualization
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
            console.log('  Playground 1 config:', playground1Config);
            
            var playground1 = window.PenguinTwistInterpreter.createPlayground(
                'variablePracticePlayground',
                'variables',
                playground1Config
            );
            playground1.init();
            console.log('✅ Practice playground created');
            console.log('  Instance options:', playground1.options);
            
            console.log('🎮 Creating print playground...');
            var playground2Config = {
                title: 'Variables and Print Practice',
                defaultCode: '# Variables with different data types\nname = "Alex"\nage = 15\nsubject = "Computer Science"\n\n# Print them to see the output\nprint(name)\nprint(age)\nprint(subject)\n\n# Try creating your own!',
                showMemory: true
            };
            console.log('  Playground 2 config:', playground2Config);
            
            var playground2 = window.PenguinTwistInterpreter.createPlayground(
                'variablePrintPlayground',
                'variables',
                playground2Config
            );
            playground2.init();
            console.log('✅ Print playground created');
            console.log('  Instance options:', playground2.options);
            
            // Create mastery check
            console.log('📝 Creating mastery check...');
            var masteryCheck = window.PenguinTwistComponents.createMasteryCheck(
                'masteryCheck',
                [
                    {
                        question: 'To store "Computer Science" in a variable called subject, what code do you write?',
                        placeholder: 'Type your Python code here',
                        validateAnswer: function(answer) {
                            return /subject\s*=\s*["']computer science["']/i.test(answer.trim());
                        },
                        hint: 'Remember: subject = "Computer Science" (with quotes around the text!)'
                    },
                    {
                        question: 'Create a variable called "score" that stores the number 95.',
                        placeholder: 'Type your code here',
                        validateAnswer: function(answer) {
                            return /score\s*=\s*95/.test(answer.trim());
                        },
                        hint: 'Numbers don\'t need quotes: score = 95'
                    },
                    {
                        question: 'If you run: name = "Jamie" then print(name), what appears on screen?',
                        placeholder: 'What gets displayed?',
                        validateAnswer: function(answer) {
                            return answer.toLowerCase().trim() === 'jamie';
                        },
                        hint: 'The variable contains "Jamie", so print(name) displays: Jamie'
                    },
                    {
                        question: 'What\'s the difference between print("age") and print(age)?',
                        placeholder: 'Explain the difference',
                        validateAnswer: function(answer) {
                            var cleaned = answer.toLowerCase();
                            return (cleaned.includes('quotes') || cleaned.includes('"age"')) && 
                                   (cleaned.includes('variable') || cleaned.includes('contents') || cleaned.includes('value'));
                        },
                        hint: 'print("age") displays the word "age", print(age) displays the contents of the variable age'
                    }
                ],
                {
                    title: 'Check Your Understanding',
                    onComplete: function() {
                        console.log('🎉 Mastery check completed!');
                        window.unlockNextLesson();
                        window.showPracticeSection();
                        
                        console.log('⏰ Scheduling challenge initialization in 600ms...');
                        // Initialize challenge playgrounds after showing section
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
                    
                    // Create playground with all 3 arguments
                    console.log('  Calling createPlayground with 3 arguments...');
                    var playground = window.PenguinTwistInterpreter.createPlayground(
                        challengeId,
                        'variables',  // This is the problematic second parameter
                        config
                    );
                    
                    console.log('  Playground instance created for:', challengeId);
                    console.log('  Instance options:', playground.options);
                    console.log('  showMemory value:', playground.options.showMemory);
                    
                    var initResult = playground.init();
                    console.log('  Init result for', challengeId + ':', initResult);
                    
                    if (initResult) {
                        console.log('✅ Challenge playground initialized:', challengeId);
                        successCount++;
                        
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
        
        if (failCount > 0) {
            console.warn('⚠️ Some challenges failed to initialize. Check containers exist in HTML.');
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
    
    console.log('=== Lesson 2 Logic Ready ===');
    
})();
