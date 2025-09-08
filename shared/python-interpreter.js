<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesson 2: Variables - PenguinTwist</title>
    
    <!-- CodeMirror CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css">
    
    <!-- Shared Styles -->
    <link rel="stylesheet" href="shared/lesson-styles.css">
</head>
<body>
    <div class="header">
        <button id="darkModeToggle" class="dark-mode-toggle">🌙 Dark Mode</button>
        <div class="container">
            <h1>Lesson 2: Variables</h1>
            <p>Give your programs memory - store and remember information</p>
        </div>
    </div>
    
    <div class="nav-back">
        <div class="container">
            <a href="navigation.html">← Back to All Lessons</a>
            <span style="color: #666;">Previous: <a href="lesson1.html" style="color: #667eea;">Hello World</a></span>
        </div>
    </div>
    
    <div class="container">
        <div class="lesson-content">
            <div class="section">
                <h3>Why Programs Need Memory</h3>
                <div class="intro">
                    <p>Imagine a calculator that forgets your answer the moment you press equals. Or a game that resets your score every time you collect a coin. Or a website that asks for your name on every single page.</p>
                    <p>Programs need to remember information to be useful. Variables are like labelled storage boxes in the computer's memory - they let your programs remember and reuse information like names, scores, messages, or any data your program needs.</p>
                </div>
            </div>
            
            <div class="section">
                <h3>Understanding Variables as Memory Boxes</h3>
                <div class="theory">
                    <p>Think of variables as labeled boxes in a warehouse. Each box has:</p>
                    <p>• A <strong>name</strong> (the label on the box)</p>
                    <p>• A <strong>value</strong> (what's stored inside the box)</p>
                    <p>• A <strong>location</strong> (where Python can find it in memory)</p>
                    
                    <div class="tip">
                        <strong>Memory Box Metaphor:</strong> When you create a variable called "name", Python creates a box labeled "name" and puts your value inside it. Whenever you use that variable name later, Python opens the box and looks at what's inside.
                    </div>
                </div>
                
                <!-- Visual Metaphor Component -->
                <div id="memoryBoxDemo"></div>
            </div>
            
            <div class="section">
                <h3>Creating Your First Variable</h3>
                <div class="theory">
                    <p>In Python, you create a variable using the assignment operator (the equals sign). This tells Python to store information in a labelled box.</p>
                    
                    <div class="code-example">name = "Alex"</div>
                    
                    <p>This code creates a memory box labelled 'name' and stores the text "Alex" inside it.</p>
                    
                    <div class="tip">
                        <strong>The Assignment Process:</strong> The equals sign doesn't mean "equal to" in maths. In programming, it means "store the value on the right into the variable on the left."
                    </div>
                    
                    <p>You can store different types of information:</p>
                    <div class="code-example">name = "Alex"
age = 15</div>
                    
                    <div class="tip">
                        <strong>Important:</strong> Text must be wrapped in quotes, but numbers don't need quotes. Python treats them differently!
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>Try Creating Variables</h3>
                <!-- Interactive Playground Component -->
                <div id="variableCreationPlayground"></div>
            </div>
            
            <div class="section">
                <h3>Using Variables with Print</h3>
                <div class="theory">
                    <p>Now that you can create variables, you can use them with print statements. This is where the magic happens - your program can remember and display information!</p>
                    
                    <div class="code-example">name = "Alex"
print(name)</div>
                    
                    <div class="expected-output"><strong>Output:</strong>
Alex</div>
                    
                    <div class="tip">
                        <strong>Key Distinction:</strong> Notice the difference between print(name) and print("name"). The first prints the contents of the variable, the second prints the word "name".
                    </div>
                    
                    <p>Watch what happens when we print both variables:</p>
                    <div class="code-example">name = "Alex"
age = 15
print(name)
print(age)</div>
                    
                    <div class="expected-output"><strong>Output:</strong>
Alex
15</div>
                </div>
            </div>
            
            <div class="section">
                <h3>See Variables in Action</h3>
                <!-- Main Practice Playground -->
                <div id="variablePrintPlayground"></div>
                
                <div class="tip">
                    <strong>Try these experiments:</strong>
                    <br>• Change "Alex" to your own name
                    <br>• Add a new variable for your favorite subject
                    <br>• Try storing a number without quotes
                    <br>• What happens if you forget the quotes around text?
                </div>
            </div>
            
            <div class="section">
                <h3>Practice with Variables</h3>
                <!-- Advanced Practice Playground -->
                <div id="variablePracticePlayground"></div>
            </div>
            
            <!-- Mastery Check Component -->
            <div id="masteryCheck"></div>
            
            <!-- Challenge System Component -->
            <div id="challengeSystem"></div>
        </div>
    </div>
    
    <div class="container">
        <div class="lesson-navigation">
            <div class="nav-buttons">
                <a href="lesson1.html" class="nav-btn">← Previous Lesson</a>
                <a href="navigation.html" class="nav-btn">📚 All Lessons</a>
                <a href="lesson3.html" class="nav-btn disabled" id="nextLessonBtn">Next Lesson →</a>
            </div>
        </div>
    </div>
    
    <!-- CodeMirror JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/python/python.min.js"></script>
    
    <!-- Shared Components -->
    <script src="shared/python-interpreter.js"></script>
    <script src="shared/lesson-components.js"></script>
    
    <script>
        // Lesson 2 Variable Challenges
        var variableChallenges = {
            basic: [
                {
                    title: "Create Your Profile",
                    description: "Create three variables: your name, your age, and your favorite color. Then print all three.",
                    starter: "# Create variables for your profile\n# Example:\n# name = \"Alex\"\n# age = 15\n# color = \"blue\"\n\n# Your turn - create three variables:\n\n\n# Now print them:\n\n\n",
                    hint: "Remember: text needs quotes, numbers don't. Use print(variable_name) to show the stored value."
                },
                {
                    title: "School Information",
                    description: "Store your school name, year group, and favorite subject in variables, then display them.",
                    starter: "# Store school information\n# Example:\n# school = \"Greenwood High\"\n# year = 10\n# subject = \"Computer Science\"\n\n# Your turn:\n\n\n# Print your school information:\n\n\n",
                    hint: "Follow the pattern: variable_name = \"text\" for text, variable_name = number for numbers."
                },
                {
                    title: "Pet Information",
                    description: "Create variables for a pet's name, type, and age. Print each piece of information.",
                    starter: "# Pet information variables\n# Think about:\n# - What's the pet's name?\n# - What type of animal?\n# - How old are they?\n\n# Create your variables:\n\n\n# Show the information:\n\n\n",
                    hint: "Pet names and types are text (use quotes), age is a number (no quotes needed)."
                }
            ],
            creative: [
                {
                    title: "Character Profile",
                    description: "Create a character for a story. Give them a name, superpower, and hometown. Print a profile.",
                    starter: "# Create a superhero character\n# Example character:\n# hero_name = \"Lightning Bolt\"\n# power = \"Super Speed\"\n# city = \"Metro City\"\n\n# Create your character:\n\n\n# Print character profile:\nprint(\"Character Profile:\")\n# Add your print statements here:\n\n",
                    hint: "Make it creative! Think of interesting names, unique powers, and exciting cities."
                },
                {
                    title: "Dream Vacation",
                    description: "Plan your dream vacation using variables for destination, activity, and duration.",
                    starter: "# Plan your dream vacation\n# Think about:\n# - Where would you go?\n# - What would you do there?\n# - How long would you stay?\n\n# Your vacation variables:\n\n\n# Share your vacation plan:\nprint(\"My Dream Vacation:\")\n# Add your details:\n\n",
                    hint: "Be creative with destinations and activities! Remember to use quotes for text."
                },
                {
                    title: "Favorite Things",
                    description: "Create variables for your favorite movie, food, and hobby. Present them nicely.",
                    starter: "# Your favorite things\n# Examples:\n# movie = \"The Lion King\"\n# food = \"Pizza\"\n# hobby = \"Reading\"\n\n# Your favorites:\n\n\n# Present your favorites:\nprint(\"My Favorite Things:\")\nprint(\"Movie: \")\nprint(\"Food: \")\nprint(\"Hobby: \")\n# Complete the print statements above\n",
                    hint: "Complete each print statement by adding your variable name after the text."
                }
            ],
            advanced: [
                {
                    title: "Data Collection",
                    description: "Create variables for different data types: text, numbers, and demonstrate the difference.",
                    starter: "# Demonstrate different data types\n# Text (strings) - use quotes\nstudent_name = \"Your Name\"\nfavorite_subject = \"Your Subject\"\n\n# Numbers - no quotes needed\nage = 0  # Change this\ntest_score = 0  # Change this\n\n# Print with labels:\nprint(\"Student Information:\")\nprint(\"Name: \")\nprint(\"Subject: \")\nprint(\"Age: \")\nprint(\"Score: \")\n# Complete the print statements\n",
                    hint: "Notice how numbers don't need quotes but text does. Complete the print statements by adding variable names."
                },
                {
                    title: "Variable Experiment",
                    description: "Show what happens when you change variable values. Create a variable, print it, change it, print again.",
                    starter: "# Variable changing experiment\n# Create a variable\nmessage = \"Hello\"\nprint(\"First message: \")\nprint(message)\n\n# Change the variable\nmessage = \"Goodbye\"\nprint(\"Second message: \")\nprint(message)\n\n# Try your own experiment:\n# Create a variable, print it, change it, print again\n\n",
                    hint: "This shows that variables can be updated! Try changing numbers or creating your own examples."
                },
                {
                    title: "Mini Database",
                    description: "Create a simple 'database' of information using multiple variables, then display it formatted nicely.",
                    starter: "# Mini student database\n# Student 1 information\nstudent1_name = \"Alice\"\nstudent1_grade = 95\nstudent1_subject = \"Maths\"\n\n# Student 2 information\nstudent2_name = \"Bob\"\nstudent2_grade = 87\nstudent2_subject = \"Science\"\n\n# Display the database\nprint(\"=== Student Database ===\")\nprint(\"Student 1:\")\nprint(\"Name: \")\nprint(\"Grade: \")\nprint(\"Subject: \")\nprint(\"\")\nprint(\"Student 2:\")\n# Complete this section\n",
                    hint: "Complete all the print statements by adding the appropriate variable names. Notice the empty print() creates a blank line."
                }
            ]
        };
        
        // Initialize lesson components
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a moment for all scripts to load
            setTimeout(function() {
                try {
                    // Check if components are available
                    if (!window.PenguinTwistComponents || !window.PenguinTwistInterpreter) {
                        console.log('Shared components not available, setting up fallbacks...');
                        setupFallbacks();
                        return;
                    }
                    
                    // Initialize visual metaphor for memory boxes
                    var memoryBoxDemo = window.PenguinTwistComponents.createVisualMetaphor(
                        'memoryBoxDemo', 
                        'storage_boxes',
                        {
                            title: 'Variables as Memory Boxes',
                            variableName: 'name',
                            variableValue: 'Alex',
                            demoButton: true,
                            boxes: [
                                { label: 'name', value: 'Empty' },
                                { label: 'age', value: 'Empty' },
                                { label: 'subject', value: 'Empty' }
                            ],
                            demoScript: [
                                { action: 'assign', box: 'name', value: 'Alex', delay: 1000 },
                                { action: 'assign', box: 'age', value: '15', delay: 1500 },
                                { action: 'assign', box: 'subject', value: 'Computer Science', delay: 1500 }
                            ]
                        }
                    );
                    memoryBoxDemo.init();
                    
                    // Initialize interactive playgrounds
                    var playground1 = window.PenguinTwistInterpreter.createPlayground(
                        'variableCreationPlayground',
                        'variables',
                        {
                            title: 'Variable Creation Practice',
                            defaultCode: 'name = "Alex"\nage = 15',
                            showMemory: true
                        }
                    );
                    playground1.init();
                    
                    var playground2 = window.PenguinTwistInterpreter.createPlayground(
                        'variablePrintPlayground',
                        'variables',
                        {
                            title: 'Variables and Print Practice',
                            defaultCode: 'name = "Alex"\nage = 15\nprint(name)\nprint(age)',
                            showMemory: true
                        }
                    );
                    playground2.init();
                    
                    var playground3 = window.PenguinTwistInterpreter.createPlayground(
                        'variablePracticePlayground',
                        'variables',
                        {
                            title: 'Your Turn to Experiment',
                            defaultCode: 'subject = "Computer Science"\nscore = 85\nprint(subject)\nprint(score)',
                            showMemory: true
                        }
                    );
                    playground3.init();
                    
                    // Initialize mastery check
                    var masteryCheck = window.PenguinTwistComponents.createMasteryCheck(
                        'masteryCheck',
                        [
                            {
                                question: 'To store "Computer Science" in a variable called subject, what code do you write?',
                                placeholder: 'Type your answer like: variable = "value"',
                                validateAnswer: function(answer) {
                                    return /subject\s*=\s*["']computer science["']/i.test(answer.trim());
                                },
                                hint: 'Remember: subject = "Computer Science" (with quotes and equals sign)'
                            },
                            {
                                question: 'What\'s the difference between print(age) and print("age")?',
                                placeholder: 'Explain the difference',
                                validateAnswer: function(answer) {
                                    var lower = answer.toLowerCase();
                                    return lower.includes('variable') || lower.includes('stored') || 
                                           lower.includes('value') || lower.includes('word') || 
                                           lower.includes('text') || lower.includes('literal') ||
                                           lower.includes('contents') || lower.includes('name');
                                },
                                hint: 'print(age) shows stored value, print("age") shows the word "age"'
                            },
                            {
                                question: 'If you run: name = "Jamie" then print(name), what appears?',
                                placeholder: 'What gets displayed?',
                                validateAnswer: function(answer) {
                                    return answer.toLowerCase().includes('jamie');
                                },
                                hint: 'The output would be: Jamie'
                            }
                        ],
                        {
                            title: 'Check Your Understanding',
                            onComplete: function() {
                                // Unlock next lesson and show challenges
                                var nextBtn = document.getElementById('nextLessonBtn');
                                if (nextBtn) {
                                    nextBtn.classList.remove('disabled');
                                    nextBtn.style.opacity = '1';
                                    nextBtn.style.pointerEvents = 'auto';
                                }
                                
                                // Show challenge system
                                var challengeSystem = document.getElementById('challengeSystem');
                                if (challengeSystem) {
                                    challengeSystem.style.display = 'block';
                                    challengeSystem.scrollIntoView({ behavior: 'smooth' });
                                }
                            }
                        }
                    );
                    masteryCheck.init();
                    
                    // Initialize challenge system
                    var challengeSystem = window.PenguinTwistComponents.createChallengeSystem(
                        'challengeSystem',
                        variableChallenges,
                        {
                            title: 'Practice Challenges',
                            interpreterType: 'variables'
                        }
                    );
                    challengeSystem.init();
                    
                    // Initially hide challenges until mastery is complete
                    document.getElementById('challengeSystem').style.display = 'none';
                    
                    // Initialize dark mode
                    var darkModeController = window.PenguinTwistComponents.setupDarkMode('darkModeToggle');
                    darkModeController.init();
                    
                    console.log('All components initialized successfully');
                    
                } catch (error) {
                    console.log('Error initializing components:', error);
                    setupFallbacks();
                }
                
                // Initially disable next lesson
                var nextBtn = document.getElementById('nextLessonBtn');
                if (nextBtn) {
                    nextBtn.classList.add('disabled');
                    nextBtn.style.opacity = '0.5';
                    nextBtn.style.pointerEvents = 'none';
                }
                
            }, 100);
        });
        
        // Fallback functionality if shared components fail
        function setupFallbacks() {
            console.log('Setting up fallback functionality...');
            
            // Basic dark mode toggle fallback
            var darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                var isDarkMode = localStorage.getItem('penguintwist_darkMode') === 'true';
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                    darkModeToggle.innerHTML = '☀️ Light Mode';
                }
                
                darkModeToggle.addEventListener('click', function() {
                    document.body.classList.toggle('dark-mode');
                    var isNowDark = document.body.classList.contains('dark-mode');
                    darkModeToggle.innerHTML = isNowDark ? '☀️ Light Mode' : '🌙 Dark Mode';
                    localStorage.setItem('penguintwist_darkMode', isNowDark);
                });
            }
            
            // Show message about component loading
            var containers = ['memoryBoxDemo', 'variableCreationPlayground', 'variablePrintPlayground', 
                             'variablePracticePlayground', 'masteryCheck', 'challengeSystem'];
            
            containers.forEach(function(containerId) {
                var container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666; border: 1px dashed #ccc; border-radius: 8px; margin: 10px 0;">Interactive component loading... Please refresh the page if this message persists.</div>';
                }
            });
        }
    </script>
</body>
</html>
