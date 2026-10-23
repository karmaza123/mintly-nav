# Mintly · Nav handoff

The working Mintly navigation, built from the Figma file **“Mintly — Audit”**
(`d6CZrxRqF3AD9PBGC7hmA5`) in **React 19 + TypeScript + Vite**, plus a handoff
guide that explains how to build every other screen the same way.

```bash
npm install
npm run dev      # http://localhost:5173  (nav demo)  ·  /#guide  (handoff guide)
npm run build    # static build in /dist
```

## What’s inside

| Path | What it is |
|---|---|
| `src/tokens/tokens.css` | Every design token from Figma: Color (Dark + Light), Space, Shape, Size, State, the 21 text styles, depth. |
| `src/icons/Icon.tsx` | The icon set exported from Figma `Icon/*` components. 24×24, 1.5 stroke, `currentColor`. |
| `src/components/` | `AppShell`, `Sidebar` (+ `SidebarItem`, `BusinessSelector`, `OtherBusinesses`), `TopBar` (`TopActions`, `NotificationsPanel`, `MobileTopBar`, `TabBar`, `MessagesBar`), primitives (`IconButton`, `Avatar`, `Badge`), `nav.css`. |
| `src/data/nav.ts` | Demo data and ქართული / English strings. Replace with API data. |
| `src/guide/` | The handoff guide (open `/#guide`). |

## How the nav works

- **Desktop ≥ 1024px:** Sidebar (280, or 80 collapsed) + floating Top actions + Messages bar.
- **Phone / tablet < 1024px:** Top bar + Tab bar; Menu opens the Sidebar as a drawer; popovers become bottom sheets.
- **Theme:** `data-theme="dark" | "light"` on `<html>`.
- **Direction:** `dir="ltr" | "rtl"` on `<html>`. All layout uses logical CSS properties, so RTL needs no extra code. Directional icons mirror automatically.
- **States:** hover / pressed use one state layer (`label/primary` at 8% / 14%), exactly like the Figma “State layer”.

## Rules (short version — full list in the guide and on Figma “DS · Do & Don’t”)

1. Only tokens — no raw hex, px sizes or font sizes in components.
2. Mint (`--color-accent-*`) is the only green. Links in light mode use `--color-accent-text` (dark).
3. Corners are concentric: inner = outer − padding (28 → 8 → 20 → 8 → 12).
4. Arrows are the small chevrons. Icons only from `Icon`, never emoji.
5. One selected item per group (Segmented control `Selected`, Sidebar `aria-current`).
6. Money never truncates. Empty states always explain what happens next.

## Not production-ready yet (on purpose)

- Data is static demo data; wire `myBusinesses`, `otherBusinesses`, `notifications`, `user` to the API.
- The AI button has no feature yet (rendered `aria-disabled`).
- Routes are not wired — `onNavigate(id)` is the hook to connect your router.
- Search fields don’t query anything yet; they show the UI states only.
