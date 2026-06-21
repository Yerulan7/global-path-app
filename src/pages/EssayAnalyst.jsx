import { useState } from 'react';
import styles from './EssayAnalyst.module.css';

// ── Essay text with highlighted spans ─────────────────────────────────────────
const ESSAY_SEGMENTS = [
  { text: 'I am writing to express my strong interest in the Master of Science in Engineering program at Politecnico di Torino.', hl: 'ai' },
  { text: ' Ever since I was young, I have been passionate about engineering and innovation.' },
  { text: '\n\nDuring my undergraduate studies at Nazarbayev University, I maintained a GPA of 3.85 while leading several research projects in sustainable energy systems.' },
  { text: ' My capstone project on solar panel optimization', hl: 'template' },
  { text: ' won the university\'s Best Engineering Project award in 2025.' },
  { text: '\n\nWhat draws me to Politecnico di Torino is its world-class research facilities and commitment to sustainable innovation.' },
  { text: ' I am particularly interested in Professor Rossi\'s work on renewable energy integration,', hl: 'template' },
  { text: ' which aligns perfectly with my career goals.' },
  { text: '\n\nI believe that my background in energy systems, combined with my leadership experience and passion for sustainability, makes me an excellent fit for your program.' },
  { text: ' I am excited about the opportunity to contribute to the university\'s research community', hl: 'weak' },
  { text: ' while developing my skills further.' },
  { text: '\n\nThank you for considering my application. I look forward to the possibility of joining Politecnico di Torino and contributing to its mission of advancing engineering excellence.' },
];

const HL_COLORS = {
  ai:       { bg: 'rgba(162,59,47,0.10)',  border: 'var(--error-brick)' },
  template: { bg: 'rgba(122,138,79,0.12)', border: 'var(--accent-olive)' },
  weak:     { bg: 'rgba(169,118,42,0.10)', border: 'var(--warn-amber)' },
};

function EssayText({ filter }) {
  return (
    <div className={styles.essayText}>
      {ESSAY_SEGMENTS.map((seg, i) => {
        const lines = seg.text.split('\n\n');
        return lines.map((line, j) => {
          const content = seg.hl && (filter === 'all' || filter === seg.hl) ? (
            <mark key={`${i}-${j}`} className={styles.hl} style={{
              background: HL_COLORS[seg.hl].bg,
              boxShadow: `inset 0 -2px 0 ${HL_COLORS[seg.hl].border}`,
            }}>{line}</mark>
          ) : line;
          return j < lines.length - 1
            ? <span key={`${i}-${j}`}>{content}<br /><br /></span>
            : <span key={`${i}-${j}`}>{content}</span>;
        });
      })}
    </div>
  );
}

// ── Paragraph breakdown ───────────────────────────────────────────────────────
const PARAGRAPHS = [
  { num: 1, title: 'Opening paragraph', words: 28, score: 62, status: 'warn',
    expanded: true,
    suggestions: ['Generic opening detected', 'Start with a specific achievement or moment'] },
  { num: 2, title: 'Academic background', words: 52, score: 88, status: 'ok' },
  { num: 3, title: 'University fit',       words: 38, score: 85, status: 'ok' },
  { num: 4, title: 'Personal motivation',  words: 46, score: 54, status: 'error' },
  { num: 5, title: 'Closing',              words: 33, score: 71, status: 'warn' },
];

const StatusIcon = ({ s }) => s === 'ok'
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pine)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
  : s === 'warn'
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warn-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error-brick)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

// ── Mini arc for score breakdown ───────────────────────────────────────────────
function MiniArc({ pct }) {
  const cx = 48, cy = 48, r = 34, sw = 7;
  const total = 270, fill = (pct / 100) * total;
  const start = 135;
  function polar(a) { const rad = (a - 90) * Math.PI / 180; return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }; }
  function arc(from, to) {
    const s = polar(from), e = polar(to), lg = (to - from) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`;
  }
  return (
    <svg viewBox="0 0 96 96" className={styles.miniArc}>
      <path d={arc(start, start + total)} fill="none" stroke="var(--track-bg)" strokeWidth={sw} strokeLinecap="round" />
      <path d={arc(start, start + fill)}  fill="none" stroke="var(--accent-pine)" strokeWidth={sw} strokeLinecap="round" />
      <text x={cx} y={cx - 4} textAnchor="middle" className={styles.miniArcNum}>{pct}%</text>
      <text x={cx} y={cx + 12} textAnchor="middle" className={styles.miniArcSub}>chance</text>
    </svg>
  );
}

// ── Score breakdown right panel ───────────────────────────────────────────────
const SCORE_FACTORS = [
  { label: 'Essay quality', pct: 82, color: 'var(--accent-pine)',       weight: '×35%', pts: 82 },
  { label: 'Documents',     pct: 60, color: 'var(--accent-terracotta)', weight: '×30%', pts: 60 },
  { label: 'GPA estimate',  pct: 85, color: 'var(--accent-olive)',      weight: '×25%', pts: 85 },
  { label: 'Language cert', pct: 40, color: 'var(--accent-terracotta)', weight: '×10%', pts: 40 },
];

const CRITERIA_SCORES = [
  { title: 'STRUCTURE & FLOW',     badge: 'Good',       score: 82, color: 'var(--accent-pine)',  desc: 'Clear paragraphing and smooth transitions throughout' },
  { title: 'LOGIC & ARGUMENTATION',badge: 'Needs work', score: 71, color: 'var(--warn-amber)',   desc: 'Some claims need stronger supporting evidence' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EssayAnalyst() {
  const [view, setView]   = useState('feedback'); // 'feedback' | 'score'
  const [filter, setFilter] = useState('all');
  const [inlineOn, setInlineOn] = useState(true);
  const [expanded, setExpanded] = useState({ 1: true });
  const [essay, setEssay] = useState('');

  function toggleSection(num) {
    setExpanded(prev => ({ ...prev, [num]: !prev[num] }));
  }

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <div className={styles.pageTitle}>Essay Analyst</div>
          <div className={styles.pageSub}>AI-powered feedback with inline suggestions and tone analysis</div>
        </div>
        <div className={styles.viewToggle}>
          <button className={`${styles.viewBtn} ${view === 'feedback' ? styles.viewBtnActive : ''}`} onClick={() => setView('feedback')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/></svg>
            Inline feedback
          </button>
          <button className={`${styles.viewBtn} ${view === 'score' ? styles.viewBtnActive : ''}`} onClick={() => setView('score')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Score breakdown
          </button>
        </div>
      </div>

      {/* ── INLINE FEEDBACK VIEW ── */}
      {view === 'feedback' && (
        <div className={styles.grid}>
          {/* Left: essay with highlights */}
          <div className={styles.leftPanel}>
            <div className={styles.feedbackBar}>
              <div className={styles.feedbackLeft}>
                <span className={styles.fbLabel}>Inline feedback</span>
                <button
                  className={`${styles.onOff} ${inlineOn ? styles.onOffOn : ''}`}
                  onClick={() => setInlineOn(v => !v)}
                >
                  {inlineOn ? 'ON' : 'OFF'}
                </button>
              </div>
              <span className={styles.wordCount}>176 words · 4 highlights</span>
            </div>

            <div className={styles.filterChips}>
              {[
                { key: 'all',      label: 'All issues (4)' },
                { key: 'ai',       label: 'AI-detected (1)',  icon: '⚡' },
                { key: 'template', label: 'Template match (1)', icon: '⊞' },
                { key: 'weak',     label: 'Weak argument (1)', icon: '⚠' },
              ].map(f => (
                <button key={f.key}
                  className={`${styles.filterChip} ${filter === f.key ? styles.filterChipActive : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.icon && <span className={styles.filterIcon}>{f.icon}</span>}{f.label}
                </button>
              ))}
            </div>

            <div className={styles.essayCard}>
              {inlineOn ? <EssayText filter={filter} /> : (
                <div className={styles.essayText}>
                  {ESSAY_SEGMENTS.map((s, i) => s.text).join('')}
                </div>
              )}
            </div>

            <div className={styles.legend}>
              <span className={styles.legendItem}><span className={styles.swatch} style={{ background: HL_COLORS.ai.bg, boxShadow: `inset 0 -2px 0 ${HL_COLORS.ai.border}` }} />AI-detected</span>
              <span className={styles.legendItem}><span className={styles.swatch} style={{ background: HL_COLORS.weak.bg, boxShadow: `inset 0 -2px 0 ${HL_COLORS.weak.border}` }} />Weak argument</span>
            </div>
          </div>

          {/* Right: paragraph breakdown + tone */}
          <div className={styles.rightPanel}>
            <div className={styles.rightCard}>
              <div className={styles.rightTitle}>Paragraph breakdown</div>
              <div className={styles.rightSub}>5 paragraphs · 177 words total</div>

              <div className={styles.paraList}>
                {PARAGRAPHS.map(p => (
                  <div key={p.num} className={styles.paraItem}>
                    <div className={styles.paraRow} onClick={() => toggleSection(p.num)}>
                      <span className={styles.paraToggle}>{expanded[p.num] ? '▾' : '›'}</span>
                      <span className={styles.paraTitle}>§{p.num}. {p.title}</span>
                      <span className={styles.paraScore}>{p.score}</span>
                      <StatusIcon s={p.status} />
                    </div>
                    {expanded[p.num] && p.words && (
                      <div className={styles.paraExpanded}>
                        <div className={styles.paraWords}>{p.words} words</div>
                        {p.suggestions?.map(s => (
                          <div key={s} className={styles.suggestion}>
                            <span className={styles.suggIcon}>💡</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.toneHeader}>
                <span className={styles.rightTitle}>Tone analysis</span>
                <span className={styles.aiPill}>AI-powered</span>
              </div>
              {[
                { label: 'Formality',    pct: 82, color: 'var(--accent-pine)' },
                { label: 'Enthusiasm',   pct: 65, color: 'var(--accent-olive)' },
                { label: 'Confidence',   pct: 71, color: 'var(--warn-amber)' },
                { label: 'Authenticity', pct: 54, color: 'var(--accent-terracotta)' },
              ].map(t => (
                <div key={t.label} className={styles.toneRow}>
                  <div className={styles.toneHeader2}>
                    <span className={styles.toneLabel}>{t.label}</span>
                    <span className={styles.tonePct}>{t.pct}%</span>
                  </div>
                  <div className={styles.toneTrack}>
                    <div className={styles.toneFill} style={{ width: `${t.pct}%`, background: t.color }} />
                  </div>
                </div>
              ))}
              <p className={styles.toneNote}>Your tone is appropriately formal but lacks authenticity. Use more personal anecdotes and specific examples.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SCORE BREAKDOWN VIEW ── */}
      {view === 'score' && (
        <div className={styles.grid}>
          {/* Left: textarea + criteria */}
          <div className={styles.leftPanel}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreCardHeader}>
                <span className={styles.rightTitle}>Motivation letter</span>
                <span className={styles.wordCount}>247 words</span>
              </div>
              <textarea
                className={styles.essayInput}
                placeholder="Paste or write your motivation letter here…"
                value={essay}
                onChange={e => setEssay(e.target.value)}
                rows={12}
              />
              <button className={styles.analyseBtn}>Analyse with AI →</button>
              <button className={styles.compareBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Compare with accepted essay sample
                <span className={styles.uniTag}>Politecnico di Torino</span>
              </button>
            </div>

            <div className={styles.criteriaCard}>
              <div className={styles.criteriaEyebrow}>4 EVALUATION CRITERIA</div>
              {[
                { title: 'Structure & Flow',       sub: 'Logical organization and transitions between ideas' },
                { title: 'Logic & Argumentation',  sub: 'Strength of reasoning and evidence presented' },
                { title: 'University Fit',          sub: 'Alignment with program values and requirements' },
                { title: 'Originality',             sub: 'Uniqueness and authenticity of content (AI-check)' },
              ].map(c => (
                <div key={c.title} className={styles.criteriaItem}>
                  <div className={styles.criteriaTitle}>{c.title}</div>
                  <div className={styles.criteriaSub}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: scores */}
          <div className={styles.rightPanel}>
            <div className={styles.rightCard}>
              <div className={styles.contributionTitle}>Your contribution to admission score</div>
              <div className={styles.contributionSub}>Politecnico di Torino · MSc Engineering</div>

              <div className={styles.arcFactors}>
                <MiniArc pct={75} />
                <div className={styles.factorList}>
                  {SCORE_FACTORS.map(f => (
                    <div key={f.label} className={styles.factorRow}>
                      <span className={styles.factorLabel}>{f.label}</span>
                      <div className={styles.factorTrack}>
                        <div className={styles.factorFill} style={{ width: `${f.pct}%`, background: f.color }} />
                      </div>
                      <span className={styles.factorPct}>{f.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.trendLine}>↑ Strong — minor improvements left.</div>
              <a className={styles.pineLink}>See full breakdown → My Chances</a>
            </div>

            <div className={styles.rightCard}>
              <div className={styles.calcTitle}>How your score is calculated:</div>
              <div className={styles.calcTable}>
                {SCORE_FACTORS.map(f => (
                  <div key={f.label} className={styles.calcRow}>
                    <span className={styles.calcLabel}>{f.label}</span>
                    <span className={styles.calcWeight}>{f.weight}</span>
                    <span className={styles.calcPts}>{f.pts} pts</span>
                  </div>
                ))}
                <div className={`${styles.calcRow} ${styles.calcTotal}`}>
                  <span className={styles.calcLabel}>Weighted total</span>
                  <span />
                  <span className={styles.calcPts}>75 / 100</span>
                </div>
              </div>
            </div>

            {CRITERIA_SCORES.map(c => (
              <div key={c.title} className={styles.rightCard}>
                <div className={styles.criteriaScoreHeader}>
                  <span className={styles.criteriaEyebrow2}>{c.title}</span>
                  <span className={styles.criteriaBadge} style={{
                    background: c.badge === 'Good' ? 'var(--accent-pine-soft)' : 'var(--warn-amber-bg)',
                    color: c.badge === 'Good' ? 'var(--accent-pine)' : 'var(--warn-amber-text)',
                  }}>{c.badge}</span>
                </div>
                <div className={styles.criteriaScore}>{c.score} / 100</div>
                <div className={styles.criteriaTrack}>
                  <div className={styles.criteriaFill} style={{ width: `${c.score}%`, background: c.color }} />
                </div>
                <div className={styles.criteriaDesc}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
