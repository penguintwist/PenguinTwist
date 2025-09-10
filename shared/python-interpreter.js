// shared/python-interpreter.js
// Modern Python interpreter for educational use (Chrome 70+, Firefox 60+, Safari 12+, Edge 79+)

(() => {
    'use strict';
    
    // Simple Python interpreter for variables and print
    class PythonInterpreter {
        constructor() {
            this.variables = {};
        }
        
        execute(code) {
            this.variables = {};
            const output = [];
            const errors = [];
            
            try {
                const lines = code.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const trimmed = lines[i].trim();
                    if (trimmed && !trimmed.startsWith('#')) {
                        // Pass the line index for glow effects
                        this.executeLine(trimmed, output, i);
                    }
                }
            } catch (error) {
                errors.push(this.makeEducationalError(error.message));
            }
            
            return {
                output: output.join('\n'),
                errors,
                variables: { ...this.variables }
            };
        }
        
        executeLine(line, output, lineIndex = -1) {
            if (line.startsWith('print(')) {
                this.handlePrint(line, output);
            } else if (line.includes('=') && !line.includes('==')) {
                this.handleAssignment(line, lineIndex);
            } else if (line.trim() !== '') {
                throw new Error(`Invalid syntax: ${line}`);
            }
        }
        
        handlePrint(line, output) {
            const match = line.match(/^print\((.+)\)$/);
            if (!match) {
                throw new Error('Invalid print statement');
            }
            
            const content = match[1].trim();
            const value = this.getValue(content);
            output.push(String(value));
        }
        
        handleAssignment(line, lineIndex = -1) {
            const [varName, ...valueParts] = line.split('=');
            if (valueParts.length === 0) {
                throw new Error('Invalid assignment');
            }
            
            const name = varName.trim();
            const value = valueParts.join('=').trim();
            
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
                throw new Error(`Invalid variable name: ${name}`);
            }
            
            this.variables[name] = this.getValue(value);
            
            // Trigger glow effect for this variable assignment
            this.showVariableGlow(name, lineIndex);
        }
        
        getValue(expr) {
            expr = expr.trim();
            
            // String literal
            if ((expr.startsWith('"') && expr.endsWith('"')) ||
                (expr.startsWith("'") && expr.endsWith("'"))) {
                return expr.slice(1, -1);
            }
            
            // Number
            if (/^-?\d+(\.\d+)?$/.test(expr)) {
                return parseFloat(expr);
            }
            
            // Variable
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr)) {
                if (expr in this.variables) {
                    return this.variables[expr];
                } else {
                    throw new Error(`Variable "${expr}" not found. Create it first with: ${expr} = "value"`);
                }
            }
            
            throw new Error(`Invalid expression: ${expr}`);
        }
        
        makeEducationalError(message) {
            if (message.includes('not found')) {
                return message + ' Remember to assign a value to variables before using them.';
            }
            if (message.includes('Invalid variable name')) {
                return message + ' Variable names must start with a letter.';
            }
            if (message.includes('Invalid expression')) {
                return message + ' Remember to use quotes for text: "hello"';
            }
            return message;
        }
        
        // NEW METHOD: Show glow effect for variable connections
        showVariableGlow(varName, lineIndex = -1) {
            // Small delay to let the DOM update with new variables first
            setTimeout(() => {
                // Find the code line (if we have a line index)
                let codeLineElement = null;
                if (lineIndex >= 0) {
                    // Try to find code lines in the editor
                    const codeEditor = document.querySelector('.code-editor');
                    if (codeEditor) {
                        // For textarea, we can't highlight individual lines easily
                        // But we can still highlight the variable in the variables panel
                    }
                }
                
                // Find the variable in the variables display panel
                const variableElements = document.querySelectorAll('.variable-item');
                const matchingVar = Array.from(variableElements).find(el => {
                    const nameSpan = el.querySelector('.var-name');
                    return nameSpan && nameSpan.textContent.trim() === varName;
                });
                
                if (matchingVar) {
                    // Add glow effect to the variable panel item
                    matchingVar.classList.add('glow-active');
                    
                    // Remove the glow effect after animation completes
                    setTimeout(() => {
                        matchingVar.classList.remove('glow-active');
                    }, 1500);
                }
            }, 100);
        }
    }
    
    // Playground component
    class Playground {
        constructor(containerId, type, options = {}) {
            this.containerId = containerId;
            this.type = type;
            this.options = options;
            this.interpreter = new PythonInterpreter();
            this.editor = null;
        }
        
        init() {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container not found: ${this.containerId}`);
                return false;
            }
            
            this.createHTML(container);
            this.setupInteractions(container);
            return true;
        }
        
        createHTML(container) {
            container.innerHTML = `
                <div class="playground-header">
                    <h3>${this.options.title || 'Try It Yourself'}</h3>
                </div>
                <div class="playground-content">
                    <div class="code-section">
                        <div class="code-header">Code:</div>
                        <textarea class="code-editor" placeholder="Enter your Python code here...">${this.options.defaultCode || ''}</textarea>
                    </div>
                    <div class="output-section">
                        <div class="output-header">Output:</div>
                        <div class="output-display"></div>
                        ${this.options.showMemory ? '<div class="memory-header">Variables:</div><div class="memory-display"></div>' : ''}
                    </div>
                </div>
                <div class="playground-controls">
                    <button class="run-button">Run Code</button>
                    <button class="clear-button">Clear</button>
                </div>
            `;
        }
        
        setupInteractions(container) {
            const codeEditor = container.querySelector('.code-editor');
            const outputDisplay = container.querySelector('.output-display');
            const memoryDisplay = container.querySelector('.memory-display');
            const runButton = container.querySelector('.run-button');
            const clearButton = container.querySelector('.clear-button');
            
            // Try to set up CodeMirror
            if (typeof CodeMirror !== 'undefined') {
                try {
                    this.editor = CodeMirror.fromTextArea(codeEditor, {
                        mode: 'python',
                        theme: document.body.classList.contains('dark-mode') ? 'monokai' : 'default',
                        lineNumbers: true,
                        indentUnit: 4
                    });
                } catch (e) {
                    console.warn('CodeMirror failed, using textarea');
                }
            }
            
            const runCode = () => {
                const code = this.editor ? this.editor.getValue() : codeEditor.value;
                const result = this.interpreter.execute(code);
                
                if (result.errors.length > 0) {
                    outputDisplay.innerHTML = `<div class="error">${result.errors[0]}</div>`;
                } else {
                    outputDisplay.innerHTML = result.output || '<div class="no-output">No output</div>';
                }
                
                if (memoryDisplay && this.options.showMemory) {
                    const vars = Object.keys(result.variables);
                    if (vars.length > 0) {
                        const html = vars.map(name => {
                            const value = result.variables[name];
                            const display = typeof value === 'string' ? `"${value}"` : String(value);
                            return `<div class="variable-item">
                                <span class="var-name">${name}</span> = 
                                <span class="var-value">${display}</span>
                            </div>`;
                        }).join('');
                        memoryDisplay.innerHTML = html;
                    } else {
                        memoryDisplay.innerHTML = '<div class="no-variables">No variables created yet</div>';
                    }
                }
            };
            
            const clearCode = () => {
                const defaultCode = this.options.defaultCode || '';
                if (this.editor) {
                    this.editor.setValue(defaultCode);
                } else {
                    codeEditor.value = defaultCode;
                }
                outputDisplay.innerHTML = '';
                if (memoryDisplay) {
                    memoryDisplay.innerHTML = '';
                }
            };
            
            runButton.addEventListener('click', runCode);
            clearButton.addEventListener('click', clearCode);
            
            // Theme change support
            document.addEventListener('themeChanged', () => {
                if (this.editor) {
                    const isDark = document.body.classList.contains('dark-mode');
                    this.editor.setOption('theme', isDark ? 'monokai' : 'default');
                }
            });
        }
    }
    
    // Main API
    window.PenguinTwistInterpreter = {
        createPlayground: (containerId, type, options) => new Playground(containerId, type, options)
    };
    
})();
