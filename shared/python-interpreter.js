// shared/python-interpreter.js
// PenguinTwist Educational Python Interpreter System
// ES5 compatible for maximum school network compatibility

(function() {
    'use strict';
    
    // Main factory and utility object
    window.PenguinTwistInterpreter = {
        
        // Create a simple variable interpreter for educational use
        createSimpleVariableInterpreter: function() {
            var interpreter = {
                variables: {},
                output: [],
                errors: []
            };
            
            interpreter.execute = function(code) {
                this.output = [];
                this.errors = [];
                
                try {
                    var lines = code.split('\n');
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i].trim();
                        if (line) {
                            this.executeLine(line);
                        }
                    }
                } catch (error) {
                    this.errors.push(this.createEducationalError(error.message));
                }
                
                return {
                    output: this.output.join('\n'),
                    errors: this.errors,
                    variables: this.variables
                };
            };
            
            interpreter.executeLine = function(line) {
                // Handle print statements
                if (line.indexOf('print(') === 0) {
                    this.handlePrint(line);
                }
                // Handle variable assignments
                else if (line.indexOf('=') > 0 && line.indexOf('==') === -1) {
                    this.handleAssignment(line);
                }
                else {
                    throw new Error('Unsupported operation: ' + line);
                }
            };
            
            interpreter.handlePrint = function(line) {
                var match = line.match(/^print\((.+)\)$/);
                if (!match) {
                    throw new Error('Invalid print statement syntax');
                }
                
                var content = match[1].trim();
                var value = this.evaluateExpression(content);
                this.output.push(String(value));
            };
            
            interpreter.handleAssignment = function(line) {
                var parts = line.split('=');
                if (parts.length !== 2) {
                    throw new Error('Invalid assignment syntax');
                }
                
                var varName = parts[0].trim();
                var varValue = parts[1].trim();
                
                // Validate variable name
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
                    throw new Error('Invalid variable name: ' + varName);
                }
                
                this.variables[varName] = this.evaluateExpression(varValue);
            };
            
            interpreter.evaluateExpression = function(expr) {
                expr = expr.trim();
                
                // String literal
                if ((expr.charAt(0) === '"' && expr.charAt(expr.length - 1) === '"') ||
                    (expr.charAt(0) === "'" && expr.charAt(expr.length - 1) === "'")) {
                    return expr.slice(1, -1);
                }
                
                // Number
                if (/^-?\d+(\.\d+)?$/.test(expr)) {
                    return parseFloat(expr);
                }
                
                // Variable reference
                if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
                    if (this.variables.hasOwnProperty(expr)) {
                        return this.variables[expr];
                    } else {
                        throw new Error('Variable "' + expr + '" not found. Make sure to create it first.');
                    }
                }
                
                throw new Error('Invalid expression: ' + expr);
            };
            
            interpreter.createEducationalError = function(message) {
                // Convert technical errors to educational ones
                if (message.indexOf('Variable') === 0 && message.indexOf('not found') > 0) {
                    return message + ' Remember to assign a value to variables before using them.';
                }
                if (message.indexOf('Invalid expression') === 0) {
                    return message + ' Text values need quotes around them, like "hello".';
                }
                if (message.indexOf('Invalid variable name') === 0) {
                    return message + ' Variable names must start with a letter and contain only letters, numbers, and underscores.';
                }
                return message;
            };
            
            return interpreter;
        },
        
        // Create an interactive playground component - SPEC COMPLIANT
        createPlayground: function(containerId, interpreterType, options) {
            options = options || {};
            
            // Return object with init() method as required by spec
            return {
                containerId: containerId,
                interpreterType: interpreterType,
                options: options,
                playground: null,
                editor: null,
                interpreter: null,
                
                init: function() {
                    var container = document.getElementById(this.containerId);
                    
                    if (!container) {
                        console.error('Container not found:', this.containerId);
                        return false;
                    }
                    
                    // Clean up any existing instance to prevent memory leaks
                    if (container._playgroundInstance && container._playgroundInstance._cleanup) {
                        container._playgroundInstance._cleanup();
                    }
                    
                    // Create playground structure
                    container.innerHTML = 
                        '<div class="playground-header">' +
                            '<h3>' + (this.options.title || 'Try It Yourself') + '</h3>' +
                            (this.options.description ? '<p>' + this.options.description + '</p>' : '') +
                        '</div>' +
                        '<div class="playground-content">' +
                            '<div class="code-section">' +
                                '<div class="code-header">Code:</div>' +
                                '<textarea class="code-editor" placeholder="Enter your Python code here...">' + 
                                (this.options.defaultCode || '') + '</textarea>' +
                            '</div>' +
                            '<div class="output-section">' +
                                '<div class="output-header">Output:</div>' +
                                '<div class="output-display"></div>' +
                                (this.options.showMemory ? '<div class="memory-header">Variables:</div><div class="memory-display"></div>' : '') +
                            '</div>' +
                        '</div>' +
                        '<div class="playground-controls">' +
                            '<button class="run-button">Run Code</button>' +
                            '<button class="clear-button">Clear</button>' +
                        '</div>';
                    
                    this.setupPlayground(container);
                    
                    // Store instance reference for cleanup
                    container._playgroundInstance = this;
                    
                    return true;
                },
                
                setupPlayground: function(container) {
                    // Get elements
                    var codeEditor = container.querySelector('.code-editor');
                    var outputDisplay = container.querySelector('.output-display');
                    var memoryDisplay = container.querySelector('.memory-display');
                    var runButton = container.querySelector('.run-button');
                    var clearButton = container.querySelector('.clear-button');
                    
                    // Initialize interpreter based on type
                    this.interpreter = window.PenguinTwistInterpreter.createSimpleVariableInterpreter();
                    
                    var self = this;
                    
                    // Set up CodeMirror if available
                    if (typeof CodeMirror !== 'undefined') {
                        try {
                            var initialTheme = 'default'; // Always start with default
                            
                            // Only try dark theme if we can verify it exists
                            if (document.body.classList.contains('dark-mode')) {
                                // Safer theme detection - check for loaded monokai theme
                                try {
                                    var stylesheets = document.styleSheets;
                                    var monokaiLoaded = false;
                                    
                                    for (var i = 0; i < stylesheets.length; i++) {
                                        try {
                                            var sheet = stylesheets[i];
                                            var href = sheet.href;
                                            if (href && href.indexOf('monokai') >= 0) {
                                                monokaiLoaded = true;
                                                break;
                                            }
                                        } catch (crossOriginError) {
                                            // Cross-origin stylesheet, skip silently
                                            continue;
                                        }
                                    }
                                    
                                    if (monokaiLoaded) {
                                        initialTheme = 'monokai';
                                    }
                                } catch (stylesheetError) {
                                    // Stylesheet access failed completely, stick with default
                                    initialTheme = 'default';
                                }
                            }
                            
                            this.editor = CodeMirror.fromTextArea(codeEditor, {
                                mode: 'python',
                                theme: initialTheme,
                                lineNumbers: true,
                                indentUnit: 4,
                                matchBrackets: true,
                                autoCloseBrackets: true
                            });
                        } catch (e) {
                            console.warn('CodeMirror initialization failed, using textarea fallback');
                        }
                    }
                    
                    // Event handlers
                    function runCode() {
                        var code = self.editor ? self.editor.getValue() : codeEditor.value;
                        var result = self.interpreter.execute(code);
                        
                        // Display output
                        if (result.errors.length > 0) {
                            outputDisplay.innerHTML = '<div class="error">' + result.errors[0] + '</div>';
                        } else {
                            outputDisplay.innerHTML = result.output || '<div class="no-output">No output</div>';
                        }
                        
                        // Display variables if enabled
                        if (memoryDisplay && self.options.showMemory) {
                            var variableKeys = Object.keys(result.variables);
                            if (variableKeys.length > 0) {
                                var memoryHTML = '';
                                for (var i = 0; i < variableKeys.length; i++) {
                                    var key = variableKeys[i];
                                    var value = result.variables[key];
                                    var displayValue = typeof value === 'string' ? '"' + value + '"' : String(value);
                                    memoryHTML += '<div class="variable-item"><span class="var-name">' + 
                                                 key + '</span> = <span class="var-value">' + displayValue + '</span></div>';
                                }
                                memoryDisplay.innerHTML = memoryHTML;
                            } else {
                                memoryDisplay.innerHTML = '<div class="no-variables">No variables created yet</div>';
                            }
                        }
                    }
                    
                    function clearCode() {
                        if (self.editor) {
                            self.editor.setValue(self.options.defaultCode || '');
                        } else {
                            codeEditor.value = self.options.defaultCode || '';
                        }
                        outputDisplay.innerHTML = '';
                        if (memoryDisplay) {
                            memoryDisplay.innerHTML = '';
                        }
                        self.interpreter = window.PenguinTwistInterpreter.createSimpleVariableInterpreter();
                    }
                    
                    // Event listeners with IE8+ compatibility
                    if (runButton.addEventListener) {
                        runButton.addEventListener('click', runCode);
                        clearButton.addEventListener('click', clearCode);
                    } else {
                        runButton.attachEvent('onclick', runCode);
                        clearButton.attachEvent('onclick', clearCode);
                    }
                    
                    // Handle theme changes
                    function updateTheme() {
                        if (self.editor) {
                            var isDark = document.body.classList.contains('dark-mode');
                            var newTheme = 'default'; // Always default to safe theme
                            
                            if (isDark) {
                                // Only use monokai if we verified it's loaded during initialization
                                var currentTheme = self.editor.getOption('theme');
                                if (currentTheme === 'monokai') {
                                    newTheme = 'monokai'; // Keep monokai if it was successfully set
                                }
                            }
                            
                            try {
                                self.editor.setOption('theme', newTheme);
                            } catch (e) {
                                console.warn('Failed to set CodeMirror theme:', e);
                                // Fallback to default if theme change fails
                                try {
                                    self.editor.setOption('theme', 'default');
                                } catch (e2) {
                                    // Even default failed, ignore theme changes
                                }
                            }
                        }
                    }
                    
                    // Listen for theme changes with compatibility
                    if (document.addEventListener) {
                        document.addEventListener('themeChanged', updateTheme);
                    } else {
                        document.attachEvent('onthemeChanged', updateTheme);
                    }
                    
                    // Store references
                    this.runCode = runCode;
                    this.clearCode = clearCode;
                    this.updateTheme = updateTheme;
                },
                
                getCode: function() { 
                    return this.editor ? this.editor.getValue() : 
                           document.getElementById(this.containerId).querySelector('.code-editor').value; 
                },
                
                setCode: function(code) { 
                    if (this.editor) {
                        this.editor.setValue(code);
                    } else {
                        document.getElementById(this.containerId).querySelector('.code-editor').value = code;
                    }
                }
            };
        },
        
        // Utility function to validate Python code structure
        validateCode: function(code, requirements) {
            var errors = [];
            requirements = requirements || {};
            
            if (requirements.hasVariable) {
                var hasAssignment = code.indexOf('=') > 0 && code.indexOf('==') === -1;
                if (!hasAssignment) {
                    errors.push('Your code should create a variable using the = operator');
                }
            }
            
            if (requirements.hasPrint) {
                if (code.indexOf('print(') === -1) {
                    errors.push('Your code should use print() to display output');
                }
            }
            
            if (requirements.variableName) {
                var regex = new RegExp('\\b' + requirements.variableName + '\\s*=');
                if (!regex.test(code)) {
                    errors.push('Your code should create a variable named "' + requirements.variableName + '"');
                }
            }
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
    };
    
    // Export for testing purposes
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.PenguinTwistInterpreter;
    }
    
})();
