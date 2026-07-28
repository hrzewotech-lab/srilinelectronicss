import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <section className="page-card">
      <p className="eyebrow">Admin Dashboard</p>
      <h2>Welcome, {user.name || 'Admin'}</h2>
      <p className="muted-text">
        You are signed in as <strong>{user.role}</strong>. This is your protected admin area.
      </p>
      <button className="primary-btn" onClick={handleLogout}>
        Logout
      </button>
    </section>
  );
}
