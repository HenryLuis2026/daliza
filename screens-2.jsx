// screens-2.jsx — PDP, Bag, Checkout, Lookbook, Search, Menu

// ─────────────────────────────────────────────────────────────────────────────
// PDP — product detail
// ─────────────────────────────────────────────────────────────────────────────
function ScreenPDP({ ctx }) {
  const { route, palette, addToCart, fav, toggleFav } = ctx;
  const product = PRODUCTS.find(p => p.id === route.params.id) || PRODUCTS[0];
  const [tone, setTone] = React.useState(product.tones[0]);
  const [size, setSize] = React.useState(null);
  const [imgIdx, setImgIdx] = React.useState(0);
  const [openSec, setOpenSec] = React.useState('details');
  const [toast, setToast] = React.useState(false);
  const isFav = fav.includes(product.id);

  const images = [
    { tone, label: product.label, look: product.look },
    { tone, label: 'DETALLE · COSTURA', look: null },
    { tone, label: 'CAÍDA', look: null },
    { tone: product.tones[1] || product.tones[0], label: product.label, look: null },
  ];

  const onAdd = () => {
    if (!size) { setSize('__err'); return; }
    addToCart(product.id, tone, size);
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ background: palette.bg, color: palette.text, paddingBottom: 100, position: 'relative' }}>
      {/* Image carousel */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }} onScroll={(e) => {
          const i = Math.round(e.target.scrollLeft / e.target.clientWidth);
          if (i !== imgIdx) setImgIdx(i);
        }}>
          {images.map((img, i) => (
            <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}>
              <ProductImage tone={img.tone} label={img.label} look={img.look} ratio={4/5} />
            </div>
          ))}
        </div>
        <button onClick={() => toggleFav(product.id)} style={{
          ...btnReset, position: 'absolute', top: 14, right: 14,
          width: 38, height: 38, borderRadius: 999,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
        }}>{Icon.heart(D_PALETTE.ink, isFav)}</button>
        {/* dots */}
        <div style={{
          position: 'absolute', bottom: 12, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 6,
        }}>
          {images.map((_, i) => (
            <div key={i} style={{
              width: i === imgIdx ? 14 : 5, height: 5, borderRadius: 3,
              background: i === imgIdx ? D_PALETTE.ink : 'rgba(26,22,20,0.3)',
              transition: 'width 0.2s',
            }} />
          ))}
        </div>
      </div>

      {/* Title block */}
      <div style={{ padding: '22px 22px 0' }}>
        <MonoLabel style={{ color: palette.text60 }}>{(CATEGORIES.find(c => c.id === product.category)||{}).name}</MonoLabel>
        <h1 style={{
          margin: '8px 0 6px',
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontWeight: 400, fontSize: 30, letterSpacing: '-0.005em',
        }}>{product.name}</h1>
        <div style={{ fontSize: 15, color: palette.text }}>{fmtPrice(product.price)}</div>
        <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.55, color: palette.text60 }}>
          {product.description}
        </p>
      </div>

      {/* Color */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <MonoLabel style={{ color: palette.text60 }}>Color</MonoLabel>
          <MonoLabel style={{ color: palette.text }}>{tone}</MonoLabel>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {product.tones.map(t => (
            <button key={t} onClick={() => setTone(t)} style={{
              ...btnReset, width: 32, height: 32, borderRadius: 999,
              padding: 3,
              border: tone === t ? `1px solid ${palette.text}` : `0.5px solid ${palette.line}`,
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: 999, background: TONE[t].bg }} />
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <MonoLabel style={{ color: palette.text60 }}>Talla</MonoLabel>
          <button style={{ ...btnReset, color: palette.text }}>
            <MonoLabel style={{ textDecoration: 'underline' }}>Guía de tallas</MonoLabel>
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.sizes.map(s => {
            const on = size === s;
            const err = size === '__err';
            return (
              <button key={s} onClick={() => setSize(s)} style={{
                ...btnReset, minWidth: 52, height: 44, padding: '0 10px',
                border: `0.5px solid ${on ? palette.text : (err ? '#9a3a2c' : palette.line)}`,
                background: on ? palette.text : 'transparent',
                color: on ? palette.bg : palette.text,
                fontSize: 13, letterSpacing: '0.04em',
              }}>{s}</button>
            );
          })}
        </div>
        {size === '__err' && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#9a3a2c' }}>Selecciona una talla</div>
        )}
      </div>

      {/* CTA */}
      <div style={{ padding: '24px 22px 0' }}>
        <BlockButton onClick={onAdd}>Añadir al carrito · {fmtPrice(product.price)}</BlockButton>
      </div>

      {/* Service strip */}
      <div style={{
        margin: '24px 22px 0', padding: '16px 0',
        display: 'flex', justifyContent: 'space-around',
        borderTop: `0.5px solid ${palette.line}`, borderBottom: `0.5px solid ${palette.line}`,
      }}>
        {[
          [Icon.shipping, 'Envío gratis +€150'],
          [Icon.return, '30 días devolución'],
          [Icon.leaf, 'Producción ética'],
        ].map(([ic, t], i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: palette.text }}>{ic(palette.text)}</div>
            <div style={{ marginTop: 6, fontSize: 10.5, letterSpacing: '0.06em', color: palette.text60 }}>{t}</div>
          </div>
        ))}
      </div>

      {/* Accordion */}
      <div style={{ padding: '0 22px' }}>
        {[
          ['details', 'Detalles', product.description],
          ['fabric', 'Tejido', `${product.fabric}\n${product.origin}`],
          ['care', 'Cuidados', product.care],
          ['ship', 'Envío y devoluciones', 'Envío estándar 3–5 días. Express 24h. Devoluciones gratuitas durante 30 días.'],
        ].map(([k, l, body]) => {
          const open = openSec === k;
          return (
            <div key={k} style={{ borderBottom: `0.5px solid ${palette.line}` }}>
              <button onClick={() => setOpenSec(open ? null : k)} style={{
                ...btnReset, width: '100%', padding: '18px 0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                color: palette.text,
              }}>
                <span style={{ fontSize: 13.5 }}>{l}</span>
                <span style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  {Icon.plus(palette.text)}
                </span>
              </button>
              {open && (
                <div style={{ paddingBottom: 18, fontSize: 13, lineHeight: 1.6, color: palette.text60, whiteSpace: 'pre-line' }}>
                  {body}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Related */}
      <div style={{ padding: '32px 22px 0' }}>
        <SectionTitle style={{ color: palette.text, marginBottom: 14 }}>También de su mano</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {related.map(p => <ProductCard key={p.id} product={p} ctx={ctx} />)}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: D_PALETTE.ink, color: D_PALETTE.ivory,
          padding: '12px 20px', borderRadius: 999,
          fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.12em',
          zIndex: 200,
        }}>AÑADIDO AL CARRITO</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BAG / CART
// ─────────────────────────────────────────────────────────────────────────────
function ScreenBag({ ctx }) {
  const { palette, cart, updateQty, removeFromCart, go } = ctx;
  const subtotal = cart.reduce((s, l) => s + (PRODUCTS.find(p => p.id === l.id)?.price || 0) * l.qty, 0);
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div style={{ background: palette.bg, color: palette.text, padding: '60px 22px', textAlign: 'center', height: '100%' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 40 }}>Tu bolso está vacío</div>
        <p style={{ color: palette.text60, fontSize: 13.5, marginTop: 12, lineHeight: 1.5 }}>
          Aún no has añadido piezas. Empieza por las esenciales.
        </p>
        <div style={{ marginTop: 28 }}>
          <BlockButton onClick={() => go('plp', { category: 'all' })}>Explorar colección</BlockButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.text, paddingBottom: 200 }}>
      <div style={{ padding: '8px 22px 18px' }}>
        <MonoLabel style={{ color: palette.text60 }}>{cart.reduce((s, l) => s + l.qty, 0)} piezas</MonoLabel>
        <h1 style={{
          margin: '6px 0 0',
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontWeight: 400, fontSize: 38,
        }}>Tu bolso</h1>
      </div>

      <div style={{ borderTop: `0.5px solid ${palette.line}` }}>
        {cart.map(line => {
          const p = PRODUCTS.find(x => x.id === line.id);
          if (!p) return null;
          return (
            <div key={`${line.id}-${line.tone}-${line.size}`} style={{
              display: 'flex', gap: 14, padding: '18px 22px',
              borderBottom: `0.5px solid ${palette.line}`,
            }}>
              <div style={{ width: 96, flexShrink: 0 }}>
                <ProductImage tone={line.tone} label={p.label} ratio={4/5} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{
                    fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                    fontSize: 17, lineHeight: 1.2,
                  }}>{p.name}</div>
                  <button onClick={() => removeFromCart(line)} style={{ ...btnReset, color: palette.text60 }}>
                    {Icon.close(palette.text60)}
                  </button>
                </div>
                <div style={{ fontSize: 11.5, color: palette.text60, marginTop: 4, letterSpacing: '0.04em' }}>
                  Talla {line.size} · {line.tone}
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: `0.5px solid ${palette.line}`,
                  }}>
                    <button onClick={() => updateQty(line, line.qty - 1)} style={{ ...btnReset, width: 30, height: 30, color: palette.text }}>{Icon.minus(palette.text)}</button>
                    <span style={{ width: 26, textAlign: 'center', fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>{line.qty}</span>
                    <button onClick={() => updateQty(line, line.qty + 1)} style={{ ...btnReset, width: 30, height: 30, color: palette.text }}>{Icon.plus(palette.text)}</button>
                  </div>
                  <div style={{ fontSize: 13 }}>{fmtPrice(p.price * line.qty)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{ padding: '22px 22px 0' }}>
        <Row label="Subtotal" value={fmtPrice(subtotal)} palette={palette} />
        <Row label="Envío" value={shipping === 0 ? 'Gratis' : fmtPrice(shipping)} palette={palette} />
        <div style={{ height: 1, background: palette.line, margin: '14px 0' }} />
        <Row label="Total" value={fmtPrice(total)} palette={palette} bold />
      </div>

      {/* Floating CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34,
        padding: '16px 22px',
        background: palette.bg,
        borderTop: `0.5px solid ${palette.line}`,
      }}>
        <BlockButton onClick={() => go('checkout')}>Finalizar compra · {fmtPrice(total)}</BlockButton>
      </div>
    </div>
  );
}

function Row({ label, value, palette, bold }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '6px 0', fontSize: bold ? 14 : 13,
      fontWeight: bold ? 500 : 400,
      color: palette.text,
    }}>
      <span style={{ color: bold ? palette.text : palette.text60 }}>{label}</span>
      <span style={{ fontFamily: 'ui-monospace, monospace' }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT — multi-step
// ─────────────────────────────────────────────────────────────────────────────
function ScreenCheckout({ ctx }) {
  const { palette, cart, go, clearCart } = ctx;
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    email: 'maria@daliza.es', name: 'María Ortega',
    address: 'Calle Velázquez 42, 3ºB', city: 'Madrid', zip: '28001',
    method: 'standard', card: '4242 4242 4242 4242', exp: '04/29', cvc: '123',
  });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const subtotal = cart.reduce((s, l) => s + (PRODUCTS.find(p => p.id === l.id)?.price || 0) * l.qty, 0);
  const shipping = data.method === 'express' ? 14 : (subtotal >= 150 ? 0 : 8);
  const total = subtotal + shipping;

  const steps = ['Datos', 'Envío', 'Pago', 'Confirmar'];

  if (step === 4) {
    return (
      <div style={{ background: palette.bg, color: palette.text, padding: '40px 22px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <MonoLabel style={{ color: palette.text60 }}>Pedido #DZA-{Math.floor(Math.random()*90000+10000)}</MonoLabel>
          <h1 style={{
            margin: '14px 0 18px',
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: 44, lineHeight: 1, letterSpacing: '-0.01em',
          }}>Gracias, {data.name.split(' ')[0]}.</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: palette.text60, maxWidth: 320 }}>
            Hemos recibido tu pedido. Te enviaremos una confirmación a <span style={{ color: palette.text }}>{data.email}</span>.
            Llegará a {data.city} en 3–5 días.
          </p>
          <div style={{ marginTop: 24, padding: 16, border: `0.5px solid ${palette.line}` }}>
            <Row label="Total" value={fmtPrice(total)} palette={palette} bold />
            <Row label="Envío" value={data.method === 'express' ? 'Express 24h' : 'Estándar 3–5 días'} palette={palette} />
          </div>
        </div>
        <BlockButton onClick={() => { clearCart(); go('home'); }}>Volver al inicio</BlockButton>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.text, paddingBottom: 100 }}>
      {/* Stepper */}
      <div style={{ padding: '8px 22px 24px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 2, background: i <= step ? palette.text : palette.line }} />
              <div style={{
                marginTop: 8, fontFamily: 'ui-monospace, monospace',
                fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: i === step ? palette.text : palette.text60,
              }}>0{i+1} {s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 22px' }}>
        {step === 0 && (
          <>
            <SectionTitle>Tus datos</SectionTitle>
            <Field label="Email" value={data.email} onChange={v => set('email', v)} palette={palette} />
            <Field label="Nombre completo" value={data.name} onChange={v => set('name', v)} palette={palette} />
            <Field label="Dirección" value={data.address} onChange={v => set('address', v)} palette={palette} />
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="Ciudad" value={data.city} onChange={v => set('city', v)} palette={palette} />
              <Field label="C.P." value={data.zip} onChange={v => set('zip', v)} palette={palette} style={{ maxWidth: 110 }} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <SectionTitle>Envío</SectionTitle>
            <div style={{ marginTop: 18 }}>
              {[
                ['standard', 'Estándar', '3–5 días', subtotal >= 150 ? 'Gratis' : '€8'],
                ['express',  'Express',  '24 horas', '€14'],
                ['pickup',   'Recoger en tienda', 'Madrid · Velázquez 35', 'Gratis'],
              ].map(([k, l, sub, price]) => {
                const on = data.method === k;
                return (
                  <button key={k} onClick={() => set('method', k)} style={{
                    ...btnReset, width: '100%', padding: '16px 14px',
                    border: `1px solid ${on ? palette.text : palette.line}`,
                    background: on ? palette.card : 'transparent',
                    marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, color: palette.text,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 999,
                      border: `1px solid ${on ? palette.text : palette.line}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {on && <div style={{ width: 8, height: 8, borderRadius: 999, background: palette.text }} />}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: 14 }}>{l}</div>
                      <div style={{ fontSize: 11.5, color: palette.text60, marginTop: 2 }}>{sub}</div>
                    </div>
                    <MonoLabel>{price}</MonoLabel>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle>Pago</SectionTitle>
            <Field label="Número de tarjeta" value={data.card} onChange={v => set('card', v)} palette={palette} />
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="MM/AA" value={data.exp} onChange={v => set('exp', v)} palette={palette} />
              <Field label="CVC" value={data.cvc} onChange={v => set('cvc', v)} palette={palette} />
            </div>
            <div style={{ marginTop: 14, padding: 14, background: palette.card, fontSize: 12, color: palette.text60 }}>
              Pago seguro mediante 3D Secure. Daliza no almacena los datos de tu tarjeta.
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle>Confirmar pedido</SectionTitle>
            <SummaryBlock title="Envío a" body={`${data.name}\n${data.address}\n${data.zip} ${data.city}`} palette={palette} onEdit={() => setStep(0)} />
            <SummaryBlock title="Método" body={data.method === 'express' ? 'Express · 24 horas' : data.method === 'pickup' ? 'Recoger en tienda' : 'Estándar · 3–5 días'} palette={palette} onEdit={() => setStep(1)} />
            <SummaryBlock title="Pago" body={`Tarjeta ···· ${data.card.slice(-4)}\nVence ${data.exp}`} palette={palette} onEdit={() => setStep(2)} />
            <div style={{ padding: '14px 0', borderTop: `0.5px solid ${palette.line}`, marginTop: 8 }}>
              <Row label="Subtotal" value={fmtPrice(subtotal)} palette={palette} />
              <Row label="Envío" value={shipping === 0 ? 'Gratis' : fmtPrice(shipping)} palette={palette} />
              <div style={{ height: 1, background: palette.line, margin: '10px 0' }} />
              <Row label="Total" value={fmtPrice(total)} palette={palette} bold />
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 34,
        padding: '14px 22px', background: palette.bg,
        borderTop: `0.5px solid ${palette.line}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{ ...btnReset, color: palette.text }}>
            {Icon.back(palette.text)}
          </button>
        )}
        <div style={{ flex: 1 }}>
          <BlockButton onClick={() => setStep(step + 1)}>
            {step === 3 ? `Pagar · ${fmtPrice(total)}` : 'Continuar'}
          </BlockButton>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, palette, style = {} }) {
  return (
    <div style={{ marginTop: 14, flex: 1, ...style }}>
      <div style={{
        fontFamily: 'ui-monospace, monospace', fontSize: 9.5,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: palette.text60, marginBottom: 6,
      }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: '100%', padding: '10px 0', boxSizing: 'border-box',
        border: 'none', borderBottom: `1px solid ${palette.line}`,
        background: 'transparent', color: palette.text,
        fontSize: 15, outline: 'none',
        fontFamily: 'inherit',
      }} />
    </div>
  );
}

function SummaryBlock({ title, body, palette, onEdit }) {
  return (
    <div style={{
      padding: '14px 0', borderBottom: `0.5px solid ${palette.line}`,
      display: 'flex', justifyContent: 'space-between', gap: 14,
    }}>
      <div>
        <MonoLabel style={{ color: palette.text60 }}>{title}</MonoLabel>
        <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5, color: palette.text, whiteSpace: 'pre-line' }}>{body}</div>
      </div>
      <button onClick={onEdit} style={{ ...btnReset, color: palette.text }}>
        <MonoLabel style={{ textDecoration: 'underline' }}>Editar</MonoLabel>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOOKBOOK
// ─────────────────────────────────────────────────────────────────────────────
function ScreenLookbook({ ctx }) {
  const { palette, go } = ctx;
  return (
    <div style={{ background: palette.bg, color: palette.text, paddingBottom: 60 }}>
      <div style={{ padding: '8px 22px 22px' }}>
        <MonoLabel style={{ color: palette.text60 }}>Editorial · SS26</MonoLabel>
        <h1 style={{
          margin: '6px 0 0',
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontWeight: 400, fontSize: 40, lineHeight: 1, letterSpacing: '-0.01em',
        }}>Atelier Daliza,<br/>primavera.</h1>
        <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.6, color: palette.text60 }}>
          Seis looks pensados como capas: lino al sol, sastrería suave, denim crudo. Cada pieza puede vestirse sola.
        </p>
      </div>

      {LOOKS.map((look, i) => {
        const tone = ['ecru','oat','bone','cocoa','taupe','ivory'][i % 6];
        return (
          <div key={look.id} style={{ marginBottom: 34 }}>
            <div style={{ position: 'relative' }}>
              <ProductImage tone={tone} label={`${look.id} · ${look.title.toUpperCase()}`} look={look.id} ratio={3/4} />
              <div style={{
                position: 'absolute', left: 22, bottom: 18,
                color: ['cocoa','taupe'].includes(tone) ? D_PALETTE.ivory : D_PALETTE.ink,
              }}>
                <MonoLabel>{look.id}</MonoLabel>
                <div style={{
                  marginTop: 6,
                  fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                  fontWeight: 400, fontSize: 28, lineHeight: 1,
                }}>{look.title}</div>
              </div>
            </div>
            <div style={{ padding: '14px 22px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <MonoLabel style={{ color: palette.text60 }}>Comprar el look</MonoLabel>
                <MonoLabel style={{ color: palette.text60 }}>{look.items.length} piezas</MonoLabel>
              </div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
                {look.items.map(pid => {
                  const p = PRODUCTS.find(x => x.id === pid);
                  if (!p) return null;
                  return (
                    <button key={pid} onClick={() => go('pdp', { id: pid })} style={{
                      ...btnResetBlock, flex: '0 0 auto', width: 110,
                    }}>
                      <ProductImage tone={p.tones[0]} label={p.label} ratio={4/5} />
                      <div style={{ marginTop: 6, fontSize: 11.5, color: palette.text, lineHeight: 1.3 }}>{p.name}</div>
                      <MonoLabel style={{ color: palette.text60 }}>{fmtPrice(p.price)}</MonoLabel>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────────────────────
function ScreenSearch({ ctx }) {
  const { palette, go } = ctx;
  const [q, setQ] = React.useState('');
  const trends = ['Lino', 'Cashmere', 'Vestido seda', 'Trench', 'Denim japonés', 'Punto fino'];
  const results = q.trim()
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.fabric.toLowerCase().includes(q.toLowerCase()) ||
        p.label.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div style={{ background: palette.bg, color: palette.text, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 22px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', background: palette.card,
          borderRadius: 999,
        }}>
          {Icon.search(palette.text60)}
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                 placeholder="Buscar piezas, tejidos, looks…"
                 style={{
                   flex: 1, border: 'none', background: 'transparent', outline: 'none',
                   fontSize: 15, color: palette.text, fontFamily: 'inherit',
                 }} />
          {q && (
            <button onClick={() => setQ('')} style={{ ...btnReset, color: palette.text60 }}>
              {Icon.close(palette.text60)}
            </button>
          )}
        </div>
        <button onClick={() => go('home')} style={{ ...btnReset, color: palette.text }}>
          <MonoLabel>Cancelar</MonoLabel>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px 60px' }}>
        {!q && (
          <>
            <MonoLabel style={{ color: palette.text60 }}>Tendencias</MonoLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {trends.map(t => (
                <button key={t} onClick={() => setQ(t)} style={{
                  ...btnReset, padding: '8px 14px',
                  border: `0.5px solid ${palette.line}`, borderRadius: 999,
                  fontSize: 12, color: palette.text,
                }}>{t}</button>
              ))}
            </div>

            <MonoLabel style={{ color: palette.text60, display: 'block', marginTop: 28 }}>Sugerido</MonoLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 12 }}>
              {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} product={p} ctx={ctx} />)}
            </div>
          </>
        )}

        {q && results.length > 0 && (
          <>
            <MonoLabel style={{ color: palette.text60 }}>{results.length} resultado{results.length === 1 ? '' : 's'}</MonoLabel>
            <div style={{ marginTop: 12 }}>
              {results.map(p => (
                <button key={p.id} onClick={() => go('pdp', { id: p.id })} style={{
                  background: 'transparent', border: 0, cursor: 'pointer', font: 'inherit', color: 'inherit',
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: `0.5px solid ${palette.line}`, textAlign: 'left',
                }}>
                  <div style={{ width: 60, flexShrink: 0 }}>
                    <ProductImage tone={p.tones[0]} label="" ratio={1} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                      fontSize: 16, color: palette.text,
                    }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: palette.text60, marginTop: 2 }}>{p.fabric}</div>
                  </div>
                  <MonoLabel style={{ color: palette.text }}>{fmtPrice(p.price)}</MonoLabel>
                </button>
              ))}
            </div>
          </>
        )}

        {q && results.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: palette.text60 }}>
            <MonoLabel>Sin resultados para "{q}"</MonoLabel>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU drawer
// ─────────────────────────────────────────────────────────────────────────────
function MenuDrawer({ ctx, onClose }) {
  const { palette, go } = ctx;
  const items = [
    ['Inicio', 'home'],
    ['Toda la colección', 'plp', { category: 'all' }],
    ['Punto', 'plp', { category: 'knit' }],
    ['Camisería', 'plp', { category: 'shirts' }],
    ['Sastrería', 'plp', { category: 'tailor' }],
    ['Vestidos', 'plp', { category: 'dresses' }],
    ['Denim', 'plp', { category: 'denim' }],
    ['Abrigos', 'plp', { category: 'outer' }],
    ['Lookbook', 'lookbook'],
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.4)', display: 'flex',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: palette.bg, width: '86%', height: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '54px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            letterSpacing: '0.18em', fontSize: 22, color: palette.text,
          }}>Daliza</div>
          <button onClick={onClose} style={{ ...btnReset, color: palette.text }}>{Icon.close(palette.text)}</button>
        </div>
        <div style={{ padding: '8px 0', flex: 1, overflowY: 'auto' }}>
          {items.map(([label, route, params], i) => (
            <button key={i} onClick={() => { go(route, params); onClose(); }} style={{
              ...btnReset, width: '100%', textAlign: 'left',
              padding: '14px 22px', display: 'flex', justifyContent: 'space-between',
              borderBottom: `0.5px solid ${palette.line}`,
              fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
              fontSize: 22, color: palette.text,
            }}>
              <span>{label}</span>
              <span style={{ color: palette.text40 }}>{Icon.chev(palette.text40)}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: '20px 22px 30px' }}>
          <MonoLabel style={{ color: palette.text60 }}>Tienda · Madrid</MonoLabel>
          <div style={{ marginTop: 8, fontSize: 13, color: palette.text }}>
            Calle Velázquez 35<br/>Lun–Sáb · 11–20h
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenPDP, ScreenBag, ScreenCheckout, ScreenLookbook, ScreenSearch, MenuDrawer });
