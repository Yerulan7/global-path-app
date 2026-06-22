import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { fetchPrograms } from '../api/programs';
import styles from './MyChances.module.css';

// ── Arc gauge ─────────────────────────────────────────────────────────────────

function ArcGauge({ pct }) {
  const cx = 100, cy = 100, r = 74;
  const strokeW = 10;
  const startAngle = 135;
  const totalDeg   = 270;
  const fillDeg    = (pct / 100) * totalDeg;

  function polar(angle) {
    const a = (angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function arcPath(fromDeg, toDeg) {
    const s = polar(fromDeg), e = polar(toDeg);
    const span = toDeg - fromDeg;
    const large = span > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackPath = arcPath(startAngle, startAngle + totalDeg);
  const fillPath  = arcPath(startAngle, startAngle + fillDeg);

  return (
    <svg viewBox="0 0 200 200" className={styles.gauge}>
      <path d={trackPath} fill="none" stroke="var(--track-bg)" strokeWidth={strokeW} strokeLinecap="round" />
      <path d={fillPath}  fill="none" stroke="var(--accent-pine)" strokeWidth={strokeW} strokeLinecap="round" />
      <text x={cx} y={cy - 8} textAnchor="middle" className={styles.gaugeNum}>{pct}</text>
      <text x={cx + 24} y={cy - 2} textAnchor="start" className={styles.gaugePct}>%</text>
      <text x={cx} y={cy + 18} textAnchor="middle" className={styles.gaugeLabel}>overall chance</text>
    </svg>
  );
}

// ── Mini horizontal bar ────────────────────────────────────────────────────────

function MiniBar({ label, pct, color }) {
  return (
    <div className={styles.miniBar}>
      <div className={styles.miniBarHeader}>
        <span className={styles.miniBarLabel}>{label}</span>
        <span className={styles.miniBarPct}>{pct}%</span>
      </div>
      <div className={styles.miniTrack}>
        <div className={styles.miniFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Score history line chart ──────────────────────────────────────────────────

function ScoreHistory({ points }) {
  const W = 560, H = 90, PAD = { l: 30, r: 60, t: 20, b: 24 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;
  const minV = Math.min(...points.map(p => p.v)) - 5;
  const maxV = Math.max(...points.map(p => p.v)) + 5;

  function x(i) { return PAD.l + (i / (points.length - 1)) * iW; }
  function y(v) { return PAD.t + iH - ((v - minV) / (maxV - minV)) * iH; }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.v)}`).join(' ');
  const last  = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg}>
      {[0, 0.5, 1].map(t => (
        <line key={t} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + iH * (1 - t)} y2={PAD.t + iH * (1 - t)}
          stroke="var(--line-divider)" strokeWidth="1" />
      ))}
      <path d={pathD} fill="none" stroke="var(--accent-pine)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.v)} r="3.5" fill="var(--accent-pine)" />
          <text x={x(i)} y={y(p.v) - 8} textAnchor="middle" className={styles.chartDot}>{p.v}</text>
          <text x={x(i)} y={H - 4} textAnchor="middle" className={styles.chartLabel}>{p.label}</text>
        </g>
      ))}
      <text x={x(points.length - 1) + 8} y={y(last.v)} className={styles.chartAnnotation} dominantBaseline="middle">
        ↑ +20 pts in 2 weeks
      </text>
    </svg>
  );
}

// ── University breakdown card ─────────────────────────────────────────────────

const PINE  = 'var(--accent-pine)';
const OLIVE = 'var(--accent-olive)';
const TERRA = 'var(--accent-terracotta)';

// Derive per-factor bars from program DB row + student profile (stub values for now)
function programToUniversityCard(prog) {
  const ieltsOk = prog.ielts_min === null || prog.ielts_min <= 6.0;
  const langPct = ieltsOk ? 70 : 40;
  const langColor = ieltsOk ? OLIVE : TERRA;
  return {
    id: prog.id,
    name: prog.university_name,
    city: prog.city,
    programName: prog.name,
    overall: Math.round((82 + 60 + 85 + langPct) / 4),
    ieltsMin: prog.ielts_min,
    factors: [
      { label: 'Essay',     pct: 82,      color: PINE },
      { label: 'Documents', pct: 60,      color: TERRA },
      { label: 'GPA',       pct: 85,      color: OLIVE },
      { label: 'Language',  pct: langPct, color: langColor },
    ],
    note: prog.ielts_min
      ? `IELTS min ${prog.ielts_min} — ${ieltsOk ? 'once submitted, your profile is strong.' : 'your score is missing. This is your biggest risk factor.'}`
      : null,
  };
}

function UniversityCard({ name, city, programName, overall, factors, note }) {
  return (
    <div className={styles.uniCard}>
      <div className={styles.uniHeader}>
        <div>
          <span className={styles.uniName}>{name}</span>
          <span className={styles.uniCity}>{city}</span>
        </div>
        <span className={styles.uniPct}>{overall}%</span>
      </div>
      <div className={styles.uniProgram}>{programName}</div>
      <div className={styles.uniBar}>
        <div className={styles.uniBarFill} style={{ width: `${overall}%` }} />
      </div>
      <div className={styles.factorGrid}>
        {factors.map((f) => (
          <MiniBar key={f.label} label={f.label} pct={f.pct} color={f.color} />
        ))}
      </div>
      {note && <p className={styles.uniNote}>{note}</p>}
    </div>
  );
}

// ── Static data (not from DB yet) ─────────────────────────────────────────────

const factors = [
  { label: 'Essay quality', pct: 82, color: PINE },
  { label: 'Documents',     pct: 60, color: TERRA },
  { label: 'GPA estimate',  pct: 85, color: OLIVE },
  { label: 'Language cert', pct: 40, color: TERRA },
];

const improvements = [
  { action: 'Upload language certificate', pts: '+12 pts', dot: TERRA },
  { action: 'Fix 2 document errors',       pts: '+8 pts',  dot: OLIVE },
  { action: 'Improve essay originality',   pts: '+5 pts',  dot: PINE  },
];

const history = [
  { v: 55, label: 'Mar 1' },
  { v: 61, label: 'Mar 5' },
  { v: 68, label: 'Mar 10' },
  { v: 72, label: 'Mar 15' },
  { v: 75, label: 'Today' },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MyChances() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetchPrograms({ targetCountry: 'IT', degreeLevel: 'bachelor' })
      .then(rows => setPrograms(rows))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const universityCards = programs.map(programToUniversityCard);

  return (
    <div className={styles.layout}>
      {/* LEFT */}
      <div className={styles.left}>

        {/* Admission probability */}
        <Card padding="large">
          <div className={styles.probHeader}>
            <span className={styles.cardTitle}>Admission probability</span>
            <span className={styles.aiPill}>AI-powered</span>
          </div>
          <div className={styles.gaugeWrap}>
            <ArcGauge pct={75} />
          </div>
          <div className={styles.trendBadge}>↑ Good — improving</div>

          <div className={styles.divider} />

          <div className={styles.factorBars}>
            {factors.map((f) => (
              <div key={f.label} className={styles.factorRow}>
                <span className={styles.factorLabel}>{f.label}</span>
                <div className={styles.factorTrack}>
                  <div className={styles.factorFill} style={{ width: `${f.pct}%`, background: f.color }} />
                </div>
                <span className={styles.factorPct}>{f.pct}%</span>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.weakNote}>
            <div className={styles.weakTitle}>⚠ Weakest factor: Language certificate (40%)</div>
            <p className={styles.weakBody}>Upload your IELTS or Duolingo score to boost your chances by ~12 points.</p>
            <a className={styles.pineLink}>Upload certificate →</a>
          </div>
        </Card>

        {/* Score history */}
        <Card padding="large">
          <div className={styles.cardTitle} style={{ marginBottom: 20 }}>Score history</div>
          <ScoreHistory points={history} />
        </Card>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>

        <div className={styles.breakdownHeader}>
          <span className={styles.sectionTitle}>Per university breakdown</span>
          <a className={styles.pineLink}>How is this calculated? →</a>
        </div>

        {loading && (
          <div className={styles.stateMsg}>Loading programs…</div>
        )}

        {error && (
          <div className={styles.stateMsg} style={{ color: 'var(--accent-terracotta)' }}>
            Could not load programs — is the backend running?
          </div>
        )}

        {!loading && !error && universityCards.length === 0 && (
          <div className={styles.stateMsg}>No programs found. Run seed.sql in Supabase.</div>
        )}

        {universityCards.map((u) => (
          <Card key={u.id} padding="compact">
            <UniversityCard {...u} />
          </Card>
        ))}

        {/* How to improve */}
        <Card padding="compact">
          <div className={styles.cardTitle} style={{ marginBottom: 18 }}>↗ How to improve your chances</div>
          <div className={styles.improveList}>
            {improvements.map((item) => (
              <div key={item.action} className={styles.improveRow}>
                <span className={styles.improveDot} style={{ background: item.dot }} />
                <span className={styles.improveAction}>{item.action}</span>
                <span className={styles.improvePts}>{item.pts}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
