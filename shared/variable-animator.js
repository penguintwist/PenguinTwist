// shared/variable-animator.js
// Interactive Variable Assignment Animation System
// VERSION: 1.0 - Educational Process Visualization

(function() {
    'use strict';
    
    console.log('=== Variable Animator Loading ===');
    
    class VariableAssignmentAnimator {
        constructor(containerId, options = {}) {
            this.containerId = containerId;
            this.container = null;
            this.options = {
                animationSpeed: options.animationSpeed || 1200,
                autoPlay: options.autoPlay || false,
                showControls: options.showControls !== false,
                theme: options.theme || 'arctic'
            };
            this.currentStep = 0;
            this.isPlaying = false;
            this.steps = [];
        }
        
        init() {
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.error('❌ Animator container not found:', this.containerId);
                return false;
            }
            
            console.log('🎬 Variable animator initialized:', this.containerId);
            return true;
        }
        
        // Create animation for specific variable assignment
        createAssignmentAnimation(variableName, value, valueType = 'auto') {
            // Auto-detect value type
            if (valueType === 'auto') {
                if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                    valueType = 'string';
                } else if (!isNaN(value) && value.toString().indexOf('.') === -1) {
                    valueType = 'number';
                } else if (!isNaN(value) && value.toString().indexOf('.') !== -1) {
                    valueType = 'float';
                } else {
                    valueType = 'string';
                }
            }
            
            const codeExample = `${variableName} = ${value}`;
            
            this.steps = [
                {
                    step: 1,
                    title: '👀 Python Reads the Code',
                    highlight: codeExample,
                    highlightPart: 'full',
                    description: `Python sees this assignment and gets ready to create a new variable.`,
                    memoryState: 'preparing',
                    codeExplanation: 'The equals sign (=) tells Python to store something in memory.'
                },
                {
                    step: 2,
                    title: '📦 Create Memory Box',
                    highlight: codeExample,
                    highlightPart: 'variable',
                    variableName: variableName,
                    description: `Python creates a memory box labeled "${variableName}".`,
                    memoryState: 'creating',
                    codeExplanation: `The name "${variableName}" becomes the label on the memory box.`
                },
                {
                    step: 3,
                    title: '💾 Store the Value',
                    highlight: codeExample,
                    highlightPart: 'value',
                    value: value,
                    valueType: valueType,
                    description: `Python puts ${value} inside the ${variableName} box.`,
                    memoryState: 'storing',
                    codeExplanation: `The value ${value} is ${valueType === 'string' ? 'text (notice the quotes)' : 'a number (no quotes needed)'}.`
                },
                {
                    step: 4,
                    title: '✅ Assignment Complete!',
                    highlight: codeExample,
                    highlightPart: 'full',
                    description: `Now whenever you use "${variableName}", Python looks in this box and finds ${value}.`,
                    memoryState: 'complete',
                    codeExplanation: `The variable ${variableName} is ready to use in your program!`
                }
            ];
            
            this.renderAnimationFramework(variableName, value, valueType);
            
            if (this.options.autoPlay) {
                this.playAnimation();
            }
        }
        
        renderAnimationFramework(variableName, value, valueType) {
            if (!this.container) return;
            
            const controlsHtml = this.options.showControls ? `
                <div class="animation-controls">
                    <button class="anim-btn play-btn" onclick="${this.containerId}Animator.playAnimation()">
                        ▶️ Watch Assignment Process
                    </button>
                    <button class="anim-btn step-btn" onclick="${this.containerId}Animator.nextStep()">
                        👆 Next Step
                    </button>
                    <button class="anim-btn reset-btn" onclick="${this.containerId}Animator.resetAnimation()">
                        🔄 Start Over
                    </button>
                </div>
            ` : '';
            
            this.container.innerHTML = `
                <div class="variable-animation ${this.options.theme}-theme">
                    <div class="animation-header">
                        <h4>🎬 How Python Creates Variables</h4>
                        <p>Watch step-by-step as Python processes: <code>${variableName} = ${value}</code></p>
                    </div>
                    
                    <div class="animation-workspace">
                        <div class="code-visualization">
                            <div class="code-title">📝 Your Code</div>
                            <div class="code-display" id="${this.containerId}_codeDisplay">
                                <code id="${this.containerId}_codeHighlight">${variableName} = ${value}</code>
                            </div>
                            <div class="code-explanation" id="${this.containerId}_codeExplanation">
                                Ready to see how this works?
                            </div>
                        </div>
                        
                        <div class="memory-visualization">
                            <div class="memory-title">🧠 Computer Memory</div>
                            <div class="memory-workspace" id="${this.containerId}_memoryWorkspace">
                                <div class="memory-box" id="${this.containerId}_memoryBox">
                                    <div class="box-label" id="${this.containerId}_boxLabel">?</div>
                                    <div class="box-value ${valueType}" id="${this.containerId}_boxValue">Empty</div>
                                    <div class="box-type" id="${this.containerId}_boxType">${valueType}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="animation-status">
                        <div class="step-indicator">
                            <span class="step-number" id="${this.containerId}_stepNumber">Ready</span>
                            <span class="step-title" id="${this.containerId}_stepTitle">Click 'Watch Assignment Process' to begin</span>
                        </div>
                        <div class="step-description" id="${this.containerId}_stepDescription">
                            This animation will show you exactly how Python creates and stores variables in memory.
                        </div>
                    </div>
                    
                    ${controlsHtml}
                </div>
            `;
            
            // Make animator available globally for button clicks
            window[this.containerId + 'Animator'] = this;
        }
        
        async playAnimation() {
            if (this.isPlaying) return;
            
            console.log('🎬 Starting variable assignment animation');
            
            // Track analytics
            if (window.penguinAnalytics) {
                window.penguinAnalytics.trackFeatureUsage('variable_animation', 'lesson2', {
                    type: 'full_playthrough',
                    steps: this.steps.length
                });
            }
            
            this.isPlaying = true;
            this.currentStep = 0;
            
            // Disable play button
            const playBtn = this.container.querySelector('.play-btn');
            if (playBtn) {
                playBtn.disabled = true;
                playBtn.textContent = '⏳ Playing...';
            }
            
            try {
                for (let i = 0; i < this.steps.length; i++) {
                    await this.animateStep(this.steps[i]);
                    await this.wait(this.options.animationSpeed);
                }
                
                // Animation complete
                this.updateStatus('🎉 Complete!', 'Animation finished! Try creating your own variables.');
                
            } catch (error) {
                console.error('Animation error:', error);
            } finally {
                this.isPlaying = false;
                
                // Re-enable play button
                if (playBtn) {
                    playBtn.disabled = false;
                    playBtn.textContent = '🔄 Play Again';
                }
            }
        }
        
        async nextStep() {
            if (this.isPlaying || this.currentStep >= this.steps.length) return;
            
            await this.animateStep(this.steps[this.currentStep]);
            this.currentStep++;
            
            if (this.currentStep >= this.steps.length) {
                this.updateStatus('🎉 Complete!', 'All steps finished! You can reset to watch again.');
            }
        }
        
        resetAnimation() {
            this.isPlaying = false;
            this.currentStep = 0;
            
            // Reset all visual elements
            const memoryBox = document.getElementById(this.containerId + '_memoryBox');
            const boxLabel = document.getElementById(this.containerId + '_boxLabel');
            const boxValue = document.getElementById(this.containerId + '_boxValue');
            const codeHighlight = document.getElementById(this.containerId + '_codeHighlight');
            
            if (memoryBox) {
                memoryBox.className = 'memory-box';
            }
            if (boxLabel) {
                boxLabel.textContent = '?';
                boxLabel.className = 'box-label';
            }
            if (boxValue) {
                boxValue.textContent = 'Empty';
                boxValue.className = 'box-value';
            }
            if (codeHighlight) {
                codeHighlight.className = '';
            }
            
            this.updateStatus('Ready', 'Click "Watch Assignment Process" to begin');
            this.updateCodeExplanation('Ready to see how this works?');
            
            // Reset play button
            const playBtn = this.container.querySelector('.play-btn');
            if (playBtn) {
                playBtn.disabled = false;
                playBtn.textContent = '▶️ Watch Assignment Process';
            }
        }
        
        async animateStep(step) {
            console.log(`🎬 Animating step ${step.step}:`, step.title);
            
            // Update status
            this.updateStatus(`Step ${step.step}`, step.title);
            this.updateStepDescription(step.description);
            this.updateCodeExplanation(step.codeExplanation);
            
            // Animate code highlighting
            this.animateCodeHighlight(step);
            
            // Animate memory changes
            await this.animateMemoryState(step);
            
            // Track step completion
            if (window.penguinAnalytics) {
                window.penguinAnalytics.trackFeatureUsage('animation_step', 'lesson2', {
                    step: step.step,
                    title: step.title
                });
            }
        }
        
        animateCodeHighlight(step) {
            const codeHighlight = document.getElementById(this.containerId + '_codeHighlight');
            if (!codeHighlight) return;
            
            // Remove existing highlights
            codeHighlight.className = '';
            
            // Add new highlight based on step
            setTimeout(() => {
                if (step.highlightPart === 'variable') {
                    codeHighlight.classList.add('highlight-variable');
                } else if (step.highlightPart === 'value') {
                    codeHighlight.classList.add('highlight-value');
                } else {
                    codeHighlight.classList.add('highlight-full');
                }
            }, 100);
        }
        
        async animateMemoryState(step) {
            const memoryBox = document.getElementById(this.containerId + '_memoryBox');
            const boxLabel = document.getElementById(this.containerId + '_boxLabel');
            const boxValue = document.getElementById(this.containerId + '_boxValue');
            
            if (!memoryBox || !boxLabel || !boxValue) return;
            
            switch (step.memoryState) {
                case 'preparing':
                    memoryBox.classList.add('preparing');
                    await this.wait(300);
                    break;
                    
                case 'creating':
                    memoryBox.classList.remove('preparing');
                    memoryBox.classList.add('creating');
                    
                    // Animate label change
                    boxLabel.style.transform = 'scale(1.2)';
                    boxLabel.style.opacity = '0.5';
                    
                    await this.wait(400);
                    
                    boxLabel.textContent = step.variableName;
                    boxLabel.classList.add('created');
                    boxLabel.style.transform = 'scale(1)';
                    boxLabel.style.opacity = '1';
                    
                    memoryBox.classList.add('created');
                    break;
                    
                case 'storing':
                    memoryBox.classList.add('storing');
                    
                    // Animate value change
                    boxValue.style.transform = 'scale(1.3)';
                    boxValue.style.opacity = '0.3';
                    
                    await this.wait(500);
                    
                    boxValue.textContent = step.value;
                    boxValue.className = `box-value ${step.valueType} stored`;
                    boxValue.style.transform = 'scale(1)';
                    boxValue.style.opacity = '1';
                    
                    memoryBox.classList.add('stored');
                    break;
                    
                case 'complete':
                    memoryBox.classList.add('complete');
                    
                    // Final celebration animation
                    boxLabel.style.animation = 'celebrate 0.6s ease-in-out';
                    boxValue.style.animation = 'celebrate 0.6s ease-in-out';
                    
                    await this.wait(600);
                    break;
            }
        }
        
        updateStatus(stepNum, title) {
            const stepNumber = document.getElementById(this.containerId + '_stepNumber');
            const stepTitle = document.getElementById(this.containerId + '_stepTitle');
            
            if (stepNumber) stepNumber.textContent = stepNum;
            if (stepTitle) stepTitle.textContent = title;
        }
        
        updateStepDescription(description) {
            const stepDescription = document.getElementById(this.containerId + '_stepDescription');
            if (stepDescription) {
                stepDescription.style.opacity = '0.5';
                setTimeout(() => {
                    stepDescription.textContent = description;
                    stepDescription.style.opacity = '1';
                }, 200);
            }
        }
        
        updateCodeExplanation(explanation) {
            const codeExplanation = document.getElementById(this.containerId + '_codeExplanation');
            if (codeExplanation) {
                codeExplanation.style.opacity = '0.6';
                setTimeout(() => {
                    codeExplanation.textContent = explanation;
                    codeExplanation.style.opacity = '1';
                }, 200);
            }
        }
        
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    
    // Quick Animation Factory for common variable types
    class QuickVariableAnimator {
        static createStringAnimation(containerId, variableName, value) {
            const animator = new VariableAssignmentAnimator(containerId, { autoPlay: false });
            animator.init();
            animator.createAssignmentAnimation(variableName, `"${value}"`, 'string');
            return animator;
        }
        
        static createNumberAnimation(containerId, variableName, value) {
            const animator = new VariableAssignmentAnimator(containerId, { autoPlay: false });
            animator.init();
            animator.createAssignmentAnimation(variableName, value, 'number');
            return animator;
        }
        
        static createAutoAnimation(containerId, code) {
            // Parse simple assignment: name = "value"
            const match = code.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
            if (!match) {
                console.error('Could not parse code for animation:', code);
                return null;
            }
            
            const variableName = match[1];
            const value = match[2].trim();
            
            const animator = new VariableAssignmentAnimator(containerId, { autoPlay: false });
            animator.init();
            animator.createAssignmentAnimation(variableName, value, 'auto');
            return animator;
        }
    }
    
    // Export to global scope
    window.VariableAssignmentAnimator = VariableAssignmentAnimator;
    window.QuickVariableAnimator = QuickVariableAnimator;
    
    console.log('=== Variable Animator Ready ===');
    
})();
