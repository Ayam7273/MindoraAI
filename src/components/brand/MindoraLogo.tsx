import { cn } from "@/lib/utils";

interface MindoraLogoProps {
  className?: string;
  size?: number;
  variant?: "cream" | "white" | "brown";
}

/** Four-petal flower mark for Mindora AI. */
export function MindoraLogo({ className, size = 48, variant = "brown" }: MindoraLogoProps) {
  const fill =
    variant === "white" ? "#ffffff" : variant === "cream" ? "#faf8f4" : "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden
    >
      <g transform="translate(24 24)">
        {[0, 90, 180, 270].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-9"
            rx="9"
            ry="14"
            fill={fill}
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="5" fill={fill} opacity={0.35} />
      </g>
    </svg>
  );
}

