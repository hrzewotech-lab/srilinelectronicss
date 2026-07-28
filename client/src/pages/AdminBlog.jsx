/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', isActive: true, order: 0, image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  const loadBlogs = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/blog?all=true');
      setBlogs(res.data.blogs || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load blogs');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const stats = useMemo(() => ({
    total: blogs.length,
    active: blogs.filter((blog) => blog.isActive).length,
    hidden: blogs.filter((blog) => !blog.isActive).length,
  }), [blogs]);
  const { visibleItems, totalPages } = paginateItems(blogs, page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('isActive', form.isActive);
      payload.append('order', form.order);
      if (form.image) payload.append('image', form.image);

      if (editingId) {
        await api.put(`/blog/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/blog', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setForm({ title: '', description: '', isActive: true, order: 0, image: null });
      setEditingId(null);
      setMessage(editingId ? 'Blog updated successfully' : 'Blog added successfully');
      await loadBlogs();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not save blog');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (blog) => {
    setEditingId(blog._id);
    setForm({ title: blog.title, description: blog.description, isActive: blog.isActive, order: blog.order ?? 0, image: null });
  };

  const toggleActive = async (blog) => {
    try {
      await api.put(`/blog/${blog._id}`, { isActive: !blog.isActive }, { headers: { 'Content-Type': 'application/json' } });
      setMessage('Blog status updated');
      await loadBlogs();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try {
      await api.delete(`/blog/${id}`);
      setMessage('Blog deleted');
      await loadBlogs();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={BookOpenText} label="Total posts" value={stats.total} tone="blue" />
        <MiniStat icon={Eye} label="Published" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Hidden" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Blog</p>
            <h2>{editingId ? 'Update blog post' : 'Create blog post'}</h2>
          </div>
          <span className="admin-chip">{blogs.length} posts</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <label className="file-label">
            <span>{form.image ? form.image.name : 'Upload featured image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </label>
          <textarea placeholder="Description" rows="6" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
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
              {loading ? 'Saving...' : editingId ? 'Update Blog' : 'Add Blog'}
            </button>
            {editingId ? (
              <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm({ title: '', description: '', isActive: true, order: 0, image: null }); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Library</p>
            <h2>Blog content</h2>
          </div>
        </div>
        {pageLoading ? <LoadingState label="Loading blog posts" /> : null}
        {!pageLoading && !blogs.length ? <EmptyState title="No blog posts yet" text="Create a blog post to publish updates on your website." /> : null}
        {!pageLoading && blogs.length ? (
          <>
            <div className="hero-grid admin-content-grid">
              {visibleItems.map((blog) => (
                <div className="hero-card-item content-tile" key={blog._id}>
                  <img src={blog.image?.url} alt={blog.title} />
                  <div className="hero-card-body">
                    <div className="hero-card-top">
                      <h3>{blog.title}</h3>
                      <span className={`status-pill ${blog.isActive ? 'active' : 'inactive'}`}>
                        {blog.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="blog-order">Order: {blog.order ?? 0}</p>
                    <pre className="blog-description">{blog.description}</pre>
                    <div className="action-group">
                      <button className="table-btn" onClick={() => startEdit(blog)}>Edit</button>
                      <button className="table-btn" onClick={() => toggleActive(blog)}>{blog.isActive ? 'Hide' : 'Show'}</button>
                      <button className="table-btn danger" onClick={() => handleDelete(blog._id)}>Delete</button>
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
