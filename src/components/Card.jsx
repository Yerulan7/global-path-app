import styles from './Card.module.css';

export default function Card({ children, className = '', padding = 'default' }) {
  return (
    <div className={`${styles.card} ${styles[`pad_${padding}`]} ${className}`}>
      {children}
    </div>
  );
}
