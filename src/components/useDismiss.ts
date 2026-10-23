import { useEffect, type RefObject } from 'react';

/**
 * Closes a popover / drop-down / sheet on outside click or Escape.
 * Pass every element that counts as "inside" — e.g. the trigger AND a panel
 * rendered through a portal (portaled nodes are not DOM children of the trigger).
 */
export function useDismiss(refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const list = Array.isArray(refs) ? refs : [refs];
    const onPointer = (e: PointerEvent) => {
      const inside = list.some((r) => r.current && r.current.contains(e.target as Node));
      if (!inside) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [refs, open, onClose]);
}
