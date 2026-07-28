/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Images } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

export default function AdminHero() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', order: 0, isActive: true, image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  const loadSlides = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/hero?all=true');
      setSlides(res.data.slides || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load hero slides');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const stats = useMemo(() => ({
    total: slides.length,
    active: slides.filter((slide) => slide.isActive).length,
    hidden: slides.filter((slide) => !slide.isActive).length,
  }), [slides]);
  const { visibleItems, totalPages } = paginateItems(slides, page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('order', form.order);
      payload.append('isActive', form.isActive);
      if (form.image) payload.append('image', form.image);

      if (editingId) {
        await api.put(`/hero/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/hero', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setForm({ title: '', description: '', order: 0, isActive: true, image: null });
      setEditingId(null);
      setMessage(editingId ? 'Hero slide updated successfully' : 'Hero slide added successfully');
      await loadSlides();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      title: slide.title,
      description: slide.description,
      order: slide.order || 0,
      isActive: slide.isActive,
      image: null,
    });
  };

  const toggleActive = async (slide) => {
    try {
      await api.put(`/hero/${slide._id}`, { isActive: !slide.isActive }, { headers: { 'Content-Type': 'application/json' } });
      setMessage('Status updated');
      await loadSlides();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hero slide?')) return;
    try {
      await api.delete(`/hero/${id}`);
      setMessage('Hero slide deleted');
      await loadSlides();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={Images} label="Total slides" value={stats.total} tone="blue" />
        <MiniStat icon={Eye} label="Active slides" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Inactive slides" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Hero Section</p>
            <h2>{editingId ? 'Update hero slide' : 'Create hero slide'}</h2>
          </div>
          <span className="admin-chip">{slides.length} slides</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <textarea placeholder="Description" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <label className="file-label">
            <span>{form.image ? form.image.name : 'Upload hero image'}</span>
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
              {loading ? 'Saving...' : editingId ? 'Update Slide' : 'Add Slide'}
            </button>
            {editingId ? (
              <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm({ title: '', description: '', order: 0, isActive: true, image: null }); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Carousel</p>
            <h2>Hero slide cards</h2>
          </div>
        </div>
        {pageLoading ? <LoadingState label="Loading hero slides" /> : null}
        {!pageLoading && !slides.length ? <EmptyState title="No hero slides yet" text="Create a slide to start building your homepage carousel." /> : null}
        {!pageLoading && slides.length ? (
          <>
            <div className="hero-grid admin-content-grid">
              {visibleItems.map((slide) => (
                <div className="hero-card-item content-tile" key={slide._id}>
                  <img src={slide.image?.url} alt={slide.title} />
                  <div className="hero-card-body">
                    <div className="hero-card-top">
                      <h3>{slide.title}</h3>
                      <span className={`status-pill ${slide.isActive ? 'active' : 'inactive'}`}>{slide.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <p>{slide.description}</p>
                    <p className="hero-meta">Order: {slide.order}</p>
                    <div className="action-group">
                      <button className="table-btn" onClick={() => startEdit(slide)}>Edit</button>
                      <button className="table-btn" onClick={() => toggleActive(slide)}>{slide.isActive ? 'Disable' : 'Enable'}</button>
                      <button className="table-btn danger" onClick={() => handleDelete(slide._id)}>Delete</button>
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
