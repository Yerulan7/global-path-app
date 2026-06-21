import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './Settings.module.css';

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: 'Ivan Kozlov',
    email: 'ivan.k@email.com',
    phone: '+7 777 123 4567',
    country: 'Kazakhstan',
  });

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>Account Settings</h2>
      <p className={styles.pageSub}>Manage your profile, security, and preferences</p>

      {/* Profile info */}
      <Card padding="large" className={styles.section}>
        <h3 className={styles.sectionTitle}>Profile Information</h3>
        <form onSubmit={handleSave} className={styles.form}>
          <Field label="FULL NAME" value={profile.fullName}
            onChange={v => setProfile(p => ({ ...p, fullName: v }))} />
          <Field label="EMAIL ADDRESS" type="email" value={profile.email}
            onChange={v => setProfile(p => ({ ...p, email: v }))} />
          <Field label="PHONE NUMBER" type="tel" value={profile.phone}
            onChange={v => setProfile(p => ({ ...p, phone: v }))} />

          <div className={styles.field}>
            <label className={styles.label}>COUNTRY OF ORIGIN</label>
            <div className={styles.selectWrap}>
              <select className={styles.select}
                value={profile.country}
                onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}>
                <option>Kazakhstan</option>
                <option>Russia</option>
                <option>Ukraine</option>
                <option>Uzbekistan</option>
                <option>Other</option>
              </select>
              <span className={styles.selectCaret}>▾</span>
            </div>
          </div>

          <Button variant="primary" fullWidth>
            {saved ? '✓ Saved!' : 'Save changes'}
          </Button>
        </form>
      </Card>

      {/* Change password */}
      <Card padding="large" className={styles.section}>
        <h3 className={styles.sectionTitle}>Change Password</h3>
        <form className={styles.form} onSubmit={e => e.preventDefault()}>
          <Field label="CURRENT PASSWORD" type="password" value={pw.current}
            onChange={v => setPw(p => ({ ...p, current: v }))} />
          <Field label="NEW PASSWORD" type="password" value={pw.next}
            onChange={v => setPw(p => ({ ...p, next: v }))} />
          <Field label="CONFIRM NEW PASSWORD" type="password" value={pw.confirm}
            onChange={v => setPw(p => ({ ...p, confirm: v }))} />

          <div className={styles.pwHint}>
            Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
          </div>
          <Button variant="primary" fullWidth>Update password</Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card padding="large" className={styles.section}>
        <h3 className={styles.sectionTitle}>Notifications</h3>
        <div className={styles.toggleList}>
          {[
            { label: 'Deadline reminders',  sub: '7, 3, and 1 day before each deadline', on: true },
            { label: 'AI Advisor updates',  sub: 'When your advisor has new suggestions', on: true },
            { label: 'Document alerts',     sub: 'When a document needs attention',       on: true },
            { label: 'Weekly progress digest', sub: 'Every Monday at 9 AM',             on: false },
          ].map((t) => (
            <Toggle key={t.label} {...t} />
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card padding="large" className={styles.section}>
        <h3 className={`${styles.sectionTitle} ${styles.danger}`}>Danger zone</h3>
        <p className={styles.dangerSub}>These actions are irreversible. Proceed with caution.</p>
        <div className={styles.dangerRow}>
          <div>
            <div className={styles.dangerLabel}>Delete account</div>
            <div className={styles.dangerDesc}>Permanently delete your account and all data.</div>
          </div>
          <button className={styles.dangerBtn}>Delete account</button>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function Toggle({ label, sub, on: defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleMeta}>
        <div className={styles.toggleLabel}>{label}</div>
        <div className={styles.toggleSub}>{sub}</div>
      </div>
      <button
        className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
        onClick={() => setOn(v => !v)}
        aria-checked={on}
        role="switch"
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}
