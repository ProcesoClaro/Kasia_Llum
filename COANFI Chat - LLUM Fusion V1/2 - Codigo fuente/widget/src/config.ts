/**
 * Runtime config leída desde window.COANFI_CHAT_CONFIG.
 * El plugin de WordPress inyecta ese objeto vía wp_localize_script antes
 * de cargar este bundle; en la variante HTML lo define el snippet.
 */
export type DisplayMode = "bubble" | "fullscreen";

export interface WidgetConfig {
  WEBHOOK_URL: string;
  FEEDBACK_URL: string;
  EVENT_URL: string;
  ASSISTANT_NAME: string;
  ASSISTANT_AVATAR: string;
  LOGO_URL: string;
  BRAND_COLOR: string;
  BRAND_COLOR_DARK: string;
  PRIVACY_URL: string;
  WELCOME: string;
  TOOLTIP_TEXT: string;
  CONSENT_TEXT: string;
  ASK_NAME_TEXT: string;
  CLOSE_TEXT: string;
  // ---- 10.0.0 (LLUM Fusión) ----
  /**
   * "bubble": burbuja flotante (comportamiento de siempre, landing).
   * "fullscreen": el chat ocupa toda la pantalla y se abre solo, sin burbuja
   * (enlace del QR: móvil, tablet u ordenador).
   * Se puede forzar por URL con ?modo=pantalla o ?modo=burbuja.
   */
  DISPLAY_MODE: DisplayMode;
  /**
   * Modo quiosco para una tablet/ordenador compartido (stand): botón
   * "Nueva conversación" y reinicio automático por inactividad, para que el
   * siguiente visitante no vea los datos del anterior. Por URL: ?quiosco=1.
   */
  KIOSK: boolean;
  /** Segundos sin actividad antes de reiniciar en modo quiosco. */
  KIOSK_IDLE_SECONDS: number;
  /** Aviso previo (segundos) antes del reinicio automático. */
  KIOSK_WARNING_SECONDS: number;
  /**
   * Identificador de la promoción. Se envía al webhook como `promocion` y
   * separa las claves de sessionStorage de cada promoción. Vacío = como antes.
   */
  PROMOCION: string;
  /** Subtítulo de la cabecera (vacío = "En línea"). */
  HEADER_SUBTITLE: string;
}

const DEFAULTS: WidgetConfig = {
  WEBHOOK_URL: "",
  FEEDBACK_URL: "",
  EVENT_URL: "",
  ASSISTANT_NAME: "KasIA",
  ASSISTANT_AVATAR: "",
  LOGO_URL: "",
  BRAND_COLOR: "#1E5BFF",
  BRAND_COLOR_DARK: "#1646C7",
  PRIVACY_URL: "#",
  WELCOME: "Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?",
  TOOLTIP_TEXT: "Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?",
  CONSENT_TEXT:
    "Antes de empezar, necesito que aceptes nuestra política de privacidad.",
  ASK_NAME_TEXT: "¡Gracias! ¿Cómo te llamas?",
  CLOSE_TEXT:
    "Gracias por agendar una cita con nosotros. Si necesitas algo más, puedes escribirnos de nuevo cuando lo desees.",
  DISPLAY_MODE: "bubble",
  KIOSK: false,
  KIOSK_IDLE_SECONDS: 180,
  KIOSK_WARNING_SECONDS: 20,
  PROMOCION: "",
  HEADER_SUBTITLE: "",
};

declare global {
  interface Window {
    COANFI_CHAT_CONFIG?: Partial<WidgetConfig>;
  }
}

const injected =
  typeof window !== "undefined" ? window.COANFI_CHAT_CONFIG ?? {} : {};

/** Parámetros de URL que pueden sobreescribir el modo (enlace del QR). */
function urlOverrides(): Partial<WidgetConfig> {
  if (typeof window === "undefined") return {};
  const out: Partial<WidgetConfig> = {};
  try {
    const q = new URLSearchParams(window.location.search);
    const modo = (q.get("modo") || "").toLowerCase();
    if (modo === "pantalla" || modo === "fullscreen") out.DISPLAY_MODE = "fullscreen";
    if (modo === "burbuja" || modo === "bubble") out.DISPLAY_MODE = "bubble";
    const quiosco = (q.get("quiosco") || q.get("kiosk") || "").toLowerCase();
    if (quiosco === "1" || quiosco === "si" || quiosco === "true") out.KIOSK = true;
    if (quiosco === "0" || quiosco === "no" || quiosco === "false") out.KIOSK = false;
  } catch {
    // URL rara: se ignora
  }
  return out;
}

const merged: WidgetConfig = { ...DEFAULTS, ...injected, ...urlOverrides() };

// Saneado de valores numéricos que pueden llegar como texto desde el snippet.
merged.KIOSK_IDLE_SECONDS = Math.max(20, Number(merged.KIOSK_IDLE_SECONDS) || DEFAULTS.KIOSK_IDLE_SECONDS);
merged.KIOSK_WARNING_SECONDS = Math.min(
  Math.max(5, Number(merged.KIOSK_WARNING_SECONDS) || DEFAULTS.KIOSK_WARNING_SECONDS),
  merged.KIOSK_IDLE_SECONDS - 5,
);
merged.DISPLAY_MODE = merged.DISPLAY_MODE === "fullscreen" ? "fullscreen" : "bubble";
merged.KIOSK = merged.KIOSK === true || (merged.KIOSK as unknown) === "true";

export const CONFIG: WidgetConfig = merged;
export const IS_FULLSCREEN = CONFIG.DISPLAY_MODE === "fullscreen";
