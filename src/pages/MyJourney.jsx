import { useState } from 'react';
import styles from './MyJourney.module.css';
import Card from '../components/Card';

// ── Foundation steps ──────────────────────────────────────────────────────────

const FOUNDATION = [
  { label: 'Profile complete',    done: true },
  { label: 'GPA entered',         done: true },
  { label: 'City selected',       done: true },
  { label: 'Diploma uploaded',    done: true },
  { label: 'GPA verified',        done: true },
  { label: 'Get Dichiarazione',   done: false, current: true },
  { label: 'Apostille diploma',   done: false },
  { label: 'Sworn translation',   done: false },
];
const DONE_COUNT = FOUNDATION.filter(s => s.done).length;

// ── University step data ──────────────────────────────────────────────────────

const UNIS = [
  {
    name: 'Politecnico di Torino', city: 'Turin',
    deadline: 'Apr 30', daysLabel: '11 days', urgency: 'ok',
    steps: [
      { icon: '✓', label: 'Profile & GPA check',    right: 'Complete',       status: 'done' },
      { icon: '✓', label: 'IELTS 6.5 required',     right: '6.8 — OK',       status: 'done' },
      { icon: '→', label: 'Apply at apply.polito.it',right: null,             status: 'current', action: 'Open portal →' },
      { icon: '🔒', label: 'Submit motivation letter',right: 'Needed',        status: 'locked' },
      { icon: '🔒', label: 'Pay application fee',    right: '€0 — free',      status: 'locked' },
      { icon: '🔒', label: 'Admission decision',     right: 'Jun 2026',       status: 'locked' },
      { icon: '🔒', label: 'Confirm enrollment',     right: 'Jul 2026',       status: 'locked' },
      { icon: '🔒', label: 'Apply for DSU',          right: 'Aug 2026',       status: 'locked' },
    ],
  },
  {
    name: 'Università di Trento', city: 'Trento',
    deadline: 'Apr 1', daysLabel: 'MISSED', urgency: 'missed',
    steps: [
      { icon: '✓', label: 'Profile & GPA check',  right: 'Complete',         status: 'done' },
      { icon: '✓', label: 'IELTS 6.0 required',   right: '6.8 — OK',         status: 'done' },
      { icon: '⚠', label: 'Round 1 deadline',     right: 'Missed · 18 days ago', status: 'missed',
        note: '' },
      { icon: '⏳', label: 'Round 2 opens',        right: '61 days',          status: 'warn',
        note: 'Round 2 is more competitive. Strengthen your essay before applying.' },
      { icon: '🔒', label: 'Submit motivation letter', right: 'Needed',       status: 'locked' },
      { icon: '🔒', label: 'Apply at unitn.it',    right: 'Jun 15',           status: 'locked' },
      { icon: '🔒', label: 'Admission decision',   right: 'Jul 2026',         status: 'locked' },
      { icon: '🔒', label: 'Apply for DSU',        right: 'Aug 2026',         status: 'locked' },
    ],
  },
];

// ── Mini calendar ─────────────────────────────────────────────────────────────

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function Calendar({ year = 2026, month = 3 /* April */ }) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // shift so Mon=0
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 14;
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <button className={styles.calNav}>‹</button>
        <span className={styles.calTitle}>April 2026</span>
        <button className={styles.calNav}>›</button>
      </div>
      <div className={styles.calGrid}>
        {DAYS.map(d => <div key={d} className={styles.calDayName}>{d}</div>)}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`${styles.calCell} ${d === today ? styles.calToday : ''} ${d === null ? styles.calEmpty : ''}`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step row ─────────────────────────────────────────────────────────────────

function StepRow({ step }) {
  const cls = {
    done:    styles.stepDone,
    current: styles.stepCurrent,
    locked:  styles.stepLocked,
    missed:  styles.stepMissed,
    warn:    styles.stepWarn,
  }[step.status] ?? '';

  const icon = step.icon === '🔒' ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ) : step.icon;

  return (
    <>
      <div className={`${styles.stepRow} ${cls}`}>
        <span className={styles.stepIcon}>{icon}</span>
        <span className={styles.stepLabel}>{step.label}</span>
        {step.action
          ? <button className={styles.stepAction}>{step.action}</button>
          : <span className={styles.stepRight}>{step.right}</span>
        }
      </div>
      {step.note && <div className={styles.stepNote}>{step.note}</div>}
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MyJourney() {
  return (
    <div className={styles.page}>

      {/* Foundation steps */}
      <div className={styles.foundationBar}>
        <div className={styles.foundationLeft}>
          <span className={styles.foundationTitle}>Foundation steps</span>
          <span className={styles.foundationSub}>Required for all universities</span>
        </div>
        <span className={styles.foundationCount}>{DONE_COUNT} of {FOUNDATION.length} complete</span>
      </div>
      <div className={styles.foundationChips}>
        {FOUNDATION.map((s, i) => (
          <div
            key={i}
            className={`${styles.chip}
              ${s.done ? styles.chipDone : ''}
              ${s.current ? styles.chipCurrent : ''}
              ${!s.done && !s.current ? styles.chipLocked : ''}
            `}
          >
            {s.done ? `✓ ${s.label}` : s.current ? `→ ${s.label}` : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                {s.label}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Warning banner */}
      <div className={styles.warnBanner}>
        ⏰ Dichiarazione di Valore takes 2–3 months — start this today before it's too late.
      </div>

      {/* Main grid */}
      <div className={styles.grid}>

        {/* LEFT: calendar + uni list */}
        <div className={styles.leftPanel}>
          <Calendar />

          <div className={styles.uniListSection}>
            <div className={styles.uniListEyebrow}>YOUR UNIVERSITIES</div>
            {UNIS.map((u) => (
              <div key={u.name} className={styles.uniListItem}>
                <span className={styles.uniDot} />
                <span className={styles.uniListName}>{u.name}</span>
                <span className={styles.uniActiveBadge}>Active</span>
              </div>
            ))}
            <div className={`${styles.uniListItem} ${styles.uniListLocked}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-ghost)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span className={styles.uniListName}>Add 3rd university</span>
              <span className={styles.plusBadge}>Plus</span>
            </div>
            <a className={styles.upgradeLink}>Upgrade to Plus to track more →</a>
          </div>

          <div className={styles.searchBox}>Search and add university →</div>
        </div>

        {/* RIGHT: university columns */}
        {UNIS.map((uni) => (
          <div key={uni.name} className={styles.uniCol}>
            <div className={styles.uniColHeader}>
              <div>
                <div className={styles.uniColName}>{uni.name}</div>
                <div className={styles.uniColCity}>{uni.city}</div>
              </div>
              <span className={`${styles.deadlineBadge} ${uni.urgency === 'missed' ? styles.deadlineMissed : styles.deadlineOk}`}>
                {uni.deadline} · {uni.daysLabel}
              </span>
            </div>
            <div className={styles.stepList}>
              {uni.steps.map((step, i) => <StepRow key={i} step={step} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
