import styles from './StatBar.module.css';

const TONE_COLORS = {
  pine:       'var(--accent-pine)',
  olive:      'var(--accent-olive)',
  terracotta: 'var(--accent-terracotta)',
};

export default function StatBar({ label, pct, tone = 'pine' }) {
  const fill = TONE_COLORS[tone] ?? TONE_COLORS.pine;
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{pct}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${pct}%`, background: fill }} />
      </div>
    </div>
  );
}
