import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { CONFIG, IS_FULLSCREEN } from "../../config";
import { useChat } from "../../hooks/useChat";
import { ChatWindow } from "./ChatWindow";

/**
 * Widget de chat autocontenido. Monta en cualquier página con <ChatWidget />.
 * Burbuja flotante abajo-derecha + ventana de chat.
 */
export function ChatWidget() {
  const chat = useChat();
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // 10.0.0 · Pantalla completa (enlace del QR): solo la ventana, siempre
  // abierta, sin burbuja ni tooltip. No se puede cerrar: no hay página debajo.
  if (IS_FULLSCREEN) {
    return (
      <ChatWindow
        chat={chat}
        onClose={() => undefined}
        fullscreen
        kiosk={CONFIG.KIOSK}
      />
    );
  }

  return (
    <>
      {chat.isOpen && (
        <ChatWindow chat={chat} onClose={chat.closeWidget} kiosk={CONFIG.KIOSK} />
      )}

      {/* Tooltip de bienvenida */}
      {!chat.isOpen && !tooltipDismissed && CONFIG.TOOLTIP_TEXT && (
        <div className="fixed bottom-28 right-6 z-[2147483646] hidden max-w-[220px] animate-in fade-in slide-in-from-bottom-2 items-start gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-gray-800 shadow-lg sm:flex">
          <span>{CONFIG.TOOLTIP_TEXT}</span>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setTooltipDismissed(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Burbuja flotante */}
      <button
        type="button"
        onClick={chat.toggleWidget}
        aria-label={chat.isOpen ? "Cerrar chat" : "Abrir chat"}
        className={`fixed bottom-6 right-6 z-[2147483647] h-20 w-20 items-center justify-center overflow-hidden rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95 ${
          // En móvil la ventana ocupa toda la pantalla y tiene su propia X en
          // la cabecera: el launcher flotante se ocultaría encima del botón de
          // enviar, así que solo se muestra cuando el chat está cerrado.
          chat.isOpen ? "hidden sm:flex" : "flex"
        }`}
        style={{ backgroundColor: CONFIG.BRAND_COLOR }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR_DARK)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR)
        }
      >
        {chat.isOpen ? (
          <X className="h-7 w-7" />
        ) : CONFIG.ASSISTANT_AVATAR ? (
          <img
            src={CONFIG.ASSISTANT_AVATAR}
            alt={CONFIG.ASSISTANT_NAME}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
      </button>
    </>
  );
}

export default ChatWidget;
