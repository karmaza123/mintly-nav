/*
  Figma: "Sidebar · პირადი" — Size (Expanded | Collapsed) × Direction (LTR | RTL).
  Built from: Sidebar item, Business selector (+ Business dropdown), Other businesses.
  Direction is NOT a prop here: set dir="rtl" on <html> and logical CSS mirrors everything.
*/
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import { Avatar, IconButton } from './primitives';
import { useDismiss } from './useDismiss';
import { myBusinesses, navItems, otherBusinesses, t, type Business, type Lang } from '../data/nav';

/* ── Sidebar item ── Figma "Sidebar item": State Default | Hover | Pressed | Selected ── */
export function SidebarItem({ icon, label, selected, onClick }: { icon: IconName; label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={`side-item state-layer${selected ? ' is-selected' : ''}`} aria-current={selected ? 'page' : undefined} onClick={onClick}>
      <Icon name={icon} size={20} />
      <span className="side-item__label t-caps-menu">{label}</span>
    </button>
  );
}

/* ── Business row ── Figma "Business option": State × Size (Default 58 | Small 40) ── */
function BusinessRow({ b, size, selected, subtitle, onClick }: { b: Business; size: 'default' | 'small'; selected?: boolean; subtitle?: string; onClick?: () => void }) {
  return (
    <button type="button" role="option" aria-selected={!!selected} className={`biz-row biz-row--${size} state-layer${selected ? ' is-selected' : ''}`} onClick={onClick}>
      <Avatar initials={b.initials} size={size === 'default' ? 'L' : 'M'} shape="square" />
      <span className="biz-row__text">
        <span className={size === 'default' ? 't-footnote biz-row__title' : 't-caption-1 biz-row__title biz-row__title--muted'}>{b.name}</span>
        {size === 'default' && subtitle ? <span className="t-caption-1 biz-row__subtitle">{subtitle}</span> : null}
      </span>
      {selected ? <Icon name="check" size={24} className="biz-row__check" /> : null}
    </button>
  );
}

/* ── Business selector ── Figma "Business selector": Default | Hover | Pressed | Open ── */
export function BusinessSelector({ lang, current, onChange }: { lang: Lang; current: Business | null; onChange: (b: Business | null) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  const L = t[lang];
  const shown = current ?? { id: 'me', name: 'kakadube', initials: 'K' };

  return (
    <div className="biz-select" ref={ref}>
      <button type="button" className={`biz-select__trigger state-layer${open ? ' is-open' : ''}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((o) => !o)}>
        <Avatar initials={shown.initials} size="L" shape="square" />
        <span className="biz-row__text">
          <span className="t-footnote biz-row__title">{shown.name}</span>
          <span className="t-caption-1 biz-row__subtitle">{current ? current.role?.[lang] : L.personalAccount}</span>
        </span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={24} />
      </button>
      {open ? (
        <div className="biz-dropdown" role="listbox" id={listId} aria-label={L.myBusinesses}>
          <div className="biz-dropdown__header t-caps-label">{L.personalAccount}</div>
          <BusinessRow b={{ id: 'me', name: 'kakadube', initials: 'K' }} subtitle={L.personalAccount} size="default" selected={!current} onClick={() => { onChange(null); close(); }} />
          <div className="biz-dropdown__header t-caps-label">{L.myBusinesses}</div>
          {myBusinesses.map((b) => (
            <BusinessRow key={b.id} b={b} subtitle={b.role?.[lang]} size="default" selected={current?.id === b.id} onClick={() => { onChange(b); close(); }} />
          ))}
          <hr className="separator" />
          <button type="button" className="menu-item state-layer" onClick={close}>
            <Icon name="plus" size={20} />
            <span className="t-subheadline menu-item__accent">{L.createBusiness}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ── Other businesses ── Figma "Other businesses": Search (Closed | Open) ──
   Closed: title + round tools (search → filter → view all).
   Open:   title stays; tools row becomes a search field + filter + view all. */
export function OtherBusinesses({ lang }: { lang: Lang }) {
  const L = t[lang];
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const [sorted, setSorted] = useState(false);
  const [all, setAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    let l = otherBusinesses.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()));
    if (sorted) l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    return all || q ? l : l.slice(0, 4);
  }, [q, sorted, all]);

  const openSearch = () => setSearching(true);
  const closeSearch = () => { setSearching(false); setQ(''); };

  return (
    <section className="other-biz" aria-label={L.otherBusinesses}>
      <h2 className="side-group t-caps-group">{L.otherBusinesses}</h2>
      <div className="other-biz__tools">
        {searching ? (
          <label className="search-field search-field--s">
            <Icon name="search" size={16} />
            <input ref={inputRef} autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.search} aria-label={L.search} onKeyDown={(e) => e.key === 'Escape' && closeSearch()} className="t-footnote" />
            <button type="button" className="search-field__clear" aria-label={L.cancel} onClick={closeSearch}><Icon name="close" size={16} /></button>
          </label>
        ) : (
          <IconButton icon="search" label={L.search} size="S" onClick={openSearch} />
        )}
        <IconButton icon="filter" label={L.filter} size="S" aria-pressed={sorted} onClick={() => setSorted((s) => !s)} />
        <IconButton icon="chevrons-right" label={L.viewAll} size="S" aria-pressed={all} onClick={() => setAll((a) => !a)} />
      </div>
      <div role="listbox" aria-label={L.otherBusinesses} className="other-biz__list">
        {list.length ? list.map((b) => <BusinessRow key={b.id} b={b} size="small" />) : <p className="t-footnote other-biz__empty">{L.noResults}</p>}
      </div>
    </section>
  );
}

/* ── Sidebar ── */
export function Sidebar({ lang, collapsed, active, onNavigate, business, onBusiness }: { lang: Lang; collapsed: boolean; active: string; onNavigate: (id: string) => void; business: Business | null; onBusiness: (b: Business | null) => void }) {
  const L = t[lang];
  const main = navItems.filter((n) => n.group === 'main');
  const res = navItems.filter((n) => n.group === 'resources');

  if (collapsed) {
    return (
      <nav className="sidebar sidebar--collapsed" aria-label={L.navigation}>
        <span className="brand-logo" aria-label="Mintly" role="img" />
        <hr className="separator" />
        {[{ id: 'me', initials: 'K', name: 'kakadube' }, ...myBusinesses].map((b) => (
          <button key={b.id} type="button" className="rail-avatar state-layer" title={b.name} aria-label={b.name} onClick={() => onBusiness(b.id === 'me' ? null : (b as Business))}>
            <Avatar initials={b.initials} size="M" shape={b.id === 'me' ? 'round' : 'square'} />
          </button>
        ))}
        <IconButton icon="apps" label={L.myBusinesses} />
        <hr className="separator" />
        {[...main, ...res].map((n) => (
          <IconButton key={n.id} icon={n.icon} label={n.label[lang]} variant={active === n.id ? 'gray' : 'plain'} aria-current={active === n.id ? 'page' : undefined} className={active === n.id ? 'is-selected' : ''} onClick={() => onNavigate(n.id)} />
        ))}
        <hr className="separator" />
        {otherBusinesses.slice(0, 4).map((b) => (
          <button key={b.id} type="button" className="rail-avatar state-layer" title={b.name} aria-label={b.name}><Avatar initials={b.initials} size="M" shape="square" /></button>
        ))}
        <span className="fill" />
        <IconButton icon="settings" label={L.menu} variant="plain" />
      </nav>
    );
  }

  return (
    <nav className="sidebar" aria-label={L.navigation}>
      <div className="brand"><span className="brand-logo" aria-hidden="true" /><span className="t-headline">Mintly</span></div>
      <h2 className="side-group t-caps-group">{L.myBusinesses}</h2>
      <BusinessSelector lang={lang} current={business} onChange={onBusiness} />
      <span className="spacer" />
      <h2 className="side-group t-caps-group">{L.navigation}</h2>
      {main.map((n) => <SidebarItem key={n.id} icon={n.icon} label={n.label[lang]} selected={active === n.id} onClick={() => onNavigate(n.id)} />)}
      <span className="spacer" />
      <h2 className="side-group t-caps-group">{L.resources}</h2>
      {res.map((n) => <SidebarItem key={n.id} icon={n.icon} label={n.label[lang]} selected={active === n.id} onClick={() => onNavigate(n.id)} />)}
      <span className="spacer" />
      <OtherBusinesses lang={lang} />
      <span className="fill" />
      <SidebarItem icon="settings" label={L.menu} />
    </nav>
  );
}
