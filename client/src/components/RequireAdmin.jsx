import { Navigate, useLocation } from 'react-router-dom';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
}

function isAdminUser() {
  const token = localStorage.getItem('token');
  const user = getStoredUser();
  return Boolean(token && user && (user.role === 'admin' || user.role === 'superadmin'));
}

export default function RequireAdmin({ children }) {
  const location = useLocation();

  if (!isAdminUser()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
