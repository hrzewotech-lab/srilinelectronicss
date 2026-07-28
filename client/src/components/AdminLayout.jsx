import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  BookOpenText,
  Boxes,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import api from '../api/axios';

const links = [
  { to: '/admin', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: ShieldCheck },
  { to: '/admin/hero', label: 'Hero Section', icon: Images },
  { to: '/admin/clients', label: 'Clients', icon: Building2 },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/blog', label: 'Blog', icon: BookOpenText },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/services', label: 'Services', icon: Sparkles },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/faqs', label: 'FAQs', icon: CircleHelp },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getStoredUser();
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const visibleLinks = links.filter((link) => link.to !== '/admin/users' || isSuperAdmin);
  const activeLink = [...visibleLinks].reverse().find((link) => (
    link.end ? location.pathname === link.to : location.pathname.startsWith(link.to)
  ));

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

  return (
    <div className="admin-layout">
      <button
        type="button"
        className={`admin-backdrop ${sidebarOpen ? 'show' : ''}`}
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <img src="/srilin-white.png" alt="Srilin" />
            <div>
              <p className="admin-brand-eyebrow">CONTROL PANEL</p>
              <h3>Srilin Admin</h3>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{link.label}</span>
                <ChevronRight className="admin-nav-arrow" size={16} />
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <span className="admin-user-avatar">{(currentUser?.name || 'A').charAt(0).toUpperCase()}</span>
            <div>
              <strong>{currentUser?.name || 'Admin'}</strong>
              <small>{isSuperAdmin ? 'Super Admin' : 'Admin'}</small>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu size={20} />
            </button>
            <div>
              <p className="topbar-kicker">Admin Portal</p>
              <h1>{activeLink?.label || 'Dashboard'}</h1>
            </div>
          </div>

          <div className="admin-top-pill">Admin Dashboard</div>

          <div className="topbar-date">
            <CalendarDays size={17} />
            <span>26 May 2025 - 26 Jun 2025</span>
          </div>

          <div className="topbar-right">
            <button className="topbar-icon-btn" type="button" aria-label="Notifications">
              <Bell size={18} />
              <span>3</span>
            </button>
            <span className="topbar-user">
              <Home size={16} />
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
