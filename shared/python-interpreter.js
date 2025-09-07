// shared/python-interpreter.js
// PenguinTwist Educational Python Interpreter System
// ES5 compatible for maximum school network compatibility

(function() {
    'use strict';
    
    // Main factory and utility object
    window.PenguinTwistInterpreter = {
        version: '1.0.0',
        
        // Factory method for creating interpreters
        createInterpreter: function(lessonType, options) {
            options = options || {};
            
            switch(lessonType) {
                case 'print':
                    return new PrintInterpreter(options);
                case 'variables':
                    return new VariableInterpreter(options);
                case 'input':
                    return new InputInterpreter(options);
                case 'concatenation':
                    return new ConcatenationInterpreter(options);
                case 'datatypes':
                    return new DataTypeInterpreter(options);
                default:
                    throw new Error('Unknown lesson type: ' + lessonType);
            }
        },
        
        // Factory for creating complete interactive playgrounds
        createPlayground: function(containerId, interpreterType, options) {
            return new InteractivePlayground(containerId, interpreterType, options);
        },
        
        // Utility methods for common validation
        validateCode: function(code) {
            if (!code || typeof code !== 'string') {
                return { valid: false, error: 'Code must be a non-empty string' };
            }
            return { valid: true };
        },
        
        // Common error messages for consistency
        getErrorMessage: function(errorType, context) {
            var messages = {
                'missing_quotes': 'Text values need quotes around them: "' + (context || 'your text') + '"',
                'missing_parentheses': 'Remember to include parentheses: print("your message")',
                'invalid_variable': 'Variable name "' + (context || 'variable') + '" is not valid. Use letters, numbers, and underscores only.',
                'variable_not_found': 'Variable "' + (context || 'variable') + '" not found. Make sure to create it first.',
                'syntax_error': 'Check your syntax. Expected: ' + (context || 'valid Python code')
            };
            return messages[errorType] || 'Unknown error occurred';
        }
    };
    
    // Base interpreter class with shared functionality
    function BaseInterpreter(options) {
        this.variables = {};
        this.output = [];
        this.options = options || {};
        this.allowedStatements = this.options.allowedStatements || [];
        this.strictMode = this.options.strictMode !== false;
        
        // Reset interpreter state
        this.reset = function() {
            this.variables = {};
            this.output = [];
        };
        
        // Common preprocessing for all interpreters
        this.preprocessCode = function(code) {
            if (!code || !code.trim()) {
                throw new Error('Please write some code to run!');
            }
            
            return code.split('\n')
                      .map(function(line) { return line.trim(); })
                      .filter(function(line) { return line && !line.startsWith('#'); });
        };
        
        // Validate variable names
        this.validateVariableName = function(name) {
            if (!name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                throw new Error(PenguinTwistInterpreter.getErrorMessage('invalid_variable', name));
            }
            return true;
        };
        
        // Parse assignment statements
        this.parseAssignment = function(line) {
            var equalIndex = line.indexOf(' = ');
            if (equalIndex === -1) {
                throw new Error('Assignment needs spaces around = sign: variable = value');
            }
            
            var varName = line.substring(0, equalIndex).trim();
            var value = line.substring(equalIndex + 3).trim();
            
            this.validateVariableName(varName);
            return { variable: varName, value: value };
        };
        
        // Parse string values
        this.parseStringValue = function(value) {
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                return value.slice(1, -1);
            }
            throw new Error(PenguinTwistInterpreter.getErrorMessage('missing_quotes', value));
        };
        
        // Parse numeric values
        this.parseNumberValue = function(value) {
            if (!isNaN(value) && value.trim() !== '') {
                return parseFloat(value);
            }
            throw new Error('Invalid number: ' + value);
        };
        
        // Validate quote pairs
        this.validateQuotes = function(line) {
            var doubleQuotes = (line.match(/"/g) || []).length;
            var singleQuotes = (line.match(/'/g) || []).length;
            return doubleQuotes % 2 === 0 && singleQuotes % 2 === 0;
        };
    }
    
    // Lesson 1: Print-only interpreter
    function PrintInterpreter(options) {
        BaseInterpreter.call(this, options);
        this.allowedStatements = ['print'];
        
        this.executeCode = function(code) {
            this.reset();
            
            try {
                var lines = this.preprocessCode(code);
                return this.executeLines(lines);
            } catch (error) {
                return {
                    success: false,
                    output: '',
                    message: error.message
                };
            }
        };
        
        this.executeLines = function(lines) {
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                
                if (!this.validateQuotes(line)) {
                    throw new Error('Missing closing quote on line ' + (i + 1) + '. Every opening quote needs a closing quote!');
                }
                
                if (line.match(/^\s*print\s*\(/)) {
                    this.handlePrint(line);
                } else if (line.trim()) {
                    this.handleUnknownStatement(line);
                }
            }
            
            return {
                success: true,
                output: this.output.join('\n'),
                message: this.output.length === 0 ? 'Code ran successfully! Add print() statements to see output.' : this.output.join('\n')
            };
        };
        
        this.handlePrint = function(line) {
            // Handle common case variations
            if (line.includes('Print') || line.includes('PRINT')) {
                throw new Error('Python is case-sensitive - use lowercase "print"');
            }
            
            var match = line.match(/print\s*\(\s*([^)]*)\s*\)/);
            if (!match) {
                if (line.includes('print') && (!line.includes('(') || !line.includes(')'))) {
                    throw new Error(PenguinTwistInterpreter.getErrorMessage('missing_parentheses'));
                }
                throw new Error('Check your print statement syntax: print("your message")');
            }
            
            var content = match[1].trim();
            
            if (!content) {
                this.output.push('');
                return;
            }
            
            // Parse multiple arguments
            var args = this.parseArguments(content);
            var values = [];
            
            for (var i = 0; i < args.length; i++) {
                values.push(this.evaluateExpression(args[i]));
            }
            
            this.output.push(values.join(' '));
        };
        
        this.parseArguments = function(content) {
            var args = [];
            var current = '';
            var inQuotes = false;
            var quoteChar = '';
            
            for (var i = 0; i < content.length; i++) {
                var char = content[i];
                
                if ((char === '"' || char === "'") && !inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                    current += char;
                } else if (char === quoteChar && inQuotes) {
                    inQuotes = false;
                    current += char;
                } else if (char === ',' && !inQuotes) {
                    if (current.trim()) {
                        args.push(current.trim());
                    }
                    current = '';
                } else {
                    current += char;
                }
            }
            
            if (current.trim()) {
                args.push(current.trim());
            }
            
            return args;
        };
        
        this.evaluateExpression = function(expr) {
            expr = expr.trim();
            
            // Handle quoted strings
            if ((expr.startsWith('"') && expr.endsWith('"')) || 
                (expr.startsWith("'") && expr.endsWith("'"))) {
                return expr.slice(1, -1);
            }
            
            // Handle numbers
            if (/^-?\d+(\.\d+)?$/.test(expr)) {
                return expr;
            }
            
            // Handle unquoted text (common mistake)
            if (/^[a-zA-Z]/.test(expr)) {
                throw new Error('Text "' + expr + '" needs quotes around it. Try print("' + expr + '")');
            }
            
            return expr;
        };
        
        this.handleUnknownStatement = function(line) {
            throw new Error('I don\'t recognize this command: "' + line + '". In this lesson, we focus on print() statements.');
        };
    }
    
    // Lesson 2: Variables + Print interpreter
    function VariableInterpreter(options) {
        BaseInterpreter.call(this, options);
        this.allowedStatements = ['print', 'assignment'];
        
        this.executeCode = function(code) {
            this.reset();
            
            try {
                var lines = this.preprocessCode(code);
                return this.executeLines(lines);
            } catch (error) {
                return {
                    success: false,
                    output: '',
                    variables: {},
                    message: error.message
                };
            }
        };
        
        this.executeLines = function(lines) {
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                
                if (!this.validateQuotes(line)) {
                    throw new Error('Missing closing quote on line ' + (i + 1));
                }
                
                if (line.includes(' = ') && !line.includes('input(')) {
                    this.handleAssignment(line);
                } else if (line.match(/^\s*print\s*\(/)) {
                    this.handlePrint(line);
                } else if (line.trim()) {
                    throw new Error('I understand assignments and print() statements in this lesson.');
                }
            }
            
            return {
                success: true,
                output: this.output.join('\n'),
                variables: this.variables,
                message: this.output.length === 0 ? 'Code ran successfully.' : this.output.join('\n')
            };
        };
        
        this.handleAssignment = function(line) {
            var parsed = this.parseAssignment(line);
            
            if ((parsed.value.startsWith('"') && parsed.value.endsWith('"')) || 
                (parsed.value.startsWith("'") && parsed.value.endsWith("'"))) {
                this.variables[parsed.variable] = parsed.value.slice(1, -1);
            } else if (!isNaN(parsed.value) && parsed.value.trim() !== '') {
                this.variables[parsed.variable] = parsed.value;
            } else {
                throw new Error(PenguinTwistInterpreter.getErrorMessage('missing_quotes', parsed.value));
            }
        };
        
        this.handlePrint = function(line) {
            var match = line.match(/print\s*\(\s*([^)]+)\s*\)/);
            if (!match) {
                throw new Error('Check your print statement syntax');
            }
            
            var content = match[1].trim();
            
            if ((content.startsWith('"') && content.endsWith('"')) || 
                (content.startsWith("'") && content.endsWith("'"))) {
                this.output.push(content.slice(1, -1));
            } else if (this.variables.hasOwnProperty(content)) {
                this.output.push(this.variables[content]);
            } else {
                throw new Error(PenguinTwistInterpreter.getErrorMessage('variable_not_found', content));
            }
        };
    }
    
    // Lesson 3: Input interpreter (educational simulation)
    function InputInterpreter(options) {
        VariableInterpreter.call(this, options);
        this.simulatedInputs = options.simulatedInputs || ["Alex", "yes"];
        this.allowedStatements = ['print', 'assignment', 'input'];
        
        this.executeCode = function(code, providedInputs) {
            this.reset();
            var inputs = providedInputs || this.simulatedInputs;
            var inputIndex = 0;
            var conversationLog = [];
            
            try {
                var lines = this.preprocessCode(code);
                
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    
                    if (line.includes(' = ') && line.includes('input(')) {
                        var result = this.handleInputAssignment(line, inputs, inputIndex);
                        if (result.prompt && inputIndex < inputs.length) {
                            conversationLog.push(result.prompt + inputs[inputIndex]);
                            inputIndex++;
                        }
                    } else if (line.includes(' = ')) {
                        this.handleAssignment(line);
                    } else if (line.match(/^\s*print\s*\(/)) {
                        this.handlePrint(line);
                    } else if (line.trim()) {
                        throw new Error('I understand assignments, input(), and print() statements in this lesson.');
                    }
                }
                
                var fullOutput = conversationLog.concat(this.output).join('\n');
                
                return {
                    success: true,
                    output: fullOutput,
                    variables: this.variables,
                    conversation: conversationLog,
                    message: fullOutput
                };
            } catch (error) {
                return {
                    success: false,
                    output: '',
                    variables: {},
                    message: error.message
                };
            }
        };
        
        this.handleInputAssignment = function(line, inputs, inputIndex) {
            var parsed = this.parseAssignment(line);
            var promptMatch = parsed.value.match(/input\s*\(\s*["']([^"']*)["']\s*\)/);
            
            if (!promptMatch) {
                throw new Error('input() needs a question in quotes: input("Your question?")');
            }
            
            var prompt = promptMatch[1];
            if (inputIndex < inputs.length) {
                this.variables[parsed.variable] = inputs[inputIndex];
            }
            
            return { prompt: prompt };
        };
    }
    
    // Lesson 4: String Concatenation interpreter
    function ConcatenationInterpreter(options) {
        VariableInterpreter.call(this, options);
        this.allowedStatements = ['print', 'assignment', 'concatenation'];
        
        this.handlePrint = function(line) {
            var match = line.match(/print\s*\(\s*([^)]+)\s*\)/);
            if (!match) {
                throw new Error('Check your print statement syntax');
            }
            
            var content = match[1].trim();
            
            // Handle concatenation with +
            if (content.includes(' + ')) {
                this.handleConcatenation(content);
            } else if ((content.startsWith('"') && content.endsWith('"')) || 
                      (content.startsWith("'") && content.endsWith("'"))) {
                this.output.push(content.slice(1, -1));
            } else if (this.variables.hasOwnProperty(content)) {
                this.output.push(this.variables[content]);
            } else {
                throw new Error(PenguinTwistInterpreter.getErrorMessage('variable_not_found', content));
            }
        };
        
        this.handleConcatenation = function(content) {
            var parts = content.split(' + ');
            var result = '';
            
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i].trim();
                if ((part.startsWith('"') && part.endsWith('"')) || 
                    (part.startsWith("'") && part.endsWith("'"))) {
                    result += part.slice(1, -1);
                } else if (this.variables.hasOwnProperty(part)) {
                    result += this.variables[part];
                } else {
                    throw new Error('Variable "' + part + '" not found in concatenation');
                }
            }
            this.output.push(result);
        };
    }
    
    // Future: Data Types interpreter (placeholder)
    function DataTypeInterpreter(options) {
        ConcatenationInterpreter.call(this, options);
        this.allowedStatements = ['print', 'assignment', 'concatenation', 'conversion'];
        
        // Add type conversion methods (str, int, float)
        // This will be implemented when needed
    }
    
    // Interactive playground component with auto-sizing
    function InteractivePlayground(containerId, interpreterType, options) {
        this.container = document.getElementById(containerId);
        this.interpreterType = interpreterType;
        this.interpreter = PenguinTwistInterpreter.createInterpreter(interpreterType, options);
        this.editor = null;
        this.options = options || {};
        
        if (!this.container) {
            throw new Error('Container element not found: ' + containerId);
        }
        
        this.init = function() {
            this.createHTML();
            this.initializeEditor();
            this.attachEventListeners();
            return this;
        };
        
        this.createHTML = function() {
            var memorySection = this.options.showMemory ? 
                '<div class="memory-display">Variables will appear here...</div>' : '';
            
            this.container.innerHTML = [
                '<div class="python-playground">',
                    '<div class="playground-header">',
                        '<span>' + (this.options.title || 'Python Practice Area') + '</span>',
                        '<div class="playground-controls">',
                            '<button class="btn btn-run">▶ Run Code</button>',
                            '<button class="btn btn-reset">🔄 Reset</button>',
                        '</div>',
                    '</div>',
                    '<div class="editor-container">',
                        '<textarea class="code-editor"></textarea>',
                    '</div>',
                    '<div class="output-container"></div>',
                    memorySection,
                '</div>'
            ].join('');
        };
        
        this.initializeEditor = function() {
            var textarea = this.container.querySelector('.code-editor');
            if (window.CodeMirror) {
                this.editor = CodeMirror.fromTextArea(textarea, {
                    mode: 'python',
                    theme: 'monokai',
                    lineNumbers: true,
                    indentUnit: 4,
                    indentWithTabs: false,
                    lineWrapping: true,
                    fontSize: '16px'
                });
                
                var defaultCode = this.options.defaultCode || '';
                this.editor.setValue(defaultCode);
                
                // Auto-size to show all content
                var lineCount = defaultCode.split('\n').length;
                var minHeight = Math.max(140, (lineCount + 2) * 20);
                this.editor.setSize(null, minHeight + 'px');
                
            } else {
                // Fallback for environments without CodeMirror
                textarea.value = this.options.defaultCode || '';
                var lines = (this.options.defaultCode || '').split('\n').length;
                textarea.rows = Math.max(8, lines + 2);
                this.editor = {
                    getValue: function() { return textarea.value; },
                    setValue: function(value) { textarea.value = value; }
                };
            }
        };
        
        this.attachEventListeners = function() {
            var self = this;
            var runBtn = this.container.querySelector('.btn-run');
            var resetBtn = this.container.querySelector('.btn-reset');
            
            runBtn.addEventListener('click', function() { self.run(); });
            resetBtn.addEventListener('click', function() { self.reset(); });
        };
        
        this.run = function() {
            var code = this.editor.getValue();
            var result = this.interpreter.executeCode(code);
            var outputEl = this.container.querySelector('.output-container');
            var memoryEl = this.container.querySelector('.memory-display');
            
            if (result.success) {
                outputEl.innerHTML = '<div class="success">' + result.message.replace(/\n/g, '<br>') + '</div>';
                if (memoryEl && result.variables) {
                    this.updateMemoryDisplay(memoryEl, result.variables);
                }
            } else {
                outputEl.innerHTML = '<div class="error">' + result.message + '</div>';
                if (memoryEl) {
                    memoryEl.innerHTML = 'Variables: None (error occurred)';
                }
            }
        };
        
        this.reset = function() {
            this.editor.setValue(this.options.defaultCode || '');
            this.container.querySelector('.output-container').innerHTML = '';
            var memoryEl = this.container.querySelector('.memory-display');
            if (memoryEl) {
                memoryEl.innerHTML = 'Variables will appear here...';
            }
        };
        
        this.updateMemoryDisplay = function(element, variables) {
            var varText = Object.keys(variables).map(function(name) {
                return name + ' = "' + variables[name] + '"';
            }).join(', ');
            element.innerHTML = 'Variables: ' + (varText || 'None');
        };
    }
    
})();

// Export for Node.js testing if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.PenguinTwistInterpreter;
}
