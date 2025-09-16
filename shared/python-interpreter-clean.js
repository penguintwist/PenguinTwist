// shared/python-interpreter-clean.js
// Streamlined Python interpreter with Skulpt (ES5 Compatible)
// VERSION: Debug Edition

(function() {
    'use strict';
    
    console.log('=== Python Interpreter Loading ===');
    
    // Global state
    var isSkultLoaded = false;
    var loadingTimeout = null;
    var inputResolver = null;
    
    // Friendly error messages
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
        
        return 'Something went wrong with your code. Check for:\n' +
               '• Spelling mistakes\n' +
               '• Missing quotes around text\n' +
               '• Correct indentation';
    }
    
    function loadSkult() {
        return new Promise(function(resolve, reject) {
            if (isSkultLoaded || (window.Sk && window.Sk.pre)) {
                isSkultLoaded = true;
                resolve();
                return;
            }
            
            loadingTimeout = setTimeout(function() {
                reject(new Error('Skulpt loading timed out after 10 seconds'));
            }, 10000);
            
            // Load Skulpt if not already loaded
            if (!window.Sk) {
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
            } else {
                clearTimeout(loadingTimeout);
                isSkultLoaded = true;
                resolve();
            }
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
                
                inputResolver = resolve;
                
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
            
            if (container) {
                container.innerHTML = container.querySelector('.input-prompt').textContent + value;
            }
            
            inputResolver(value);
            inputResolver = null;
        }
    };
    
    function extractVariables(code) {
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
    
    // Python Playground Component
    function PythonPlayground(containerId, options) {
        console.log('🎮 Creating PythonPlayground instance');
        console.log('  Container ID:', containerId);
        console.log('  Options received:', JSON.stringify(options, null, 2));
        
        this.containerId = containerId;
        this.options = options || {};
        this.isRunning = false;
        this.editor = null;
        
        console.log('  showMemory setting:', this.options.showMemory);
        console.log('  typeof showMemory:', typeof this.options.showMemory);
    }
    
    PythonPlayground.prototype.init = function() {
        console.log('📋 Initializing playground:', this.containerId);
        
        var container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ Python playground container not found: ' + this.containerId);
            return false;
        }
        
        console.log('✅ Container found, creating HTML');
        container.innerHTML = this.createHTML();
        this.setupEditor(container);
        this.setupEvents(container);
        
        // Verify what was actually created
        var memorySection = container.querySelector('.memory-section');
        console.log('  Memory section created?', memorySection !== null);
        if (memorySection) {
            console.log('  Memory section HTML:', memorySection.outerHTML.substring(0, 100) + '...');
        }
        
        return true;
    };
    
    PythonPlayground.prototype.createHTML = function() {
        console.log('🏗️ Creating HTML for playground:', this.containerId);
        console.log('  Options at HTML creation:', this.options);
        console.log('  showMemory value:', this.options.showMemory);
        
        var title = this.options.title || 'Python Playground';
        var defaultCode = this.options.defaultCode || '# Write your Python code here\nprint("Hello, World!")';
        
        var html = '<div class="enhanced-python-playground arctic-aurora-theme">' +
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
            console.log('  ✅ Adding memory section for:', this.containerId);
            html += '<div class="memory-section">' +
                '<div class="memory-tracker" id="' + this.containerId + 'Memory"></div>' +
            '</div>';
        } else {
            console.log('  ⚠️ NOT adding memory section for:', this.containerId);
            console.log('    Reason: showMemory is', this.options.showMemory);
        }
        
        html += '</div>';
        
        console.log('  HTML length created:', html.length, 'characters');
        
        return html;
    };
    
    PythonPlayground.prototype.setupEditor = function(container) {
        var textarea = container.querySelector('.code-editor');
        
        // Try to use CodeMirror if available
        if (window.CodeMirror) {
            this.editor = window.CodeMirror.fromTextArea(textarea, {
                mode: 'python',
                theme: 'monokai',
                lineNumbers: true,
                indentUnit: 4,
                indentWithTabs: false,
                lineWrapping: true
            });
            console.log('  CodeMirror editor initialized for:', this.containerId);
        } else {
            // Fallback to textarea
            console.warn('  CodeMirror not available, using fallback textarea for:', this.containerId);
            this.editor = {
                getValue: function() { return textarea.value; },
                setValue: function(value) { textarea.value = value; }
            };
        }
    };
    
    PythonPlayground.prototype.setupEvents = function(container) {
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
    
    PythonPlayground.prototype.runCode = function() {
        var self = this;
        if (this.isRunning) return;
        
        var outputElement = document.getElementById(this.containerId + 'Output');
        var memoryElement = document.getElementById(this.containerId + 'Memory');
        var runBtn = document.querySelector('#' + this.containerId + ' .run-btn');
        
        console.log('▶️ Running code for:', this.containerId);
        console.log('  Output element found:', outputElement !== null);
        console.log('  Memory element found:', memoryElement !== null);
        
        if (!outputElement) return;
        
        this.isRunning = true;
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.textContent = '⏳ Running...';
        }
        
        var code = this.editor.getValue();
        
        showLoadingState(outputElement, '🐧 Starting Python engine...');
        
        loadSkult().then(function() {
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
                        console.log('  Updating memory tracker for:', self.containerId);
                        updateMemoryTracker(memoryElement, code);
                    } else {
                        console.log('  No memory element to update for:', self.containerId);
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
            
        }).catch(function(error) {
            console.error('Skulpt loading failed:', error);
            outputElement.innerHTML = '<div class="error-fallback">' +
                '<h4>Having trouble loading Python?</h4>' +
                '<p>This sometimes happens on school networks. Try:</p>' +
                '<ul>' +
                    '<li>Refreshing the page (F5)</li>' +
                    '<li>Checking your internet connection</li>' +
                    '<li>Asking your teacher for help</li>' +
                '</ul>' +
            '</div>';
            
            self.isRunning = false;
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.textContent = '▶ Run Code';
            }
        });
    };
    
    PythonPlayground.prototype.clearOutput = function() {
        var outputElement = document.getElementById(this.containerId + 'Output');
        var memoryElement = document.getElementById(this.containerId + 'Memory');
        
        if (outputElement) {
            outputElement.innerHTML = '';
        }
        if (memoryElement) {
            memoryElement.innerHTML = '';
        }
    };
    
    // Export the API
    window.PenguinTwistInterpreter = {
        createPlayground: function(containerId, type, options) {
            console.log('🚀 createPlayground called');
            console.log('  Arguments received:', arguments.length);
            console.log('  Arg 1 (containerId):', containerId);
            console.log('  Arg 2 (type):', type);
            console.log('  Arg 3 (options):', options);
            
            // CRITICAL: Handle the parameter mismatch
            // If 3 arguments, the middle one is 'type' and should be ignored
            var actualOptions = arguments.length === 3 ? options : type;
            
            console.log('  Actual options to use:', actualOptions);
            
            return new PythonPlayground(containerId, actualOptions);
        }
    };
    
    console.log('=== Python Interpreter Ready ===');
    
})();
