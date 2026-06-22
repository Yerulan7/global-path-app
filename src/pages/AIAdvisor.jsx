import { useState, useRef, useEffect } from 'react';
import { sendToAdvisor } from '../api/advisor';
import styles from './AIAdvisor.module.css';

// ── Simple bold-text renderer ─────────────────────────────────────────────────
function RichText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p.split('\n').map((line, j, arr) => (
              <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
            ))
      )}
    </>
  );
}

// ── Initial messages ──────────────────────────────────────────────────────────
const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: 'Welcome to Global Path AI!\n\nI\'m your expert consultant for university admissions in Italy. Your profile: Engineering/IT Master\'s, English B2+.\n\nWhat would you like to explore first?',
    time: '2:34 PM',
  },
];

const SUGGESTED_PRIMARY = [
  'How do I get Dichiarazione di Valore? →',
  'Book consulate appointment →',
  'What is a sworn translation? →',
  'DSU scholarship step by step →',
];

const SUGGESTED_SECONDARY = [
  'Best programs in Turin',
  'How do I get Dichiarazione di Valore?',
  'DSU scholarship eligibility',
  'Italian student visa D 2026',
  'Nostrification vs apostille',
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function AIAdvisor() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text) {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = { role: 'user', content: text.trim(), time: now };
    const aiPlaceholder = { role: 'assistant', content: '', time: now };

    setMessages(prev => [...prev, userMsg, aiPlaceholder]);
    setDraft('');
    setLoading(true);

    // Build history in the shape the backend expects: { role, content }
    const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

    try {
      await sendToAdvisor(history, (delta) => {
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });
      });
    } catch {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: 'Something went wrong. Try again.' };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(draft); }
  }

  return (
    <div className={styles.page}>
      {/* Sub-header */}
      <div className={styles.subHeader}>
        <div className={styles.subLeft}>
          <span className={styles.subTitle}>AI Advisor</span>
          <span className={styles.onlinePill}>● Online</span>
          <span className={styles.subMeta}>Powered by Claude Sonnet · {messages.length} messages</span>
        </div>
        <button className={styles.exportBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>

      {/* Chat scroll area */}
      <div className={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgRowUser : ''}`}>
            {msg.role === 'assistant' && <div className={styles.aiAvatar}>AI</div>}
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAi}`}>
              {msg.role === 'assistant' && msg.content === '' && loading
                ? <span className={styles.cursor}>▍</span>
                : <RichText text={msg.content} />
              }
              <div className={styles.msgTime}>{msg.time}</div>
            </div>
            {msg.role === 'user' && <div className={styles.userAvatar}>U</div>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className={styles.inputWrap}>
        <div className={styles.contextBar}>
          <span className={styles.contextLabel}>Your context:</span>
          {['GPA 4.8', 'Turin', 'Engineering'].map(tag => (
            <span key={tag} className={styles.contextTag}>{tag}</span>
          ))}
          <a className={styles.editLink}>Edit →</a>
        </div>

        <div className={styles.inputBox}>
          <textarea
            className={styles.textarea}
            placeholder="Ask about programs, deadlines, scholarships…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            disabled={loading}
          />
          <div className={styles.inputActions}>
            <button className={styles.attachBtn} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <button className={`${styles.sendBtn} ${loading ? styles.sendBtnLoading : ''}`} onClick={() => send(draft)} disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.inputMeta}>
          <span className={styles.inputHint}>Shift + Enter for new line</span>
          <span className={styles.inputPowered}>Powered by Claude Sonnet</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className={styles.suggestions}>
        <div className={styles.suggestEyebrow}>BASED ON YOUR DOCUMENT CHECK</div>
        <div className={styles.suggestPrimary}>
          {SUGGESTED_PRIMARY.map(s => (
            <button key={s} className={styles.suggestChip} onClick={() => send(s)} disabled={loading}>{s}</button>
          ))}
        </div>
        <div className={styles.suggestSecondary}>
          {SUGGESTED_SECONDARY.map(s => (
            <button key={s} className={styles.suggestSmall} onClick={() => send(s)} disabled={loading}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
