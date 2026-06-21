import { useState } from 'react';
import styles from './DocumentCheck.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pine)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);
const IconWarn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warn-amber)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--error-brick)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-ghost)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);
const IconUpload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--error-brick)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

// ── OCR check data ────────────────────────────────────────────────────────────
const OCR_CHECKS = [
  { label: 'Apostille present',     sub: 'Apostille stamp detected at coordinates (245, 680)',  status: 'ok' },
  { label: 'Issuing authority seal', sub: 'Official seal verified at top-right corner',          status: 'ok' },
  { label: 'GPA field',             sub: 'Score found but scale unclear',                        status: 'warn' },
  { label: 'Certified translation', sub: 'No sworn translation found',                           status: 'error', promo: true },
  { label: 'Dichiarazione di Valore', sub: 'Obtain from Italian Embassy (2–3 months)',           status: 'error' },
];

const STATUS_CHIPS = [
  { label: 'Apostille',    s: 'ok'    },
  { label: 'Seal',         s: 'ok'    },
  { label: 'GPA',          s: 'warn'  },
  { label: 'Translation',  s: 'error' },
  { label: 'Dichiarazione', s: 'error' },
];

// ── Vault documents ───────────────────────────────────────────────────────────
const VAULT_DOCS = [
  { name: 'bachelor_diploma_apostille.pdf', id: '#247', size: '2.4 MB', cat: 'Diploma',    date: 'Mar 10', passed: 2, warn: 1, error: 2 },
  { name: 'transcript_2022_2025.pdf',       id: '#246', size: '1.8 MB', cat: 'Transcript', date: 'Mar 8',  passed: 4, warn: 0, error: 1 },
  { name: 'passport_scan.jpg',              id: '#245', size: '890 KB', cat: 'Identity',   date: 'Mar 5',  passed: 3, warn: 0, error: 0 },
  { name: 'language_certificate_draft.pdf', id: '#244', size: '1.2 MB', cat: 'Language',   date: 'Mar 1',  processing: true },
  { name: 'recommendation_letter_1.pdf',    id: '#243', size: '340 KB', cat: 'Letters',    date: 'Feb 28', passed: 2, warn: 0, error: 0 },
];

const CAT_COLORS = {
  Diploma: 'pine', Transcript: 'olive', Identity: 'muted', Language: 'terracotta', Letters: 'clay',
};

// ── OCR Validator view ────────────────────────────────────────────────────────
function OcrView() {
  return (
    <div className={styles.ocrWrap}>
      {/* File row */}
      <div className={styles.fileRow}>
        <div className={styles.fileLeft}>
          <span className={styles.fileName}>bachelor_diploma_apostille.pdf</span>
          <span className={styles.fileCounts}>
            <span style={{ color: 'var(--warn-amber)' }}>2 warnings</span>
            <span style={{ color: 'var(--ink-ghost)' }}> · </span>
            <span style={{ color: 'var(--error-brick)' }}>2 errors</span>
          </span>
        </div>
        <div className={styles.fileChips}>
          {STATUS_CHIPS.map(c => (
            <span key={c.label} className={`${styles.statusChip} ${styles[`chip_${c.s}`]}`}>
              {c.s === 'ok' ? '✓' : c.s === 'warn' ? '⚠' : '✕'} {c.label}
            </span>
          ))}
        </div>
        <button className={styles.ghostSm}>Upload new version</button>
      </div>

      {/* Split panel */}
      <div className={styles.splitPanel}>
        {/* Document preview */}
        <div className={styles.previewCard}>
          <div className={styles.previewTitle}>Document preview</div>
          <div className={styles.previewDoc}>
            <div className={styles.fakeDiploma}>
              <div className={styles.diplomaTitle}>BACHELOR OF SCIENCE DIPLOMA</div>
              <div className={styles.diplomaField}><span className={styles.fieldLabel}>Name:</span> Ivan Kozlov</div>
              <div className={styles.diplomaField}><span className={styles.fieldLabel}>University:</span> Nazarbayev University</div>
              <div className={styles.diplomaField}><span className={styles.fieldLabel}>GPA:</span> 3.85</div>
              <div className={styles.diplomaPlaceholder}>[Lorem ipsum diploma text content…]</div>
              <div className={styles.diplomaStampArea}>
                <div className={styles.diplomaStamp} />
              </div>
              <div className={styles.diplomaSignArea}>
                <div className={styles.signBox} />
              </div>
            </div>
          </div>
          <div className={styles.previewLegend}>
            <span><span className={styles.legendDotOk} /> Verified</span>
            <span><span className={styles.legendDotWarn} /> Warning</span>
          </div>
        </div>

        {/* Analysis panel */}
        <div className={styles.analysisPanel}>
          <div className={styles.analysisHeader}>
            <div>
              <div className={styles.analysisFileName}>bachelor_diploma_apostille.pdf</div>
              <div className={styles.analysisMeta}>Document ID #247 · Uploaded 5 days ago</div>
            </div>
            <span className={styles.warnBadge}>2 warnings</span>
          </div>

          <div className={styles.checkList}>
            {OCR_CHECKS.map((c, i) => (
              <div key={i}>
                <div className={styles.checkItem}>
                  <div className={styles.checkText}>
                    <div className={styles.checkLabel}>{c.label}</div>
                    <div className={styles.checkSub}>{c.sub}</div>
                  </div>
                  <div className={styles.checkIcon}>
                    {c.status === 'ok'    && <IconCheck />}
                    {c.status === 'warn'  && <IconWarn />}
                    {c.status === 'error' && <IconX />}
                  </div>
                </div>
                {c.promo && (
                  <div className={styles.promoBar}>
                    <div className={styles.promoText}>
                      <div className={styles.promoTitle}>Order certified translation</div>
                      <div className={styles.promoSub}>Via our partner translators · From €35 · 48h delivery</div>
                    </div>
                    <button className={styles.promoBtn}>Order now →</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.actionNote}>
            ⚠ Action required — Resolve flagged issues before submitting. Dichiarazione di Valore takes 2–3 months.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Vault card ─────────────────────────────────────────────────────────────────
function VaultCard({ doc }) {
  return (
    <div className={styles.vaultCard}>
      <div className={styles.vaultCardTop}>
        <div className={styles.vaultIcon}><IconDoc /></div>
        <div className={styles.vaultMeta}>
          <div className={styles.vaultName}>{doc.name}</div>
          <div className={styles.vaultSub}>{doc.id} · {doc.size}</div>
        </div>
      </div>
      <div className={styles.vaultRow2}>
        <span className={`${styles.catBadge} ${styles[`cat_${CAT_COLORS[doc.cat]}`]}`}>{doc.cat}</span>
        <span className={styles.vaultDate}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:4}}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {doc.date}
        </span>
      </div>
      {doc.processing ? (
        <div className={styles.processingBadge}>⏳ Processing…</div>
      ) : (
        <div className={styles.statusCounts}>
          {doc.passed > 0 && <span className={styles.countOk}>✓ {doc.passed} passed</span>}
          {doc.warn  > 0 && <span className={styles.countWarn}>⚠ {doc.warn} warning</span>}
          {doc.error > 0 && <span className={styles.countErr}>✕ {doc.error} error</span>}
        </div>
      )}
      <div className={styles.vaultActions}>
        <button className={styles.viewBtn}><IconEye /> View</button>
        <button className={styles.iconBtn}><IconDownload /></button>
        <button className={styles.iconBtn}><IconTrash /></button>
      </div>
    </div>
  );
}

// ── Digital Vault view ────────────────────────────────────────────────────────
function VaultView() {
  const [q, setQ] = useState('');
  return (
    <div className={styles.vaultWrap}>
      <div className={styles.vaultSearch}>
        <div className={styles.searchBar}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-ghost)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className={styles.searchInput} placeholder="Search documents…" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className={styles.catSelect}>
          All categories
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      <div className={styles.vaultGrid}>
        {VAULT_DOCS
          .filter(d => d.name.includes(q.toLowerCase()))
          .map((d, i) => <VaultCard key={i} doc={d} />)}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DocumentCheck() {
  const [tab, setTab] = useState('ocr');

  return (
    <div className={styles.page}>
      {/* Header card */}
      <div className={styles.headerCard}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>Document Center</div>
          <div className={styles.headerSub}>
            {tab === 'ocr' ? 'AI-powered verification for Italian university requirements' : 'Your secure document library with version history'}
          </div>
        </div>
        <button className={styles.uploadBtn}><IconUpload /> Upload document</button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'ocr' ? styles.tabActive : ''}`} onClick={() => setTab('ocr')}>
          OCR Validator
        </button>
        <button className={`${styles.tab} ${tab === 'vault' ? styles.tabActive : ''}`} onClick={() => setTab('vault')}>
          Digital Vault <span className={styles.tabCount}>5</span>
        </button>
      </div>

      {tab === 'ocr'   && <OcrView />}
      {tab === 'vault' && <VaultView />}
    </div>
  );
}
