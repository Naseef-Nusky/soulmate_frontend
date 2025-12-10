// Auto-detect protocol to avoid redirect loops
// This function is called at runtime to ensure Capacitor is available
const getApiBase = () => {
  // Check if running in web browser on localhost (development)
  // In this case, use relative paths to leverage Vite proxy (avoids CORS issues)
  const isWebLocalhost = typeof window !== 'undefined' && 
    window.location && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    !window.Capacitor && 
    !window.CapacitorWeb && 
    !window.capacitor;
  
  if (isWebLocalhost) {
    console.log('[API] Web localhost detected - using relative paths (Vite proxy)');
    return ''; // Use relative paths for Vite proxy
  }
  
  // First, check for explicit environment variable (highest priority)
  // But only if not on web localhost (to avoid CORS issues)
  const envBase = (import.meta?.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (envBase) {
    console.log('[API] Using VITE_API_BASE_URL:', envBase);
    return envBase;
  }
  
  // For mobile apps (Capacitor), use production API URL by default
  // But allow localhost for development if explicitly set
  // Check if running in Capacitor - multiple detection methods (runtime check)
  const isCapacitor = typeof window !== 'undefined' && (
    window.Capacitor !== undefined ||
    window.CapacitorWeb !== undefined ||
    window.capacitor !== undefined ||
    (window.location && window.location.protocol === 'file:') ||
    (window.navigator && window.navigator.userAgent && (
      window.navigator.userAgent.includes('Capacitor') ||
      window.navigator.userAgent.includes('file://') ||
      // Android app (not Chrome browser)
      (window.navigator.userAgent.includes('Android') && 
       !window.navigator.userAgent.includes('Chrome') && 
       !window.navigator.userAgent.includes('wv')) ||
      // iOS app (not Safari browser)
      ((window.navigator.userAgent.includes('iPhone') || 
        window.navigator.userAgent.includes('iPad')) && 
       !window.navigator.userAgent.includes('Safari') &&
       !window.navigator.userAgent.includes('CriOS'))
    ))
  );
  
  if (isCapacitor) {
    // For mobile apps, always use production API URL
    // Environment variable VITE_API_BASE_URL takes precedence if set
    const apiUrl = 'https://api.gurulink.app';
    console.log('[API] Detected Capacitor/mobile, using:', apiUrl, '(mode:', import.meta.env.MODE + ')');
    return apiUrl;
  }
  
  // Additional fallback: if we're in production build and not in a browser, use API URL
  // This catches cases where detection might fail
  if (import.meta.env.MODE === 'production' && typeof window !== 'undefined') {
    const isLikelyMobile = window.location && (
      window.location.protocol === 'file:' ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'http:' && window.location.hostname === 'localhost'
    );
    
    if (isLikelyMobile) {
      const apiUrl = 'https://api.gurulink.app';
      console.log('[API] Fallback: Production mode + mobile-like environment, using:', apiUrl);
      return apiUrl;
    }
  }
  
  // For production web deployment (not localhost, not Capacitor), use full API URL
  // This ensures translation and other APIs work when frontend and backend are on different domains
  if (import.meta.env.MODE === 'production' && typeof window !== 'undefined' && window.location) {
    const isProductionWeb = 
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      !isCapacitor &&
      (window.location.protocol === 'https:' || window.location.protocol === 'http:');
    
    if (isProductionWeb) {
      const apiUrl = 'https://api.gurulink.app';
      console.log('[API] Production web deployment detected, using:', apiUrl);
      return apiUrl;
    }
  }
  
  // If no explicit base URL, use relative paths (works with same-domain proxy)
  // This prevents protocol mismatches (http vs https)
  // For local web development, this will use Vite's proxy to localhost:4000
  if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('[API] Local web development - using relative paths (Vite proxy to localhost:4000)');
  } else {
    console.log('[API] Using relative paths (web mode)');
  }
  return '';
};

// Get API base - will be recalculated if needed, but cache the initial value
let API_BASE = getApiBase();
const withBase = (path) => {
  // Re-check API base at runtime to ensure we have the latest value
  // This is important because Capacitor might not be available at module load time
  const currentApiBase = getApiBase();
  
  if (!currentApiBase) return path; // Relative path - works with Nginx proxy
  // Ensure path starts with / and API_BASE doesn't end with /
  const cleanBase = currentApiBase.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;
  
  // Always log in mobile/Capacitor for debugging
  const isMobile = typeof window !== 'undefined' && (
    window.Capacitor || 
    window.CapacitorWeb || 
    window.capacitor ||
    (window.navigator && window.navigator.userAgent && (
      window.navigator.userAgent.includes('file://') ||
      (window.navigator.userAgent.includes('Android') && !window.navigator.userAgent.includes('Chrome'))
    ))
  );
  
  if (isMobile) {
    console.log('[API] Mobile request - URL:', fullUrl, 'Path:', path);
  } else {
    // Log for web too in development
    if (import.meta.env.DEV) {
      console.log('[API] Web request - URL:', fullUrl || path, 'Path:', path, 'Using proxy:', !currentApiBase);
    }
  }
  
  return fullUrl;
};

// Helper function to make HTTP requests - tries Capacitor HTTP first, falls back to fetch
async function makeHttpRequest(url, options = {}) {
  const isMobile = typeof window !== 'undefined' && (
    window.Capacitor || window.CapacitorWeb || window.capacitor
  );
  
  // Try Capacitor HTTP plugin if available (better for mobile)
  if (isMobile && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Http) {
    try {
      console.log('[API] Using Capacitor HTTP plugin for:', url);
      const http = window.Capacitor.Plugins.Http;
      
      const httpOptions = {
        url: url,
        method: options.method || 'GET',
        headers: options.headers || {},
      };
      
      if (options.body) {
        httpOptions.data = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        if (!httpOptions.headers['Content-Type']) {
          httpOptions.headers['Content-Type'] = 'application/json';
        }
      }
      
      const response = await http.request(httpOptions);
      
      // Capacitor HTTP returns data directly
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText || 'OK',
        json: async () => {
          if (typeof response.data === 'string') {
            return JSON.parse(response.data);
          }
          return response.data;
        },
        text: async () => {
          if (typeof response.data === 'string') {
            return response.data;
          }
          return JSON.stringify(response.data);
        },
        headers: {
          get: (name) => response.headers?.[name] || response.headers?.[name.toLowerCase()] || null
        }
      };
    } catch (error) {
      console.warn('[API] Capacitor HTTP failed, falling back to fetch:', error);
      // Fall through to fetch
    }
  }
  
  // Use standard fetch
  if (isMobile) {
    console.log('[API] Using fetch for mobile request:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      hasBody: !!options.body,
      userAgent: navigator.userAgent,
      capacitorAvailable: !!window.Capacitor,
      timestamp: new Date().toISOString()
    });
  } else {
    console.log('[API] Making request to:', url, options.method || 'GET');
  }
  
  // Add timeout and better error handling for mobile
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.error('[API] Request timeout after 30 seconds:', url);
  }, 30000); // 30 second timeout
  
  try {
    // For mobile apps, use mode that avoids CORS issues
    // Mobile apps shouldn't have CORS, but Capacitor sometimes sends origin headers
    const fetchOptions = {
      ...options,
      signal: controller.signal
    };
    
    // For mobile, try to avoid CORS by not sending origin-like headers
    if (isMobile) {
      // Don't set mode to 'no-cors' as it prevents reading response
      // Instead, let the backend handle it by allowing the origin
      // But we can try to minimize CORS issues
      fetchOptions.mode = 'cors';
      fetchOptions.credentials = 'omit'; // Don't send credentials to avoid CORS preflight
    }
    
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server did not respond within 30 seconds');
    }
    throw error;
  }
}

// Helper function to handle fetch errors with better logging
async function fetchWithErrorHandling(url, options = {}, extractError = null) {
  try {
    // Log request details for mobile debugging
    const isMobile = typeof window !== 'undefined' && (
      window.Capacitor || window.CapacitorWeb || window.capacitor
    );
    
    if (isMobile) {
      console.log('[API] Making mobile request:', {
        url,
        method: options.method || 'GET',
        hasBody: !!options.body,
        timestamp: new Date().toISOString()
      });
    }
    
    const res = await makeHttpRequest(url, options);
    
    if (!res.ok) {
      let errorMessage = `HTTP ${res.status} ${res.statusText}`;
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          if (extractError && typeof extractError === 'function') {
            errorMessage = extractError(errorData) || errorMessage;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else {
          const errorText = await res.text();
          if (errorText) errorMessage = errorText;
        }
      } catch (e) {
        // If we can't parse error, use default message
      }
      
      console.error('[API] Request failed:', {
        url,
        status: res.status,
        statusText: res.statusText,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error) {
    // Log ALL error details for debugging
    const currentApiBase = getApiBase();
    const isMobile = typeof window !== 'undefined' && (window.Capacitor || window.CapacitorWeb || window.capacitor);
    
    console.error('[API] Error caught:', {
      url,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      errorToString: error.toString(),
      API_BASE: currentApiBase,
      isMobile,
      hasCapacitor: typeof window !== 'undefined' && !!window.Capacitor,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      location: typeof window !== 'undefined' ? window.location.href : 'N/A'
    });
    
    // Check for various network error types
    const isNetworkError = 
      (error.name === 'TypeError' && (
        error.message.includes('fetch') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout') ||
        error.message.includes('aborted')
      )) ||
      error.message.includes('ERR_INTERNET_DISCONNECTED') ||
      error.message.includes('ERR_NETWORK_CHANGED') ||
      error.message.includes('ERR_CONNECTION_REFUSED') ||
      error.message.includes('ERR_CONNECTION_TIMED_OUT') ||
      error.message.includes('ERR_NAME_NOT_RESOLVED') ||
      error.message.includes('ERR_CERT') ||
      error.message.includes('SSL') ||
      error.message.includes('certificate');
    
    if (isNetworkError) {
      // Provide more specific error message based on error type
      let errorMsg = `Cannot connect to server. Please check your internet connection and ensure the backend is running at ${currentApiBase || 'the configured URL'}`;
      
      if (error.message.includes('certificate') || error.message.includes('SSL') || error.message.includes('ERR_CERT')) {
        errorMsg += ' (SSL Certificate error detected - check network security config)';
      } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
        errorMsg += ' (Connection timeout - server may be slow or unreachable)';
      } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        errorMsg += ' (DNS resolution failed - check domain name)';
      }
      
      throw new Error(errorMsg);
    }
    throw error;
  }
}

export async function submitQuiz(payload) {
  const url = withBase('/api/generate');
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function requestGeneration(payload) {
  const url = withBase('/api/request');
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getJobStatus(jobId) {
  const url = withBase(`/api/request/status/${jobId}`);
  return fetchWithErrorHandling(url);
}

export async function getResult(resultId) {
  const url = withBase(`/api/request/result/${resultId}`);
  return fetchWithErrorHandling(url);
}

export async function requestArtistSketch(payload) {
  const url = withBase('/api/artist');
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Sign-up / login helpers
export async function signup(userData) {
  const url = withBase('/api/auth/register');
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }, (errorData) => errorData.error || 'Registration failed');
}

export async function createPaymentIntent(payload) {
  const res = await fetch(withBase('/api/payments/create-intent'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unable to start payment' }));
    throw new Error(error.error || 'Unable to start payment');
  }
  return res.json();
}

export async function createCheckoutSession(payload, retries = 2) {
  const url = withBase('/api/payments/create-checkout-session');
  const isMobile = typeof window !== 'undefined' && (
    window.Capacitor || window.CapacitorWeb || window.capacitor ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Add timeout for mobile devices (they often have slower connections)
      const controller = new AbortController();
      const timeoutMs = isMobile ? 45000 : 30000; // 45s for mobile, 30s for web
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.error('[API] Checkout session request timeout after', timeoutMs, 'ms');
      }, timeoutMs);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        // For mobile, ensure we're not blocked by CORS
        mode: 'cors',
        credentials: 'omit',
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unable to start checkout' }));
        // Don't retry on client errors (4xx)
        if (res.status >= 400 && res.status < 500) {
          throw new Error(error.error || 'Unable to start checkout');
        }
        // Retry on server errors (5xx) or network issues
        if (attempt === retries) {
          throw new Error(error.error || 'Unable to start checkout. Please try again.');
        }
        // Wait before retrying
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`[API] Retrying checkout session (attempt ${attempt + 1}/${retries + 1}) after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      const result = await res.json();
      
      // Validate response
      if (!result || !result.url) {
        throw new Error('Invalid response from server. Please try again.');
      }
      
      // Ensure URL is HTTPS (Stripe requires HTTPS)
      if (result.url && !result.url.startsWith('https://')) {
        console.warn('[API] Checkout URL is not HTTPS:', result.url);
        throw new Error('Security error: Checkout must use HTTPS. Please contact support.');
      }
      
      return result;
    } catch (error) {
      // If it's the last attempt or a non-retryable error, throw
      if (attempt === retries) {
        // Improve error messages for mobile users
        if (error.name === 'AbortError' || error.message?.includes('timeout')) {
          throw new Error('Connection timeout. Please check your internet connection and try again.');
        }
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        if (error.message?.includes('CORS') || error.message?.includes('CORS')) {
          throw new Error('Connection blocked. Please try again or contact support.');
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.log(`[API] Retrying checkout session (attempt ${attempt + 1}/${retries + 1}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function createSubscription(payload, retries = 2) {
  const url = withBase('/api/payments/create-subscription');
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithErrorHandling(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }, (errorData) => errorData.error || 'Unable to create subscription');
      
      return res;
    } catch (error) {
      // If it's the last attempt or error is not retryable, throw
      if (attempt === retries) {
        // Improve error message for user
        if (error.message?.includes('timeout') || error.message?.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          throw new Error('Unable to connect to server. Please check your internet connection and try again.');
        }
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      console.log(`[API] Retrying createSubscription (attempt ${attempt + 1}/${retries + 1}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function emailLogin(email) {
  const url = withBase('/api/auth/login');
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }, (errorData) => errorData.error || 'Login failed');
}

export async function verifyLoginToken(token) {
  const url = withBase(`/api/auth/verify-token/${token}`);
  return fetchWithErrorHandling(url, {
    headers: { 'Content-Type': 'application/json' },
  }, (errorData) => errorData.error || 'Token verification failed');
}

export async function sendCancellationVerificationCode(email) {
  const res = await fetch(withBase('/api/auth/cancel/send-code'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to send verification code' }));
    throw new Error(error.error || 'Failed to send verification code');
  }
  return res.json();
}

export async function verifyCodeAndCancel(email, code) {
  const res = await fetch(withBase('/api/auth/cancel/verify-and-cancel'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to cancel subscription' }));
    throw new Error(error.error || 'Failed to cancel subscription');
  }
  return res.json();
}

// Astrological Reports APIs
export async function getNatalChart() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/astrology/natal-chart'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to get natal chart');
  return res.json();
}

export async function getDailyHoroscope() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/astrology/horoscope?type=today'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to get daily horoscope');
  return res.json();
}

export async function getTomorrowHoroscope() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/astrology/horoscope?type=tomorrow'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to get tomorrow horoscope');
  return res.json();
}

export async function getMonthlyHoroscope() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/astrology/horoscope?type=monthly'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to get monthly horoscope');
  return res.json();
}

export async function getUserSoulmateSketch() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/astrology/soulmate-sketch'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to get soulmate sketch');
  return res.json();
}

export async function updateSoulmateSketchSpeedOption(speedOption) {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/astrology/soulmate-sketch/speed-option'), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ speedOption }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to update speed option' }));
    throw new Error(error.error || 'Failed to update speed option');
  }
  return res.json();
}

// Profile APIs
export async function getProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/auth/profile'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to get profile');
  return res.json();
}

export async function updateProfile(profileData) {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/auth/profile'), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to update profile' }));
    throw new Error(error.error || 'Failed to update profile');
  }
  return res.json();
}

// Subscription/Payment APIs
export async function getSubscription() {
  const token = localStorage.getItem('token');
  const res = await fetch(withBase('/api/auth/subscription'), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to get subscription' }));
    throw new Error(error.error || 'Failed to get subscription');
  }
  return res.json();
}

// Translation API (server-side Google Cloud Translation proxy)
export async function translateTexts({ texts, target, source }) {
  const res = await fetch(withBase('/api/translate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, target, source }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Translation failed' }));
    throw new Error(error.error || 'Translation failed');
  }
  return res.json(); // { translations: string[] }
}

export async function sendSketchReadyEmail(email) {
  const res = await fetch(withBase('/api/notifications/sketch-ready'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to send sketch email' }));
    throw new Error(error.error || 'Failed to send sketch email');
  }
  return res.json();
}

export async function sendHoroscopeLoginEmail(email) {
  const res = await fetch(withBase('/api/notifications/login-link'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to send login email' }));
    throw new Error(error.error || 'Failed to send login email');
  }
  return res.json();
}

export async function checkAccountExists(email) {
  const url = withBase('/api/auth/check-account');
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }, (errorData) => errorData.error || 'Failed to check account');
}

// Health check function to test API connectivity
export async function checkApiHealth() {
  try {
    // Re-check API base at runtime
    const currentApiBase = getApiBase();
    const healthUrl = currentApiBase ? `${currentApiBase}/health` : '/health';
    console.log('[API] Testing health check at:', healthUrl, 'API_BASE:', currentApiBase);
    
    const res = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.status} ${res.statusText}`);
    }
    const result = await res.json();
    console.log('[API] Health check successful:', result);
    return result;
  } catch (error) {
    console.error('[API] Health check failed:', {
      error: error.message,
      errorName: error.name,
      stack: error.stack
    });
    throw error;
  }
}

// Simple test function to verify API connectivity
export async function testApiConnection() {
  const currentApiBase = getApiBase();
  const testUrl = currentApiBase ? `${currentApiBase}/health` : '/health';
  
  const isMobile = typeof window !== 'undefined' && (window.Capacitor || window.CapacitorWeb || window.capacitor);
  
  console.log('[API TEST] Starting connection test...', {
    apiBase: currentApiBase,
    testUrl,
    isMobile,
    hasCapacitor: typeof window !== 'undefined' && !!window.Capacitor,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    location: typeof window !== 'undefined' ? window.location.href : 'N/A'
  });
  
  // Try fetch first
  try {
    console.log('[API TEST] Attempting fetch to:', testUrl);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('[API TEST] Fetch timeout after 15 seconds');
    }, 15000); // 15 second timeout
    
    const response = await fetch(testUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      // Add mode and credentials for better compatibility
      mode: 'cors',
      credentials: 'omit'
    });
    
    clearTimeout(timeoutId);
    
    console.log('[API TEST] Fetch successful:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const data = await response.json();
    console.log('[API TEST] Response data:', data);
    return { success: true, data, url: testUrl, method: 'fetch' };
  } catch (error) {
    console.error('[API TEST] Fetch failed with detailed error:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      errorToString: error.toString(),
      url: testUrl,
      isAbortError: error.name === 'AbortError'
    });
    
    // Try with XMLHttpRequest as fallback
    try {
      console.log('[API TEST] Trying XMLHttpRequest as fallback...');
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', testUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 15000;
        
        xhr.onload = () => {
          console.log('[API TEST] XMLHttpRequest response:', {
            status: xhr.status,
            statusText: xhr.statusText,
            readyState: xhr.readyState
          });
          
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log('[API TEST] XMLHttpRequest successful:', data);
              resolve({ success: true, data, url: testUrl, method: 'XMLHttpRequest' });
            } catch (parseError) {
              reject(new Error(`Failed to parse response: ${parseError.message}`));
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = (e) => {
          console.error('[API TEST] XMLHttpRequest onerror:', {
            readyState: xhr.readyState,
            status: xhr.status,
            statusText: xhr.statusText
          });
          reject(new Error(`XMLHttpRequest network error (status: ${xhr.status})`));
        };
        
        xhr.ontimeout = () => {
          console.error('[API TEST] XMLHttpRequest timeout');
          reject(new Error('XMLHttpRequest timeout after 15 seconds'));
        };
        
        xhr.onabort = () => {
          console.error('[API TEST] XMLHttpRequest aborted');
          reject(new Error('XMLHttpRequest was aborted'));
        };
        
        xhr.send();
      });
    } catch (xhrError) {
      console.error('[API TEST] XMLHttpRequest also failed:', {
        errorName: xhrError.name,
        errorMessage: xhrError.message,
        errorStack: xhrError.stack
      });
      
      // Provide comprehensive error message
      const errorDetails = {
        fetchError: error.message,
        xhrError: xhrError.message,
        url: testUrl,
        suggestion: isMobile 
          ? 'Check Android network security config and ensure device has internet access'
          : 'Check CORS configuration and ensure backend is running'
      };
      
      console.error('[API TEST] All connection methods failed:', errorDetails);
      throw new Error(`Connection failed. Fetch error: ${error.message}. XHR error: ${xhrError.message}`);
    }
  }
}

// Initialize and log API configuration
export function initApi() {
  // Wait a bit for Capacitor to initialize if it's available
  setTimeout(() => {
    // Re-check at initialization time
    const currentApiBase = getApiBase();
    const isCapacitor = typeof window !== 'undefined' && (
      window.Capacitor || 
      window.CapacitorWeb || 
      window.capacitor
    );
    
    const isMobile = typeof window !== 'undefined' && window.navigator && 
      (window.navigator.userAgent.includes('file://') || 
       (window.navigator.userAgent.includes('Android') && !window.navigator.userAgent.includes('Chrome')) ||
       (window.navigator.userAgent.includes('iPhone') && !window.navigator.userAgent.includes('Safari')));
    
    console.log('[API] Initialization:', {
      API_BASE: currentApiBase,
      isCapacitor,
      isMobile,
      hasWindowCapacitor: typeof window !== 'undefined' && !!window.Capacitor,
      hasWindowCapacitorWeb: typeof window !== 'undefined' && !!window.CapacitorWeb,
      hasWindowCapacitorLower: typeof window !== 'undefined' && !!window.capacitor,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      mode: import.meta.env.MODE,
      envApiUrl: import.meta.env.VITE_API_BASE_URL,
      location: typeof window !== 'undefined' ? window.location.href : 'N/A',
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A'
    });
    
    // Test health endpoint on mobile - this helps diagnose connection issues
    if (isCapacitor || isMobile) {
      console.log('[API] Running automatic connection test for mobile...');
      testApiConnection()
        .then(result => {
          console.log('[API] ✅ Connection test successful:', result);
        })
        .catch(err => {
          console.error('[API] ❌ Connection test failed:', {
            error: err.message,
            url: currentApiBase ? `${currentApiBase}/health` : '/health',
            suggestion: 'Check if backend is accessible and network security config is correct'
          });
        });
    }
  }, 500); // Increased delay to ensure Capacitor is fully initialized
}





