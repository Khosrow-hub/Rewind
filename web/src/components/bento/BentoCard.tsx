import type { ReactNode } from "react";

type Span =
  | "full"
  | "half"
  | "third"
  | "twoThirds"
  | "quarter"
  | "two"
  | "three"
  | "four";

type Props = {
  children: ReactNode;
  span?: Span;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
};

const spanMap: Record<Span, string> = {
  full: "md:col-span-6 lg:col-span-12",
  half: "md:col-span-3 lg:col-span-6",
  third: "md:col-span-2 lg:col-span-4",
  twoThirds: "md:col-span-4 lg:col-span-8",
  quarter: "md:col-span-3 lg:col-span-3",
  two: "md:col-span-2 lg:col-span-2",
  three: "md:col-span-3 lg:col-span-3",
  four: "md:col-span-4 lg:col-span-4"
};

export function BentoCard({
  children,
  span = "half",
  interactive = false,
  className = "",
  onClick
}: Props) {
  const base = interactive ? "bento-interactive cursor-pointer" : "bento";
  return (
    <section
      className={`${base} ${spanMap[span]} ${className}`}
      onClick={onClick}
    >
      {children}
    </section>
  );
}