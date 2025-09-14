// shared/lesson2-logic.js
// Main logic for Lesson 2 - Variables (ES5 Compatible)

(function() {
    'use strict';
    
    // Challenge data with simple validation
    var challengeConfigs = {
        challenge1: {
            title: '🐍 Create Your Profile',
            defaultCode: '# Create three variables:\nname = "Your Name Here"\nage = 16\ncolor = "blue"\n\n# Print them:\nprint(name)\nprint(age)\nprint(color)',
            showMemory: true
        },
        challenge2: {
            title: '🐍 Numbers and Text Practice',
            defaultCode: '# Text variable (use quotes):\nname = "Alex"\n\n# Number variable (no quotes):\nscore = 95\n\n# Print both:\nprint(name)\nprint(score)',
            showMemory: true
        },
        challenge3: {
            title: '🐍 Character Creator',
            defaultCode: '# Create your superhero character:\nhero_name = "Lightning Bolt"\npower = "Super Speed"\ncity = "Metro City"\n\n# Print character profile:\nprint(hero_name)\nprint(power)\nprint(city)',
            showMemory: true
        },
        challenge4: {
            title: '🐍 School Timetable',
            defaultCode: '# Your school subjects:\nperiod1 = "Mathematics"\nperiod2 = "Computer Science"\nperiod3 = "English"\n\n# Print your timetable:\nprint(period1)\nprint(period2)\nprint(period3)',
            showMemory: true
        },
        challenge5: {
            title: '🐍 Mixed Data Challenge',
            defaultCode: '# Different data types:\nstudent_name = "Jamie"\ntest_score = 87\nsubject_code = "CS101"\nmax_score = 100\n\n# Print information:\nprint(student_name)\nprint(test_score)\nprint(subject_code)\nprint(max_score)',
            showMemory: true
        },
        challenge6: {
            title: '🐍 Variable Update Challenge',
            defaultCode: '# Create and print a variable:\nscore = 50\nprint(score)\n\n# Update the variable:\nscore = 75\nprint(score)\n\n# Update it again:\nscore = 100\nprint(score)',
            showMemory: true
        }
    };
    
    // Main initialization function
    function initializeLesson() {
        console.log('🐧 Initializing PenguinTwist Lesson 2...');
        
        try {
            // Check for required components
            if (!window.PenguinTwistComponents) {
                console.error('❌ PenguinTwistComponents not loaded');
                return;
            }
            
            if (!window.PenguinTwistInterpreter) {
                console.error('❌ PenguinTwistInterpreter not loaded');
                return;
            }
            
            // Initialize dark mode
            window.PenguinTwistComponents.setupDarkMode();
            console.log('✅ Dark mode initialized');
            
            // Create memory visualization
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
            var playground1 = window.PenguinTwistInterpreter.createPlayground(
                'variablePracticePlayground',
                {
                    title: '🐍 Python Variable Creator',
                    defaultCode: '# Create your first variables here!\nname = "Alex"\nage = 16\n\n# Try creating more variables:\n# favorite_color = "blue"\n# lucky_number = 7',
                    showMemory: true
                }
            );
            playground1.init();
            console.log('✅ Practice playground created');
            
            var playground2 = window.PenguinTwistInterpreter.createPlayground(
                'variablePrintPlayground',
                {
                    title: '🐍 Variables and Print Practice',
                    defaultCode: '# Variables with different data types\nname = "Alex"\nage = 15\nsubject = "Computer Science"\n\n# Print them to see the output\nprint(name)\nprint(age)\nprint(subject)\n\n# Try creating your own!',
                    showMemory: true
                }
            );
            playground2.init();
            console.log('✅ Print playground created');
            
            // Create mastery check
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
                        
                        // Initialize challenge playgrounds after showing section
                        setTimeout(function() {
                            initializeChallenges();
                        }, 600);
                    }
                }
            );
            masteryCheck.init();
            console.log('✅ Mastery check created');
            
            console.log('🎉 Lesson 2 initialization complete!');
            
        } catch (error) {
            console.error('❌ Lesson initialization failed:', error);
        }
    }
    
    function initializeChallenges() {
        console.log('🏆 Initializing challenge playgrounds...');
        
        for (var challengeId in challengeConfigs) {
            if (challengeConfigs.hasOwnProperty(challengeId)) {
                var config = challengeConfigs[challengeId];
                try {
                    var playground = window.PenguinTwistInterpreter.createPlayground(
                        challengeId,
                        config
                    );
                    playground.init();
                    console.log('✅ Challenge playground created:', challengeId);
                } catch (error) {
                    console.error('❌ Failed to create challenge:', challengeId, error);
                }
            }
        }
        
        console.log('🏆 All challenge playgrounds initialized!');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initializeLesson, 100);
        });
    } else {
        setTimeout(initializeLesson, 100);
    }
    
    // Add keyboard shortcuts for accessibility
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to run code in any focused playground
        if (e.ctrlKey && e.key === 'Enter') {
            var activePlayground = document.querySelector('.enhanced-python-playground .code-editor:focus');
            if (activePlayground) {
                var playgroundContainer = activePlayground.closest('.enhanced-python-playground');
                var runButton = playgroundContainer.querySelector('.run-btn');
                if (runButton && !runButton.disabled) {
                    runButton.click();
                }
            }
        }
    });
    
    // Enhanced error handling for network issues
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('Skulpt')) {
            console.warn('Skulpt loading issue detected, components may fall back to basic mode');
        }
    });
    
})();
