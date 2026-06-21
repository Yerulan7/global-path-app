import styles from './Nav.module.css';
import Badge from './Badge';

export default function Nav({ items = [], activeRoute = '/' }) {
  return (
    <nav className={styles.nav}>
      {items.map((item) => {
        const isActive = item.route === activeRoute;
        return (
          <a key={item.route} href={item.route} className={`${styles.item} ${isActive ? styles.active : ''}`}>
            <span className={styles.label}>{item.label}</span>
            {item.badge != null && <Badge tone="terracotta">{item.badge}</Badge>}
          </a>
        );
      })}
    </nav>
  );
}
