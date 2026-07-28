/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { Boxes, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { AdminPagination, EmptyState, LoadingState, MiniStat } from '../components/AdminUi';
import { paginateItems } from '../utils/adminPagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', specifications: '', isActive: true, image: null });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  const loadProducts = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/products?all=true');
      setProducts(res.data.products || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load products');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter((product) => product.isActive).length,
    hidden: products.filter((product) => !product.isActive).length,
  }), [products]);
  const { visibleItems, totalPages } = paginateItems(products, page);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('description', form.description);
      payload.append('specifications', form.specifications);
      payload.append('isActive', form.isActive);
      if (form.image) payload.append('image', form.image);

      if (editingId) {
        await api.put(`/products/${editingId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/products', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setForm({ name: '', description: '', specifications: '', isActive: true, image: null });
      setEditingId(null);
      setMessage(editingId ? 'Product updated successfully' : 'Product added successfully');
      await loadProducts();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not save product');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      specifications: product.specifications?.join('\n') || '',
      isActive: product.isActive,
      image: null,
    });
  };

  const toggleActive = async (product) => {
    try {
      await api.put(`/products/${product._id}`, { isActive: !product.isActive }, { headers: { 'Content-Type': 'application/json' } });
      setMessage('Product status updated');
      await loadProducts();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setMessage('Product deleted');
      await loadProducts();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={Boxes} label="Total products" value={stats.total} tone="violet" />
        <MiniStat icon={Eye} label="Visible" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Hidden" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Products</p>
            <h2>{editingId ? 'Update product' : 'Create product'}</h2>
          </div>
          <span className="admin-chip">{products.length} products</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label className="file-label">
            <span>{form.image ? form.image.name : 'Upload product image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
          </label>
          <textarea placeholder="Description" rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <textarea placeholder="Specifications (one per line)" rows="5" value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} />
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
              {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId ? (
              <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm({ name: '', description: '', specifications: '', isActive: true, image: null }); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h2>Product cards</h2>
          </div>
        </div>
        {pageLoading ? <LoadingState label="Loading products" /> : null}
        {!pageLoading && !products.length ? <EmptyState title="No products yet" text="Create a product to show it in the website catalog." /> : null}
        {!pageLoading && products.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {visibleItems.map((product) => (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow" key={product._id}>
                  <img src={product.image?.url} alt={product.name} className="w-full h-40 sm:h-44 object-cover" />
                  <div className="p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
                      <span className={`status-pill ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3">{product.description}</p>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <strong className="block text-xs uppercase tracking-wide text-slate-500 mb-2">Specifications</strong>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        {product.specifications?.slice(0, 3).map((spec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                            <span className="line-clamp-2">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button className="table-btn" onClick={() => startEdit(product)}>Edit</button>
                      <button className="table-btn" onClick={() => toggleActive(product)}>{product.isActive ? 'Hide' : 'Show'}</button>
                      <button className="table-btn danger" onClick={() => handleDelete(product._id)}>Delete</button>
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
