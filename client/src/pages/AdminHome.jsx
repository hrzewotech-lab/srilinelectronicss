import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpenText,
  Boxes,
  CheckCircle2,
  CircleHelp,
  Images,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../api/axios';

const contentSources = [
  { key: 'slides', label: 'Hero Slides', endpoint: '/hero?all=true', responseKey: 'slides', icon: Images },
  { key: 'blogs', label: 'Blog Posts', endpoint: '/blog?all=true', responseKey: 'blogs', icon: BookOpenText },
  { key: 'products', label: 'Products', endpoint: '/products?all=true', responseKey: 'products', icon: Boxes },
  { key: 'services', label: 'Services', endpoint: '/services?all=true', responseKey: 'services', icon: Sparkles },
  { key: 'members', label: 'Team Members', endpoint: '/team?all=true', responseKey: 'members', icon: Users },
  { key: 'faqs', label: 'FAQs', endpoint: '/faqs?all=true', responseKey: 'faqs', icon: CircleHelp },
];

const trafficData = [
  { day: 'Mon', visits: 1240, inquiries: 18 },
  { day: 'Tue', visits: 1380, inquiries: 22 },
  { day: 'Wed', visits: 1290, inquiries: 16 },
  { day: 'Thu', visits: 1510, inquiries: 27 },
  { day: 'Fri', visits: 1740, inquiries: 31 },
  { day: 'Sat', visits: 1600, inquiries: 24 },
  { day: 'Sun', visits: 1870, inquiries: 34 },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
}

export default function AdminHome() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      const results = await Promise.allSettled(contentSources.map((source) => api.get(source.endpoint)));

      if (!mounted) return;

      const nextSummary = {};
      results.forEach((result, index) => {
        const source = contentSources[index];
        const items = result.status === 'fulfilled' ? result.value.data?.[source.responseKey] || [] : [];
        nextSummary[source.key] = {
          total: items.length,
          active: items.filter((item) => item.isActive !== false).length,
        };
      });

      setSummary(nextSummary);
      setLoading(false);
    };

    loadSummary();

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => {
    const values = Object.values(summary);
    const totalContent = values.reduce((count, item) => count + item.total, 0);
    const activeContent = values.reduce((count, item) => count + item.active, 0);

    return {
      totalContent,
      activeContent,
      inactiveContent: Math.max(totalContent - activeContent, 0),
      publishRate: totalContent ? Math.round((activeContent / totalContent) * 100) : 0,
    };
  }, [summary]);

  const contentData = contentSources.map((source) => ({
    name: source.label.replace(' ', '\n'),
    total: summary[source.key]?.total || 0,
    active: summary[source.key]?.active || 0,
  }));

  const statCards = [
    { label: 'Total Content', value: totals.totalContent, detail: 'Managed records', icon: Activity },
    { label: 'Published', value: totals.activeContent, detail: `${totals.publishRate}% active content`, icon: CheckCircle2 },
    { label: 'Needs Review', value: totals.inactiveContent, detail: 'Hidden or inactive', icon: CircleHelp },
  ];

  return (
    <div className="admin-dashboard">
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back, {user?.name || 'Admin'}</h2>
          <p className="muted-text">
            Monitor content, publishing health, and quick performance signals from one clean control center.
          </p>
        </div>
        <div className="dashboard-health">
          <span>{loading ? 'Syncing' : 'Live'}</span>
          <strong>{totals.publishRate}%</strong>
          <small>Publishing health</small>
        </div>
      </section>

      <section className="stat-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="stat-card" key={stat.label}>
              <div className="stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <span>{stat.label}</span>
                <strong>{loading ? '--' : stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="admin-panel-card analytics-card">
          <div className="admin-card-header">
            <div>
              <p className="eyebrow">Analytics</p>
              <h2>Weekly engagement</h2>
            </div>
            <span className="admin-chip">Last 7 days</span>
          </div>
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trafficData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="visits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="visits" stroke="#2563eb" fill="url(#visits)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-panel-card content-card">
          <div className="admin-card-header">
            <div>
              <p className="eyebrow">Content</p>
              <h2>Content status</h2>
            </div>
          </div>
          <div className="chart-shell compact">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={contentData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#475569" radius={[6, 6, 0, 0]} />
                <Bar dataKey="active" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="quick-grid">
        {contentSources.map((source) => {
          const Icon = source.icon;
          const item = summary[source.key] || { total: 0, active: 0 };
          return (
            <article className="quick-card" key={source.key}>
              <Icon size={19} />
              <div>
                <strong>{source.label}</strong>
                <span>{loading ? 'Loading...' : `${item.active} active of ${item.total}`}</span>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
