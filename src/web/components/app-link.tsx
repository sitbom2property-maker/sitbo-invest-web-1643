import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { scrollToId } from "../lib/scroll-to-id";

type AppLinkProps = {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onNavigate?: () => void;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/** Client-side link; hash routes scroll to section (works on same page). */
export function AppLink({
  href,
  className,
  style,
  children,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: AppLinkProps) {
  const [, navigate] = useLocation();

  const onClick = (e: MouseEvent) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) {
      onNavigate?.();
      return;
    }

    const path = href.slice(0, hashIndex) || "/";
    const id = href.slice(hashIndex + 1);
    if (!id) {
      onNavigate?.();
      return;
    }

    e.preventDefault();
    onNavigate?.();

    const applyHash = () => {
      window.history.replaceState(null, "", `${path}#${id}`);
      scrollToId(id);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    };

    if (window.location.pathname === path) {
      window.history.pushState(null, "", `${path}#${id}`);
      scrollToId(id);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      return;
    }

    // wouter drops hashes — navigate to the path, then attach # and scroll
    navigate(path);
    window.setTimeout(applyHash, 80);
    window.setTimeout(() => scrollToId(id), 280);
  };

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}
