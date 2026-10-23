/*
  Small building blocks used by every nav part.
  Figma: "Icon button" (Style × Size × State), "Avatar" (Size), "Badge" (Tone × Size).
*/
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../icons/Icon';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: IconName;
  /** Accessible name — required, the button has no visible text. */
  label: string;
  /** Figma Size: M = 44px (icon 22), S = 32px (icon 18). */
  size?: 'M' | 'S';
  /** Figma Style: Gray (filled circle) or Plain (no fill). */
  variant?: 'gray' | 'plain';
  /** Small danger count, e.g. unread notifications. */
  count?: number;
};

export function IconButton({ icon, label, size = 'M', variant = 'gray', count, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={count ? `${label} (${count})` : label}
      title={label}
      className={['icon-btn', `icon-btn--${size.toLowerCase()}`, `icon-btn--${variant}`, 'state-layer', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Icon name={icon} size={size === 'M' ? 22 : 18} />
      {count ? <Badge tone="danger" className="icon-btn__count">{count}</Badge> : null}
    </button>
  );
}

/** Figma Avatar. People are round, businesses are rounded squares (radius/sm or radius/xs). */
export function Avatar({ initials, size = 'M', shape = 'round' }: { initials: string; size?: 'S' | 'M' | 'L'; shape?: 'round' | 'square' }) {
  return (
    <span className={`avatar avatar--${size.toLowerCase()} avatar--${shape}`} aria-hidden="true">
      {initials}
    </span>
  );
}

export function Badge({ tone = 'neutral', children, className }: { tone?: 'neutral' | 'success' | 'warning' | 'danger'; children: ReactNode; className?: string }) {
  return <span className={['badge', `badge--${tone}`, 't-caps-label', className].filter(Boolean).join(' ')}>{children}</span>;
}
