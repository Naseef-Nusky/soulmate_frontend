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
 * Sanitize string for use as GA4 event name
 * GA4 event names must be alphanumeric, underscores, and hyphens only
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeEventName = (str) => {
  if (!str) return 'unknown';
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 40) // Limit length (GA4 has limits)
    .toLowerCase();
};

/**
 * Track quiz step navigation
 * @param {number} stepNumber - The step number (1-indexed)
 * @param {string} stepKey - The step key/identifier
 * @param {string} stepTitle - The full question/title text
 */
export const trackQuizStep = (stepNumber, stepKey, stepTitle) => {
  const title = stepTitle || stepKey;
  const sanitizedTitle = sanitizeEventName(title);
  // Event name includes both step number and question title
  const eventName = `quiz_step_${stepNumber}_${sanitizedTitle}`;
  
  trackEvent(eventName, {
    step: stepNumber,
    step_key: stepKey,
    step_title: title, // Full question text
    event_label: `Step ${stepNumber}: ${title}`,
    question: title, // Include full question for easy filtering
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

