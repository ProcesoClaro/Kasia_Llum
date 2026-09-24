import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "./components/chat/ChatWidget";
import cssText from "./styles.css?inline";

const HOST_ID = "coanfi-chat-widget-host";

function mount() {
  if (document.getElementById(HOST_ID)) return;

  // Navegadores sin cascade layers (@layer) ignorarían TODO el CSS del widget
  // y este se pintaría roto encima de la web. Mejor no montarlo: la página
  // del cliente queda intacta y sin chat. Cubre navegadores anteriores a
  // Chrome/Edge 99, Safari 15.4 y Firefox 97 (principios de 2022).
  if (typeof CSSLayerBlockRule === "undefined") return;
  if (!("attachShadow" in Element.prototype)) return;

  const host = document.createElement("div");
  host.id = HOST_ID;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  // Defensa frente a librerías de la página anfitriona (p. ej. SmoothScroll.js)
  // que escuchan el teclado en document y hacen preventDefault de espacio,
  // flechas, Inicio/Fin... Por el retargeting del Shadow DOM, esas librerías
  // ven como event.target el host (un DIV) en lugar del input del chat — y
  // document.activeElement también devuelve el host — así que su salvaguarda
  // de "el usuario está escribiendo" no salta y cancelan la tecla.
  // Frenamos aquí la propagación de las teclas nacidas en campos de texto del
  // widget para que nunca lleguen a document. stopPropagation, NO
  // preventDefault: el input debe seguir recibiendo la tecla con normalidad.
  host.addEventListener("keydown", (event) => {
    const origin = event.composedPath()[0];
    if (
      origin instanceof HTMLElement &&
      (/^(input|textarea)$/i.test(origin.tagName) || origin.isContentEditable)
    ) {
      event.stopPropagation();
    }
  });

  const style = document.createElement("style");
  style.textContent = cssText;
  shadow.appendChild(style);

  const container = document.createElement("div");
  shadow.appendChild(container);

  createRoot(container).render(
    <StrictMode>
      <ChatWidget />
    </StrictMode>,
  );
}

function safeMount() {
  try {
    mount();
  } catch (err) {
    // Nunca dejar que un fallo del widget afecte a la página anfitriona.
    console.error("[coanfi-chat] no se pudo iniciar el widget:", err);
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeMount, { once: true });
  } else {
    safeMount();
  }
}
