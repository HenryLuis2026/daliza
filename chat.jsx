// chat.jsx — DALIZA chat stylist · v2 con protección al cliente
// Diseñado para reducir incertidumbre, no presionar a comprar.
// Ejes: transparencia · acompañamiento · seguridad de decisión · políticas claras · pago consciente.

const STOCK = (() => {
  const out = {};
  PRODUCTS.forEach(p => {
    out[p.id] = {};
    p.tones.forEach(t => {
      out[p.id][t] = {};
      p.sizes.forEach((s, i) => {
        const seed = (p.id.charCodeAt(2) + t.length + i * 3) % 7;
        out[p.id][t][s] = seed === 0 ? 0 : seed === 1 ? 3 : 8;
      });
    });
  });
  return out;
})();
const stockOf = (pid, tone, size) => (STOCK[pid]?.[tone]?.[size] ?? 0);

// Fit + sizing reference (datos reales de tallaje, modelos con medidas)
const FIT_DATA = {
  default: {
    chart: [
      { size: 'XS', bust: '82', waist: '64', hip: '90' },
      { size: 'S',  bust: '86', waist: '68', hip: '94' },
      { size: 'M',  bust: '90', waist: '72', hip: '98' },
      { size: 'L',  bust: '94', waist: '76', hip: '102' },
    ],
    model: { name: 'Marta', height: '1,72m', wears: 'S', notes: 'normalmente talla S–M' },
    fit: 'Tallaje fiel. Si dudas entre dos, elige la más grande.',
  },
};

// Razones por las que Lía recomienda — concretas, basadas en propiedades reales
const REASONS = {
  evento:   ['Caída fluida y sin transparencias', 'Tejido que no arruga al sentarte', 'Funciona con sandalia plana o tacón'],
  oficina:  ['Resiste varios usos sin lavarlo', 'Fácil de combinar con sastrería', 'Tejido que no marca'],
  diario:   ['Suave al tacto y transpirable', 'Lavable en casa', 'Te lo pondrás muchas veces'],
  general:  ['Tejido natural certificado', 'Confeccionado con cuidado', 'Pieza que dura años'],
};

// Detección de intención
function detectIntent(text) {
  const q = text.toLowerCase();
  if (/(hola|buenas|hi|hey)/.test(q)) return { kind: 'greet' };
  if (/(devolu|cambio|reembolso)/.test(q)) return { kind: 'returns' };
  if (/(env[ií]o|llega|cu[áa]ndo)/.test(q)) return { kind: 'shipping' };
  if (/(material|tejido|composici[óo]n|hecho)/.test(q)) return { kind: 'fabric' };
  if (/(talla|medida)/.test(q)) return { kind: 'sizing' };
  if (/(precio|cuesta)/.test(q)) return { kind: 'price' };
  if (/(boda|evento|fiesta|cena)/.test(q)) return { kind: 'occasion', mood: 'evento' };
  if (/(oficina|trabajo)/.test(q)) return { kind: 'occasion', mood: 'oficina' };
  if (/(diario|casual|d[íi]a)/.test(q)) return { kind: 'occasion', mood: 'diario' };
  if (/(no s[ée]|ayuda|stylist)/.test(q)) return { kind: 'guide' };
  if (/(pensarlo|guardar|m[áa]s tarde)/.test(q)) return { kind: 'save' };
  for (const c of CATEGORIES) {
    if (c.id !== 'all' && q.includes(c.name.toLowerCase())) return { kind: 'cat', cat: c.id };
  }
  if (/(camisa|blusa)/.test(q)) return { kind: 'cat', cat: 'shirts' };
  if (/(pantal|falda|sastre)/.test(q)) return { kind: 'cat', cat: 'tailor' };
  if (/(jersey|punto)/.test(q)) return { kind: 'cat', cat: 'knit' };
  if (/(vestido)/.test(q)) return { kind: 'cat', cat: 'dresses' };
  return { kind: 'unknown' };
}

// ── Avatar + bubble primitives ──
function StylistAvatar({ size = 28 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: 'linear-gradient(135deg, #d9c9a9 0%, #a08d6e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
      fontWeight: 500, fontSize: size * 0.5, color: '#2a201a', flexShrink: 0,
    }}>L</div>
  );
}

function Bubble({ from = 'stylist', children, time, palette, padding }) {
  const isUser = from === 'user';
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 4,
      flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-end',
    }}>
      {!isUser && <StylistAvatar />}
      <div style={{
        maxWidth: '82%',
        background: isUser ? palette.bubbleUser : palette.bubbleStylist,
        color: isUser ? palette.bubbleUserText : palette.text,
        padding: padding || '10px 14px',
        borderRadius: 16,
        borderTopLeftRadius: !isUser ? 4 : 16,
        borderTopRightRadius: isUser ? 4 : 16,
        fontSize: 14.5, lineHeight: 1.45,
      }}>
        {children}
        {time && <div style={{ marginTop: 4, fontSize: 10, opacity: 0.5, textAlign: 'right', fontFamily: 'ui-monospace, monospace' }}>{time}</div>}
      </div>
    </div>
  );
}

function TypingBubble({ palette }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-end' }}>
      <StylistAvatar />
      <div style={{ background: palette.bubbleStylist, padding: '12px 14px', borderRadius: 16, borderTopLeftRadius: 4, display: 'flex', gap: 4 }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: palette.text40, animation: `dz-bob 1s ${i * 0.15}s infinite` }} />)}
      </div>
    </div>
  );
}

function QuickReplies({ options, onPick, palette }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 0 8px 36px', marginBottom: 4 }}>
      {options.map((o, i) => (
        <button key={i} onClick={() => onPick(o)} style={{
          background: palette.bg, color: palette.accent,
          border: `1px solid ${palette.accent}`,
          padding: '8px 14px', borderRadius: 999,
          fontSize: 13.5, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500,
        }}>{o.label}</button>
      ))}
    </div>
  );
}

// ── Sugerencia con RAZONES ──
function ReasonedProductCard({ product, reasons, palette, onPick, onCompare, onSave, picked }) {
  return (
    <div style={{
      background: palette.bubbleStylist, borderRadius: 16, borderTopLeftRadius: 4,
      overflow: 'hidden', width: 256,
      border: picked ? `1.5px solid ${palette.accent}` : `0.5px solid ${palette.line}`,
    }}>
      <ProductImage tone={product.tones[0]} label={product.label} look={product.look} ratio={4/5} />
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 16, lineHeight: 1.2, color: palette.text }}>
          {product.name}
        </div>
        <div style={{ fontSize: 11.5, color: palette.text60, marginTop: 4 }}>{product.fabric.toLowerCase()}</div>
        <div style={{ marginTop: 8, padding: '8px 10px', background: palette.bg, borderRadius: 8 }}>
          <div style={{ fontSize: 9.5, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', color: palette.text60, textTransform: 'uppercase', marginBottom: 4 }}>Por qué te lo recomiendo</div>
          {reasons.map((r, i) => (
            <div key={i} style={{ fontSize: 11.5, color: palette.text, lineHeight: 1.4, padding: '2px 0' }}>· {r}</div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: palette.text }}>{fmtPrice(product.price)}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onSave(product)} title="Guardar para pensarlo" style={chatBtnStyle(palette, 'ghost')}>Guardar</button>
            <button onClick={() => onPick(product)} style={chatBtnStyle(palette, 'primary')}>Ver detalle</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const chatBtnStyle = (palette, kind = 'primary') => {
  const base = {
    fontFamily: 'inherit', fontSize: 11.5, padding: '7px 12px',
    borderRadius: 8, cursor: 'pointer', fontWeight: 500,
  };
  if (kind === 'primary') return { ...base, background: palette.accent, color: 'white', border: 0 };
  if (kind === 'ghost')   return { ...base, background: 'transparent', color: palette.text, border: `1px solid ${palette.line}` };
  return base;
};

function ProductSuggestionsBubble({ products, mood, palette, onPick, onCompare, onSave, picked }) {
  const reasonsFor = REASONS[mood] || REASONS.general;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, padding: '0 0 8px 36px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {products.map(p => (
          <div key={p.id} style={{ flex: '0 0 auto' }}>
            <ReasonedProductCard
              product={p}
              reasons={reasonsFor}
              palette={palette}
              onPick={onPick}
              onCompare={onCompare}
              onSave={onSave}
              picked={picked === p.id}
            />
          </div>
        ))}
      </div>
      {products.length > 1 && (
        <div style={{ paddingLeft: 36 }}>
          <button onClick={onCompare} style={{ ...chatBtnStyle(palette, 'ghost'), background: palette.bg }}>
            ⇆ Comparar lado a lado
          </button>
        </div>
      )}
    </div>
  );
}

// ── Detalle producto: galería completa, ficha, fit ──
function ProductDetailBubble({ product, palette, onChooseSize, onSave, onAskMore }) {
  const [imgIdx, setImgIdx] = React.useState(0);
  const photos = [
    { caption: 'Frontal · estudio', tone: product.tones[0] },
    { caption: 'Espalda · estudio', tone: product.tones[0] },
    { caption: 'Detalle de tejido (macro real)', tone: product.tones[0] },
    { caption: `En Marta · 1,72m · talla ${FIT_DATA.default.model.wears}`, tone: product.tones[1] || product.tones[0] },
  ];
  return (
    <Bubble palette={palette} padding="0">
      <div style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <ProductImage tone={photos[imgIdx].tone} label={photos[imgIdx].caption.toUpperCase()} ratio={4/5} />
          <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {photos.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{
                width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === imgIdx ? '#1a1614' : 'rgba(26,22,20,0.35)',
                border: 0, padding: 0, cursor: 'pointer', transition: 'width 0.2s',
              }} />
            ))}
          </div>
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 19, lineHeight: 1.15 }}>
            {product.name}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: palette.text, lineHeight: 1.5 }}>
            {product.description}
          </div>

          {/* Ficha técnica honesta */}
          <div style={{ marginTop: 12, padding: '10px 12px', background: palette.bg, borderRadius: 8 }}>
            <FactRow label="Composición" value={product.fabric} palette={palette} />
            <FactRow label="Gramaje" value="240 g/m² · medio-grueso" palette={palette} />
            <FactRow label="Confección" value={product.origin} palette={palette} />
            <FactRow label="Peso prenda" value="≈ 380 g (talla M)" palette={palette} />
            <FactRow label="Cuidados" value={product.care} palette={palette} />
            <FactRow label="Certificación" value="GOTS · OEKO-TEX 100" palette={palette} last />
          </div>

          {/* Fit data — dato real, no opinión */}
          <div style={{ marginTop: 10, padding: '10px 12px', background: palette.bg, borderRadius: 8 }}>
            <div style={{ fontSize: 9.5, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', color: palette.text60, textTransform: 'uppercase', marginBottom: 6 }}>Tallaje</div>
            <div style={{ fontSize: 12, color: palette.text, lineHeight: 1.5 }}>{FIT_DATA.default.fit}</div>
            <div style={{ fontSize: 11.5, color: palette.text60, marginTop: 4 }}>
              Modelo: {FIT_DATA.default.model.name}, {FIT_DATA.default.model.height}, lleva talla {FIT_DATA.default.model.wears}.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <button onClick={onSave} style={{ ...chatBtnStyle(palette, 'ghost'), flex: 1 }}>Guardar y pensarlo</button>
            <button onClick={onAskMore} style={{ ...chatBtnStyle(palette, 'ghost'), flex: 1 }}>Preguntar a Lía</button>
            <button onClick={onChooseSize} style={{ ...chatBtnStyle(palette, 'primary'), flex: 1.2 }}>Elegir talla</button>
          </div>
        </div>
      </div>
    </Bubble>
  );
}

function FactRow({ label, value, palette, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 12,
      padding: '4px 0',
      borderBottom: last ? 'none' : `0.5px solid ${palette.line}`,
      fontSize: 11.5, color: palette.text,
    }}>
      <span style={{ color: palette.text60 }}>{label}</span>
      <span style={{ textAlign: 'right', flex: 1, marginLeft: 8 }}>{value}</span>
    </div>
  );
}

// ── Color (pregunta antes que talla, sin elogios) ──
function ColorPicker({ product, palette, value, onPick }) {
  return (
    <Bubble palette={palette}>
      <div style={{ marginBottom: 8 }}>¿Qué color prefieres? Los tres se confeccionan con el mismo tejido.</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {product.tones.map(t => {
          const on = value === t;
          return (
            <button key={t} onClick={() => onPick(t)} style={{
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 999, background: TONE[t].bg,
                border: on ? `2px solid ${palette.accent}` : `0.5px solid ${palette.line}`,
                boxShadow: on ? `0 0 0 2px ${palette.bg} inset` : 'none',
              }} />
              <span style={{ fontSize: 10, color: palette.text60, textTransform: 'capitalize' }}>{t}</span>
            </button>
          );
        })}
      </div>
    </Bubble>
  );
}

// ── Talla: pregunta tallaje habitual + altura, recomienda con datos ──
function SizingFlowBubble({ product, tone, palette, profile, onSetProfile, onPick }) {
  const [step, setStep] = React.useState(profile.height && profile.usual ? 'pick' : 'ask');
  const [tempHeight, setTempHeight] = React.useState(profile.height || '');
  const [tempUsual, setTempUsual] = React.useState(profile.usual || '');

  if (step === 'ask') {
    return (
      <Bubble palette={palette}>
        <div style={{ marginBottom: 8 }}>Para acertar de talla, dime dos cosas (puedes saltarlo):</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: palette.text60, marginBottom: 4 }}>Tu altura aproximada</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['<1,60m', '1,60–1,70m', '1,70–1,80m', '>1,80m'].map(h => (
              <button key={h} onClick={() => setTempHeight(h)} style={{
                ...chatBtnStyle(palette, tempHeight === h ? 'primary' : 'ghost'),
                background: tempHeight === h ? palette.accent : palette.bg,
              }}>{h}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: palette.text60, marginBottom: 4 }}>Tu talla habitual en otras marcas</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.sizes.map(s => (
              <button key={s} onClick={() => setTempUsual(s)} style={{
                ...chatBtnStyle(palette, tempUsual === s ? 'primary' : 'ghost'),
                background: tempUsual === s ? palette.accent : palette.bg,
                minWidth: 38,
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setStep('pick')} style={chatBtnStyle(palette, 'ghost')}>Saltar</button>
          <button onClick={() => { onSetProfile({ height: tempHeight, usual: tempUsual }); setStep('pick'); }}
            disabled={!tempHeight || !tempUsual}
            style={{ ...chatBtnStyle(palette, 'primary'), opacity: (tempHeight && tempUsual) ? 1 : 0.4 }}>Continuar</button>
        </div>
      </Bubble>
    );
  }

  // pick
  const recommended = profile.usual || tempUsual || null;
  return (
    <Bubble palette={palette}>
      {recommended && (
        <div style={{ marginBottom: 10, padding: '8px 10px', background: palette.bg, borderRadius: 8, fontSize: 12, color: palette.text }}>
          Para tu talla habitual ({recommended}) y tallaje fiel de esta pieza, te recomiendo la <strong>{recommended}</strong>.
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {product.sizes.map(s => {
          const stock = stockOf(product.id, tone, s);
          const sold = stock === 0;
          const isRec = s === recommended;
          return (
            <button key={s} onClick={() => !sold && onPick(s)} style={{
              minWidth: 44, padding: '8px 10px', position: 'relative',
              background: 'transparent',
              color: sold ? palette.text40 : palette.text,
              border: `1px solid ${isRec ? palette.accent : palette.line}`,
              borderWidth: isRec ? 1.5 : 1,
              borderRadius: 8,
              fontSize: 13, fontFamily: 'inherit', cursor: sold ? 'default' : 'pointer',
              textDecoration: sold ? 'line-through' : 'none',
            }}>
              {s}
              {sold && <div style={{ fontSize: 8.5, color: palette.text40, marginTop: 1 }}>agotada</div>}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: palette.text60, lineHeight: 1.5 }}>
        ¿Dudas entre dos tallas? Puedes pedir las dos: <strong style={{ color: palette.text }}>devuelves la que no sin coste</strong>.
      </div>
    </Bubble>
  );
}

// ── Repaso: políticas + reflexión + pago consciente ──
function ReviewBubble({ product, tone, size, palette, onConfirm, onSave, onChange }) {
  const subtotal = product.price;
  const shipping = subtotal >= 150 ? 0 : 8;
  const total = subtotal + shipping;
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(3);

  React.useEffect(() => {
    if (!acknowledged) return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [acknowledged, secondsLeft]);

  const canPay = acknowledged && secondsLeft === 0;

  return (
    <Bubble palette={palette}>
      <div style={{ marginBottom: 10, fontSize: 14 }}>Repasemos antes de pagar — no hay prisa.</div>

      {/* Resumen */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 56, flexShrink: 0 }}>
          <ProductImage tone={tone} label="" ratio={4/5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 15, lineHeight: 1.2 }}>{product.name}</div>
          <div style={{ fontSize: 11, color: palette.text60, marginTop: 2, textTransform: 'capitalize' }}>{tone} · talla {size}</div>
          <button onClick={onChange} style={{ background: 'transparent', border: 0, padding: 0, color: palette.accent, fontSize: 11, cursor: 'pointer', textDecoration: 'underline', marginTop: 4 }}>Cambiar</button>
        </div>
        <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>{fmtPrice(subtotal)}</div>
      </div>

      <div style={{ padding: '6px 0', fontSize: 11.5, display: 'flex', justifyContent: 'space-between', color: palette.text60 }}>
        <span>Envío estándar (3–5 días)</span>
        <span style={{ fontFamily: 'ui-monospace, monospace' }}>{shipping === 0 ? 'Gratis' : fmtPrice(shipping)}</span>
      </div>
      <div style={{ padding: '8px 0 0', borderTop: `0.5px solid ${palette.line}`, display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 500 }}>
        <span>Total</span>
        <span style={{ fontFamily: 'ui-monospace, monospace' }}>{fmtPrice(total)}</span>
      </div>

      {/* Políticas explícitas */}
      <div style={{ marginTop: 12, padding: '10px 12px', background: palette.bg, borderRadius: 8 }}>
        <div style={{ fontSize: 9.5, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', color: palette.text60, textTransform: 'uppercase', marginBottom: 6 }}>Tus derechos</div>
        <PolicyLine icon="↩" text="30 días de devolución sin coste — recogida en casa" palette={palette} />
        <PolicyLine icon="📐" text="Cambio de talla gratis con envío directo" palette={palette} />
        <PolicyLine icon="⚖" text="14 días de derecho de desistimiento (UE)" palette={palette} />
        <PolicyLine icon="🔧" text="Reparación de por vida en nuestro atelier" palette={palette} />
        <PolicyLine icon="🔒" text="Pago seguro 3D Secure · no guardamos tu tarjeta" palette={palette} last />
      </div>

      {/* Confirmación informada */}
      <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12, fontSize: 11.5, color: palette.text, cursor: 'pointer' }}>
        <input type="checkbox" checked={acknowledged} onChange={(e) => { setAcknowledged(e.target.checked); if (e.target.checked) setSecondsLeft(3); }}
          style={{ marginTop: 2, accentColor: palette.accent }} />
        <span>He revisado tejido, talla y políticas. Quiero continuar.</span>
      </label>

      <button onClick={onConfirm} disabled={!canPay} style={{
        marginTop: 12, width: '100%', padding: '13px',
        background: canPay ? palette.text : palette.line,
        color: canPay ? palette.bg : palette.text40,
        border: 0, borderRadius: 10,
        fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500,
        cursor: canPay ? 'pointer' : 'default',
      }}>
        {!acknowledged ? 'Marca la casilla para continuar' : (secondsLeft > 0 ? `Confirmar en ${secondsLeft}s…` : `Confirmar pago · ${fmtPrice(total)}`)}
      </button>

      <button onClick={onSave} style={{ marginTop: 6, width: '100%', padding: '10px', background: 'transparent', color: palette.text60, border: `1px solid ${palette.line}`, borderRadius: 10, fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer' }}>
        Lo pienso · guardar para más tarde
      </button>
    </Bubble>
  );
}

function PolicyLine({ icon, text, palette, last }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '4px 0', borderBottom: last ? 'none' : `0.5px solid ${palette.line}`, fontSize: 11.5, color: palette.text, lineHeight: 1.4 }}>
      <span style={{ width: 16, flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ConfirmationBubble({ product, tone, size, total, palette }) {
  const orderId = 'DZA-' + Math.floor(Math.random() * 90000 + 10000);
  return (
    <Bubble palette={palette}>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.1, marginBottom: 8 }}>Pedido confirmado</div>
      <div style={{ fontSize: 13, color: palette.text60, marginBottom: 10 }}>
        Tu <strong style={{ color: palette.text }}>{product.name}</strong> en {tone}, talla {size}, llegará en 3–5 días.
        Si algo no encaja, lo recogemos en casa.
      </div>
      <div style={{ background: palette.bg, padding: '10px 12px', borderRadius: 10, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: palette.text, display: 'flex', justifyContent: 'space-between', border: `0.5px solid ${palette.line}` }}>
        <span>{orderId}</span>
        <span>{fmtPrice(total)}</span>
      </div>
    </Bubble>
  );
}

// ── Comparación lado a lado ──
function ComparisonBubble({ products, palette, onPickOne, onClose }) {
  return (
    <Bubble palette={palette} padding="12px">
      <div style={{ marginBottom: 10, fontSize: 13 }}>Comparativa honesta:</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${products.length}, 1fr)`, gap: 8 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: palette.bg, borderRadius: 8, overflow: 'hidden' }}>
            <ProductImage tone={p.tones[0]} label="" ratio={4/5} />
            <div style={{ padding: '8px 8px 10px' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 13, lineHeight: 1.15 }}>{p.name}</div>
              <div style={{ fontSize: 10, color: palette.text60, marginTop: 4 }}>{p.fabric.split(',')[0].toLowerCase()}</div>
              <div style={{ fontSize: 10.5, color: palette.text60, marginTop: 2 }}>{p.origin.replace('Confeccionado en ', '').replace('Tejido en ', '')}</div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, marginTop: 6 }}>{fmtPrice(p.price)}</div>
              <button onClick={() => onPickOne(p)} style={{ ...chatBtnStyle(palette, 'primary'), marginTop: 8, width: '100%', fontSize: 10.5 }}>Esta</button>
            </div>
          </div>
        ))}
      </div>
    </Bubble>
  );
}

// ── Saved bubble ──
function SavedBubble({ product, palette }) {
  return (
    <Bubble palette={palette}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 18 }}>🤍</span>
        <div style={{ fontSize: 13 }}>Guardé la <em>{product.name}</em>. Cuando vuelvas, sigue aquí.</div>
      </div>
    </Bubble>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ScreenChat
// ─────────────────────────────────────────────────────────────────────────────
function ScreenChat({ ctx }) {
  const { palette: basePalette, dark, addToCart, go, toggleFav } = ctx;
  const palette = {
    ...basePalette,
    accent: '#7a5d3f',
    bubbleStylist: dark ? '#2a2520' : '#ffffff',
    bubbleUser: dark ? '#5c4a35' : '#e8dec7',
    bubbleUserText: dark ? '#f0eadd' : '#1a1614',
    chatBg: dark ? '#15120f' : '#ebe2d3',
  };

  const [messages, setMessages] = React.useState([]);
  const [quick, setQuick] = React.useState(null);
  const [input, setInput] = React.useState('');
  const [phase, setPhase] = React.useState('opening');
  const [selProduct, setSelProduct] = React.useState(null);
  const [selTone, setSelTone] = React.useState(null);
  const [selSize, setSelSize] = React.useState(null);
  const [mood, setMood] = React.useState(null);
  const [profile, setProfile] = React.useState({ height: null, usual: null });
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  const time = () => { const d = new Date(); return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };

  const stylistSay = (kind, payload) => {
    setQuick(null);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + Math.random(), from: 'stylist', kind, payload, time: time() }]);
    }, 600 + Math.random() * 300);
  };
  const userSay = (text) => setMessages(m => [...m, { id: Date.now() + Math.random(), from: 'user', kind: 'text', payload: { text }, time: time() }]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, quick]);

  React.useEffect(() => {
    const t1 = setTimeout(() => stylistSay('text', { text: 'Hola, soy Lía. Te ayudo a elegir bien — sin prisa.' }), 300);
    const t2 = setTimeout(() => stylistSay('text', { text: 'Cuéntame qué buscas y te enseñaré opciones honestas, con su tejido y su tallaje. Si prefieres pensarlo después, lo guardamos.' }), 1700);
    const t3 = setTimeout(() => setQuick({ context: 'opening', options: [
      { label: '👗 Para un evento', value: 'evento' },
      { label: '☕ Diario, cómodo', value: 'diario' },
      { label: '💼 Para la oficina', value: 'oficina' },
      { label: '🧥 Una prenda concreta', value: 'concreta' },
    ]}), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const suggestForMood = (m) => {
    setMood(m);
    let pool;
    if (m === 'evento') pool = PRODUCTS.filter(p => ['dresses', 'tailor'].includes(p.category));
    else if (m === 'oficina') pool = PRODUCTS.filter(p => ['tailor', 'shirts', 'knit'].includes(p.category));
    else if (m === 'diario') pool = PRODUCTS.filter(p => ['knit', 'denim', 'shirts'].includes(p.category));
    else pool = PRODUCTS;
    const items = pool.slice(0, 3);
    const intros = {
      evento: 'Para un evento, estas tres son honestas: sin transparencias, tejidos que aguantan estar sentada, fáciles de combinar.',
      oficina: 'Para oficina, busca durabilidad y combinación. Estas tres son las que más uso veo:',
      diario: 'Cómodo y favorecedor. Tejidos suaves, lavables en casa, que duran muchos lavados:',
    };
    stylistSay('text', { text: intros[m] || 'Mira estas tres opciones:' });
    setTimeout(() => stylistSay('products', { items: items.map(p => p.id), mood: m }), 1300);
    setPhase('choosing');
  };

  const suggestForCategory = (catId) => {
    const items = PRODUCTS.filter(p => p.category === catId).slice(0, 3);
    const cat = (CATEGORIES.find(c => c.id === catId) || {}).name;
    stylistSay('text', { text: `Estas son nuestras tres en ${cat?.toLowerCase()}. Te explico tejido y origen de cada una.` });
    setTimeout(() => stylistSay('products', { items: items.map(p => p.id), mood: 'general' }), 1300);
    setPhase('choosing');
  };

  const handleQuick = (opt) => {
    userSay(opt.label.replace(/^[^\s]+\s/, ''));
    setQuick(null);
    if (quick.context === 'opening') {
      if (opt.value === 'concreta') {
        stylistSay('text', { text: '¿Qué tipo de prenda?' });
        setTimeout(() => setQuick({ context: 'category', options: CATEGORIES.filter(c => c.id !== 'all').map(c => ({ label: c.name, value: c.id })) }), 1100);
      } else suggestForMood(opt.value);
    } else if (quick.context === 'category') {
      suggestForCategory(opt.value);
    } else if (quick.context === 'after_buy') {
      if (opt.value === 'more') {
        stylistSay('text', { text: 'Si quieres ver más, sin compromiso, te enseño combinaciones. Cuando tú me digas.' });
        setTimeout(() => setQuick({ context: 'opening', options: [
          { label: '👗 Para un evento', value: 'evento' },
          { label: '☕ Diario, cómodo', value: 'diario' },
          { label: '💼 Para la oficina', value: 'oficina' },
        ]}), 1200);
        setPhase('opening'); setSelProduct(null); setSelTone(null); setSelSize(null);
      } else if (opt.value === 'track') {
        stylistSay('text', { text: 'Te aviso por aquí cuando salga del atelier. Y cuando llegue.' });
      } else {
        stylistSay('text', { text: 'Hasta pronto. Si llega algo y no encaja, escríbeme y lo resolvemos.' });
      }
    }
  };

  const handleProductPick = (p) => {
    userSay(`Ver ${p.name}`);
    setSelProduct(p);
    setTimeout(() => stylistSay('detail', { id: p.id }), 600);
    setPhase('detail');
  };

  const handleSave = (p) => {
    toggleFav(p.id);
    stylistSay('saved', { id: p.id });
  };

  const handleCompare = () => {
    if (!mood) return;
    let pool;
    if (mood === 'evento') pool = PRODUCTS.filter(p => ['dresses', 'tailor'].includes(p.category));
    else if (mood === 'oficina') pool = PRODUCTS.filter(p => ['tailor', 'shirts', 'knit'].includes(p.category));
    else if (mood === 'diario') pool = PRODUCTS.filter(p => ['knit', 'denim', 'shirts'].includes(p.category));
    else pool = PRODUCTS;
    stylistSay('compare', { items: pool.slice(0, 3).map(p => p.id) });
  };

  const handleChooseSize = () => {
    setTimeout(() => stylistSay('color', { id: selProduct.id }), 400);
    setPhase('color');
  };

  const handleAskMore = () => {
    stylistSay('text', { text: 'Pregúntame lo que quieras: tallaje, transparencia, lavado, comparación con otra pieza…' });
  };

  const handleColor = (tone) => {
    userSay(`En ${tone}`);
    setSelTone(tone);
    setTimeout(() => stylistSay('sizing', { id: selProduct.id, tone }), 600);
    setPhase('size');
  };

  const handleSize = (size) => {
    userSay(`Talla ${size}`);
    setSelSize(size);
    setTimeout(() => stylistSay('review', { id: selProduct.id, tone: selTone, size }), 700);
    setPhase('review');
  };

  const handleConfirm = () => {
    const total = selProduct.price + (selProduct.price >= 150 ? 0 : 8);
    userSay('He revisado y confirmo');
    addToCart(selProduct.id, selTone, selSize);
    setTimeout(() => stylistSay('confirm', { id: selProduct.id, tone: selTone, size: selSize, total }), 800);
    setTimeout(() => setQuick({ context: 'after_buy', options: [
      { label: '✨ Ver más, sin compromiso', value: 'more' },
      { label: '📦 Seguir mi pedido', value: 'track' },
      { label: '🤍 Eso es todo', value: 'done' },
    ]}), 2400);
    setPhase('confirmed');
  };

  const handleSubmit = () => {
    const text = input.trim();
    if (!text) return;
    userSay(text);
    setInput('');
    setQuick(null);
    const intent = detectIntent(text);
    setTimeout(() => {
      switch (intent.kind) {
        case 'greet': stylistSay('text', { text: '¡Hola! Cuéntame qué buscas, sin prisa.' }); break;
        case 'cat': suggestForCategory(intent.cat); break;
        case 'occasion': suggestForMood(intent.mood); break;
        case 'returns': stylistSay('text', { text: '30 días para devolver sin coste, recogida en casa. 14 días de derecho de desistimiento UE. Sin preguntas.' }); break;
        case 'shipping': stylistSay('text', { text: 'Estándar 3–5 días (gratis +€150) o express 24h (€14). Empaquetado sin plástico.' }); break;
        case 'sizing': stylistSay('text', { text: 'Tallaje fiel a la marca. Si dudas entre dos, puedes pedir las dos y devolver la que no encaje sin coste.' }); break;
        case 'fabric': stylistSay('text', { text: 'Trabajamos lino europeo, lana virgen italiana, cashmere mongol y denim japonés. Cada pieza tiene su ficha completa: composición, gramaje, origen y certificación.' }); break;
        case 'price': stylistSay('text', { text: 'De €75 a €620. El precio refleja el tejido y el atelier — te lo desgloso si quieres.' }); break;
        case 'guide': stylistSay('text', { text: 'Tranquila, vamos paso a paso. ¿Qué situación quieres vestir?' }); break;
        case 'save': stylistSay('text', { text: 'Perfecto, sin prisa. Cuando vuelvas tu selección estará aquí.' }); break;
        default:
          stylistSay('text', { text: 'Cuéntame un poco más: ocasión, qué prenda, o cualquier duda. También puedo enseñarte por categoría.' });
          setTimeout(() => setQuick({ context: 'opening', options: [
            { label: '👗 Para un evento', value: 'evento' },
            { label: '☕ Diario, cómodo', value: 'diario' },
            { label: '💼 Para la oficina', value: 'oficina' },
            { label: '🧥 Una prenda concreta', value: 'concreta' },
          ]}), 1100);
      }
    }, 350);
  };

  const renderMessage = (m) => {
    if (m.from === 'user') return <Bubble key={m.id} from="user" palette={palette} time={m.time}>{m.payload.text}</Bubble>;
    switch (m.kind) {
      case 'text': return <Bubble key={m.id} palette={palette} time={m.time}>{m.payload.text}</Bubble>;
      case 'products':
        return <ProductSuggestionsBubble key={m.id}
          products={m.payload.items.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)}
          mood={m.payload.mood}
          palette={palette}
          picked={selProduct?.id}
          onPick={(p) => phase === 'choosing' && handleProductPick(p)}
          onCompare={handleCompare}
          onSave={handleSave}
        />;
      case 'compare':
        return <ComparisonBubble key={m.id}
          products={m.payload.items.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)}
          palette={palette}
          onPickOne={(p) => phase === 'choosing' && handleProductPick(p)}
        />;
      case 'detail':
        return <ProductDetailBubble key={m.id}
          product={PRODUCTS.find(p => p.id === m.payload.id)}
          palette={palette}
          onChooseSize={() => phase === 'detail' && handleChooseSize()}
          onSave={() => handleSave(PRODUCTS.find(p => p.id === m.payload.id))}
          onAskMore={handleAskMore}
        />;
      case 'color':
        return <ColorPicker key={m.id}
          product={PRODUCTS.find(p => p.id === m.payload.id)}
          palette={palette} value={selTone}
          onPick={(t) => phase === 'color' && handleColor(t)} />;
      case 'sizing':
        return <SizingFlowBubble key={m.id}
          product={PRODUCTS.find(p => p.id === m.payload.id)}
          tone={m.payload.tone} palette={palette}
          profile={profile} onSetProfile={setProfile}
          onPick={(s) => phase === 'size' && handleSize(s)} />;
      case 'review':
        return <ReviewBubble key={m.id}
          product={PRODUCTS.find(p => p.id === m.payload.id)}
          tone={m.payload.tone} size={m.payload.size}
          palette={palette}
          onConfirm={() => phase === 'review' && handleConfirm()}
          onSave={() => { handleSave(PRODUCTS.find(p => p.id === m.payload.id)); stylistSay('text', { text: 'Guardado. Tómate el tiempo que necesites.' }); }}
          onChange={() => { stylistSay('text', { text: '¿Quieres cambiar talla, color o pieza?' }); }}
        />;
      case 'saved':
        return <SavedBubble key={m.id} product={PRODUCTS.find(p => p.id === m.payload.id)} palette={palette} />;
      case 'confirm':
        return <ConfirmationBubble key={m.id}
          product={PRODUCTS.find(p => p.id === m.payload.id)}
          tone={m.payload.tone} size={m.payload.size} total={m.payload.total}
          palette={palette} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: palette.chatBg, color: palette.text }}>
      <style>{`@keyframes dz-bob { 0%,80%,100% { transform: translateY(0); opacity:.4; } 40% { transform: translateY(-3px); opacity:1; } }`}</style>

      <div style={{
        flexShrink: 0, padding: '8px 14px', background: palette.bg,
        borderBottom: `0.5px solid ${palette.line}`,
        display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 5,
      }}>
        <button onClick={() => go('home')} style={{ ...btnReset, color: palette.text, padding: 0 }}>{Icon.back(palette.text)}</button>
        <StylistAvatar size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 18, fontWeight: 500, color: palette.text, lineHeight: 1.1 }}>Lía · Daliza Stylist</div>
          <div style={{ fontSize: 11, color: palette.text60, marginTop: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#5fa14a' }} />
            Asesora real · L–S 10–20h
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ flexShrink: 0, background: palette.bg, padding: '6px 14px 8px', borderBottom: `0.5px solid ${palette.line}`, display: 'flex', gap: 12, justifyContent: 'space-around', fontSize: 10, color: palette.text60, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}>
        <span>30 DÍAS DEVOLUCIÓN</span>
        <span>·</span>
        <span>FOTOS REALES</span>
        <span>·</span>
        <span>FICHA COMPLETA</span>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ alignSelf: 'center', padding: '4px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: 999, marginBottom: 8 }}>
          <span style={{ fontSize: 10.5, color: palette.text60, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>HOY</span>
        </div>
        {messages.map(renderMessage)}
        {typing && <TypingBubble palette={palette} />}
        {quick && <QuickReplies options={quick.options} onPick={handleQuick} palette={palette} />}
      </div>

      <div style={{ flexShrink: 0, padding: '8px 12px 12px', background: palette.bg, borderTop: `0.5px solid ${palette.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: dark ? '#2a2520' : '#fff', border: `0.5px solid ${palette.line}`, borderRadius: 22, padding: '6px 6px 6px 14px' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Escribe a Lía o pregúntale lo que sea…"
            style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 15, color: palette.text, padding: '6px 0', fontFamily: 'inherit' }} />
          <button onClick={handleSubmit} style={{ width: 32, height: 32, borderRadius: 999, background: input.trim() ? palette.accent : palette.line, color: 'white', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L12 7 2 2v4l7 1-7 1v4z" fill="currentColor"/></svg>
          </button>
        </div>
        <div style={{ marginTop: 6, textAlign: 'center', fontSize: 10, color: palette.text60 }}>
          ¿Prefieres pensarlo? Escribe <strong>"guardar"</strong>. Tu selección no se pierde.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenChat });
