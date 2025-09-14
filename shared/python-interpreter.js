// shared/python-interpreter.js
// Enhanced Python interpreter with Skulpt integration (ES5 Compatible)

(function() {
    'use strict';
    
    // Global state
    var isSkultLoaded = false;
    var loadingTimeout = null;
    var currentInput = null;
    var inputResolver = null;
    
    // Beginner-friendly error message mapping
    var errorMessages = {
        'NameError': function(msg) {
            var varName = msg.match(/'([^']+)'/);
            var variable = varName ? varName[1] : 'variable';
            return 'Variable "' + variable + '" doesn\'t exist yet. Did you create it first?\n' +
                   'Hint: Use ' + variable + ' = "some value" to create it.';
        },
        'SyntaxError': function(msg) {
            if (msg.includes('invalid syntax')) {
                return 'Python doesn\'t understand this code. Check your spelling and punctuation.\n' +
                       'Common mistakes: missing quotes around text, wrong indentation.';
            }
            if (msg.includes('EOL')) {
                return 'Missing closing quote. Make sure all your text has matching quotes.\n' +
                       'Example: "hello" not "hello';
            }
            return 'Typing mistake detected. Double-check your Python syntax.';
        },
        'TypeError': function(msg) {
            if (msg.includes('unsupported operand')) {
                return 'You\'re trying to mix different types of data (like text and numbers).\n' +
                       'Example: "hello" + 5 won\'t work. Try "hello" + "5" instead.';
            }
            return 'Wrong type of data used. Make sure you\'re using the right kind of values.';
        },
        'IndentationError': function(msg) {
            return 'Spacing problem! Python is picky about indentation.\n' +
                   'Make sure all your code lines start at the same position.';
        },
        'ValueError': function(msg) {
            return 'The value you\'re using doesn\'t make sense here.\n' +
                   'Check if you\'re using the right type of data.';
        }
    };
    
    function friendlyError(error) {
        var errorStr = error.toString();
        var errorType = errorStr.split(':')[0];
        
        if (errorMessages[errorType]) {
            return errorMessages[errorType](errorStr);
        }
        
        // Generic friendly message for unknown errors
        return 'Something went wrong with your code. Check for:\n' +
               '• Spelling mistakes\n' +
               '• Missing quotes around text\n' +
               '• Correct indentation';
    }
    
    function loadSkult() {
        return new Promise(function(resolve, reject) {
            if (isSkultLoaded) {
                resolve();
                return;
            }
            
            // Check if Skulpt is already loaded
            if (window.Sk && window.Sk.pre) {
                isSkultLoaded = true;
                resolve();
                return;
            }
            
            // Set timeout for slow networks
            loadingTimeout = setTimeout(function() {
                reject(new Error('Skulpt loading timed out after 10 seconds'));
            }, 10000);
            
            // Load Skulpt dynamically if not already loaded
            var skulptScript = document.createElement('script');
            skulptScript.src = 'https://unpkg.com/skulpt@0.11.1/dist/skulpt.min.js';
            skulptScript.onload = function() {
                var skulptStdlib = document.createElement('script');
                skulptStdlib.src = 'https://unpkg.com/skulpt@0.11.1/dist/skulpt-stdlib.js';
                skulptStdlib.onload = function() {
                    clearTimeout(loadingTimeout);
                    isSkultLoaded = true;
                    resolve();
                };
                skulptStdlib.onerror = function() {
                    clearTimeout(loadingTimeout);
                    reject(new Error('Failed to load Skulpt standard library'));
                };
                document.head.appendChild(skulptStdlib);
            };
            skulptScript.onerror = function() {
                clearTimeout(loadingTimeout);
                reject(new Error('Failed to load Skulpt'));
            };
            document.head.appendChild(skulptScript);
        });
    }
    
    function builtinRead(x) {
        if (window.Sk.builtinFiles === undefined || 
            window.Sk.builtinFiles["files"][x] === undefined) {
            throw "File not found: '" + x + "'";
        }
        return window.Sk.builtinFiles["files"][x];
    }
    
    function createOutputHandler(outputElement) {
        return function(text) {
            if (!outputElement) return;
            outputElement.innerHTML += text.replace(/\n/g, '<br>');
            outputElement.scrollTop = outputElement.scrollHeight;
        };
    }
    
    function createInputHandler(outputElement) {
        return function(prompt) {
            return new Promise(function(resolve) {
                if (!outputElement) {
                    resolve('');
                    return;
                }
                
                var inputDiv = document.createElement('div');
                inputDiv.className = 'input-container';
                inputDiv.innerHTML = 
                    '<span class="input-prompt">' + (prompt || 'Input: ') + '</span>' +
                    '<input type="text" class="input-field" id="pythonInput" autofocus>' +
                    '<button class="input-submit" onclick="submitPythonInput()">Enter</button>';
                
                outputElement.appendChild(inputDiv);
                outputElement.scrollTop = outputElement.scrollHeight;
                
                // Store resolver globally for submit function
                inputResolver = resolve;
                
                // Focus input and handle Enter key
                setTimeout(function() {
                    var inputField = document.getElementById('pythonInput');
                    if (inputField) {
                        inputField.focus();
                        inputField.addEventListener('keypress', function(e) {
                            if (e.key === 'Enter') {
                                submitPythonInput();
                            }
                        });
                    }
                }, 50);
            });
        };
    }
    
    // Global function for input submission
    window.submitPythonInput = function() {
        var inputField = document.getElementById('pythonInput');
        if (inputField && inputResolver) {
            var value = inputField.value;
            var container = inputField.closest('.input-container');
            
            // Replace input with the entered value
            if (container) {
                container.innerHTML = container.querySelector('.input-prompt').textContent + value;
            }
            
            inputResolver(value);
            inputResolver = null;
        }
    };
    
    function extractVariables(code) {
        // Simple variable extraction for display
        var variables = {};
        var lines = code.split('\n');
        var assignmentPattern = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/;
        
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line && !line.startsWith('#')) {
                var match = line.match(assignmentPattern);
                if (match) {
                    var varName = match[1];
                    var value = match[2].trim();
                    
                    // Classify variable type for styling
                    var type = 'other';
                    if (value.startsWith('[') && value.endsWith(']')) {
                        type = 'list';
                    } else if (value.startsWith('{') && value.endsWith('}')) {
                        type = 'dict';
                    } else if (value === 'True' || value === 'False') {
                        type = 'boolean';
                    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
                        type = 'number';
                    } else if ((value.startsWith('"') && value.endsWith('"')) || 
                             (value.startsWith("'") && value.endsWith("'"))) {
                        type = 'string';
                    }
                    
                    variables[varName] = {
                        value: value,
                        type: type
                    };
                }
            }
        }
        
        return variables;
    }
    
    function updateMemoryTracker(memoryElement, code) {
        if (!memoryElement) return;
        
        var variables = extractVariables(code);
        var varCount = Object.keys(variables).length;
        
        if (varCount === 0) {
            memoryElement.innerHTML = '';
            return;
        }
        
        var html = '<div class="memory-tracker-title">📦 Variables in Memory:</div>';
        
        for (var name in variables) {
            if (variables.hasOwnProperty(name)) {
                var variable = variables[name];
                html += '<div class="memory-item memory-item-' + variable.type + '">' +
                        '<span class="var-name">' + name + '</span> = ' +
                        '<span class="var-value">' + variable.value + '</span>' +
                        '</div>';
            }
        }
        
        memoryElement.innerHTML = html;
    }
    
    function showLoadingState(element, message) {
        if (!element) return;
        element.innerHTML = '<div class="loading-state">' +
            '<div class="loading-spinner">🐧</div>' +
            '<div class="loading-message">' + message + '</div>' +
        '</div>';
    }
    
    function showFallback(element) {
        if (!element) return;
        element.innerHTML = '<div class="error-fallback">' +
            '<h4>Having trouble loading Python?</h4>' +
            '<p>This sometimes happens on school networks. Try:</p>' +
            '<ul>' +
                '<li>Refreshing the page (F5)</li>' +
                '<li>Checking your internet connection</li>' +
                '<li>Asking your teacher for help</li>' +
            '</ul>' +
        '</div>';
    }
    
    // Enhanced Python Playground Component
    function EnhancedPythonPlayground(containerId, type, options) {
        this.containerId = containerId;
        this.type = type;
        this.options = options || {};
        this.isRunning = false;
        this.editor = null;
    }
    
    EnhancedPythonPlayground.prototype.init = function() {
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Enhanced Python playground container not found: ' + this.containerId);
            return false;
        }
        
        container.innerHTML = this.createHTML();
        this.setupEditor(container);
        this.setupEvents(container);
        
        return true;
    };
    
    EnhancedPythonPlayground.prototype.createHTML = function() {
        var title = this.options.title || 'Python Playground';
        var defaultCode = this.options.defaultCode || '# Write your Python code here\nprint("Hello, World!")';
        
        var html = '<div class="enhanced-python-playground">' +
            '<div class="playground-header">' +
                '<h4>' + title + '</h4>' +
                '<div class="playground-controls">' +
                    '<button class="run-btn" onclick="' + this.containerId + 'Instance.runCode()">▶ Run Code</button>' +
                    '<button class="clear-btn" onclick="' + this.containerId + 'Instance.clearOutput()">🗑️ Clear</button>' +
                '</div>' +
            '</div>' +
            '<div class="playground-content">' +
                '<div class="code-section">' +
                    '<div class="code-header">Code Editor</div>' +
                    '<textarea class="code-editor" id="' + this.containerId + 'Editor">' + defaultCode + '</textarea>' +
                '</div>' +
                '<div class="output-section">' +
                    '<div class="output-header">Output</div>' +
                    '<div class="output-display" id="' + this.containerId + 'Output"></div>' +
                '</div>' +
            '</div>';
            
        if (this.options.showMemory) {
            html += '<div class="memory-section">' +
                '<div class="memory-tracker" id="' + this.containerId + 'Memory"></div>' +
            '</div>';
        }
        
        html += '</div>';
        
        return html;
    };
    
    EnhancedPythonPlayground.prototype.setupEditor = function(container) {
        var self = this;
        var textarea = container.querySelector('.code-editor');
        
        // Try to use CodeMirror if available, fallback to textarea
        if (window.CodeMirror) {
            this.editor = window.CodeMirror.fromTextArea(textarea, {
                mode: 'python',
                theme: 'monokai',
                lineNumbers: true,
                indentUnit: 4,
                indentWithTabs: false,
                lineWrapping: true
            });
        } else {
            console.warn('CodeMirror not available, using fallback textarea');
            this.editor = {
                getValue: function() { return textarea.value; },
                setValue: function(value) { textarea.value = value; }
            };
        }
    };
    
    EnhancedPythonPlayground.prototype.setupEvents = function(container) {
        var self = this;
        
        // Make instance available globally for button clicks
        window[this.containerId + 'Instance'] = this;
        
        // Keyboard shortcuts
        container.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter' && !self.isRunning) {
                e.preventDefault();
                self.runCode();
            }
        });
    };
    
    EnhancedPythonPlayground.prototype.runCode = function() {
        var self = this;
        if (this.isRunning) return;
        
        var outputElement = document.getElementById(this.containerId + 'Output');
        var memoryElement = document.getElementById(this.containerId + 'Memory');
        var runBtn = document.querySelector('#' + this.containerId + ' .run-btn');
        
        if (!outputElement) return;
        
        this.isRunning = true;
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.textContent = '⏳ Running...';
        }
        
        var code = this.editor.getValue();
        
        // Show loading state immediately
        showLoadingState(outputElement, '🐧 Starting Python engine...');
        
        loadSkult().then(function() {
            showLoadingState(outputElement, '📚 Loading Python libraries...');
            
            setTimeout(function() {
                showLoadingState(outputElement, '▶️ Running your code...');
                
                setTimeout(function() {
                    outputElement.innerHTML = '';
                    
                    // Configure Skulpt
                    window.Sk.pre = "output";
                    window.Sk.configure({
                        output: createOutputHandler(outputElement),
                        read: builtinRead,
                        inputfun: createInputHandler(outputElement),
                        inputfunTakesPrompt: true,
                        execLimit: 10000,
                        yieldLimit: null,
                        killableWhile: true,
                        killableFor: true
                    });
                    
                    var myPromise = window.Sk.misceval.asyncToPromise(function() {
                        return window.Sk.importMainWithBody("<stdin>", false, code, true);
                    });
                    
                    myPromise.then(function(mod) {
                        // Success - update memory tracker
                        if (memoryElement) {
                            updateMemoryTracker(memoryElement, code);
                        }
                        
                        // Show success message if no output
                        if (outputElement.innerHTML.trim() === '') {
                            outputElement.innerHTML = '<div class="no-output">Code ran successfully (no output)</div>';
                        }
                        
                    }, function(err) {
                        // Error handling with friendly messages
                        outputElement.innerHTML = '<div class="error-output">' +
                            '<div class="error-title">❌ Oops! Something went wrong:</div>' +
                            '<div class="error-message">' + friendlyError(err) + '</div>' +
                        '</div>';
                        
                    }).finally(function() {
                        self.isRunning = false;
                        if (runBtn) {
                            runBtn.disabled = false;
                            runBtn.textContent = '▶ Run Code';
                        }
                    });
                }, 200);
            }, 100);
            
        }).catch(function(error) {
            console.error('Skulpt loading failed:', error);
            showFallback(outputElement);
            
            self.isRunning = false;
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.textContent = '▶ Run Code';
            }
        });
    };
    
    EnhancedPythonPlayground.prototype.clearOutput = function() {
        var outputElement = document.getElementById(this.containerId + 'Output');
        var memoryElement = document.getElementById(this.containerId + 'Memory');
        
        if (outputElement) {
            outputElement.innerHTML = '';
        }
        if (memoryElement) {
            memoryElement.innerHTML = '';
        }
    };
    
    // Export the enhanced API
    window.PenguinTwistInterpreter = {
        createPlayground: function(containerId, type, options) {
            return new EnhancedPythonPlayground(containerId, type, options);
        }
    };
    
})();
