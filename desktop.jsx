// desktop.jsx — DALIZA desktop web view
// Wide-canvas layouts that share state with mobile screens via ctx.
// Chat con Lía vive como widget docked en la esquina inferior derecha.

// ─── Desktop chrome: nav top + footer ────────────────────────────────────────
function DesktopNav({ ctx }) {
  const { palette, go, route, cart } = ctx;
  const bagCount = cart.reduce((s, l) => s + l.qty, 0);
  const links = [
    { label: 'Mujer', cat: 'all' },
    { label: 'Punto', cat: 'knit' },
    { label: 'Camisería', cat: 'shirts' },
    { label: 'Sastrería', cat: 'tailor' },
    { label: 'Vestidos', cat: 'dresses' },
    { label: 'Denim', cat: 'denim' },
    { label: 'Abrigos', cat: 'outer' },
    { label: 'Lookbook', route: 'lookbook' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: palette.bg + 'ee', backdropFilter: 'blur(12px)',
      borderBottom: `0.5px solid ${palette.line}`,
    }}>
      {/* Trust strip */}
      <div style={{
        background: palette.text, color: palette.bg,
        padding: '8px 0', textAlign: 'center',
        fontSize: 11.5, letterSpacing: '0.08em',
        fontFamily: 'ui-monospace, monospace',
      }}>
        ENVÍO GRATIS DESDE €150 · 30 DÍAS DEVOLUCIÓN · ASESORÍA REAL CON LÍA
      </div>
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '20px 40px',
      }}>
        <nav style={{ display: 'flex', gap: 22 }}>
          {links.slice(0, 5).map(l => (
            <button key={l.label} onClick={() => l.route ? go(l.route) : go('plp', { category: l.cat })} style={{
              ...btnReset, color: palette.text, fontSize: 13.5, padding: '4px 0',
              borderBottom: route.name === 'plp' && route.params.category === l.cat
                ? `1px solid ${palette.text}` : '1px solid transparent',
            }}>{l.label}</button>
          ))}
        </nav>
        <button onClick={() => go('home')} style={{ ...btnReset, padding: 0 }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 500, fontSize: 32, letterSpacing: '0.18em', color: palette.text,
          }}>Daliza</div>
        </button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 18, alignItems: 'center' }}>
          {links.slice(5).map(l => (
            <button key={l.label} onClick={() => l.route ? go(l.route) : go('plp', { category: l.cat })} style={{
              ...btnReset, color: palette.text, fontSize: 13.5,
            }}>{l.label}</button>
          ))}
          <span style={{ width: 0.5, height: 18, background: palette.line }} />
          <button onClick={() => go('search')} style={{ ...btnReset, color: palette.text }}>{Icon.search(palette.text)}</button>
          <button onClick={() => go('home')} style={{ ...btnReset, color: palette.text }}>{Icon.user(palette.text)}</button>
          <button onClick={() => go('bag')} style={{ ...btnReset, color: palette.text, position: 'relative' }}>
            {Icon.bag(palette.text)}
            {bagCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16,
                borderRadius: 999, background: palette.text, color: palette.bg,
                fontSize: 9.5, fontFamily: 'ui-monospace, monospace',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>{bagCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function DesktopFooter({ ctx }) {
  const { palette } = ctx;
  return (
    <footer style={{
      borderTop: `0.5px solid ${palette.line}`, marginTop: 80,
      padding: '60px 40px 40px', background: palette.card,
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontSize: 28, letterSpacing: '0.16em', color: palette.text, marginBottom: 16,
          }}>Daliza</div>
          <p style={{ color: palette.text60, fontSize: 13, lineHeight: 1.6, maxWidth: 360 }}>
            Atelier de básicos premium en Madrid. Pocas piezas, hechas despacio, pensadas para durar años.
          </p>
          <div style={{ marginTop: 20 }}>
            <MonoLabel style={{ color: palette.text60 }}>Tienda</MonoLabel>
            <div style={{ marginTop: 6, fontSize: 13, color: palette.text }}>
              Calle Velázquez 35, Madrid · Lun–Sáb 11–20h
            </div>
          </div>
        </div>
        <FooterCol palette={palette} title="Tienda" links={['Mujer', 'Lookbook', 'Novedades', 'Esenciales']} />
        <FooterCol palette={palette} title="Ayuda" links={['Envíos', 'Devoluciones (30 días)', 'Guía de tallas', 'Cuidados', 'Contacto']} />
        <FooterCol palette={palette} title="Atelier" links={['Origen', 'Confección', 'Reparación de por vida', 'Sostenibilidad']} />
      </div>
      <div style={{
        maxWidth: 1440, margin: '40px auto 0', paddingTop: 24,
        borderTop: `0.5px solid ${palette.line}`,
        display: 'flex', justifyContent: 'space-between', color: palette.text60, fontSize: 11.5,
        fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em',
      }}>
        <span>© 2026 DALIZA · MADRID</span>
        <span>PRIVACIDAD · TÉRMINOS · COOKIES</span>
      </div>
    </footer>
  );
}
function FooterCol({ palette, title, links }) {
  return (
    <div>
      <MonoLabel style={{ color: palette.text }}>{title}</MonoLabel>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {links.map(l => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} style={{
            color: palette.text60, fontSize: 13, textDecoration: 'none',
          }}>{l}</a>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop product card ────────────────────────────────────────────────────
function DProductCard({ product, ctx, large = false }) {
  const { go, palette, fav, toggleFav } = ctx;
  const [hover, setHover] = React.useState(false);
  const isFav = fav.includes(product.id);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => go('pdp', { id: product.id })}
      style={{ cursor: 'pointer' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ transition: 'transform 0.5s ease', transform: hover ? 'scale(1.03)' : 'scale(1)' }}>
          <ProductImage tone={hover && product.tones[1] ? product.tones[1] : product.tones[0]}
            label={product.label} look={product.look} ratio={4/5} />
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }} style={{
          ...btnReset, position: 'absolute', top: 12, right: 12,
          width: 36, height: 36, borderRadius: 999,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)',
          opacity: hover || isFav ? 1 : 0, transition: 'opacity 0.2s',
        }}>{Icon.heart(D_PALETTE.ink, isFav)}</button>
        {product.badge && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: palette.bg, color: palette.text, padding: '4px 10px',
            fontFamily: 'ui-monospace, monospace', fontSize: 9.5, letterSpacing: '0.14em',
          }}>{product.badge}</div>
        )}
        {/* Quick add bar on hover */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: 10, background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          transform: hover ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s ease', display: 'flex', justifyContent: 'center', gap: 8,
        }}>
          {product.sizes.slice(0, 5).map(s => (
            <button key={s} onClick={(e) => { e.stopPropagation(); go('pdp', { id: product.id }); }} style={{
              ...btnReset, padding: '6px 10px', fontSize: 12, color: '#1a1614',
              border: '0.5px solid rgba(0,0,0,0.15)',
            }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontSize: large ? 19 : 16, color: palette.text, lineHeight: 1.2,
          }}>{product.name}</div>
          <div style={{ marginTop: 4, fontSize: 11.5, color: palette.text60 }}>{product.fabric.split(',')[0]}</div>
          <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
            {product.tones.slice(0, 4).map(t => (
              <div key={t} style={{
                width: 9, height: 9, borderRadius: 999, background: TONE[t].bg,
                border: `0.5px solid ${palette.line}`,
              }} />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: palette.text }}>
          {fmtPrice(product.price)}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Home ────────────────────────────────────────────────────────────
function DHome({ ctx }) {
  const { palette, go } = ctx;
  const featured = PRODUCTS.slice(0, 8);
  const newArr = PRODUCTS.filter(p => p.new);
  return (
    <div style={{ background: palette.bg, color: palette.text }}>
      {/* Hero — split layout */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0, alignItems: 'stretch',
        minHeight: '78vh',
      }}>
        <div style={{ position: 'relative' }}>
          <ProductImage tone="ecru" label="EDITORIAL · SS26" look="LOOK 02" ratio={3/4} />
        </div>
        <div style={{
          padding: '90px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          background: palette.card,
        }}>
          <MonoLabel style={{ color: palette.text60 }}>Colección · Primavera 26</MonoLabel>
          <h1 style={{
            margin: '24px 0 0',
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: 88, lineHeight: 0.92, letterSpacing: '-0.015em',
            color: palette.text, textWrap: 'balance',
          }}>Una temporada<br/>vestida de luz.</h1>
          <p style={{ marginTop: 28, fontSize: 15, lineHeight: 1.7, color: palette.text60, maxWidth: 440 }}>
            Lino europeo, sastrería suave y punto fino italiano. Veintiocho piezas
            pensadas como un guardarropa que dura años — no temporadas.
          </p>
          <div style={{ marginTop: 36, display: 'flex', gap: 14 }}>
            <button onClick={() => go('plp', { category: 'all' })} style={{
              ...btnReset, padding: '14px 28px',
              background: palette.text, color: palette.bg,
              fontSize: 12, letterSpacing: '0.16em', fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase',
            }}>Ver colección</button>
            <button onClick={() => go('lookbook')} style={{
              ...btnReset, padding: '14px 28px',
              border: `1px solid ${palette.text}`, color: palette.text,
              fontSize: 12, letterSpacing: '0.16em', fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase',
            }}>Lookbook</button>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section style={{ padding: '90px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 36 }}>
          <h2 style={{
            margin: 0, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: 44,
          }}>Por categoría</h2>
          <button onClick={() => go('plp', { category: 'all' })} style={{ ...btnReset, color: palette.text }}>
            <MonoLabel style={{ borderBottom: `1px solid ${palette.text}` }}>Ver todo</MonoLabel>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18 }}>
          {CATEGORIES.filter(c => c.id !== 'all').map((cat, i) => (
            <button key={cat.id} onClick={() => go('plp', { category: cat.id })}
              style={{ ...btnResetBlock, position: 'relative' }}>
              <ProductImage tone={['ivory','oat','bone','cocoa','ecru','taupe'][i % 6]} label={cat.name.toUpperCase()} ratio={3/4} />
              <div style={{
                marginTop: 12, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                fontSize: 20, color: palette.text,
              }}>{cat.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section style={{ padding: '90px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 36 }}>
          <h2 style={{
            margin: 0, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: 44,
          }}>Lo esencial</h2>
          <MonoLabel style={{ color: palette.text60 }}>{featured.length} piezas</MonoLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, rowGap: 56 }}>
          {featured.map(p => <DProductCard key={p.id} product={p} ctx={ctx} />)}
        </div>
      </section>

      {/* Lookbook banner full-bleed */}
      <section style={{ marginTop: 100 }}>
        <div onClick={() => go('lookbook')} style={{
          position: 'relative', cursor: 'pointer', overflow: 'hidden',
        }}>
          <div style={{ height: '70vh', position: 'relative' }}>
            <ProductImage tone="cocoa" label="LOOKBOOK · 06 LOOKS" look="VER" ratio={16/7} />
          </div>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            padding: '0 80px',
          }}>
            <div style={{ color: D_PALETTE.ivory, maxWidth: 600 }}>
              <MonoLabel style={{ color: 'rgba(245,240,230,0.6)' }}>Editorial</MonoLabel>
              <h2 style={{
                margin: '20px 0 24px',
                fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                fontWeight: 400, fontSize: 76, lineHeight: 0.95, letterSpacing: '-0.01em',
              }}>Atelier Daliza,<br/>primavera.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.75 }}>
                Seis looks pensados como capas: lino al sol, sastrería suave, denim crudo.
              </p>
              <div style={{
                marginTop: 32, padding: '14px 28px', display: 'inline-block',
                border: '1px solid rgba(245,240,230,0.4)',
                fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.16em',
              }}>VER LOOKBOOK</div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section style={{ padding: '100px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 36 }}>
          <h2 style={{ margin: 0, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 44 }}>Recién llegado</h2>
          <button onClick={() => go('plp', { category: 'all' })} style={{ ...btnReset, color: palette.text }}>
            <MonoLabel style={{ borderBottom: `1px solid ${palette.text}` }}>Ver todo</MonoLabel>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, rowGap: 56 }}>
          {newArr.map(p => <DProductCard key={p.id} product={p} ctx={ctx} />)}
        </div>
      </section>

      {/* Manifesto */}
      <section style={{ padding: '120px 40px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <p style={{
          margin: 0, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontSize: 44, lineHeight: 1.25, color: palette.text, textWrap: 'balance',
        }}>
          "Pocas piezas. Hechas despacio.<br/>Pensadas para durar años."
        </p>
        <MonoLabel style={{ color: palette.text60, display: 'block', marginTop: 24 }}>Daliza · Madrid</MonoLabel>
      </section>
    </div>
  );
}

// ─── Desktop PLP ─────────────────────────────────────────────────────────────
function DPLP({ ctx }) {
  const { palette, route, go } = ctx;
  const [activeCat, setActiveCat] = React.useState(route.params.category || 'all');
  const [sort, setSort] = React.useState('featured');
  const [colorFilter, setColorFilter] = React.useState(null);
  const [priceMax, setPriceMax] = React.useState(700);
  const [grid, setGrid] = React.useState(4);

  let items = PRODUCTS.filter(p => activeCat === 'all' ? true : p.category === activeCat);
  if (colorFilter) items = items.filter(p => p.tones.includes(colorFilter));
  items = items.filter(p => p.price <= priceMax);
  if (sort === 'priceAsc') items = [...items].sort((a, b) => a.price - b.price);
  if (sort === 'priceDesc') items = [...items].sort((a, b) => b.price - a.price);
  if (sort === 'newest') items = [...items].sort((a, b) => Number(!!b.new) - Number(!!a.new));

  const catName = (CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0]).name;
  const tones = ['ivory','bone','oat','taupe','cocoa','black','navy','olive','rust','ecru'];

  return (
    <div style={{ background: palette.bg, color: palette.text }}>
      {/* Header */}
      <div style={{ padding: '40px 40px 30px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: palette.text60, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>
          INICIO / MUJER / {catName.toUpperCase()}
        </div>
        <h1 style={{
          margin: '14px 0 8px', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontWeight: 400, fontSize: 60, letterSpacing: '-0.01em',
        }}>{catName === 'Todo' ? 'Toda la colección' : catName}</h1>
        <div style={{ fontSize: 13, color: palette.text60 }}>{items.length} piezas</div>
      </div>

      {/* Layout: sidebar + grid */}
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40, padding: '0 40px 40px' }}>
        {/* Sidebar filters */}
        <aside style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
          <FilterGroup palette={palette} title="Categoría">
            {CATEGORIES.map(c => (
              <FilterRow key={c.id} palette={palette}
                active={activeCat === c.id} onClick={() => setActiveCat(c.id)}>
                {c.name}
              </FilterRow>
            ))}
          </FilterGroup>
          <FilterGroup palette={palette} title="Color">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tones.map(t => {
                const on = colorFilter === t;
                return (
                  <button key={t} onClick={() => setColorFilter(on ? null : t)}
                    title={t}
                    style={{
                      ...btnReset, width: 24, height: 24, borderRadius: 999,
                      background: TONE[t].bg, padding: 0,
                      border: on ? `2px solid ${palette.text}` : `0.5px solid ${palette.line}`,
                      boxShadow: on ? `0 0 0 2px ${palette.bg} inset` : 'none',
                    }} />
                );
              })}
            </div>
          </FilterGroup>
          <FilterGroup palette={palette} title="Precio máximo">
            <input type="range" min={50} max={700} step={5} value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: palette.text }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontFamily: 'ui-monospace, monospace', color: palette.text60, marginTop: 4 }}>
              <span>€50</span>
              <span style={{ color: palette.text }}>€{priceMax}</span>
            </div>
          </FilterGroup>
          <FilterGroup palette={palette} title="Promesa Daliza">
            <RowNote palette={palette} icon="↩">30 días devolución gratis</RowNote>
            <RowNote palette={palette} icon="🛠">Reparación de por vida</RowNote>
            <RowNote palette={palette} icon="🌿">Tejidos naturales</RowNote>
          </FilterGroup>
        </aside>

        {/* Grid */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0 0 24px', borderBottom: `0.5px solid ${palette.line}`, marginBottom: 32,
          }}>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
              border: 'none', background: 'transparent', color: palette.text, fontSize: 13,
              padding: '6px 24px 6px 0', cursor: 'pointer',
            }}>
              <option value="featured">Destacado</option>
              <option value="newest">Novedades</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
            </select>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <MonoLabel style={{ color: palette.text60 }}>Vista</MonoLabel>
              <button onClick={() => setGrid(2)} style={{ ...btnReset, opacity: grid === 2 ? 1 : 0.35, color: palette.text }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" stroke="currentColor"/><rect x="9" y="2" width="5" height="5" stroke="currentColor"/><rect x="2" y="9" width="5" height="5" stroke="currentColor"/><rect x="9" y="9" width="5" height="5" stroke="currentColor"/></svg>
              </button>
              <button onClick={() => setGrid(3)} style={{ ...btnReset, opacity: grid === 3 ? 1 : 0.35, color: palette.text }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="3" height="3" stroke="currentColor"/><rect x="6.5" y="2" width="3" height="3" stroke="currentColor"/><rect x="11" y="2" width="3" height="3" stroke="currentColor"/><rect x="2" y="6.5" width="3" height="3" stroke="currentColor"/><rect x="6.5" y="6.5" width="3" height="3" stroke="currentColor"/><rect x="11" y="6.5" width="3" height="3" stroke="currentColor"/></svg>
              </button>
              <button onClick={() => setGrid(4)} style={{ ...btnReset, opacity: grid === 4 ? 1 : 0.35, color: palette.text }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">{[0,1,2,3].map(i => <rect key={i} x={1+i*3.7} y="2" width="2.5" height="12" stroke="currentColor"/>)}</svg>
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid}, 1fr)`, gap: 28, rowGap: 56 }}>
            {items.map(p => <DProductCard key={p.id} product={p} ctx={ctx} />)}
          </div>
          {items.length === 0 && (
            <div style={{ padding: '80px 0', textAlign: 'center', color: palette.text60 }}>
              <MonoLabel>Sin piezas con estos filtros</MonoLabel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function FilterGroup({ palette, title, children }) {
  return (
    <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: `0.5px solid ${palette.line}` }}>
      <MonoLabel style={{ color: palette.text, display: 'block', marginBottom: 16 }}>{title}</MonoLabel>
      {children}
    </div>
  );
}
function FilterRow({ palette, active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      ...btnReset, width: '100%', padding: '6px 0', display: 'block', textAlign: 'left',
      color: active ? palette.text : palette.text60, fontSize: 13,
      fontWeight: active ? 500 : 400,
    }}>{active ? '— ' : ''}{children}</button>
  );
}
function RowNote({ palette, icon, children }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: palette.text60, padding: '4px 0' }}>
      <span style={{ width: 16 }}>{icon}</span>{children}
    </div>
  );
}

// ─── Desktop PDP ─────────────────────────────────────────────────────────────
function DPDP({ ctx }) {
  const { route, palette, addToCart, fav, toggleFav, go } = ctx;
  const product = PRODUCTS.find(p => p.id === route.params.id) || PRODUCTS[0];
  const [tone, setTone] = React.useState(product.tones[0]);
  const [size, setSize] = React.useState(null);
  const [openSec, setOpenSec] = React.useState('details');
  const [toast, setToast] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const isFav = fav.includes(product.id);

  const images = [
    { tone, label: product.label, look: product.look },
    { tone, label: 'DETALLE · COSTURA', look: null },
    { tone, label: 'EN MODELO · 1,72m TALLA S', look: null },
    { tone, label: 'CAÍDA', look: null },
    { tone: product.tones[1] || product.tones[0], label: product.label, look: null },
  ];

  const onAdd = () => {
    if (!size || !agreed) return;
    addToCart(product.id, tone, size);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div style={{ background: palette.bg, color: palette.text }}>
      {/* Breadcrumb */}
      <div style={{ padding: '24px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ fontSize: 12, color: palette.text60, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.06em' }}>
          INICIO / MUJER / {(CATEGORIES.find(c => c.id === product.category) || {}).name?.toUpperCase()} / {product.name.toUpperCase()}
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, padding: '20px 40px 60px' }}>
        {/* Image gallery — sticky */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {images.map((img, i) => (
              <div key={i} style={{ gridColumn: i === 0 ? '1 / -1' : 'auto' }}>
                <ProductImage tone={img.tone} label={img.label} look={img.look} ratio={4/5} />
              </div>
            ))}
          </div>
        </div>

        {/* Info — sticky right column */}
        <div style={{ position: 'sticky', top: 100, alignSelf: 'start', maxWidth: 460 }}>
          <MonoLabel style={{ color: palette.text60 }}>{(CATEGORIES.find(c => c.id === product.category) || {}).name}</MonoLabel>
          <h1 style={{
            margin: '12px 0 8px', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.01em',
          }}>{product.name}</h1>
          <div style={{ fontSize: 18, fontFamily: 'ui-monospace, monospace' }}>{fmtPrice(product.price)}</div>
          <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.65, color: palette.text60 }}>
            {product.description}
          </p>

          {/* Color */}
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <MonoLabel style={{ color: palette.text }}>Color</MonoLabel>
              <span style={{ fontSize: 12, color: palette.text60, textTransform: 'capitalize' }}>{tone}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {product.tones.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  ...btnReset, width: 36, height: 36, borderRadius: 999, padding: 3,
                  border: tone === t ? `1.5px solid ${palette.text}` : `0.5px solid ${palette.line}`,
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: 999, background: TONE[t].bg }} />
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <MonoLabel style={{ color: palette.text }}>Talla</MonoLabel>
              <button style={{ ...btnReset, color: palette.text, fontSize: 12 }}>
                <span style={{ borderBottom: `1px solid ${palette.text}` }}>Guía de tallas</span>
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {product.sizes.map(s => {
                const on = size === s;
                return (
                  <button key={s} onClick={() => setSize(s)} style={{
                    ...btnReset, minWidth: 56, height: 46, padding: '0 12px',
                    border: `1px solid ${on ? palette.text : palette.line}`,
                    background: on ? palette.text : 'transparent',
                    color: on ? palette.bg : palette.text, fontSize: 13,
                  }}>{s}</button>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: palette.text60 }}>
              Modelo Marta lleva talla S · 1,72m
            </div>
          </div>

          {/* Agreement + CTA */}
          <div style={{ marginTop: 24 }}>
            <label style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, color: palette.text60,
              padding: '12px 14px', border: `0.5px solid ${palette.line}`, cursor: 'pointer',
            }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: palette.text }} />
              <span>He revisado tejido, talla y políticas. <strong style={{ color: palette.text }}>30 días</strong> para devolver, sin coste.</span>
            </label>
            <button onClick={onAdd} disabled={!size || !agreed} style={{
              marginTop: 12, width: '100%', height: 56,
              background: palette.text, color: palette.bg, border: 0,
              fontSize: 13, letterSpacing: '0.16em', fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase', cursor: (size && agreed) ? 'pointer' : 'default',
              opacity: (size && agreed) ? 1 : 0.4,
            }}>Añadir al carrito · {fmtPrice(product.price)}</button>
            <button onClick={() => toggleFav(product.id)} style={{
              marginTop: 8, width: '100%', height: 50, background: 'transparent',
              border: `1px solid ${palette.text}`, color: palette.text, cursor: 'pointer',
              fontSize: 12, letterSpacing: '0.16em', fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {Icon.heart(palette.text, isFav)} {isFav ? 'Guardado' : 'Guardar para pensarlo'}
            </button>
          </div>

          {/* Service strip */}
          <div style={{
            marginTop: 28, padding: '20px 0',
            borderTop: `0.5px solid ${palette.line}`, borderBottom: `0.5px solid ${palette.line}`,
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
          }}>
            {[
              [Icon.shipping, 'Envío gratis', '+€150'],
              [Icon.return, 'Devolución', '30 días'],
              [Icon.leaf, 'Producción', 'ética'],
            ].map(([ic, t, s], i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 11, color: palette.text60 }}>
                {ic(palette.text)}
                <div style={{ textAlign: 'center', lineHeight: 1.3 }}><div style={{ color: palette.text }}>{t}</div>{s}</div>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div style={{ marginTop: 4 }}>
            {[
              ['details', 'Detalles', product.description],
              ['fabric', 'Tejido y origen', `${product.fabric}\n${product.origin}`],
              ['care', 'Cuidados', product.care],
              ['ship', 'Envío y devoluciones', 'Envío estándar 3–5 días. Express 24h. Devoluciones gratuitas durante 30 días. 14 días de desistimiento UE.'],
            ].map(([k, l, body]) => {
              const open = openSec === k;
              return (
                <div key={k} style={{ borderBottom: `0.5px solid ${palette.line}` }}>
                  <button onClick={() => setOpenSec(open ? null : k)} style={{
                    ...btnReset, width: '100%', padding: '18px 0', color: palette.text,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 13.5 }}>{l}</span>
                    <span style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>{Icon.plus(palette.text)}</span>
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
        </div>
      </div>

      {/* Related */}
      <section style={{ padding: '60px 40px 0', maxWidth: 1440, margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 38, marginBottom: 28 }}>
          También de su mano
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {related.map(p => <DProductCard key={p.id} product={p} ctx={ctx} />)}
        </div>
      </section>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          background: palette.text, color: palette.bg, padding: '14px 24px',
          fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.14em',
          zIndex: 200,
        }}>AÑADIDO AL CARRITO · {tone.toUpperCase()} TALLA {size}</div>
      )}
    </div>
  );
}

// ─── Desktop Bag ─────────────────────────────────────────────────────────────
function DBag({ ctx }) {
  const { palette, cart, updateQty, removeFromCart, go } = ctx;
  const subtotal = cart.reduce((s, l) => s + (PRODUCTS.find(p => p.id === l.id)?.price || 0) * l.qty, 0);
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 56, margin: 0 }}>Tu bolso está vacío</h1>
        <p style={{ color: palette.text60, fontSize: 14, marginTop: 14, lineHeight: 1.6 }}>
          Aún no has añadido piezas. Empieza por las esenciales o pídele recomendación a Lía.
        </p>
        <button onClick={() => go('plp', { category: 'all' })} style={{
          ...btnReset, marginTop: 28, padding: '14px 28px',
          background: palette.text, color: palette.bg,
          fontSize: 12, letterSpacing: '0.16em', fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase',
        }}>Ver colección</button>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.text }}>
      <div style={{ padding: '40px 40px 30px', maxWidth: 1440, margin: '0 auto' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 56, margin: 0 }}>
          Tu bolso
        </h1>
        <div style={{ fontSize: 13, color: palette.text60, marginTop: 6 }}>
          {cart.reduce((s, l) => s + l.qty, 0)} pieza{cart.reduce((s, l) => s + l.qty, 0) === 1 ? '' : 's'}
        </div>
      </div>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 60, padding: '0 40px 80px' }}>
        <div>
          <div style={{ borderTop: `0.5px solid ${palette.line}` }}>
            {cart.map(line => {
              const p = PRODUCTS.find(x => x.id === line.id);
              if (!p) return null;
              return (
                <div key={`${line.id}-${line.tone}-${line.size}`} style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 24, padding: '24px 0',
                  borderBottom: `0.5px solid ${palette.line}`, alignItems: 'flex-start',
                }}>
                  <ProductImage tone={line.tone} label={p.label} ratio={4/5} />
                  <div>
                    <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.2 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: palette.text60, marginTop: 6 }}>
                      Talla {line.size} · <span style={{ textTransform: 'capitalize' }}>{line.tone}</span> · {p.fabric.split(',')[0]}
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ display: 'flex', border: `0.5px solid ${palette.line}` }}>
                        <button onClick={() => updateQty(line, line.qty - 1)} style={{ ...btnReset, width: 32, height: 32, color: palette.text }}>{Icon.minus(palette.text)}</button>
                        <span style={{ width: 28, textAlign: 'center', alignSelf: 'center', fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>{line.qty}</span>
                        <button onClick={() => updateQty(line, line.qty + 1)} style={{ ...btnReset, width: 32, height: 32, color: palette.text }}>{Icon.plus(palette.text)}</button>
                      </div>
                      <button onClick={() => removeFromCart(line)} style={{ ...btnReset, color: palette.text60, fontSize: 12, textDecoration: 'underline' }}>Quitar</button>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14 }}>{fmtPrice(p.price * line.qty)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <aside style={{ position: 'sticky', top: 110, alignSelf: 'start' }}>
          <div style={{ background: palette.card, padding: 28 }}>
            <h2 style={{ margin: 0, fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 28 }}>Resumen</h2>
            <div style={{ marginTop: 18 }}>
              <Row label="Subtotal" value={fmtPrice(subtotal)} palette={palette} />
              <Row label="Envío" value={shipping === 0 ? 'Gratis' : fmtPrice(shipping)} palette={palette} />
              <div style={{ height: 1, background: palette.line, margin: '14px 0' }} />
              <Row label="Total" value={fmtPrice(total)} palette={palette} bold />
            </div>
            <button onClick={() => go('checkout')} style={{
              marginTop: 22, width: '100%', height: 54,
              background: palette.text, color: palette.bg, border: 0,
              fontSize: 12, letterSpacing: '0.16em', fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>Finalizar compra · {fmtPrice(total)}</button>
            <div style={{ marginTop: 18, fontSize: 11.5, color: palette.text60, lineHeight: 1.6 }}>
              <div>↩ 30 días para devolver, sin coste</div>
              <div>🛠 Reparación de por vida</div>
              <div>🔒 Pago seguro 3D Secure</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Desktop Lookbook (reuse mobile but wider) ───────────────────────────────
function DLookbook({ ctx }) {
  const { palette, go } = ctx;
  return (
    <div style={{ background: palette.bg, color: palette.text }}>
      <div style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <MonoLabel style={{ color: palette.text60 }}>Editorial · SS26</MonoLabel>
        <h1 style={{ margin: '20px 0 0', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 76, lineHeight: 1, letterSpacing: '-0.01em' }}>
          Atelier Daliza,<br/>primavera.
        </h1>
        <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.7, color: palette.text60, maxWidth: 580, margin: '24px auto 0' }}>
          Seis looks pensados como capas: lino al sol, sastrería suave, denim crudo. Cada pieza puede vestirse sola.
        </p>
      </div>

      <div style={{ padding: '0 40px 60px' }}>
        {LOOKS.map((look, i) => {
          const tone = ['ecru','oat','bone','cocoa','taupe','ivory'][i % 6];
          const reverse = i % 2 === 1;
          return (
            <div key={look.id} style={{
              maxWidth: 1440, margin: '0 auto 80px',
              display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'center',
              direction: reverse ? 'rtl' : 'ltr',
            }}>
              <div style={{ direction: 'ltr' }}>
                <ProductImage tone={tone} label={`${look.id} · ${look.title.toUpperCase()}`} look={look.id} ratio={3/4} />
              </div>
              <div style={{ direction: 'ltr' }}>
                <MonoLabel style={{ color: palette.text60 }}>{look.id}</MonoLabel>
                <h2 style={{ margin: '14px 0 12px', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 400, fontSize: 48, lineHeight: 1.05 }}>
                  {look.title}
                </h2>
                <p style={{ color: palette.text60, fontSize: 14, lineHeight: 1.6 }}>{look.subtitle}</p>
                <div style={{ marginTop: 24 }}>
                  <MonoLabel style={{ color: palette.text }}>Comprar el look</MonoLabel>
                  <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                    {look.items.map(pid => {
                      const p = PRODUCTS.find(x => x.id === pid);
                      if (!p) return null;
                      return (
                        <button key={pid} onClick={() => go('pdp', { id: pid })} style={{ ...btnResetBlock, width: 110 }}>
                          <ProductImage tone={p.tones[0]} label={p.label} ratio={4/5} />
                          <div style={{ marginTop: 6, fontSize: 12, color: palette.text, lineHeight: 1.3 }}>{p.name}</div>
                          <MonoLabel style={{ color: palette.text60 }}>{fmtPrice(p.price)}</MonoLabel>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Floating chat widget ────────────────────────────────────────────────────
function ChatLauncher({ ctx, onOpen }) {
  const { palette } = ctx;
  return (
    <button onClick={onOpen} style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 100,
      background: palette.text, color: palette.bg,
      border: 0, borderRadius: 999,
      padding: '14px 22px 14px 16px',
      display: 'flex', gap: 12, alignItems: 'center',
      cursor: 'pointer', boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
      fontFamily: 'inherit',
    }}>
      <StylistAvatar size={32} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>¿Te ayudo a decidir?</div>
        <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 1 }}>Lía · stylist · responde en min</div>
      </div>
    </button>
  );
}

function ChatPanel({ ctx, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 400, height: 620, zIndex: 110,
      background: ctx.palette.bg, borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      display: 'flex', flexDirection: 'column',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 14, right: 14, zIndex: 10,
        background: 'rgba(0,0,0,0.04)', border: 0, width: 28, height: 28, borderRadius: 999,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.close(ctx.palette.text)}</button>
      <ScreenChat ctx={ctx} />
    </div>
  );
}

// ─── Desktop App shell ──────────────────────────────────────────────────────
function DesktopApp({ ctx }) {
  const { route, palette } = ctx;
  const [chatOpen, setChatOpen] = React.useState(false);

  const screen = (() => {
    switch (route.name) {
      case 'home':     return <DHome ctx={ctx} />;
      case 'plp':      return <DPLP ctx={ctx} />;
      case 'pdp':      return <DPDP ctx={ctx} />;
      case 'bag':      return <DBag ctx={ctx} />;
      case 'lookbook': return <DLookbook ctx={ctx} />;
      // checkout, search, chat reuse mobile but rendered in browser frame
      case 'checkout':
      case 'search':
        return (
          <div style={{ maxWidth: 600, margin: '40px auto', background: palette.card, padding: 40 }}>
            {route.name === 'checkout' ? <ScreenCheckout ctx={ctx} /> : <ScreenSearch ctx={ctx} />}
          </div>
        );
      case 'chat':     return <DHome ctx={ctx} />; // chat lives as widget on desktop
      default:         return <DHome ctx={ctx} />;
    }
  })();

  return (
    <div data-screen-label={`DALIZA · desktop · ${route.name}`}
      style={{ background: palette.bg, color: palette.text, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <DesktopNav ctx={ctx} />
      <main style={{ flex: 1 }}>{screen}</main>
      <DesktopFooter ctx={ctx} />
      {!chatOpen && <ChatLauncher ctx={ctx} onOpen={() => setChatOpen(true)} />}
      {chatOpen && <ChatPanel ctx={ctx} onClose={() => setChatOpen(false)} />}
    </div>
  );
}

Object.assign(window, { DesktopApp });
