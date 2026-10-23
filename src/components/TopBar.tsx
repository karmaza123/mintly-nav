/*
  Figma: "Top actions" (desktop, Search Closed | Open), "Top bar · ტელეფონი"
  (phone/tablet, Search Closed | Open), "Tab bar · ტელეფონი", "Notifications popover",
  "Notification item" (Unread | Read), "Messages bar".
*/
import { useCallback, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../icons/Icon';
import { Avatar, Badge, IconButton } from './primitives';
import { useDismiss } from './useDismiss';
import { notifications, t, user, type Lang } from '../data/nav';

/* ── Search field ── Figma "Search field" (State Default | Active) ── */
function SearchField({ lang, onClose, autoFocus }: { lang: Lang; onClose: () => void; autoFocus?: boolean }) {
  const L = t[lang];
  const [q, setQ] = useState('');
  return (
    <label className="search-field">
      <Icon name="search" size={16} />
      <input autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder={L.searchMintly} aria-label={L.search} className="t-callout" onKeyDown={(e) => e.key === 'Escape' && onClose()} />
      <button type="button" className="search-field__clear" aria-label={L.cancel} onClick={onClose}><Icon name="close" size={16} /></button>
    </label>
  );
}

/* ── Notifications ── */
export function NotificationsPanel({ lang, items, onMarkAll }: { lang: Lang; items: typeof notifications; onMarkAll: () => void }) {
  const L = t[lang];
  const groups: Array<['yesterday' | 'older', string]> = [['yesterday', L.yesterday], ['older', L.older]];
  return (
    <div className="notif-panel" role="dialog" aria-label={L.notifications}>
      <div className="notif-panel__header">
        <h2 className="t-headline">{L.notifications}</h2>
        <div className="row-4">
          <IconButton icon="check-all" label={L.markAllRead} size="S" variant="plain" onClick={onMarkAll} />
          <IconButton icon="refresh" label={L.refresh} size="S" variant="plain" />
          <IconButton icon="settings" label={L.settings} size="S" variant="plain" />
        </div>
      </div>
      {groups.map(([g, label]) => (
        <section key={g} aria-label={label}>
          <h3 className="notif-panel__group t-caption-1-semibold">{label}</h3>
          {items.filter((n) => n.group === g).map((n) => (
            <article key={n.id} className={`notif state-layer${n.unread ? ' is-unread' : ''}`}>
              <span className="notif__tile"><Icon name={n.icon} size={20} /></span>
              <div className="notif__text">
                <p className={n.unread ? 't-subheadline-semibold' : 't-subheadline'}>{n.title[lang]}</p>
                <p className="t-caption-1 notif__time">{n.time}</p>
                <p className="t-subheadline notif__body">{n.body[lang]}</p>
                <a href="#details" className="t-footnote-semibold notif__link" onClick={(e) => e.preventDefault()}>{L.details}</a>
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}

function useNotifications() {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => n.unread).length;
  return { items, unread, markAll: () => setItems((l) => l.map((n) => ({ ...n, unread: false }))) };
}

function BellWithPanel({ lang, align = 'end' }: { lang: Lang; align?: 'end' | 'sheet' }) {
  const L = t[lang];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const refs = useMemo(() => [ref, sheetRef], []);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(refs, open, close);
  const { items, unread, markAll } = useNotifications();
  const panel = <NotificationsPanel lang={lang} items={items} onMarkAll={markAll} />;
  return (
    <div className={`popover-anchor popover-anchor--${align}`} ref={ref}>
      <IconButton icon="bell" label={L.notifications} count={unread || undefined} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((o) => !o)} />
      {open && align === 'end' ? panel : null}
      {/* Sheet renders at <body>: the top bar uses backdrop-filter, which would trap a fixed child inside it. */}
      {open && align === 'sheet'
        ? createPortal(
            <div className="sheet-layer">
              <div className="scrim" onClick={close} />
              <div className="sheet" ref={sheetRef}>{panel}</div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/* ── Desktop: Top actions ── search expands to the LEFT (the slot is end-aligned). */
export function TopActions({ lang }: { lang: Lang }) {
  const L = t[lang];
  const [searching, setSearching] = useState(false);
  return (
    <div className="top-actions-slot">
      <div className={`top-actions${searching ? ' is-searching' : ''}`}>
        {searching ? <SearchField lang={lang} autoFocus onClose={() => setSearching(false)} /> : <IconButton icon="search" label={L.search} onClick={() => setSearching(true)} />}
        <IconButton icon="sparkle" label={L.ai} aria-disabled="true" />
        <BellWithPanel lang={lang} />
        <button type="button" className="profile-chip state-layer" aria-label={`${user.name}, ${user.balance}`}>
          <Avatar initials={user.initials} size="M" />
          <span className="profile-chip__text">
            <span className="t-footnote-semibold">{user.name}</span>
            <span className="t-caption-1-semibold profile-chip__balance">{user.balance}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Phone / tablet: Top bar ── Open search = field fills the bar + Cancel. */
export function MobileTopBar({ lang }: { lang: Lang }) {
  const L = t[lang];
  const [searching, setSearching] = useState(false);
  return (
    <header className="m-top-bar">
      {searching ? (
        <>
          <SearchField lang={lang} autoFocus onClose={() => setSearching(false)} />
          <button type="button" className="text-btn t-caps-button-m" onClick={() => setSearching(false)}>{L.cancel}</button>
        </>
      ) : (
        <>
          <div className="brand brand--compact"><span className="brand-logo" aria-hidden="true" /><span className="t-headline">Mintly</span></div>
          <span className="fill" />
          <IconButton icon="search" label={L.search} onClick={() => setSearching(true)} />
          <IconButton icon="sparkle" label={L.ai} aria-disabled="true" />
          <BellWithPanel lang={lang} align="sheet" />
          <Avatar initials={user.initials} size="M" />
        </>
      )}
    </header>
  );
}

export function TabBar({ lang, active, onNavigate, onMenu }: { lang: Lang; active: string; onNavigate: (id: string) => void; onMenu: () => void }) {
  const L = t[lang];
  return (
    <nav className="tab-bar" aria-label={L.navigation}>
      <IconButton icon="menu" label={L.menu} variant="plain" onClick={onMenu} />
      <IconButton icon="home" label="Home" variant={active === 'home' ? 'gray' : 'plain'} aria-current={active === 'home' ? 'page' : undefined} onClick={() => onNavigate('home')} />
      <button type="button" className="tab-bar__create state-layer" aria-label={L.createBusiness} onClick={() => onNavigate('create')}><Icon name="plus" size={24} /></button>
      <IconButton icon="compass" label="Discover" variant={active === 'discover' ? 'gray' : 'plain'} aria-current={active === 'discover' ? 'page' : undefined} onClick={() => onNavigate('discover')} />
    </nav>
  );
}

/* ── Floating Messages bar ── bottom-end on every screen size. */
export function MessagesBar({ lang, mobile }: { lang: Lang; mobile?: boolean }) {
  const L = t[lang];
  return (
    <button type="button" className={`messages-bar state-layer${mobile ? ' messages-bar--mobile' : ''}`} aria-label={`${L.messages}, 2`}>
      <Icon name="message" size={24} />
      <span className="t-headline">{L.messages}</span>
      <span className="avatar-stack" aria-hidden="true">
        <Avatar initials="C" /><Avatar initials="K" /><Avatar initials="N" />
      </span>
      <Badge tone="danger">2</Badge>
    </button>
  );
}
