// shared/analytics.js
// PenguinTwist Educational Analytics - Privacy-Compliant Learning Insights
// VERSION: 1.0 - GDPR Compliant, No Personal Data

(function() {
    'use strict';
    
    console.log('=== PenguinTwist Analytics Loading ===');
    
    class PenguinTwistAnalytics {
        constructor() {
            this.sessionId = this.generateSessionId();
            this.events = [];
            this.sessionStart = Date.now();
            this.enabled = this.checkPrivacyConsent();
            
            console.log('📊 Analytics initialized:', {
                sessionId: this.sessionId,
                enabled: this.enabled,
                timestamp: new Date().toISOString()
            });
        }
        
        generateSessionId() {
            // Generate anonymous session ID (no personal info)
            return 'pt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        checkPrivacyConsent() {
            // Simple privacy-compliant check
            try {
                const consent = localStorage.getItem('penguintwist_analytics_consent');
                return consent === 'true';
            } catch (e) {
                // If localStorage blocked, disable analytics
                console.warn('Analytics disabled - localStorage not available');
                return false;
            }
        }
        
        requestConsent() {
            if (this.enabled) return;
            
            const consentHtml = `
                <div id="analytics-consent" style="
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);
                    z-index: 1000;
                    font-size: 14px;
                    max-width: 500px;
                    margin: 0 auto;
                ">
                    <h4 style="margin: 0 0 10px 0;">📊 Help Improve PenguinTwist</h4>
                    <p style="margin: 0 0 15px 0;">
                        We'd like to collect anonymous learning data (no personal info) to improve lessons.
                        This helps us see where students get stuck and make better educational content.
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button onclick="penguinAnalytics.denyConsent()" style="
                            background: rgba(255,255,255,0.2);
                            border: none;
                            color: white;
                            padding: 8px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                        ">No Thanks</button>
                        <button onclick="penguinAnalytics.grantConsent()" style="
                            background: rgba(255,255,255,0.9);
                            border: none;
                            color: #06b6d4;
                            padding: 8px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Yes, Help Improve</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', consentHtml);
        }
        
        grantConsent() {
            try {
                localStorage.setItem('penguintwist_analytics_consent', 'true');
                this.enabled = true;
                document.getElementById('analytics-consent')?.remove();
                console.log('✅ Analytics consent granted');
                
                // Track consent grant
                this.trackEvent('consent_granted', {});
            } catch (e) {
                console.warn('Could not save consent preference');
            }
        }
        
        denyConsent() {
            try {
                localStorage.setItem('penguintwist_analytics_consent', 'false');
                this.enabled = false;
                document.getElementById('analytics-consent')?.remove();
                console.log('❌ Analytics consent denied');
            } catch (e) {
                console.warn('Could not save consent preference');
            }
        }
        
        // Core tracking function - only educational data
        trackEvent(eventType, data) {
            if (!this.enabled) return;
            
            const event = {
                timestamp: Date.now(),
                sessionId: this.sessionId,
                type: eventType,
                data: data,
                userAgent: navigator.userAgent.split(' ')[0], // Browser family only
                viewport: {
                    width: Math.floor(window.innerWidth / 100) * 100, // Rounded for privacy
                    height: Math.floor(window.innerHeight / 100) * 100
                }
            };
            
            this.events.push(event);
            
            console.log('📊 Event tracked:', {
                type: eventType,
                data: data,
                sessionEvents: this.events.length
            });
            
            // Optional: Send to external analytics (if implemented)
            this.sendToAnalytics(event);
        }
        
        // Educational event tracking methods
        trackLessonStart(lessonId) {
            this.trackEvent('lesson_start', { 
                lesson: lessonId,
                sessionTime: Date.now() - this.sessionStart
            });
        }
        
        trackLessonComplete(lessonId, timeSpent) {
            this.trackEvent('lesson_complete', {
                lesson: lessonId,
                timeSpent: timeSpent,
                totalEvents: this.events.filter(e => e.data.lesson === lessonId).length
            });
        }
        
        trackCodeExecution(lessonId, playground, codeLength, hasOutput, hasError, errorType = null) {
            this.trackEvent('code_run', {
                lesson: lessonId,
                playground: playground,
                codeLength: Math.floor(codeLength / 10) * 10, // Rounded for privacy
                hasOutput: hasOutput,
                hasError: hasError,
                errorType: errorType
            });
        }
        
        trackMasteryAttempt(lessonId, questionIndex, isCorrect, attempts) {
            this.trackEvent('mastery_attempt', {
                lesson: lessonId,
                question: questionIndex,
                isCorrect: isCorrect,
                attempts: attempts
            });
        }
        
        trackMasteryComplete(lessonId, totalAttempts, timeSpent, score) {
            this.trackEvent('mastery_complete', {
                lesson: lessonId,
                totalAttempts: totalAttempts,
                timeSpent: Math.floor(timeSpent / 1000) * 1000, // Rounded to seconds
                score: score
            });
        }
        
        trackCommonError(lessonId, playground, errorType, errorMessage) {
            // Track educational errors for improvement
            const sanitizedError = this.sanitizeErrorMessage(errorMessage);
            
            this.trackEvent('common_error', {
                lesson: lessonId,
                playground: playground,
                errorType: errorType,
                errorPattern: sanitizedError
            });
        }
        
        trackUserStruggle(lessonId, struggleType, context) {
            // Detect when students are having difficulty
            this.trackEvent('user_struggle', {
                lesson: lessonId,
                struggleType: struggleType, // 'multiple_runs', 'error_loop', 'long_idle'
                context: context
            });
        }
        
        trackFeatureUsage(feature, lessonId, context = {}) {
            this.trackEvent('feature_usage', {
                feature: feature, // 'dark_mode', 'memory_tracker', 'hint_expansion'
                lesson: lessonId,
                context: context
            });
        }
        
        trackProgressFlow(fromLesson, toLesson, method) {
            this.trackEvent('progress_flow', {
                from: fromLesson,
                to: toLesson,
                method: method // 'next_button', 'navigation', 'direct_link'
            });
        }
        
        // Helper methods
        sanitizeErrorMessage(errorMessage) {
            // Remove any potentially personal info from error messages
            if (!errorMessage) return 'unknown_error';
            
            return errorMessage
                .replace(/line \d+/gi, 'line X')
                .replace(/'[^']*'/g, "'XXX'")
                .replace(/"[^"]*"/g, '"XXX"')
                .substring(0, 100); // Limit length
        }
        
        sendToAnalytics(event) {
            // Optional: Send to external analytics service
            // For GitHub Pages, could send to GitHub Issues API, Google Analytics, etc.
            // Currently just logs for development
            
            if (window.gtag) {
                // Google Analytics 4 integration (if available)
                window.gtag('event', event.type, {
                    custom_parameter: JSON.stringify(event.data),
                    session_id: this.sessionId
                });
            }
        }
        
        // Debug and export methods
        getSessionSummary() {
            if (!this.enabled) return { message: 'Analytics disabled' };
            
            const summary = {
                sessionId: this.sessionId,
                sessionDuration: Date.now() - this.sessionStart,
                totalEvents: this.events.length,
                eventTypes: {},
                lessons: new Set(),
                errors: 0
            };
            
            this.events.forEach(event => {
                summary.eventTypes[event.type] = (summary.eventTypes[event.type] || 0) + 1;
                if (event.data.lesson) summary.lessons.add(event.data.lesson);
                if (event.type === 'common_error') summary.errors++;
            });
            
            summary.lessons = Array.from(summary.lessons);
            
            return summary;
        }
        
        exportSessionData() {
            if (!this.enabled) return null;
            
            return {
                summary: this.getSessionSummary(),
                events: this.events.map(event => ({
                    timestamp: event.timestamp,
                    type: event.type,
                    data: event.data
                }))
            };
        }
    }
    
    // Create global analytics instance
    window.penguinAnalytics = new PenguinTwistAnalytics();
    
    // Auto-request consent after page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.penguinAnalytics.requestConsent();
        }, 2000); // Wait 2 seconds before showing consent
    });
    
    console.log('=== Analytics System Ready ===');
    
})();
