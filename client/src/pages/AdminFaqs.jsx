/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { CircleHelp, Eye, EyeOff, Tag } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

const EMPTY_FORM = { question: '', answer: '', category: 'General', isActive: true, order: 0 };

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState(['General']);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('All');

  const loadFaqs = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/faqs?all=true');
      setFaqs(res.data.faqs || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load FAQs');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
    api.get('/faqs/categories')
      .then((res) => { if (res.data.categories) setCategories(res.data.categories); })
      .catch(() => {});
  }, []);

  const stats = useMemo(() => ({
    total: faqs.length,
    active: faqs.filter((faq) => faq.isActive).length,
    hidden: faqs.filter((faq) => !faq.isActive).length,
  }), [faqs]);

  const filteredFaqs = useMemo(() =>
    filterCategory === 'All' ? faqs : faqs.filter((f) => f.category === filterCategory),
    [faqs, filterCategory]
  );

  const { visibleItems, totalPages } = paginateItems(filteredFaqs, page, 8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/faqs/${editingId}`, form);
      } else {
        await api.post('/faqs', form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setMessage(editingId ? 'FAQ updated successfully' : 'FAQ added successfully');
      await loadFaqs();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      isActive: faq.isActive,
      order: faq.order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleActive = async (faq) => {
    try {
      await api.put(`/faqs/${faq._id}`, { ...faq, isActive: !faq.isActive });
      setMessage('FAQ status updated');
      await loadFaqs();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      setMessage('FAQ deleted');
      await loadFaqs();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  const categoryColors = {
    'Embedded Hardware Design Services': '#3b82f6',
    'Embedded Software Development Services': '#8b5cf6',
    'ECAD Layout Services': '#06b6d4',
    'PCB Manufacturing': '#10b981',
    'Stencil Manufacturing Services': '#f59e0b',
    'Component Sourcing Services': '#ef4444',
    'Testing Services': '#ec4899',
    'Laser Marking/ Laser Printing': '#f97316',
    'Conformal Coating': '#84cc16',
    'About Srilin': '#6366f1',
    'PCB Assembly': '#a855f7',
    'X-Ray Inspection': '#14b8a6',
    'Turnkey Box Build Integration': '#f43f5e',
    'Ball Grid Array': '#eab308',
    'General': '#64748b',
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={CircleHelp} label="Total FAQs" value={stats.total} tone="blue" />
        <MiniStat icon={Eye} label="Visible" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Hidden" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2>{editingId ? 'Update question' : 'Create question'}</h2>
          </div>
          <span className="admin-chip">{faqs.length} items</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input
            placeholder="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
          <textarea
            placeholder="Answer"
            rows="5"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />

          {/* Category select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                padding: '10px 12px',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                fontSize: 14,
                background: '#fff',
                color: '#0F172A',
                cursor: 'pointer',
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <input
            type="number"
            min="0"
            placeholder="Display order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value === '' ? 0 : Number(e.target.value) })}
          />
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
              {loading ? 'Saving...' : editingId ? 'Update FAQ' : 'Add FAQ'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Knowledge Base</p>
            <h2>Question library</h2>
          </div>
        </div>

        {/* Category filter tabs */}
        {!pageLoading && faqs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 0 16px' }}>
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setFilterCategory(cat); setPage(1); }}
                style={{
                  padding: '5px 14px',
                  border: '1px solid',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  borderColor: filterCategory === cat ? (categoryColors[cat] || '#0F172A') : '#E2E8F0',
                  background: filterCategory === cat ? (categoryColors[cat] || '#0F172A') : '#fff',
                  color: filterCategory === cat ? '#fff' : '#334155',
                }}
              >
                {cat}
                {cat !== 'All' && (
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>
                    ({faqs.filter((f) => f.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {pageLoading ? <LoadingState label="Loading FAQs" /> : null}
        {!pageLoading && !faqs.length ? <EmptyState title="No FAQs yet" text="Add common questions to help visitors get answers quickly." /> : null}
        {!pageLoading && faqs.length ? (
          <>
            <div className="faq-list">
              {visibleItems.map((faq) => (
                <div className="faq-item" key={faq._id}>
                  <div className="hero-card-top">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <h3>{faq.question}</h3>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {faq.category && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            color: categoryColors[faq.category] || '#64748b',
                            padding: '2px 8px',
                            background: `${categoryColors[faq.category] || '#64748b'}18`,
                            borderRadius: 10,
                            width: 'fit-content',
                          }}>
                            <Tag size={10} />
                            {faq.category}
                          </span>
                        )}
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                          Order: {faq.order ?? 0}
                        </span>
                      </div>
                    </div>
                    <span className={`status-pill ${faq.isActive ? 'active' : 'inactive'}`}>
                      {faq.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="blog-description">{faq.answer}</p>
                  <div className="action-group">
                    <button className="table-btn" onClick={() => startEdit(faq)}>Edit</button>
                    <button className="table-btn" onClick={() => toggleActive(faq)}>{faq.isActive ? 'Hide' : 'Show'}</button>
                    <button className="table-btn danger" onClick={() => handleDelete(faq._id)}>Delete</button>
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
