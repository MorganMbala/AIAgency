// Utilitaire pour décoder le token JWT et récupérer le rôle
export function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (e) {
    return null;
  }
}

export function isAdmin() {
  return getUserRole() === 'admin';
}
