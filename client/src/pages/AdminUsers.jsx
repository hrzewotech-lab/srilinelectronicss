/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, UserCheck, UsersRound } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const currentUser = getStoredUser();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const loadUsers = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load users');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) {
      setMessage('Only super admins can manage admin accounts.');
      setPageLoading(false);
      return;
    }
    loadUsers();
  }, [isSuperAdmin]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((user) => user.isActive).length,
    superAdmins: users.filter((user) => user.role === 'superadmin').length,
  }), [users]);

  const { visibleItems, totalPages } = paginateItems(users, page, 7);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setMessage('Only super admins can manage admin accounts.');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, { name: form.name, email: form.email });
      } else {
        await api.post('/users', form);
      }
      setForm({ name: '', email: '', password: '', role: 'admin' });
      setEditingId(null);
      setMessage(editingId ? 'Admin updated successfully' : 'Admin added successfully');
      await loadUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin?')) return;
    try {
      await api.delete(`/users/${id}`);
      setMessage('Admin deleted');
      await loadUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  const handlePromote = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role: role === 'admin' ? 'superadmin' : 'admin' });
      setMessage('Role updated');
      await loadUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Role update failed');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="admin-panel-card access-card">
        <p className="eyebrow">Users</p>
        <h2>Access restricted</h2>
        <p className="muted-text">Only a super admin can add, edit, delete, or promote admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={UsersRound} label="Total admins" value={stats.total} tone="green" />
        <MiniStat icon={UserCheck} label="Active accounts" value={stats.active} tone="blue" />
        <MiniStat icon={ShieldCheck} label="Super admins" value={stats.superAdmins} tone="violet" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Users</p>
            <h2>{editingId ? 'Update admin account' : 'Create admin account'}</h2>
          </div>
          <span className="admin-chip">{users.length} admins</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form" onSubmit={handleSubmit}>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {!editingId ? (
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          ) : null}
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Update Admin' : 'Add Admin'}
          </button>
          {editingId ? (
            <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: '', role: 'admin' }); }}>
              Cancel
            </button>
          ) : null}
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>Admin accounts</h2>
          </div>
        </div>

        {pageLoading ? <LoadingState label="Loading admins" /> : null}
        {!pageLoading && !users.length ? <EmptyState title="No admins found" text="Add an admin account to start building your team." /> : null}

        {!pageLoading && users.length ? (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="table-profile">
                          <span>{user.name?.charAt(0)?.toUpperCase() || 'A'}</span>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td><span className="role-pill">{user.role}</span></td>
                      <td><span className={`status-pill ${user.isActive ? 'active' : 'inactive'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <div className="action-group">
                          <button className="table-btn" onClick={() => startEdit(user)}>Edit</button>
                          <button className="table-btn" onClick={() => handlePromote(user._id, user.role)}>
                            {user.role === 'admin' ? 'Promote' : 'Demote'}
                          </button>
                          <button className="table-btn danger" onClick={() => handleDelete(user._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : null}
      </div>
    </div>
  );
}
