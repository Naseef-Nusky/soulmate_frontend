/**
 * Google Analytics 4 Event Tracking Utility
 * Tracks quiz progress and user actions for funnel analysis
 */

/**
 * Track a custom event to GA4
 * @param {string} eventName - Name of the event (e.g., 'quiz_start', 'quiz_step_1')
 * @param {object} params - Additional event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) {
    // Silently fail if gtag is not available (e.g., during SSR or if GA is blocked)
    return;
  }

  try {
    window.gtag('event', eventName, {
      ...params,
      event_category: 'quiz',
      timestamp: new Date().toISOString(),
    });
    
    // Log in development for debugging
    if (import.meta.env.DEV) {
      console.log('[GA4] Event tracked:', eventName, params);
    }
  } catch (error) {
    console.warn('[GA4] Failed to track event:', eventName, error);
  }
};

/**
 * Track quiz start event
 */
export const trackQuizStart = () => {
  trackEvent('quiz_start', {
    event_label: 'Quiz Started',
  });
};

/**
 * Track quiz step navigation
 * @param {number} stepNumber - The step number (1-indexed)
 * @param {string} stepKey - The step key/identifier
 */
export const trackQuizStep = (stepNumber, stepKey) => {
  trackEvent(`quiz_step_${stepNumber}`, {
    step: stepNumber,
    step_key: stepKey,
    event_label: `Step ${stepNumber}: ${stepKey}`,
  });
};

/**
 * Track quiz completion
 */
export const trackQuizComplete = () => {
  trackEvent('quiz_complete', {
    event_label: 'Quiz Completed',
  });
};

/**
 * Track registration view
 */
export const trackRegisterView = () => {
  trackEvent('register_view', {
    event_label: 'Registration Page Viewed',
  });
};

/**
 * Track purchase start (when checkout session is created)
 */
export const trackPurchaseStart = () => {
  trackEvent('purchase_start', {
    event_label: 'Purchase Started',
  });
};

