import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { ReactNode } from "react";
import type { ChatMessage, FeedbackRating } from "../../hooks/useChat";
import { CONFIG } from "../../config";
import { PromoCard } from "./PromoCard";
import { QuickReplyButtons } from "./QuickReplyButtons";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderTextWithBoldName(text: string): ReactNode {
  const name = CONFIG.ASSISTANT_NAME;
  if (!name) return text;
  // Case-insensitive: encuentra el nombre aunque el webhook devuelva
  // variaciones como "KasiA", "KASIA", "kasia", etc.
  const regex = new RegExp(escapeRegExp(name), "gi");
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={key++}>{match[0]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  if (parts.length === 0) return text;
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}

interface Props {
  message: ChatMessage;
  onPickQuickReply: (value: string) => void;
  onFeedback: (turnId: string, rating: FeedbackRating) => void;
  onAcceptConsent: () => void;
  // true una vez el usuario ha aceptado la política de privacidad
  consentAccepted?: boolean;
  chatClosed?: boolean;
  onCloseConversation?: () => void;
}

export function MessageBubble({
  message,
  onPickQuickReply,
  onFeedback,
  onAcceptConsent,
  consentAccepted = false,
  chatClosed = false,
  onCloseConversation,
}: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex animate-in fade-in slide-in-from-bottom-2 justify-end">
        <div
          className="max-w-[78%] whitespace-pre-wrap rounded-[14px] rounded-br-sm px-3.5 py-2.5 text-sm text-white shadow-sm"
          style={{ backgroundColor: CONFIG.BRAND_COLOR }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  // Asistente
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-2 items-end gap-2">
      <img
        src={CONFIG.ASSISTANT_AVATAR}
        alt=""
        className="h-7 w-7 flex-shrink-0 rounded-full bg-gray-200 object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
      <div className="max-w-[82%] space-y-2">
        {message.text && (
          <div
            className={`whitespace-pre-wrap rounded-[14px] rounded-bl-sm px-3.5 py-2.5 text-sm ${
              message.isError
                ? "bg-red-50 text-red-800"
                : "bg-[#F4F4F6] text-gray-900"
            }`}
          >
            {renderTextWithBoldName(message.text)}
            {message.isConsentRequest && (
              <div className="mt-2 space-y-2">
                <div className="text-xs text-gray-600">
                  Lee nuestra{" "}
                  <a
                    href={CONFIG.PRIVACY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: CONFIG.BRAND_COLOR }}
                  >
                    política de privacidad
                  </a>
                  .
                </div>
                {consentAccepted ? (
                  /* Estado aceptado: color de confirmación y sin interacción,
                     para que no se pueda volver a pulsar (cada pulsación extra
                     regeneraría la sesión y duplicaría el saludo). */
                  <button
                    type="button"
                    disabled
                    className="cursor-default rounded-full px-4 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: "#16A34A" }}
                  >
                    ✓ Aceptado
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onAcceptConsent}
                    className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition-colors"
                    style={{ backgroundColor: CONFIG.BRAND_COLOR }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        CONFIG.BRAND_COLOR_DARK)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR)
                    }
                  >
                    Acepto
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {message.cards && message.cards.length > 0 && (
          <div className="grid gap-2">
            {message.cards.map((card, i) => (
              <PromoCard key={i} data={card} />
            ))}
          </div>
        )}

        {message.buttons && message.buttons.length > 0 && (
          <QuickReplyButtons
            buttons={message.buttons}
            onPick={onPickQuickReply}
            disabled={chatClosed}
            onLinkClick={(btn) => {
              if (btn.close_on_click === true) onCloseConversation?.();
            }}
          />
        )}

        {/* Feedback solo para respuestas reales (no consent, no error) */}
        {message.feedback !== undefined && !message.isError && (
          <div className="flex gap-1 pl-1">
            <button
              type="button"
              aria-label="Respuesta útil"
              onClick={() => onFeedback(message.id, "up")}
              disabled={message.feedback !== null}
              className={`rounded-full p-1.5 transition-colors ${
                message.feedback === "up"
                  ? "bg-green-100 text-green-700"
                  : "text-gray-400 hover:bg-gray-100 disabled:opacity-30"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Respuesta no útil"
              onClick={() => onFeedback(message.id, "down")}
              disabled={message.feedback !== null}
              className={`rounded-full p-1.5 transition-colors ${
                message.feedback === "down"
                  ? "bg-red-100 text-red-700"
                  : "text-gray-400 hover:bg-gray-100 disabled:opacity-30"
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
