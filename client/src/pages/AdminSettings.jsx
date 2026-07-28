import { Bell, LockKeyhole, Palette, Settings } from 'lucide-react';
import { MiniStat } from '../components/AdminUi';

export default function AdminSettings() {
  return (
    <div className="admin-users-page">
      <section className="inner-stat-grid">
        <MiniStat icon={Settings} label="System status" value="Ready" tone="green" />
        <MiniStat icon={LockKeyhole} label="Access level" value="Secure" tone="blue" />
        <MiniStat icon={Bell} label="Notifications" value="On" tone="violet" />
      </section>

      <div className="admin-panel-card settings-panel">
        <div className="admin-card-header">
          <div>
            <p className="eyebrow">Settings</p>
            <h2>Application preferences</h2>
          </div>
          <span className="admin-chip">Configured</span>
        </div>

        <div className="settings-grid">
          <article className="settings-option">
            <Palette size={22} />
            <div>
              <strong>Dashboard appearance</strong>
              <span>Modern green and navy theme with compact admin cards.</span>
            </div>
          </article>
          <article className="settings-option">
            <LockKeyhole size={22} />
            <div>
              <strong>Protected admin routes</strong>
              <span>Admin and super admin permissions stay separated.</span>
            </div>
          </article>
          <article className="settings-option">
            <Bell size={22} />
            <div>
              <strong>Operational alerts</strong>
              <span>Prepared for future notification and review workflows.</span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
