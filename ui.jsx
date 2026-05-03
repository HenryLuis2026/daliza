// ui.jsx — DALIZA shared primitives: ProductImage placeholder, icons, chrome.

// ── Placeholder product image ────────────────────────────────────────────────
// A subtly-striped panel with a monospace label. Replace with real photos later.
function ProductImage({ tone = 'ivory', label = '', ratio = 4/5, width, height, look, soft = false, style = {} }) {
  const t = TONE[tone] || TONE.ivory;
  const w = width || 400;
  const h = height || Math.round(w / ratio);
  const stripeId = `s_${tone}_${Math.round(w)}_${Math.round(h)}`;
  // dark tones get a light label
  const isDark = ['black', 'cocoa', 'navy', 'olive', 'taupe', 'rust'].includes(tone);
  const labelColor = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(26,22,20,0.55)';
  return (
    <div style={{
      width: '100%', aspectRatio: `${ratio}`, position: 'relative', overflow: 'hidden',
      background: t.bg, ...style,
    }}>
      <svg width="100%" height="100%" preserveAspectRatio="none"
           viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={stripeId} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="14" height="14" fill={t.bg} />
            <line x1="0" y1="0" x2="0" y2="14" stroke={t.stripe} strokeWidth="6" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#${stripeId})`} opacity={soft ? 0.5 : 1} />
      </svg>
      {/* label */}
      <div style={{
        position: 'absolute', left: 12, bottom: 10,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 9.5, letterSpacing: '0.12em', color: labelColor,
      }}>
        {label}
      </div>
      {look && (
        <div style={{
          position: 'absolute', right: 12, top: 10,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 9.5, letterSpacing: '0.12em', color: labelColor,
        }}>
          {look}
        </div>
      )}
    </div>
  );
}

// ── Icons (stroke, 1.4) ──────────────────────────────────────────────────────
const Icon = {
  menu: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  search: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke={c} strokeWidth="1.3"/><path d="M14 14l3.5 3.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  bag: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 6h10l-1 11H6L5 6z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/><path d="M7.5 6c0-1.5 1.1-2.5 2.5-2.5S12.5 4.5 12.5 6" stroke={c} strokeWidth="1.3"/></svg>,
  user: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7.5" r="3" stroke={c} strokeWidth="1.3"/><path d="M4 17c1-3 3.5-4.5 6-4.5s5 1.5 6 4.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  heart: (c='currentColor', filled=false) => <svg width="20" height="20" viewBox="0 0 20 20" fill={filled ? c : 'none'}><path d="M10 16.5s-6-3.4-6-7.8C4 6.7 5.7 5 7.7 5c1.2 0 2.2.6 2.8 1.6.6-1 1.6-1.6 2.8-1.6 2 0 3.7 1.7 3.7 3.7 0 4.4-7 7.8-7 7.8z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  back: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  filter: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M5 10h10M8 15h4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  grid2: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" stroke={c} strokeWidth="1.2"/><rect x="11" y="3" width="6" height="6" stroke={c} strokeWidth="1.2"/><rect x="3" y="11" width="6" height="6" stroke={c} strokeWidth="1.2"/><rect x="11" y="11" width="6" height="6" stroke={c} strokeWidth="1.2"/></svg>,
  grid1: (c='currentColor') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="6" stroke={c} strokeWidth="1.2"/><rect x="3" y="11" width="14" height="6" stroke={c} strokeWidth="1.2"/></svg>,
  plus: (c='currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  minus: (c='currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  chev: (c='currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevDown: (c='currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: (c='currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5L6 10l5-6" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shipping: (c='currentColor') => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="7" width="11" height="9" stroke={c} strokeWidth="1.2"/><path d="M13 10h4l3 3v3h-7v-6z" stroke={c} strokeWidth="1.2" strokeLinejoin="round"/><circle cx="6" cy="17" r="1.6" stroke={c} strokeWidth="1.2"/><circle cx="16" cy="17" r="1.6" stroke={c} strokeWidth="1.2"/></svg>,
  return: (c='currentColor') => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11a7 7 0 1 1 2 4.9" stroke={c} strokeWidth="1.2" strokeLinecap="round"/><path d="M4 6v5h5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  leaf: (c='currentColor') => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 18c0-7 4-13 14-14-1 10-7 14-14 14z" stroke={c} strokeWidth="1.2" strokeLinejoin="round"/><path d="M4 18c4-3 8-6 12-10" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
};

// ── Top bar (logo + actions) ────────────────────────────────────────────────
function TopBar({ onMenu, onSearch, onBag, onAccount, bagCount = 0, dark = false }) {
  const c = dark ? D_PALETTE.d_text : D_PALETTE.ink;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 18px', height: 48, position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: c }}>
        <button onClick={onMenu} style={btnReset}>{Icon.menu(c)}</button>
        <button onClick={onSearch} style={btnReset}>{Icon.search(c)}</button>
      </div>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
        fontStyle: 'italic', fontWeight: 500, letterSpacing: '0.18em',
        fontSize: 22, color: c,
      }}>Daliza</div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', color: c }}>
        <button onClick={onAccount} style={btnReset}>{Icon.user(c)}</button>
        <button onClick={onBag} style={{ ...btnReset, position: 'relative' }}>
          {Icon.bag(c)}
          {bagCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -6,
              minWidth: 16, height: 16, borderRadius: 999,
              background: c, color: dark ? D_PALETTE.ink : D_PALETTE.ivory,
              fontSize: 9.5, fontFamily: 'ui-monospace, monospace',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            }}>{bagCount}</span>
          )}
        </button>
      </div>
    </div>
  );
}

const btnReset = {
  background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: 'inherit',
};

// For buttons that wrap card-style block content (ProductImage etc.). Avoids
// inline-flex collapsing children to 0 size, and reverts the spacing.
const btnResetBlock = {
  background: 'transparent', border: 0, padding: 0, margin: 0, cursor: 'pointer',
  display: 'block', textAlign: 'left', color: 'inherit', font: 'inherit',
};

// Pressable container that's NOT a <button>, so it can contain interactive
// children (heart icon, etc) without nested-button DOM warnings.
function Pressable({ onClick, children, style = {} }) {
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick && onClick(e); }
  };
  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={onKey}
      style={{ cursor: 'pointer', display: 'block', ...style }}>
      {children}
    </div>
  );
}

// ── Mono label ──────────────────────────────────────────────────────────────
function MonoLabel({ children, style = {} }) {
  return <span style={{
    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
    ...style,
  }}>{children}</span>;
}

// ── Section title (italic serif) ────────────────────────────────────────────
function SectionTitle({ children, style = {} }) {
  return <h2 style={{
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontStyle: 'italic', fontWeight: 400,
    fontSize: 30, lineHeight: 1.1, margin: 0, letterSpacing: '-0.005em',
    ...style,
  }}>{children}</h2>;
}

// ── Primary block button ────────────────────────────────────────────────────
function BlockButton({ children, onClick, dark = false, secondary = false, disabled = false, style = {} }) {
  const bg = secondary ? 'transparent' : (dark ? D_PALETTE.d_text : D_PALETTE.ink);
  const fg = secondary ? (dark ? D_PALETTE.d_text : D_PALETTE.ink) : (dark ? D_PALETTE.ink : D_PALETTE.ivory);
  const border = secondary ? `1px solid ${dark ? D_PALETTE.d_text20 : D_PALETTE.ink20}` : 'none';
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width: '100%', height: 50,
      background: bg, color: fg, border,
      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1, padding: 0,
      ...style,
    }}>{children}</button>
  );
}

Object.assign(window, { ProductImage, Icon, TopBar, MonoLabel, SectionTitle, BlockButton, btnReset, btnResetBlock, Pressable });
