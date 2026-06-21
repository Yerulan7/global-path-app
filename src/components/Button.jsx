import styles from './Button.module.css';

/**
 * variant: 'primary' | 'ghost' | 'clay'
 * size: 'md' | 'sm'
 */
export default function Button({ children, variant = 'ghost', size = 'md', fullWidth = false, onClick, className = '' }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.full : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
