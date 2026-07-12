import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { scrollToId } from "../lib/scroll-to-id";

type AppLinkProps = {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Client-side link; hash routes scroll to section (works on same page). */
export function AppLink({ href, className, style, children }: AppLinkProps) {
  const [, navigate] = useLocation();

  const onClick = (e: MouseEvent) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;

    const path = href.slice(0, hashIndex) || "/";
    const id = href.slice(hashIndex + 1);
    if (!id) return;

    e.preventDefault();
    const target = `${path}#${id}`;

    if (window.location.pathname === path) {
      window.history.pushState(null, "", target);
      scrollToId(id);
    } else {
      navigate(target);
    }
  };

  return (
    <Link href={href} className={className} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}
