// screens.jsx — DALIZA screens. Each takes (ctx) with state + actions.

const fmtPrice = (n) => `€${n}`;

// ─────────────────────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────────────────────
function ScreenHome({ ctx }) {
  const { go, palette, density } = ctx;
  const featured = PRODUCTS.slice(0, 4);
  const newArr = PRODUCTS.filter(p => p.new).slice(0, 6);
  return (
    <div style={{ paddingBottom: 60, background: palette.bg, color: palette.text }}>
      {/* Hero */}
      <div style={{ position: 'relative' }}>
        <ProductImage tone="ecru" label="EDITORIAL · SS26" look="LOOK 02" ratio={4/5.4} />
        <div style={{
          position: 'absolute', left: 22, right: 22, bottom: 28,
          color: palette.ink,
        }}>
          <MonoLabel style={{ color: 'rgba(26,22,20,0.6)' }}>Colección · Primavera 26</MonoLabel>
          <h1 style={{
            margin: '8px 0 0',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic', fontWeight: 400,
            fontSize: 44, lineHeight: 0.95, letterSpacing: '-0.01em',
            textWrap: 'pretty',
          }}>Una temporada<br/>vestida de luz.</h1>
          <button onClick={() => go('plp', { category: 'all' })} style={{
            ...btnReset, marginTop: 18, padding: '12px 22px',
            background: D_PALETTE.ink, color: D_PALETTE.ivory,
            fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}>Ver colección</button>
        </div>
      </div>

      {/* Categories rail */}
      <div style={{ padding: '32px 0 8px' }}>
        <div style={{ padding: '0 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <SectionTitle style={{ color: palette.text }}>Por categoría</SectionTitle>
          <button onClick={() => go('plp', { category: 'all' })} style={{ ...btnReset, color: palette.text60 }}>
            <MonoLabel>Todo</MonoLabel>
          </button>
        </div>
        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto', padding: '0 22px 4px',
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.filter(c => c.id !== 'all').map((cat, i) => (
            <button key={cat.id} onClick={() => go('plp', { category: cat.id })} style={{
              ...btnResetBlock, flex: '0 0 auto', width: 124,
            }}>
              <ProductImage tone={['ivory','oat','bone','cocoa','ecru','taupe'][i % 6]} label={cat.name.toUpperCase()} ratio={3/4} />
              <div style={{
                marginTop: 8, fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic', fontSize: 17, color: palette.text,
              }}>{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured grid 2-up */}
      <div style={{ padding: '32px 22px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <SectionTitle style={{ color: palette.text }}>Lo esencial</SectionTitle>
          <MonoLabel style={{ color: palette.text60 }}>04 piezas</MonoLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: density === 'compact' ? 8 : 14 }}>
          {featured.map(p => <ProductCard key={p.id} product={p} ctx={ctx} />)}
        </div>
      </div>

      {/* Editorial banner */}
      <div style={{ marginTop: 36 }}>
        <button onClick={() => go('lookbook')} style={{ ...btnResetBlock, width: '100%' }}>
          <ProductImage tone="cocoa" label="LOOKBOOK · 06 LOOKS" look="VER" ratio={1/0.7} />
          <div style={{ padding: '20px 22px 0' }}>
            <MonoLabel style={{ color: palette.text60 }}>Editorial</MonoLabel>
            <SectionTitle style={{ color: palette.text, marginTop: 8 }}>Atelier Daliza, primavera</SectionTitle>
          </div>
        </button>
      </div>

      {/* New arrivals */}
      <div style={{ padding: '32px 22px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <SectionTitle style={{ color: palette.text }}>Recién llegado</SectionTitle>
          <button onClick={() => go('plp', { category: 'all' })} style={{ ...btnReset, color: palette.text60 }}>
            <MonoLabel>Ver todo</MonoLabel>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: density === 'compact' ? 8 : 14 }}>
          {newArr.map(p => <ProductCard key={p.id} product={p} ctx={ctx} />)}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ padding: '40px 22px 24px', textAlign: 'center', borderTop: `1px solid ${palette.line}`, marginTop: 36 }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontSize: 22, color: palette.text, lineHeight: 1.3,
        }}>"Pocas piezas. Hechas despacio."</div>
        <MonoLabel style={{ color: palette.text60, display: 'block', marginTop: 12 }}>Daliza · Madrid</MonoLabel>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product, ctx }) {
  const { go, palette, cardStyle, fav, toggleFav } = ctx;
  const isFav = fav.includes(product.id);
  const card = cardStyle || 'minimal';

  return (
    <Pressable onClick={() => go('pdp', { id: product.id })} style={{
      width: '100%', textAlign: 'left',
      background: card === 'framed' ? palette.card : 'transparent',
      padding: card === 'framed' ? 8 : 0,
      border: card === 'framed' ? `1px solid ${palette.line}` : 'none',
    }}>
      <div style={{ position: 'relative' }}>
        <ProductImage tone={product.tones[0]} label={product.label} look={product.look} ratio={4/5} />
        <button onClick={(e) => { e.stopPropagation(); toggleFav(product.id); }} style={{
          ...btnReset, position: 'absolute', top: 8, right: 8,
          width: 30, height: 30, borderRadius: 999,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(6px)',
        }}>{Icon.heart(D_PALETTE.ink, isFav)}</button>
        {product.badge && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: D_PALETTE.ivory, color: D_PALETTE.ink,
            padding: '4px 8px',
            fontFamily: 'ui-monospace, monospace', fontSize: 9, letterSpacing: '0.14em',
          }}>{product.badge}</div>
        )}
      </div>
      <div style={{ marginTop: 10, padding: card === 'framed' ? '0 4px 4px' : 0 }}>
        <div style={{
          fontFamily: card === 'serif' ? '"Cormorant Garamond", serif' : 'inherit',
          fontStyle: card === 'serif' ? 'italic' : 'normal',
          fontSize: card === 'serif' ? 17 : 13.5,
          color: palette.text, lineHeight: 1.25,
        }}>{product.name}</div>
        <div style={{
          marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <MonoLabel style={{ color: palette.text60 }}>{fmtPrice(product.price)}</MonoLabel>
          <div style={{ display: 'flex', gap: 4 }}>
            {product.tones.slice(0, 3).map(t => (
              <div key={t} style={{
                width: 8, height: 8, borderRadius: 999,
                background: TONE[t].bg, border: `0.5px solid ${palette.line}`,
              }} />
            ))}
          </div>
        </div>
      </div>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLP — listing with filters
// ─────────────────────────────────────────────────────────────────────────────
function ScreenPLP({ ctx }) {
  const { go, route, palette, density, cardStyle } = ctx;
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [grid, setGrid] = React.useState(2);
  const [sort, setSort] = React.useState('featured');
  const [activeCat, setActiveCat] = React.useState(route.params.category || 'all');
  const [colorFilter, setColorFilter] = React.useState(null);
  const [priceMax, setPriceMax] = React.useState(700);

  let items = PRODUCTS.filter(p => activeCat === 'all' ? true : p.category === activeCat);
  if (colorFilter) items = items.filter(p => p.tones.includes(colorFilter));
  items = items.filter(p => p.price <= priceMax);
  if (sort === 'priceAsc') items = [...items].sort((a, b) => a.price - b.price);
  if (sort === 'priceDesc') items = [...items].sort((a, b) => b.price - a.price);
  if (sort === 'newest') items = [...items].sort((a, b) => Number(!!b.new) - Number(!!a.new));

  const catName = (CATEGORIES.find(c => c.id === activeCat) || CATEGORIES[0]).name;

  return (
    <div style={{ background: palette.bg, color: palette.text, paddingBottom: 80 }}>
      {/* Title block */}
      <div style={{ padding: '10px 22px 14px' }}>
        <MonoLabel style={{ color: palette.text60 }}>Mujer · {items.length} piezas</MonoLabel>
        <h1 style={{
          margin: '6px 0 0',
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontWeight: 400, fontSize: 38, letterSpacing: '-0.01em',
        }}>{catName === 'Todo' ? 'Toda la colección' : catName}</h1>
      </div>

      {/* Category chips */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '0 22px 12px', scrollbarWidth: 'none',
      }}>
        {CATEGORIES.map(c => {
          const on = activeCat === c.id;
          return (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              ...btnReset, flex: '0 0 auto',
              padding: '7px 14px', borderRadius: 999,
              border: `0.5px solid ${on ? palette.text : palette.line}`,
              background: on ? palette.text : 'transparent',
              color: on ? palette.bg : palette.text,
              fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>{c.name}</button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 22px', background: palette.bg,
        borderTop: `1px solid ${palette.line}`,
        borderBottom: `1px solid ${palette.line}`,
      }}>
        <button onClick={() => setFilterOpen(true)} style={{
          ...btnReset, display: 'flex', alignItems: 'center', gap: 8, color: palette.text,
        }}>
          {Icon.filter(palette.text)}
          <MonoLabel>Filtrar y ordenar</MonoLabel>
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setGrid(1)} style={{ ...btnReset, opacity: grid === 1 ? 1 : 0.35, color: palette.text }}>{Icon.grid1(palette.text)}</button>
          <button onClick={() => setGrid(2)} style={{ ...btnReset, opacity: grid === 2 ? 1 : 0.35, color: palette.text }}>{Icon.grid2(palette.text)}</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        padding: '14px 22px',
        display: 'grid',
        gridTemplateColumns: grid === 1 ? '1fr' : '1fr 1fr',
        gap: density === 'compact' ? 8 : 14,
      }}>
        {items.map(p => <ProductCard key={p.id} product={p} ctx={ctx} />)}
        {items.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: palette.text60 }}>
            <MonoLabel>Sin piezas con estos filtros</MonoLabel>
          </div>
        )}
      </div>

      {/* Filter sheet */}
      {filterOpen && (
        <FilterSheet
          ctx={ctx}
          sort={sort} setSort={setSort}
          colorFilter={colorFilter} setColorFilter={setColorFilter}
          priceMax={priceMax} setPriceMax={setPriceMax}
          onClose={() => setFilterOpen(false)}
          count={items.length}
        />
      )}
    </div>
  );
}

function FilterSheet({ ctx, sort, setSort, colorFilter, setColorFilter, priceMax, setPriceMax, onClose, count }) {
  const { palette } = ctx;
  const tones = ['ivory','bone','oat','taupe','cocoa','black','navy','olive','rust','ecru'];
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: palette.bg, width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 0 28px', maxHeight: '88%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, background: palette.line, borderRadius: 4, margin: '4px auto 14px' }} />
        <div style={{ padding: '0 22px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionTitle style={{ color: palette.text }}>Filtrar</SectionTitle>
          <button onClick={onClose} style={btnReset}>{Icon.close(palette.text)}</button>
        </div>

        <div style={{ padding: '10px 22px 0' }}>
          <MonoLabel style={{ color: palette.text60 }}>Ordenar</MonoLabel>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
            {[
              ['featured', 'Destacado'],
              ['newest', 'Novedades'],
              ['priceAsc', 'Precio: menor a mayor'],
              ['priceDesc', 'Precio: mayor a menor'],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} style={{
                ...btnReset, display: 'flex', justifyContent: 'space-between',
                padding: '14px 0', borderBottom: `0.5px solid ${palette.line}`,
                color: palette.text, fontSize: 14,
              }}>
                <span>{l}</span>
                {sort === k && Icon.check(palette.text)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 22px 0' }}>
          <MonoLabel style={{ color: palette.text60 }}>Color</MonoLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
            {tones.map(t => {
              const on = colorFilter === t;
              return (
                <button key={t} onClick={() => setColorFilter(on ? null : t)} style={{
                  ...btnReset, display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px 6px 6px',
                  border: `0.5px solid ${on ? palette.text : palette.line}`,
                  borderRadius: 999, color: palette.text,
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: 999,
                    background: TONE[t].bg, border: `0.5px solid ${palette.line}`,
                  }} />
                  <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '24px 22px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <MonoLabel style={{ color: palette.text60 }}>Precio máximo</MonoLabel>
            <MonoLabel style={{ color: palette.text }}>€{priceMax}</MonoLabel>
          </div>
          <input type="range" min={50} max={700} step={5} value={priceMax}
                 onChange={(e) => setPriceMax(Number(e.target.value))}
                 style={{ width: '100%', marginTop: 10, accentColor: palette.text }} />
        </div>

        <div style={{ padding: '28px 22px 0', display: 'flex', gap: 10 }}>
          <BlockButton secondary onClick={() => { setSort('featured'); setColorFilter(null); setPriceMax(700); }}>Limpiar</BlockButton>
          <BlockButton onClick={onClose}>Ver {count} piezas</BlockButton>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHome, ScreenPLP, ProductCard, fmtPrice });
