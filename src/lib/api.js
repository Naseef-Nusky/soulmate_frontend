// Auto-detect protocol to avoid redirect loops
const getApiBase = () => {
  const envBase = (import.meta?.env?.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (envBase) return envBase;
  
  // If no explicit base URL, use relative paths (works with same-domain proxy)
  // This prevents protocol mismatches (http vs https)
  return '';
};

const API_BASE = getApiBase();
const withBase = (path) => {
  if (!API_BASE) return path; // Relative path - works with Nginx proxy
  return `${API_BASE}${path}`;
};

export async function submitQuiz(payload) {
  const res = await fetch(withBase('/api/generate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export async function requestGeneration(payload) {
  const res = await fetch(withBase('/api/request'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(withBase(`/api/request/status/${jobId}`));
  if (!res.ok) throw new Error('Status failed');
  return res.json();
}

export async function getResult(resultId) {
  const res = await fetch(withBase(`/api/request/result/${resultId}`));
  if (!res.ok) throw new Error('Result failed');
  return res.json();
}

export async function requestArtistSketch(payload) {
  const res = await fetch(withBase('/api/artist'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Artist request failed');
  return res.json();
}

// Sign-up / login helpers
export async function signup(userData) {
  const res = await fetch(withBase('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Registration failed' }));
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}

export async function emailLogin(email) {
  const res = await fetch(withBase('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || 'Login failed');
  }
  return res.json();
}

export async function verifyLoginToken(token) {
  const res = await fetch(withBase(`/api/auth/verify-token/${token}`), {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Token verification failed' }));
    throw new Error(error.error || 'Token verification failed');
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





