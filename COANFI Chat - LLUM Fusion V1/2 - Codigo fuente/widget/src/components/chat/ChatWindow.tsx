import { RotateCcw, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONFIG } from "../../config";
import type { useChat } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

type ChatApi = ReturnType<typeof useChat>;

export function ChatWindow({
  chat,
  onClose,
  fullscreen = false,
  kiosk = false,
}: {
  chat: ChatApi;
  onClose: () => void;
  /** 10.0.0 · Ocupa toda la pantalla en cualquier dispositivo (enlace QR). */
  fullscreen?: boolean;
  /** 10.0.0 · Tablet compartida: "Nueva conversación" + reinicio por inactividad. */
  kiosk?: boolean;
}) {
  const [draft, setDraft] = useState("");
  // Segundos que faltan para el reinicio automático (null = sin aviso visible).
  const [kioskCountdown, setKioskCountdown] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // En móvil la ventana es fixed a pantalla completa, pero al abrirse el
  // teclado virtual (iOS sobre todo) este tapa la barra de escritura: el
  // usuario teclea a ciegas. visualViewport sí refleja el hueco visible real,
  // así que ajustamos alto y offset de la ventana al viewport visual.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const desktop = window.matchMedia("(min-width: 640px)");
    const update = () => {
      const el = rootRef.current;
      if (!el) return;
      // En pantalla completa también se ajusta en tablet (teclado del iPad).
      if (desktop.matches && !fullscreen) {
        el.style.top = "";
        el.style.height = "";
        return;
      }
      el.style.top = `${vv.offsetTop}px`;
      el.style.height = `${vv.height}px`;
      // Mantener la conversación pegada al final al encoger el hueco visible
      const sc = scrollRef.current;
      if (sc) sc.scrollTop = sc.scrollHeight;
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  // Foco automático en el input al abrir (cuando consent ya está aceptado)
  useEffect(() => {
    if (chat.consent) inputRef.current?.focus();
  }, [chat.consent]);

  // Auto-scroll al final cuando llegan mensajes nuevos
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.messages, chat.isTyping]);

  // ---------- 10.0.0 · QUIOSCO ----------
  // Solo cuenta la inactividad si la conversación ha empezado (política
  // aceptada o algo escrito): una pantalla en blanco no hay que reiniciarla.
  const conversacionEmpezada = chat.consent || draft.trim().length > 0;
  const restart = () => {
    setDraft("");
    setKioskCountdown(null);
    chat.resetConversation();
  };
  useEffect(() => {
    if (!kiosk) return;
    const tick = window.setInterval(() => {
      if (!conversacionEmpezada) {
        setKioskCountdown(null);
        return;
      }
      const idle = (Date.now() - chat.lastActivityRef.current) / 1000;
      const restante = Math.ceil(CONFIG.KIOSK_IDLE_SECONDS - idle);
      if (restante <= 0) {
        restart();
      } else if (restante <= CONFIG.KIOSK_WARNING_SECONDS) {
        setKioskCountdown(restante);
      } else {
        setKioskCountdown(null);
      }
    }, 1000);
    return () => window.clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kiosk, conversacionEmpezada]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chat.consent || chat.chatClosed || !draft.trim()) return;
    void chat.sendMessage(draft);
    setDraft("");
  };

  const logoSrc = CONFIG.LOGO_URL || CONFIG.ASSISTANT_AVATAR;
  // En pantalla completa el contenido se centra en una columna legible en
  // tablet y ordenador; en móvil ocupa todo el ancho igual que antes.
  const columna = fullscreen ? "mx-auto w-full max-w-[760px]" : "";

  return (
    <div
      ref={rootRef}
      className={
        fullscreen
          ? "fixed inset-0 z-[2147483646] flex flex-col bg-white"
          : "fixed inset-0 z-[2147483646] flex flex-col bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:inset-auto sm:bottom-28 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-[20px]"
      }
      role="dialog"
      aria-label={`Chat con ${CONFIG.ASSISTANT_NAME}`}
      // Cualquier toque o tecla dentro del chat cuenta como actividad (quiosco).
      onPointerDown={kiosk ? chat.markActivity : undefined}
      onKeyDown={kiosk ? chat.markActivity : undefined}
    >
      {/* Header */}
      <div
        className={`text-white shadow-sm ${fullscreen ? "pt-[env(safe-area-inset-top)]" : "sm:rounded-t-[20px]"}`}
        style={{ backgroundColor: CONFIG.BRAND_COLOR }}
      >
      <div className={`flex items-center gap-3 px-4 py-3.5 ${columna}`}>
        {logoSrc && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <img
              src={logoSrc}
              alt=""
              className="h-6 w-6 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center leading-none">
          <div
            className="truncate text-[17px] font-extrabold tracking-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            {CONFIG.ASSISTANT_NAME}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-white/85">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(255,255,255,0.15)]" />
            {CONFIG.HEADER_SUBTITLE || "En línea"}
          </div>
        </div>
        {kiosk && (
          <button
            type="button"
            onClick={restart}
            aria-label="Nueva conversación"
            className="flex h-9 flex-shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/40 px-3 text-xs font-semibold transition-colors hover:bg-white/15"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Nueva conversación</span>
          </button>
        )}
        {!fullscreen && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar chat"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      </div>

      {/* 10.0.0 · Aviso de reinicio por inactividad (quiosco) */}
      {kiosk && kioskCountdown !== null && (
        <div className="border-b border-amber-200 bg-amber-50 text-amber-900">
          <div className={`flex items-center gap-3 px-4 py-2.5 text-sm ${columna}`}>
            <span className="flex-1">
              ¿Sigues ahí? La conversación se borrará en {kioskCountdown} s para el siguiente visitante.
            </span>
            <button
              type="button"
              onClick={() => {
                chat.markActivity();
                setKioskCountdown(null);
              }}
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: CONFIG.BRAND_COLOR }}
            >
              Seguir
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white px-3 py-4"
      >
        <div className={`space-y-3 ${columna}`}>
        {chat.messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            onPickQuickReply={(v) => void chat.sendMessage(v)}
            onFeedback={chat.sendFeedback}
            onAcceptConsent={chat.acceptConsent}
            consentAccepted={chat.consent}
            chatClosed={chat.chatClosed}
            onCloseConversation={chat.closeConversation}
          />
        ))}
        {chat.isTyping && (
          <div className="flex items-end gap-2">
            {CONFIG.ASSISTANT_AVATAR && (
              <img
                src={CONFIG.ASSISTANT_AVATAR}
                alt=""
                className="h-7 w-7 flex-shrink-0 rounded-full bg-gray-200 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility =
                    "hidden";
                }}
              />
            )}
            <div className="rounded-[14px] rounded-bl-sm bg-[#F4F4F6]">
              <TypingIndicator />
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`border-t border-gray-100 bg-white ${fullscreen ? "pb-[env(safe-area-inset-bottom)]" : "sm:rounded-b-[20px]"}`}
      >
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 p-3 ${columna}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (kiosk) chat.markActivity();
          }}
          disabled={!chat.consent || chat.chatClosed}
          placeholder={
            !chat.consent
              ? "Acepta la política para continuar"
              : chat.chatClosed
                ? "Conversación finalizada"
                : "Escribe tu mensaje..."
          }
          aria-label="Mensaje"
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-base outline-none transition-colors focus:border-gray-300 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        />
        <button
          type="submit"
          disabled={!chat.consent || chat.chatClosed || !draft.trim()}
          aria-label="Enviar mensaje"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:opacity-40"
          style={{ backgroundColor: CONFIG.BRAND_COLOR }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled)
              e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR_DARK;
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR)
          }
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      </div>
    </div>
  );
}
