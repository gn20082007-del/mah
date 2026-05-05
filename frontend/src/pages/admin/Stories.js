import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { storiesAPI, authorsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Business','Sport','Technology','Health','Culture','Environment','Le Phare','Music','Transport','Education','Opinion'];

// ─── STORIES LIST ────────────────────────────────────────────────────────────
export function StoriesList() {
  const [stories, setStories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { can } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, search, status: filterStatus || undefined };
      if (filterCat) params.category = filterCat;
      const res = await storiesAPI.getAll(params);
      setStories(res.data.stories || []);
      setTotal(res.data.total || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filterCat, filterStatus]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    await storiesAPI.delete(id);
    load();
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem', margin: 0, letterSpacing: '-0.03em' }}>Content Library</h1>
        <Link to="/admin/stories/new" style={{ background: '#1a472a', color: '#fff', padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>+ New Story</Link>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search headlines…" style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
        <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <button onClick={load} style={{ padding: '10px 22px', background: '#1a472a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Search</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,.03)' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>{['', 'Headline', 'Category', 'Author', 'Views', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', background: '#f8fafc', color: '#64748b', fontSize: 11, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '.05em', borderBottom: '1px solid #e2e8f0', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {stories.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <img src={s.image?.startsWith('http') ? s.image : `${process.env.REACT_APP_API_URL?.replace('/api','')}/uploads/${s.image?.replace('uploads/','')}` || '/placeholder.jpg'} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} onError={e => e.target.src='/placeholder.jpg'} />
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: {s.id}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#475569' }}>{s.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{s.author}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#0369a1' }}>{Number(s.views||0).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: s.status === 'published' ? '#dcfce7' : s.status === 'scheduled' ? '#e0f2fe' : '#f1f5f9', color: s.status === 'published' ? '#166534' : s.status === 'scheduled' ? '#0369a1' : '#475569' }}>{s.status?.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/story/${s.id}`} target="_blank" style={{ padding: '5px 10px', fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6, color: '#475569', textDecoration: 'none' }}>View</Link>
                      <Link to={`/admin/stories/edit/${s.id}`} style={{ padding: '5px 10px', fontSize: 12, background: '#1a472a', color: '#fff', borderRadius: 6, textDecoration: 'none', border: 'none' }}>Edit</Link>
                      {can('delete_content') && (
                        <button onClick={() => handleDelete(s.id)} style={{ padding: '5px 10px', fontSize: 12, background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Del</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>{total} total stories</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[...Array(Math.ceil(total / 12)).keys()].slice(0, 8).map(i => (
                <button key={i} onClick={() => setPage(i+1)} style={{ padding: '6px 12px', background: page === i+1 ? '#1a472a' : '#fff', color: page === i+1 ? '#fff' : '#475569', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: 13 }}>{i+1}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ─── CREATE / EDIT STORY ─────────────────────────────────────────────────────
export function StoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const [form, setForm] = useState({
    title: '', category: 'Business', subcategory: '', description: '',
    author_id: '', tags: '', meta_description: '', status: 'published',
    scheduled_at: '', featured: false,
  });

  useEffect(() => {
    authorsAPI.getAll().then(r => setAuthors(r.data || []));
    if (isEdit) {
      setLoading(true);
      storiesAPI.getOne(id).then(r => {
        const s = r.data;
        setForm({
          title: s.title || '', category: s.category || 'Business', subcategory: s.subcategory || '',
          description: s.description || '', author_id: s.author_id || '', tags: s.tags || '',
          meta_description: s.meta_description || '', status: s.status || 'published',
          scheduled_at: s.scheduled_at ? s.scheduled_at.slice(0,16) : '', featured: Boolean(s.featured),
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v === null ? '' : v));
      if (fileRef.current?.files[0]) fd.append('image', fileRef.current.files[0]);
      if (isEdit) await storiesAPI.update(id, fd);
      else await storiesAPI.create(fd);
      navigate('/admin/stories');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', marginBottom: 8, fontWeight: 700, fontSize: 13, color: '#334155' };

  if (loading) return <AdminLayout><div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Loading…</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem', margin: 0, letterSpacing: '-0.03em' }}>{isEdit ? 'Edit Story' : 'Publish New Story'}</h1>
        <Link to="/admin/stories" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>← Back</Link>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '14px 18px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Story Headline *</label>
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required placeholder="Write a compelling headline…" style={{ ...inputStyle, fontSize: 18, fontWeight: 700, padding: '14px 16px' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Content Body *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={18} placeholder="Write your story content here… HTML is supported." required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>HTML formatting supported: &lt;b&gt;, &lt;i&gt;, &lt;p&gt;, &lt;h2&gt;, &lt;img&gt;, &lt;a&gt; etc.</p>
              </div>
              <div>
                <label style={labelStyle}>Meta Description</label>
                <textarea value={form.meta_description} onChange={e => setForm(f => ({...f, meta_description: e.target.value}))} rows={3} placeholder="SEO description (120-160 chars)…" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            {/* Featured Image */}
            <div style={{ background: '#fff', padding: 28, borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <label style={labelStyle}>Featured Image {!isEdit && '*'}</label>
              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #e2e8f0', borderRadius: 12, padding: '32px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all .2s' }}>
                {preview ? <img src={preview} alt="" style={{ maxHeight: 200, borderRadius: 8, margin: '0 auto' }} /> : (
                  <>
                    <div style={{ fontSize: 36, marginBottom: 12, opacity: .5 }}>🖼</div>
                    <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Click to upload image</p>
                    <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>JPG, PNG, WebP — max 20MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0])); }} />
            </div>
          </div>

          {/* Sidebar settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, margin: '0 0 18px', color: '#0f172a' }}>Publish Settings</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} style={inputStyle}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {form.status === 'scheduled' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Schedule Date</label>
                  <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({...f, scheduled_at: e.target.value}))} style={inputStyle} />
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} style={{ width: 18, height: 18, accentColor: '#1a472a' }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Featured Story</span>
              </label>
              <button type="submit" disabled={saving} style={{ width: '100%', background: saving ? '#94a3b8' : '#1a472a', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
                {saving ? 'Saving…' : isEdit ? 'Update Story' : 'Publish Story'}
              </button>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, margin: '0 0 18px', color: '#0f172a' }}>Categorization</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} required style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Subcategory</label>
                <input value={form.subcategory} onChange={e => setForm(f => ({...f, subcategory: e.target.value}))} placeholder="Optional sub-topic" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tags</label>
                <input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="Rwanda, Kigali, sport…" style={inputStyle} />
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>Comma-separated</p>
              </div>
            </div>

            <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: 800, fontSize: 14, margin: '0 0 18px', color: '#0f172a' }}>Author</h3>
              <select value={form.author_id} onChange={e => setForm(f => ({...f, author_id: e.target.value}))} required style={inputStyle}>
                <option value="">Select Author *</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <Link to="/admin/authors" style={{ display: 'block', marginTop: 10, fontSize: 13, color: '#1a472a', fontWeight: 600 }}>+ Add new author</Link>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
