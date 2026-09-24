import type { CSSProperties } from "react";
import type { QuickReply } from "../../hooks/useChat";
import { CONFIG } from "../../config";

// Clases visuales que NO dependen del preflight de Tailwind (que dentro del
// Shadow DOM se comporta de forma inconsistente).
const pillClasses =
  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors inline-flex items-center justify-center";

const basePillStyle: CSSProperties = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: CONFIG.BRAND_COLOR,
  color: CONFIG.BRAND_COLOR,
  backgroundColor: "#ffffff",
  textDecoration: "none",
  cursor: "pointer",
  lineHeight: 1.2,
};

const disabledStyle: CSSProperties = {
  ...basePillStyle,
  cursor: "not-allowed",
  opacity: 0.5,
};

export function QuickReplyButtons({
  buttons,
  onPick,
  disabled = false,
  onLinkClick,
}: {
  buttons: QuickReply[];
  onPick: (value: string) => void;
  disabled?: boolean;
  onLinkClick?: (btn: QuickReply) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {buttons.map((b, i) => {
        const isLink = b.action === "link" && !!(b.url || b.value);
        const linkUrl = isLink ? b.url || b.value : null;

        if (linkUrl) {
          if (disabled) {
            return (
              <span key={i} className={pillClasses} style={disabledStyle}>
                {b.label}
              </span>
            );
          }
          return (
            <a
              key={i}
              href={linkUrl}
              target={b.target || "_blank"}
              rel="noopener noreferrer"
              onClick={() => onLinkClick?.(b)}
              className={pillClasses}
              style={basePillStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9fafb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#ffffff")
              }
            >
              {b.label}
            </a>
          );
        }

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onPick(b.value)}
            className={pillClasses}
            style={disabled ? disabledStyle : basePillStyle}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}
