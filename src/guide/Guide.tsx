/*
  Handoff guide — how to build the rest of Mintly from this nav.
  Lives inside the app (#guide) so docs and working code ship together.
*/
import { useEffect, useState } from 'react';
import { Icon, iconNames } from '../icons/Icon';

const sections = [
  ['start', 'Start here'],
  ['foundations', 'Foundations'],
  ['components', 'Nav components'],
  ['layout', 'Layout & breakpoints'],
  ['build', 'Build the rest'],
  ['rules', 'Do & Don’t'],
  ['qa', 'QA checklist'],
] as const;

const colorGroups: Array<[string, string[]]> = [
  ['Backgrounds', ['bg-base', 'bg-raised', 'bg-inset', 'bg-overlay', 'bg-sidebar']],
  ['Labels', ['label-primary', 'label-secondary', 'label-tertiary', 'label-quaternary']],
  ['Fills & lines', ['fill-primary', 'fill-secondary', 'fill-tertiary', 'fill-quaternary', 'separator-default', 'separator-opaque']],
  ['Accent (mint)', ['accent-default', 'accent-on', 'accent-tinted', 'accent-tinted-label', 'accent-text']],
  ['Controls', ['control-selected', 'control-selected-label', 'control-track', 'focus-ring']],
  ['Status', ['status-success', 'status-success-bg', 'status-warning', 'status-warning-bg', 'status-danger', 'status-danger-bg']],
  ['Overlays', ['overlay-scrim', 'material-regular', 'material-thin']],
];

const typeScale: Array<[string, string, string]> = [
  ['Large Title', 't-large-title', '34 / 46 · Bold'],
  ['Title 1', 't-title-1', '28 / 38 · Bold'],
  ['Title 2', 't-title-2', '22 / 30 · Bold'],
  ['Title 3', 't-title-3', '20 / 28 · SemiBold'],
  ['Headline', 't-headline', '17 / 24 · SemiBold'],
  ['Body', 't-body', '17 / 26 · Regular'],
  ['Callout', 't-callout', '16 / 24 · Regular'],
  ['Subheadline', 't-subheadline', '15 / 22 · Regular'],
  ['Footnote', 't-footnote', '13 / 20 · Regular'],
  ['Caption 1', 't-caption-1', '12 / 18 · Regular'],
  ['Caps/Menu', 't-caps-menu', '13 / 20 · SemiBold · UPPER +4%'],
  ['Caps/Label', 't-caps-label', '12 / 18 · SemiBold · UPPER +6%'],
];

const components: Array<{ figma: string; code: string; variants: string; states: string; notes: string }> = [
  { figma: 'Sidebar · პირადი', code: '<Sidebar collapsed />', variants: 'Size: Expanded (280) | Collapsed (80) · Direction: LTR | RTL', states: '—', notes: 'Direction comes from <html dir>. Never ship a separate RTL component in code.' },
  { figma: 'Sidebar item', code: '<SidebarItem icon label selected />', variants: 'State: Default | Hover | Pressed | Selected', states: 'Hover/Pressed = state layer 8% / 14%. Selected = control/selected + control/selected-label, aria-current="page".', notes: 'Label is Caps/Menu, one line, ellipsis.' },
  { figma: 'Business selector', code: '<BusinessSelector current onChange />', variants: 'State: Default | Hover | Pressed | Open', states: 'Open = 1.5px accent/default border, chevron-up, drop-down below.', notes: 'Listbox pattern. Esc + outside click close. Radius/control (20) because content inset is 8 around a radius/sm (12) avatar.' },
  { figma: 'Business dropdown + Business option', code: 'inside <BusinessSelector>', variants: 'Option State: Default | Hover | Pressed | Selected · Size: Default (58) | Small (40)', states: 'Selected = control/selected + check icon.', notes: 'Personal account first, then My businesses, separator, “Create business” (accent/text).' },
  { figma: 'Other businesses', code: '<OtherBusinesses />', variants: 'Search: Closed | Open', states: 'Open: tools row becomes search field + filter + view all. Empty search = “Nothing found”.', notes: 'Title on its own line; tools right-aligned (end). Arrows are the small chevron.' },
  { figma: 'Top actions', code: '<TopActions />', variants: 'Search: Closed | Open', states: 'Open: search grows towards the start side (slot is end-aligned).', notes: 'AI button has no feature yet → aria-disabled. Bell shows the danger count badge.' },
  { figma: 'Notifications popover + Notification item', code: '<NotificationsPanel />', variants: 'Item State: Unread | Read', states: 'Unread = mint-tinted tile + semibold title + accent/text link.', notes: 'Desktop: popover under the bell. Phone/tablet: bottom sheet over the scrim.' },
  { figma: 'Top bar · ტელეფონი', code: '<MobileTopBar />', variants: 'Search: Closed | Open', states: 'Open: field fills the bar + Cancel.', notes: 'Used below 1024px for phone AND tablet.' },
  { figma: 'Tab bar · ტელეფონი', code: '<TabBar />', variants: '—', states: 'Current tab = Gray icon button.', notes: 'Menu opens the full Sidebar as a drawer.' },
  { figma: 'Messages bar', code: '<MessagesBar />', variants: 'State: Default | Hover | Pressed', states: '—', notes: 'Fixed bottom-end. On mobile it sits 16px above the tab bar.' },
  { figma: 'Icon button / Avatar / Badge', code: '<IconButton /> <Avatar /> <Badge />', variants: 'Icon button: Style Gray | Plain × Size M (44) | S (32) · Avatar: S | M | L · Badge: Tone × Size', states: 'Icon buttons always need a label (aria-label + title).', notes: 'People are round avatars, businesses are rounded squares.' },
];

const pages: Array<[string, string, string]> = [
  ['A · შესვლამდე', 'Before login', '/login, /join, /invite/:code, /waitlist — no AppShell'],
  ['B · პირადი ანგარიში', 'Personal account', '/discover, /home, /balance, /messages, /profile… — AppShell'],
  ['C · ბიზნეს სივრცე', 'Business space', '/space/:id/... — AppShell + space menu'],
  ['D · სივრცის დაფა', 'Space dashboard', '/space/:id/dashboard/... — collapsed rail + space & dashboard menus'],
  ['E · ოვერლეები', 'Overlays', 'menus, popovers, modals, sheets, toasts — shared components, not routes'],
];

const buildOrder: Array<[string, string]> = [
  ['Button', 'Style Filled | Tinted | Gray | Plain × Size S | M | L × State. Labels use Caps/Button styles.'],
  ['Segmented control', 'Segments 2–4 × Selected 1–4. Selection is a prop — never restyle a segment by hand.'],
  ['Page header', 'Title 2 + Subheadline (label/secondary) in a bg/raised card, radius/lg, padding 24.'],
  ['Stat cell', 'Caps/Label + value (Title 2; the hero value may use Large Title) + Footnote meta.'],
  ['Card / Campaign card / Featured campaign', 'radius/lg outer, 8 inset, radius/control media. Featured = 1px accent outline + “რჩეული” chip.'],
  ['Balance summary', 'Layout Row | Stacked × Hold Active | None. Amounts never truncate; zero balance disables Withdraw.'],
  ['Transaction row', 'Type In | Out × Status Completed | Pending. In = “+” in accent/text, Out = “−” in label/primary.'],
  ['Empty state, Inline message, Toast, Modal, Sheet', 'Every list needs an empty state with a reason and a next step.'],
];

const rules: Array<[string, string, string]> = [
  ['Mint is the only green', 'Use accent tokens for the brand colour.', 'Don’t add another green for success or CTAs.'],
  ['Links in light mode are dark text', 'Use --color-accent-text (it is dark in light mode).', 'Don’t put mint text on a light background.'],
  ['Corners are concentric', 'Inner radius = outer radius − padding (28 → 8 → 20).', 'Don’t nest the same radius inside itself.'],
  ['Arrows use the small chevron', 'chevron-* and chevrons-right from Icon.', 'Don’t scale up a big arrow glyph.'],
  ['One selected tab', 'Segmented control Selected = n.', 'Don’t paint segments by hand.'],
  ['Money never truncates', 'Let the container grow; wrap or stack.', 'Don’t ellipsize amounts.'],
  ['Empty states explain', '“Nothing on hold” + one line about what happens next.', 'Don’t show 0.00 and an empty bar.'],
  ['Icons from the DS set', '<Icon name /> inside <IconButton>.', 'Don’t use emoji or raw library SVGs.'],
  ['Text styles only', 'Use the .t-* classes / text style tokens.', 'Don’t set font sizes by hand.'],
];

const qa = [
  'Every colour, space, radius and font comes from a token — no raw hex or px values in components.',
  'Works in Dark and Light (toggle data-theme on <html>).',
  'Works in LTR and RTL (toggle dir on <html>); directional icons mirror.',
  'Works in Georgian and English; long Georgian labels ellipsize, never overflow.',
  'Keyboard: Tab reaches every control, focus ring is visible, Esc closes menus, popovers and drawers.',
  'Every icon-only button has an accessible label.',
  'Hover, pressed, selected, disabled, empty, loading and error states exist.',
  'Desktop ≥ 1024 uses Sidebar + Top actions; below 1024 uses Top bar + Tab bar.',
  'Nothing is hidden under the floating Messages bar or the tab bar (add bottom padding).',
  'Respects prefers-reduced-motion.',
];

function Swatch({ token }: { token: string }) {
  const [vals, setVals] = useState<{ dark: string; light: string }>({ dark: '', light: '' });
  useEffect(() => {
    const read = (theme: string) => {
      const el = document.createElement('div');
      el.dataset.theme = theme;
      el.style.display = 'none';
      document.body.appendChild(el);
      const v = getComputedStyle(el).getPropertyValue(`--color-${token}`).trim();
      el.remove();
      return v;
    };
    setVals({ dark: read('dark'), light: read('light') });
  }, [token]);
  return (
    <div className="g-swatch">
      <div className="g-swatch__chips">
        <span data-theme="dark" style={{ backgroundImage: `linear-gradient(var(--color-${token}), var(--color-${token}))` }} />
        <span data-theme="light" style={{ backgroundImage: `linear-gradient(var(--color-${token}), var(--color-${token}))` }} />
      </div>
      <code className="t-footnote-semibold">--color-{token}</code>
      <span className="t-caption-1 g-muted">{vals.dark} · {vals.light}</span>
    </div>
  );
}

export function Guide() {
  return (
    <div className="guide">
      <nav className="g-toc" aria-label="Guide sections">
        <div className="brand"><span className="brand-logo" aria-hidden="true" /><span className="t-headline">Mintly handoff</span></div>
        {sections.map(([id, label]) => <a key={id} href={`#guide-${id}`} className="t-footnote-semibold" onClick={(e) => { e.preventDefault(); document.getElementById(`guide-${id}`)?.scrollIntoView({ behavior: 'smooth' }); }}>{label}</a>)}
        <a href="#" className="t-footnote-semibold g-back">← Back to the nav demo</a>
      </nav>

      <main className="g-main">
        <header className="g-hero">
          <h1 className="t-large-title">Building Mintly from the design system</h1>
          <p className="t-body g-muted">This package is the working navigation from Figma (“Mintly — Audit”) in React 19, plus the rules to build every other screen the same way. If something here disagrees with Figma, Figma wins — tell design.</p>
        </header>

        <section id="guide-start" className="g-section">
          <h2 className="t-title-2">Start here</h2>
          <div className="g-cols">
            <div className="g-card"><h3 className="t-headline">Run it</h3><pre className="g-code">{`npm install\nnpm run dev      # http://localhost:5173\nnpm run build    # static build in /dist`}</pre></div>
            <div className="g-card"><h3 className="t-headline">What’s where</h3><pre className="g-code">{`src/tokens/tokens.css   all design tokens\nsrc/icons/Icon.tsx      icon set (currentColor)\nsrc/components/         nav components + nav.css\nsrc/data/nav.ts         demo data + ka/en strings\nsrc/guide/              this guide`}</pre></div>
          </div>
          <p className="t-subheadline g-muted">Use the Demo controls at the bottom of the nav demo to switch Dark/Light, LTR/RTL, ქართული/English and Expanded/Collapsed. Resize below 1024px to see the phone/tablet nav.</p>
        </section>

        <section id="guide-foundations" className="g-section">
          <h2 className="t-title-2">Foundations</h2>
          <p className="t-subheadline g-muted">Figma variable <code>bg/raised</code> = CSS <code>--color-bg-raised</code>. Each swatch shows Dark (left) and Light (right). Theme switches with <code>data-theme</code> on <code>&lt;html&gt;</code>.</p>
          {colorGroups.map(([g, toks]) => (
            <div key={g} className="g-block"><h3 className="t-headline">{g}</h3><div className="g-swatches">{toks.map((tk) => <Swatch key={tk} token={tk} />)}</div></div>
          ))}
          <div className="g-cols">
            <div className="g-card">
              <h3 className="t-headline">Spacing · 4-pt scale</h3>
              {[4, 8, 12, 16, 20, 24, 32, 40, 48].map((s) => <div key={s} className="g-space"><span style={{ width: s }} /><code className="t-footnote">--space-{s}</code></div>)}
            </div>
            <div className="g-card">
              <h3 className="t-headline">Radius · concentric chain</h3>
              <div className="g-radius"><div className="g-radius__outer"><div className="g-radius__mid"><div className="g-radius__inner" /></div></div></div>
              <p className="t-footnote g-muted">radius/lg 28 → 8 padding → radius/control 20 → 8 padding → radius/sm 12. Also: xs 8 · 14 · 16 · 18 · md 22 · xl 32 · full.</p>
            </div>
          </div>
          <div className="g-block">
            <h3 className="t-headline">Type scale · Google Sans Flex</h3>
            <div className="g-type">{typeScale.map(([n, c, spec]) => <div key={n} className="g-type__row"><span className={c}>{n === 'Caps/Menu' || n === 'Caps/Label' ? 'აღმოჩენა Discover' : 'მინთლი Mintly'}</span><code className="t-caption-1 g-muted">.{c} · {spec}</code></div>)}</div>
          </div>
          <div className="g-block">
            <h3 className="t-headline">Icons · {iconNames.length} in this package</h3>
            <div className="g-icons">{iconNames.map((n) => <div key={n} className="g-icon"><Icon name={n} /><span className="t-caption-1 g-muted">{n}</span></div>)}</div>
          </div>
        </section>

        <section id="guide-components" className="g-section">
          <h2 className="t-title-2">Nav components</h2>
          <p className="t-subheadline g-muted">Figma variant properties map 1:1 to props or to <code>dir</code>/<code>data-theme</code>. States are CSS (hover/active via the state layer), not props.</p>
          <div className="g-table" role="table">
            <div className="g-tr g-th" role="row"><span>Figma</span><span>React</span><span>Variants</span><span>States & behaviour</span></div>
            {components.map((c) => (
              <div key={c.figma} className="g-tr" role="row">
                <span className="t-footnote-semibold">{c.figma}</span>
                <code className="t-footnote">{c.code}</code>
                <span className="t-footnote g-muted">{c.variants}</span>
                <span className="t-footnote g-muted">{c.states} {c.notes}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="guide-layout" className="g-section">
          <h2 className="t-title-2">Layout & breakpoints</h2>
          <div className="g-cols g-cols--3">
            <div className="g-card"><h3 className="t-headline">Desktop · ≥ 1024</h3><p className="t-footnote g-muted">Sidebar 280 (or 80 collapsed). Content starts 32 after the sidebar, max 1096 wide, top padding 96 (room for Top actions). Top actions float top-end, 16 from top, 32 from the edge.</p></div>
            <div className="g-card"><h3 className="t-headline">Tablet · 600–1023</h3><p className="t-footnote g-muted">Top bar (60) + Tab bar (72). Side padding 24. Menu opens the Sidebar as a drawer. Cards stack or go 2-up.</p></div>
            <div className="g-card"><h3 className="t-headline">Phone · &lt; 600</h3><p className="t-footnote g-muted">Same as tablet, side padding 16. Popovers become bottom sheets. Bottom padding must clear the tab bar + Messages bar.</p></div>
          </div>
          <p className="t-subheadline g-muted">Vertical rhythm inside a page: 24 between blocks, 12 between a section title and its content, 12 between cards in a grid.</p>
        </section>

        <section id="guide-build" className="g-section">
          <h2 className="t-title-2">Build the rest</h2>
          <ol className="g-steps">
            <li><strong className="t-headline">Wrap the screen in AppShell.</strong><span className="t-subheadline g-muted">Pages under B, C and D use it; A (before login) does not. Pass the active nav id.</span></li>
            <li><strong className="t-headline">Open the screen in Figma.</strong><span className="t-subheadline g-muted">Pages “ეკრანები · A–E”, frames named “ახალი დიზაინი · …”, each in 1440 / 834 / 390. Build desktop and phone; tablet follows from the breakpoints.</span></li>
            <li><strong className="t-headline">Use existing components first.</strong><span className="t-subheadline g-muted">Every layer on a screen is an instance of a component on “DS · კომპონენტები”. Build the component once, then the screen is assembly.</span></li>
            <li><strong className="t-headline">Only tokens.</strong><span className="t-subheadline g-muted">Inspect a layer in Dev Mode: the variable name (e.g. bg/raised, space/24, radius/lg) is the CSS token. If a value has no token, ask design — don’t invent one.</span></li>
            <li><strong className="t-headline">Ship all states.</strong><span className="t-subheadline g-muted">Default, hover, pressed, selected, disabled, empty, loading, error. Figma components carry them as variants.</span></li>
            <li><strong className="t-headline">Check RTL, light mode and Georgian text</strong><span className="t-subheadline g-muted">before opening a PR (see the QA checklist).</span></li>
          </ol>
          <div className="g-cols">
            <div className="g-card">
              <h3 className="t-headline">Figma pages → routes</h3>
              {pages.map(([ka, en, r]) => <div key={ka} className="g-kv"><span className="t-footnote-semibold">{ka}<span className="g-muted"> · {en}</span></span><span className="t-footnote g-muted">{r}</span></div>)}
            </div>
            <div className="g-card">
              <h3 className="t-headline">Build these components next</h3>
              {buildOrder.map(([n, d], i) => <div key={n} className="g-kv"><span className="t-footnote-semibold">{i + 1}. {n}</span><span className="t-footnote g-muted">{d}</span></div>)}
            </div>
          </div>
        </section>

        <section id="guide-rules" className="g-section">
          <h2 className="t-title-2">Do & Don’t</h2>
          <p className="t-subheadline g-muted">Full visual examples are on the Figma page “DS · Do &amp; Don’t”.</p>
          <div className="g-rules">
            {rules.map(([title, d, dn], i) => (
              <div key={title} className="g-rule">
                <h3 className="t-headline">{i + 1}. {title}</h3>
                <p className="t-footnote g-do"><Icon name="check-circle" size={16} /> {d}</p>
                <p className="t-footnote g-dont"><Icon name="close" size={16} /> {dn}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="guide-qa" className="g-section">
          <h2 className="t-title-2">QA checklist · before every PR</h2>
          <ul className="g-checklist">{qa.map((q) => <li key={q} className="t-subheadline"><Icon name="check" size={18} /> {q}</li>)}</ul>
        </section>
      </main>
    </div>
  );
}
