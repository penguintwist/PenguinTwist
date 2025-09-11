// debug-integration.js - Simple integration for standalone debug logger
// Just include this script and call PenguinDebug.log() anywhere in your code
// To disable: simply remove the script tag or set DEBUG_ENABLED = false

(function() {
    'use strict';
    
    // Easy on/off switch
    const DEBUG_ENABLED = true;
    
    if (!DEBUG_ENABLED) {
        // Provide no-op functions when disabled
        window.PenguinDebug = {
            log: function() {},
            error: function() {},
            warn: function() {},
            info: function() {},
            success: function() {},
            component: function() {},
            event: function() {},
            api: function() {},
            openLogger: function() {},
            closeLogger: function() {}
        };
        return;
    }
    
    let debugWindow = null;
    let messageQueue = [];
    let isLoggerReady = false;
    
    // Listen for messages from debug window
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'PENGUIN_DEBUG_PONG') {
            isLoggerReady = true;
            // Send any queued messages
            while (messageQueue.length > 0) {
                const message = messageQueue.shift();
                sendToLogger(message);
            }
        }
    });
    
    function sendToLogger(logData) {
        if (debugWindow && !debugWindow.closed) {
            if (isLoggerReady) {
                debugWindow.postMessage({
                    type: 'PENGUIN_DEBUG_LOG',
                    log: logData
                }, '*');
            } else {
                messageQueue.push(logData);
            }
        }
    }
    
    function createLogEntry(level, message, details, source) {
        return {
            timestamp: new Date().toISOString().substr(11, 12), // HH:MM:SS.mmm
            level: level,
            message: message,
            details: details || null,
            source: source || getCallerInfo(),
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
        };
    }
    
    function getCallerInfo() {
        try {
            const stack = new Error().stack;
            const lines = stack.split('\n');
            // Try to find the first line that's not this script
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i];
                if (line && !line.includes('debug-integration.js')) {
                    // Extract filename and line number
                    const match = line.match(/([^\/\\]+):(\d+):(\d+)/);
                    if (match) {
                        return `${match[1]}:${match[2]}`;
                    }
                }
            }
        } catch (e) {
            // Fallback if stack trace fails
        }
        return 'lesson-page';
    }
    
    function log(level, message, details) {
        if (!DEBUG_ENABLED) return;
        
        const logEntry = createLogEntry(level, message, details);
        
        // Also log to browser console with styling
        const styles = {
            ERROR: 'color: #ef4444; font-weight: bold;',
            WARN: 'color: #f59e0b; font-weight: bold;',
            INFO: 'color: #3b82f6;',
            SUCCESS: 'color: #10b981; font-weight: bold;',
            DEBUG: 'color: #6b7280;',
            COMPONENT: 'color: #8b5cf6; font-weight: bold;',
            EVENT: 'color: #06b6d4;',
            API: 'color: #f97316;'
        };
        
        console.log(`%c🐧 [${level}] ${message}`, styles[level] || styles.DEBUG, details || '');
        
        sendToLogger(logEntry);
    }
    
    // Public API
    window.PenguinDebug = {
        // Basic logging methods
        log: function(level, message, details) {
            log(level, message, details);
        },
        
        error: function(message, details) {
            log('ERROR', message, details);
        },
        
        warn: function(message, details) {
            log('WARN', message, details);
        },
        
        info: function(message, details) {
            log('INFO', message, details);
        },
        
        success: function(message, details) {
            log('SUCCESS', message, details);
        },
        
        debug: function(message, details) {
            log('DEBUG', message, details);
        },
        
        component: function(message, details) {
            log('COMPONENT', message, details);
        },
        
        event: function(message, details) {
            log('EVENT', message, details);
        },
        
        api: function(message, details) {
            log('API', message, details);
        },
        
        // Specialized logging helpers
        logComponentInit: function(componentName, containerId, success, details) {
            const message = `Component "${componentName}" init in "${containerId}" ${success ? '✅' : '❌'}`;
            log('COMPONENT', message, details);
        },
        
        logEvent: function(eventType, target, details) {
            const message = `Event "${eventType}" on "${target}"`;
            log('EVENT', message, details);
        },
        
        logDarkMode: function(action, state) {
            const message = `Dark mode ${action} → ${state ? 'enabled' : 'disabled'}`;
            log('EVENT', message);
        },
        
        logError: function(error, context) {
            const message = `${context || 'Error'}: ${error.message || error}`;
            log('ERROR', message, {
                stack: error.stack,
                context: context
            });
        },
        
        // Window management
        openLogger: function() {
            if (debugWindow && !debugWindow.closed) {
                debugWindow.focus();
                return;
            }
            
            const width = 800;
            const height = 600;
            const left = window.screen.width - width - 50;
            const top = 50;
            
            debugWindow = window.open(
                'debug-logger.html',
                'PenguinDebugLogger',
                `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );
            
            if (debugWindow) {
                isLoggerReady = false;
                log('INFO', 'Debug logger window opened');
                
                // Send ping after a short delay to establish connection
                setTimeout(() => {
                    if (debugWindow && !debugWindow.closed) {
                        debugWindow.postMessage({ type: 'PENGUIN_DEBUG_PING' }, '*');
                    }
                }, 1000);
            } else {
                console.warn('Failed to open debug logger window. Please check popup blocker settings.');
            }
        },
        
        closeLogger: function() {
            if (debugWindow && !debugWindow.closed) {
                debugWindow.close();
                debugWindow = null;
                isLoggerReady = false;
                log('INFO', 'Debug logger window closed');
            }
        }
    };
    
    // Auto-open logger on page load (optional)
    document.addEventListener('DOMContentLoaded', function() {
        log('INFO', 'Page loaded, debug system ready');
        
        // Uncomment the next line to auto-open the debug window
        // PenguinDebug.openLogger();
    });
    
    // Handle window unload
    window.addEventListener('beforeunload', function() {
        if (debugWindow && !debugWindow.closed) {
            debugWindow.close();
        }
    });
    
    // Global error handler
    window.addEventListener('error', function(event) {
        log('ERROR', `Global error: ${event.message}`, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });
    
    // Global unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        log('ERROR', `Unhandled promise rejection: ${event.reason}`, {
            promise: event.promise,
            reason: event.reason
        });
    });
    
})();
