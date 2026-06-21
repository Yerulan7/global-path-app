import { Outlet, NavLink, useLocation } from 'react-router-dom';
import Badge from './Badge';
import styles from './AppShell.module.css';

const NAV_ITEMS = [
  { label: 'Home',           to: '/' },
  { label: 'AI Advisor',     to: '/advisor' },
  { label: 'Document Check', to: '/documents', badge: 2 },
  { label: 'Essay Analyst',  to: '/essay' },
  { label: 'My Chances',     to: '/chances' },
  { label: 'Budget Planner', to: '/budget' },
  { label: 'My Journey',     to: '/journey', badge: 2 },
];

const PAGE_TITLES = {
  '/':          'Overview',
  '/chances':   'My Chances',
  '/budget':    'Budget Planner',
  '/journey':   'My Journey',
  '/settings':  'Settings',
  '/advisor':   'AI Advisor',
  '/documents': 'Document Check',
  '/essay':     'Essay Analyst',
};

export default function AppShell() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Overview';

  return (
    <div className={styles.shell}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>GP</div>
          <span className={styles.logoWord}>Global Path</span>
        </div>

        <div className={styles.navSection}>
          <div className={styles.eyebrow}>NAVIGATE</div>
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navActive : ''}`
                }
              >
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge != null && <Badge tone="terracotta">{item.badge}</Badge>}
              </NavLink>
            ))}
          </nav>
        </div>

        <NavLink to="/settings" className={styles.userRow}>
          <div className={styles.avatar}>IK</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>Ivan Kozlov</div>
            <div className={styles.userSub}>Settings</div>
          </div>
        </NavLink>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        <div className={styles.topbar}>
          <span className={styles.topbarLabel}>{title}</span>
          <div className={styles.topbarRight}>
            <div className={styles.syncStatus}>
              <span className={styles.syncDot} />
              Synced just now
            </div>
            <div className={styles.claudePill}>Powered by Claude</div>
          </div>
        </div>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
