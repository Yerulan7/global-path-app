import { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import StatBar from '../components/StatBar';
import styles from './Home.module.css';

// ── Mock data ─────────────────────────────────────────────────────────────────

const user = { firstName: 'Ivan' };

const urgentDeadline = {
  title: 'DSU Scholarship application opens',
  school: 'Politecnico di Torino',
  city: 'Turin',
  note: 'Apply right after enrollment confirmation',
  daysAway: 1,
  countdown: { days: 0, hours: 14, mins: 32 },
};

const aiNudge = {
  body: "Ivan, you haven't uploaded a language certificate yet. The Duolingo English Test is accepted at Politecnico di Torino and takes about an hour — it's the fastest option for your timeline.",
  suggestions: ['Take Duolingo test →', 'What other tests are accepted? →'],
};

const readiness = { score: 75, missing: ['language certificate'], stepsCompletePct: 38 };

const profileStrength = [
  { label: 'Academics', pct: 90, tone: 'pine' },
  { label: 'Language',  pct: 65, tone: 'olive' },
  { label: 'Documents', pct: 40, tone: 'terracotta' },
];

const checklist = [
  { name: 'Diploma (apostille)',      status: 'verified', note: 'Verified' },
  { name: 'Issuing authority seal',   status: 'verified', note: 'Verified' },
  { name: 'GPA field',                status: 'warning',  note: 'Unclear scale' },
  { name: 'Sworn translation',        status: 'missing',  note: 'Missing' },
  { name: 'Dichiarazione di Valore',  status: 'missing',  note: 'Missing' },
];

const STATUS = {
  verified: { glyph: '✓', color: 'var(--accent-pine)' },
  warning:  { glyph: '⚠', color: 'var(--warn-amber)' },
  missing:  { glyph: '✕', color: 'var(--error-brick)' },
};

const quickActions = [
  {
    label: 'Chat with AI Advisor',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pine)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></svg>,
  },
  {
    label: 'Upload a document',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pine)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M12 4l-4 4M12 4l4 4M4 18v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1"/></svg>,
  },
  {
    label: 'Analyse my essay',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pine)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h8l4 4v14H6V3z"/><path d="M9 12h6M9 16h6"/></svg>,
  },
  {
    label: 'Check my budget',
    icon: <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--accent-pine)', lineHeight: 1 }}>€</span>,
  },
];

function pad(n) { return String(n).padStart(2, '0'); }

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [countdown, setCountdown] = useState(urgentDeadline.countdown);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, mins } = prev;
        mins--;
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return { days: 0, hours: 0, mins: 0 };
        return { days, hours, mins };
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.content}>
      {/* LEFT COLUMN */}
      <div className={styles.leftCol}>

        {/* Header */}
        <div>
          <p className={styles.greeting}>Good morning, {user.firstName}.</p>
          <h1 className={styles.h1}>
            Your DSU scholarship deadline is{' '}
            <em className={styles.h1Accent}>tomorrow.</em>
          </h1>
          <p className={styles.meta}>
            {urgentDeadline.school} · {urgentDeadline.city} · {urgentDeadline.note}
          </p>
        </div>

        {/* Deadline card */}
        <Card padding="large">
          <div className={styles.urgentRow}>
            <div className={styles.urgentLabel}>
              <span className={styles.urgentDot} />
              <span className={styles.urgentText}>URGENT</span>
            </div>
            <span className={styles.daysAway}>{urgentDeadline.daysAway} day away</span>
          </div>
          <div className={styles.deadlineTitle}>{urgentDeadline.title}</div>
          <div className={styles.countdownRow}>
            {[
              { value: pad(countdown.days),  label: 'DAYS' },
              { value: pad(countdown.hours), label: 'HOURS' },
              { value: pad(countdown.mins),  label: 'MINS' },
            ].map(({ value, label }) => (
              <div key={label} className={styles.countdownTile}>
                <span className={styles.countdownNum}>{value}</span>
                <span className={styles.countdownLabel}>{label}</span>
              </div>
            ))}
          </div>
          <div className={styles.btnRow}>
            <Button variant="primary" fullWidth>View DSU guide →</Button>
            <Button variant="ghost">Add to calendar</Button>
          </div>
        </Card>

        {/* AI nudge */}
        <Card padding="compact">
          <div className={styles.cardHeader}>
            <div className={styles.aiLeft}>
              <div className={styles.aiIcon}>GP</div>
              <span className={styles.cardTitle}>AI Advisor</span>
            </div>
            <span className={styles.cardTs}>Just now</span>
          </div>
          <p className={styles.aiBody}>{aiNudge.body}</p>
          <div className={styles.chips}>
            {aiNudge.suggestions.map((s) => <Button key={s} variant="clay" size="sm">{s}</Button>)}
          </div>
        </Card>

        {/* Readiness */}
        <Card padding="large">
          <div className={styles.cardHeader}>
            <span className={styles.eyebrowInline}>READINESS SCORE</span>
            <a className={styles.pineLink}>My Chances →</a>
          </div>
          <div className={styles.readinessRow}>
            <div className={styles.scoreBlock}>
              <span className={styles.scoreBig}>75</span>
              <span className={styles.scoreOf}>/100</span>
            </div>
            <div className={styles.missingAlert}>
              <span className={styles.warnIcon}>⚠</span>
              <span>Missing: {readiness.missing[0]}</span>
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${readiness.score}%` }} />
          </div>
          <div className={styles.readinessFooter}>
            <span className={styles.stepsLabel}>{readiness.stepsCompletePct}% of application steps complete</span>
            <span className={styles.deltaLabel}>↑ +20 pts this week</span>
          </div>
        </Card>
      </div>

      {/* RIGHT RAIL */}
      <div className={styles.rightRail}>

        {/* Profile strength */}
        <Card padding="compact">
          <div className={styles.cardTitleSans}>Profile strength</div>
          <div className={styles.subLabel}>Based on your answers</div>
          <div className={styles.statBars}>
            {profileStrength.map((s) => <StatBar key={s.label} label={s.label} pct={s.pct} tone={s.tone} />)}
          </div>
          <div className={styles.amberNote}>Upload your documents to raise this score from 40% to 80%.</div>
        </Card>

        {/* Document checklist */}
        <Card padding="compact">
          <div className={styles.cardHeader}>
            <span className={styles.cardTitleSans}>Document checklist</span>
            <Badge tone="pine">3 / 5</Badge>
          </div>
          <div>
            {checklist.map((item, i) => {
              const s = STATUS[item.status];
              return (
                <div key={item.name} className={`${styles.checkRow} ${i < checklist.length - 1 ? styles.checkRowBorder : ''}`}>
                  <span className={styles.checkName}>{item.name}</span>
                  <span className={styles.checkStatus} style={{ color: s.color }}>{s.glyph} {item.note}</span>
                </div>
              );
            })}
          </div>
          <Button variant="ghost" fullWidth className={styles.mt16}>Go to Document Check →</Button>
        </Card>

        {/* Quick actions */}
        <Card padding="compact">
          <div className={styles.cardTitleSans} style={{ marginBottom: 16 }}>Quick actions</div>
          {quickActions.map((a) => (
            <div key={a.label} className={styles.actionRow}>
              <div className={styles.actionIcon}>{a.icon}</div>
              <span className={styles.actionLabel}>{a.label}</span>
            </div>
          ))}
        </Card>

        {/* Quiet stat */}
        <p className={styles.quietStat}>
          <span className={styles.quietStatNum}>450 students</span>
          {' '}from Kazakhstan are applying to Italy this season. All data anonymised.
        </p>
      </div>
    </div>
  );
}
