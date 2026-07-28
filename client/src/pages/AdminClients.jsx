/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { Building2, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ companyName: '', order: 0, isActive: true, image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  const loadClients = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/clients');
      setClients(res.data.clients || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load clients');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((client) => client.isActive).length,
    hidden: clients.filter((client) => !client.isActive).length,
  }), [clients]);
  const { visibleItems, totalPages } = paginateItems(clients, page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('companyName', form.companyName);
      payload.append('order', form.order);
      payload.append('isActive', form.isActive);
      if (form.image) payload.append('image', form.image);

      if (editingId) {
        await api.put(`/clients/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/clients', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setForm({ companyName: '', order: 0, isActive: true, image: null });
      setEditingId(null);
      setMessage(editingId ? 'Client updated successfully' : 'Client added successfully');
      await loadClients();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (client) => {
    setEditingId(client._id);
    setForm({
      companyName: client.companyName,
      order: client.order || 0,
      isActive: client.isActive,
      image: null,
    });
  };

  const toggleActive = async (client) => {
    try {
      await api.put(`/clients/${client._id}`, { isActive: !client.isActive }, { headers: { 'Content-Type': 'application/json' } });
      setMessage('Status updated');
      await loadClients();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      setMessage('Client deleted');
      await loadClients();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={Building2} label="Total clients" value={stats.total} tone="blue" />
        <MiniStat icon={Eye} label="Active clients" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Inactive clients" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Trusted Companies</p>
            <h2>{editingId ? 'Update client' : 'Create client'}</h2>
          </div>
          <span className="admin-chip">{clients.length} clients</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
          <input placeholder="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <label className="file-label">
            <span>{form.image ? form.image.name : 'Upload client logo'}</span>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </label>
          <div className="status-toggle-row">
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
              {loading ? 'Saving...' : editingId ? 'Update Client' : 'Add Client'}
            </button>
            {editingId ? (
              <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm({ companyName: '', order: 0, isActive: true, image: null }); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Client list</p>
            <h2>Company cards</h2>
          </div>
        </div>
        {pageLoading ? <LoadingState label="Loading clients" /> : null}
        {!pageLoading && !clients.length ? <EmptyState title="No clients yet" text="Create a client to display them in the trusted companies section." /> : null}
        {!pageLoading && clients.length ? (
          <>
            <div className="hero-grid admin-content-grid">
              {visibleItems.map((client) => (
                <div className="hero-card-item content-tile" key={client._id}>
                  {client.logo?.url ? <img src={client.logo.url} alt={client.companyName} /> : <div className="hero-card-body"><h3>{client.companyName}</h3></div>}
                  <div className="hero-card-body">
                    <div className="hero-card-top">
                      <h3>{client.companyName}</h3>
                      <span className={`status-pill ${client.isActive ? 'active' : 'inactive'}`}>{client.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <p className="hero-meta">Order: {client.order}</p>
                    <div className="action-group">
                      <button className="table-btn" onClick={() => startEdit(client)}>Edit</button>
                      <button className="table-btn" onClick={() => toggleActive(client)}>{client.isActive ? 'Disable' : 'Enable'}</button>
                      <button className="table-btn danger" onClick={() => handleDelete(client._id)}>Delete</button>
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
