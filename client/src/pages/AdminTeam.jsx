/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Users } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', designation: '', message: '', honors: '', contact: '', order: 0, isFeatured: false, isActive: true, image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  const loadMembers = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/team?all=true');
      setMembers(res.data.members || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load team');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter((member) => member.isActive).length,
    hidden: members.filter((member) => !member.isActive).length,
  }), [members]);
  const { visibleItems, totalPages } = paginateItems(members, page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('designation', form.designation);
      payload.append('message', form.message);
      payload.append('honors', form.honors);
      payload.append('contact', form.contact);
      payload.append('order', form.order);
      payload.append('isFeatured', form.isFeatured);
      payload.append('isActive', form.isActive);
      if (form.image) payload.append('image', form.image);

      if (editingId) {
        await api.put(`/team/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/team', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setForm({ name: '', designation: '', message: '', honors: '', contact: '', order: 0, isFeatured: false, isActive: true, image: null });
      setEditingId(null);
      setMessage(editingId ? 'Team member updated successfully' : 'Team member added successfully');
      await loadMembers();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not save team member');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name,
      designation: member.designation,
      message: member.message || '',
      honors: member.honors?.join('\n') || '',
      contact: member.contact || '',
      order: member.order || 0,
      isFeatured: member.isFeatured || false,
      isActive: member.isActive,
      image: null,
    });
  };

  const toggleActive = async (member) => {
    try {
      await api.put(`/team/${member._id}`, { isActive: !member.isActive }, { headers: { 'Content-Type': 'application/json' } });
      setMessage('Team member status updated');
      await loadMembers();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await api.delete(`/team/${id}`);
      setMessage('Team member deleted');
      await loadMembers();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={Users} label="Team members" value={stats.total} tone="violet" />
        <MiniStat icon={Eye} label="Visible" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Hidden" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Team</p>
            <h2>{editingId ? 'Update team member' : 'Create team member'}</h2>
          </div>
          <span className="admin-chip">{members.length} members</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} required />
          <input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <input placeholder="Display order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <label className="file-label">
            <span>{form.image ? form.image.name : 'Upload profile image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </label>
          <textarea placeholder="Message" rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <textarea placeholder="Honors / achievements (one per line)" rows="4" value={form.honors} onChange={(e) => setForm({ ...form, honors: e.target.value })} />
          <div className="status-toggle-row">
            <button
              type="button"
              className={`status-toggle ${form.isFeatured ? 'active' : 'inactive'}`}
              onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
            >
              {form.isFeatured ? 'Featured leader' : 'Leadership grid'}
            </button>
            <button
              type="button"
              className={`status-toggle ${form.isActive ? 'active' : 'inactive'}`}
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
            >
              {form.isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
            </button>
            {editingId ? (
              <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm({ name: '', designation: '', message: '', honors: '', contact: '', order: 0, isFeatured: false, isActive: true, image: null }); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">People</p>
            <h2>Team profiles</h2>
          </div>
        </div>
        {pageLoading ? <LoadingState label="Loading team profiles" /> : null}
        {!pageLoading && !members.length ? <EmptyState title="No team members yet" text="Create a profile to introduce your team on the website." /> : null}
        {!pageLoading && members.length ? (
          <>
            <div className="hero-grid admin-content-grid">
              {visibleItems.map((member) => (
                <div className="hero-card-item content-tile" key={member._id}>
                  <img src={member.image?.url} alt={member.name} />
                  <div className="hero-card-body">
                    <div className="hero-card-top">
                      <h3>{member.name}</h3>
                      <span className={`status-pill ${member.isActive ? 'active' : 'inactive'}`}>
                        {member.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="blog-order">Order: {member.order || 0}</p>
                    <p><strong>{member.designation}</strong></p>
                    <pre className="blog-description">{member.message}</pre>
                    <p className="hero-meta">Contact: {member.contact || '-'}</p>
                    <p className="hero-meta">{member.isFeatured ? 'Featured leader' : 'Leadership grid'}</p>
                    <div className="spec-list">
                      <strong>Honors</strong>
                      <ul>{member.honors?.map((honor, index) => <li key={index}>{honor}</li>)}</ul>
                    </div>
                    <div className="action-group">
                      <button className="table-btn" onClick={() => startEdit(member)}>Edit</button>
                      <button className="table-btn" onClick={() => toggleActive(member)}>{member.isActive ? 'Hide' : 'Show'}</button>
                      <button className="table-btn danger" onClick={() => handleDelete(member._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : null}
      </div>
    </div>
  );
}
