/*
  AppShell — the frame every Mintly screen sits in.
  ≥ 1024px: Sidebar (280, or 80 collapsed) + floating Top actions + Messages bar.
  < 1024px: Top bar + Tab bar; Menu opens the Sidebar as a drawer over a scrim.
  Put page content in <AppShell>{children}</AppShell>.
*/
import { useEffect, useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MessagesBar, MobileTopBar, TabBar, TopActions } from './TopBar';
import type { Business, Lang } from '../data/nav';

export const DESKTOP_QUERY = '(min-width: 1024px)';

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  useEffect(() => {
    const m = window.matchMedia(DESKTOP_QUERY);
    const on = () => setDesktop(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return desktop;
}

export function AppShell({ lang, collapsed, active, onNavigate, children }: { lang: Lang; collapsed: boolean; active: string; onNavigate: (id: string) => void; children: ReactNode }) {
  const desktop = useIsDesktop();
  const [business, setBusiness] = useState<Business | null>(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [drawer]);

  const go = (id: string) => { onNavigate(id); setDrawer(false); };

  if (desktop) {
    return (
      <div className="shell">
        <Sidebar lang={lang} collapsed={collapsed} active={active} onNavigate={go} business={business} onBusiness={setBusiness} />
        <main className="shell__main">
          <TopActions lang={lang} />
          <div className="shell__content">{children}</div>
        </main>
        <MessagesBar lang={lang} />
      </div>
    );
  }

  return (
    <div className="shell shell--mobile">
      <MobileTopBar lang={lang} />
      <main className="shell__content shell__content--mobile">{children}</main>
      <MessagesBar lang={lang} mobile />
      <TabBar lang={lang} active={active} onNavigate={go} onMenu={() => setDrawer(true)} />
      {drawer ? (
        <>
          <div className="scrim" style={{ zIndex: 49 }} onClick={() => setDrawer(false)} />
          <div className="drawer" role="dialog" aria-modal="true">
            <Sidebar lang={lang} collapsed={false} active={active} onNavigate={go} business={business} onBusiness={setBusiness} />
          </div>
        </>
      ) : null}
    </div>
  );
}
