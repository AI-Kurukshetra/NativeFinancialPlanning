import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
};

export function BrandMark({
  className,
  iconClassName,
  showWordmark = true,
  showTagline = true,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        aria-hidden="true"
        className={cn(
          "size-11 shrink-0 drop-shadow-[0_18px_28px_rgba(10,37,64,0.22)]",
          iconClassName,
        )}
        viewBox="0 0 72 72"
      >
        <defs>
          <linearGradient
            id="brand-mark-fill"
            x1="9"
            x2="63"
            y1="8"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#000000" />
            <stop offset="0.55" stopColor="#2b2b2b" />
            <stop offset="1" stopColor="#666666" />
          </linearGradient>
        </defs>
        <rect width="72" height="72" rx="22" fill="url(#brand-mark-fill)" />
        <path
          d="M16 48.5c6.833-1.5 12.833-4.667 18-9.5S44.5 28.417 56 20.5"
          fill="none"
          opacity="0.92"
          stroke="#F8FAFC"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5.5"
        />
        <path
          d="m45.5 20.5 10.5 0v10.5"
          fill="none"
          stroke="#F8FAFC"
          strokeLinecap="round"
          strokeWidth="5.5"
        />
        <path
          d="M18 18h14v10H18zm0 16h10v10H18zm16 0h12v10H34z"
          fill="#F8FAFC"
          opacity="0.86"
        />
      </svg>

      {showWordmark ? (
        <div className="space-y-0.5">
          <p className="text-lg font-[var(--font-heading)] font-semibold tracking-tight text-black dark:text-white">
            Native FP&amp;A
          </p>
          {showTagline ? (
            <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 dark:text-neutral-400">
              Plan at operating speed
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
