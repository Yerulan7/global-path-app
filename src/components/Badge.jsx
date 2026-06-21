import styles from './Badge.module.css';

/**
 * tone: 'pine' | 'terracotta'
 */
export default function Badge({ children, tone = 'pine' }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
