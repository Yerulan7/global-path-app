import { useState } from 'react';
import Card from '../components/Card';
import styles from './BudgetPlanner.module.css';

const CITIES = ['Turin', 'Bologna', 'Milan', 'Trento', 'Rome'];

const CITY_DATA = {
  Turin:   { rent: 420 },
  Bologna: { rent: 450 },
  Milan:   { rent: 650 },
  Trento:  { rent: 400 },
  Rome:    { rent: 550 },
};

const BUDGET = 900;

const CITY_TABLE = [
  { city: 'Turin',   rent: 420, minTotal: 690,  fits: true  },
  { city: 'Trento',  rent: 400, minTotal: 645,  fits: true  },
  { city: 'Bologna', rent: 450, minTotal: 730,  fits: true  },
  { city: 'Rome',    rent: 550, minTotal: 865,  fits: true  },
  { city: 'Milan',   rent: 650, minTotal: 1000, fits: false },
];

export default function BudgetPlanner() {
  const [city, setCity] = useState('Turin');
  const [expenses, setExpenses] = useState({ Food: 160, Transport: 35, Other: 75 });

  const rent  = CITY_DATA[city].rent;
  const total = rent + expenses.Food + expenses.Transport + expenses.Other;
  const spare = BUDGET - total;
  const fits  = spare >= 0;
  const pct   = Math.min((total / BUDGET) * 100, 100);

  function setExp(k, v) { setExpenses(prev => ({ ...prev, [k]: v })); }

  return (
    <div className={styles.page}>

      {/* City selector */}
      <Card padding="compact" className={styles.cityCard}>
        <div className={styles.eyebrow}>SELECT CITY</div>
        <div className={styles.cityPills}>
          {CITIES.map(c => (
            <button
              key={c}
              className={`${styles.cityPill} ${c === city ? styles.cityPillActive : ''}`}
              onClick={() => setCity(c)}
            >
              {c === city ? `${c} ✓` : c}
            </button>
          ))}
        </div>
      </Card>

      {/* Summary stats */}
      <div className={styles.stats}>
        <Card padding="compact" className={styles.statCard}>
          <div className={styles.statEyebrow}>RENT (AVG)</div>
          <div className={styles.statBig}>€{rent}</div>
          <div className={styles.statSub}>shared room</div>
        </Card>
        <Card padding="compact" className={styles.statCard}>
          <div className={styles.statEyebrow}>TOTAL / MONTH</div>
          <div className={styles.statBig}>€{total}</div>
          <div className={styles.statSub}>all expenses</div>
        </Card>
        <Card padding="compact" className={styles.statCard}>
          <div className={styles.statEyebrow}>BUDGET FIT</div>
          <div className={`${styles.statBig} ${fits ? styles.statFitOk : styles.statFitOver}`}>
            {fits ? '✓ OK' : '✕ Over'}
          </div>
          <div className={styles.statSub}>{fits ? `€${spare} to spare` : `€${-spare} over budget`}</div>
        </Card>
      </div>

      {/* Adjust expenses */}
      <Card padding="large">
        <div className={styles.eyebrow}>ADJUST EXPENSES</div>

        <div className={styles.sliders}>
          <SliderRow label="Rent" value={rent} min={200} max={800} disabled
            onChange={() => {}} note="based on city average" />
          {Object.entries(expenses).map(([k, v]) => (
            <SliderRow key={k} label={k} value={v} min={0} max={k === 'Food' ? 400 : 200}
              onChange={(val) => setExp(k, val)} />
          ))}
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Monthly total</span>
          <span className={styles.totalValue}>€{total} / €{BUDGET}</span>
        </div>
        <div className={styles.totalTrack}>
          <div
            className={`${styles.totalFill} ${!fits ? styles.totalFillOver : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      {/* Status note */}
      <div className={`${styles.statusNote} ${fits ? styles.statusOk : styles.statusOver}`}>
        {fits
          ? `✓ You have €${spare}/month to spare. ${city} is on track!`
          : `✕ You are €${-spare}/month over budget. Consider a cheaper city.`}
      </div>

      {/* Find flatmate promo */}
      <Card padding="compact">
        <div className={styles.promoInner}>
          <div className={styles.promoLeft}>
            <div className={styles.promoTitle}>Find a flatmate in {city}</div>
            <p className={styles.promoBody}>
              Join 47 other students currently searching for shared housing in {city}. Split rent and find your community.
            </p>
          </div>
          <div className={styles.promoRight}>
            <button className={styles.promoBtn}>Find flatmates →</button>
            <div className={styles.promoSub}>47 active listings</div>
          </div>
        </div>
      </Card>

      {/* City comparison table */}
      <Card padding="compact">
        <div className={styles.eyebrow}>CITY COMPARISON</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>City</th>
              <th className={styles.th}>Rent avg</th>
              <th className={styles.th}>Min total</th>
              <th className={styles.th}>Fits €{BUDGET}</th>
            </tr>
          </thead>
          <tbody>
            {CITY_TABLE.map((row) => (
              <tr key={row.city} className={`${styles.tr} ${row.city === city ? styles.trActive : ''}`}>
                <td className={styles.td}>{row.city}</td>
                <td className={styles.td}>€{row.rent}</td>
                <td className={styles.td}>€{row.minTotal}</td>
                <td className={styles.td}>
                  <span className={row.fits ? styles.fitOk : styles.fitOver}>
                    {row.fits ? '⊙' : '⊗'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Share */}
      <div className={styles.shareRow}>
        <button className={styles.shareBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share budget report
          <span className={styles.pdfBadge}>PDF</span>
        </button>
        <div className={styles.shareNote}>Generates a PDF with your budget breakdown and city comparison</div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, onChange, disabled, note }) {
  return (
    <div className={styles.sliderRow}>
      <span className={styles.sliderLabel}>{label}</span>
      <input
        type="range" min={min} max={max} value={value}
        disabled={disabled}
        className={`${styles.slider} ${disabled ? styles.sliderDisabled : ''}`}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span className={styles.sliderValue}>€{value}</span>
    </div>
  );
}
