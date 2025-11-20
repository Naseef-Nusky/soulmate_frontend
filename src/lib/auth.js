// Simple auth utilities using localStorage
// In production, use proper JWT tokens and secure storage

export function setUser(user, token) {
  localStorage.setItem('user', JSON.stringify(user));
  if (token) localStorage.setItem('token', token);
}

export function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getUser();
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}









