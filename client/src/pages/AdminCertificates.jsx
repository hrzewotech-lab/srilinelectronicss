/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { Award, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { EmptyState, LoadingState, MiniStat } from '../components/AdminUi';

const emptyForm = {
  name: '',
  order: 0,
  isActive: true,
  image: null,
};

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadCertificates = async () => {
    setPageLoading(true);
    try {
      const response = await api.get('/certificates?all=true');
      setCertificates(response.data.certificates || []);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Failed to load certificates');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const stats = useMemo(() => ({
    total: certificates.length,
    active: certificates.filter((certificate) => certificate.isActive).length,
    hidden: certificates.filter((certificate) => !certificate.isActive).length,
  }), [certificates]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('order', form.order);
      payload.append('isActive', form.isActive);
      if (form.image) payload.append('image', form.image);

      if (editingId) {
        await api.put(`/certificates/${editingId}`, payload);
      } else {
        await api.post('/certificates', payload);
      }

      setMessage(editingId ? 'Certificate updated successfully' : 'Certificate added successfully');
      resetForm();
      await loadCertificates();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not save the certificate');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (certificate) => {
    setEditingId(certificate._id);
    setForm({
      name: certificate.name,
      order: certificate.order || 0,
      isActive: certificate.isActive,
      image: null,
    });
  };

  const toggleActive = async (certificate) => {
    try {
      await api.put(`/certificates/${certificate._id}`, {
        isActive: !certificate.isActive,
      });
      setMessage('Certificate status updated');
      await loadCertificates();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (certificate) => {
    if (!window.confirm(`Delete "${certificate.name}"?`)) return;

    try {
      await api.delete(`/certificates/${certificate._id}`);
      setMessage('Certificate deleted');
      await loadCertificates();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Could not delete certificate');
    }
  };

  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={Award} label="Total certificates" value={stats.total} tone="blue" />
        <MiniStat icon={Eye} label="Active" value={stats.active} tone="green" />
        <MiniStat icon={EyeOff} label="Inactive" value={stats.hidden} tone="orange" />
      </section>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Quality Certifications</p>
            <h2>{editingId ? 'Update certificate' : 'Add certificate'}</h2>
          </div>
          <span className="admin-chip">{certificates.length} certificates</span>
        </div>

        {message ? <div className="admin-alert">{message}</div> : null}

        <form className="admin-form hero-form" onSubmit={handleSubmit}>
          <input
            placeholder="Certificate name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            placeholder="Display order"
            type="number"
            value={form.order}
            onChange={(event) => setForm({ ...form, order: Number(event.target.value) })}
          />
          <label className="file-label">
            <span>{form.image ? form.image.name : 'Upload certificate image'}</span>
            <input
              type="file"
              accept="image/*"
              required={!editingId}
              onChange={(event) => setForm({ ...form, image: event.target.files[0] })}
            />
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
              {loading ? 'Saving...' : editingId ? 'Update Certificate' : 'Add Certificate'}
            </button>
            {editingId ? (
              <button className="secondary-btn" type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Homepage Carousel</p>
            <h2>Certificate images</h2>
          </div>
        </div>

        {pageLoading ? <LoadingState label="Loading certificates" /> : null}
        {!pageLoading && !certificates.length ? (
          <EmptyState
            title="No certificates yet"
            text="Upload a certificate to display it on the homepage."
          />
        ) : null}

        {!pageLoading && certificates.length ? (
          <div className="hero-grid admin-content-grid">
            {certificates.map((certificate) => (
              <article className="hero-card-item content-tile" key={certificate._id}>
                <img src={certificate.image?.url} alt={certificate.name} />
                <div className="hero-card-body">
                  <div className="hero-card-top">
                    <h3>{certificate.name}</h3>
                    <span className={`status-pill ${certificate.isActive ? 'active' : 'inactive'}`}>
                      {certificate.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="hero-meta">Display order: {certificate.order}</p>
                  <div className="action-group">
                    <button className="table-btn" onClick={() => startEdit(certificate)}>Edit</button>
                    <button className="table-btn" onClick={() => toggleActive(certificate)}>
                      {certificate.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button className="table-btn danger" onClick={() => handleDelete(certificate)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
