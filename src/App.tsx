import { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { Guide } from './guide/Guide';
import { navItems, type Lang } from './data/nav';

type Theme = 'dark' | 'light';
type View = 'demo' | 'guide';

const readView = (): View => (location.hash === '#guide' ? 'guide' : 'demo');

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [lang, setLang] = useState<Lang>('ka');
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('discover');
  const [view, setView] = useState<View>(readView);
  // Demo panel starts minimised on phone/tablet so it doesn't cover the nav.
  const [controls, setControls] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [theme, dir, lang]);

  useEffect(() => {
    const on = () => setView(readView());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const page = navItems.find((n) => n.id === active);

  return (
    <>
      {view === 'guide' ? (
        <Guide />
      ) : (
        <AppShell lang={lang} collapsed={collapsed} active={active} onNavigate={setActive}>
          <DemoPage title={page ? page.label[lang] : lang === 'ka' ? 'მენიუ' : 'Menu'} lang={lang} />
        </AppShell>
      )}

      <aside className={`demo-controls${controls ? '' : ' is-min'}`} aria-label="Demo controls">
        <button type="button" className="demo-controls__toggle t-caps-label" onClick={() => setControls((c) => !c)} aria-expanded={controls}>
          {controls ? 'Demo controls ▾' : 'Demo ▸'}
        </button>
        {controls ? (
          <div className="demo-controls__body">
            <Seg label="View" value={view} options={[['demo', 'Nav demo'], ['guide', 'Handoff guide']]} onChange={(v) => { location.hash = v === 'guide' ? 'guide' : ''; setView(v as View); }} />
            <Seg label="Theme" value={theme} options={[['dark', 'Dark'], ['light', 'Light']]} onChange={(v) => setTheme(v as Theme)} />
            <Seg label="Direction" value={dir} options={[['ltr', 'LTR'], ['rtl', 'RTL']]} onChange={(v) => setDir(v as 'ltr' | 'rtl')} />
            <Seg label="Language" value={lang} options={[['ka', 'ქართ.'], ['en', 'EN']]} onChange={(v) => setLang(v as Lang)} />
            <Seg label="Sidebar" value={collapsed ? 'c' : 'e'} options={[['e', 'Expanded'], ['c', 'Collapsed']]} onChange={(v) => setCollapsed(v === 'c')} />
          </div>
        ) : null}
      </aside>
    </>
  );
}

function Seg({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="demo-seg">
      <span className="t-caption-1 demo-seg__label">{label}</span>
      <div className="demo-seg__track" role="radiogroup" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} className={`demo-seg__opt t-caption-1-semibold${value === v ? ' is-on' : ''}`} onClick={() => onChange(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

/* Placeholder page: shows where real content goes and the spacing it must follow. */
function DemoPage({ title, lang }: { title: string; lang: Lang }) {
  const ka = lang === 'ka';
  return (
    <div className="demo-page">
      <header className="page-header">
        <h1 className="t-title-2">{title}</h1>
        <p className="t-subheadline page-header__sub">{ka ? 'გვერდის შიგთავსი აქ ჩაჯდება. ნავიგაცია ყველა გვერდზე ერთი და იგივეა.' : 'Page content goes here. The navigation is the same on every page.'}</p>
      </header>
      <div className="demo-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="demo-card">
            <span className="demo-card__media" />
            <span className="demo-line" style={{ width: '70%' }} />
            <span className="demo-line demo-line--muted" style={{ width: '45%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
