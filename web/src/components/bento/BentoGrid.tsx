import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Bento grid layout.
 * Twelve columns on desktop, six on tablet, one on mobile.
 * Cards declare their span with col-span utilities in the caller.
 */
export function BentoGrid({ children, className = "" }: Props) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-gutter ${className}`}
    >
      {children}
    </div>
  );
}