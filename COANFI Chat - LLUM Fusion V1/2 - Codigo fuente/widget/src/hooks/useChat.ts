import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG, IS_FULLSCREEN } from "../config";

export type Role = "user" | "assistant";
export type FeedbackRating = "up" | "down";

export interface QuickReply {
  label: string;
  value: string;
  url?: string;
  action?: string;
  close_on_click?: boolean;
  target?: string;
}

export interface PromoCardData {
  nombre: string;
  municipio?: string;
  dormitorios?: string;
  precio_desde?: number;
  url?: string;
  imagen?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  text?: string;
  buttons?: QuickReply[];
  cards?: PromoCardData[];
  feedback?: FeedbackRating | null;
  isError?: boolean;
  isConsentRequest?: boolean;
  // Texto del mensaje del usuario al que responde este mensaje (para feedback)
  userMessage?: string;
}

// 10.0.0 · Con PROMOCION configurada, las claves llevan su sufijo: dos widgets
// de promociones distintas en el mismo dominio no comparten sesión.
const SUFIJO = CONFIG.PROMOCION ? `_${CONFIG.PROMOCION}` : "";
const SESSION_KEY = `kasia_session_id${SUFIJO}`;
const OPEN_EVENT_KEY = `coanfi_chat_open_event_sent${SUFIJO}`;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return newId();
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = newId();
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export function useChat() {
  const [sessionId, setSessionId] = useState<string>(() =>
    getOrCreateSessionId(),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [consent, setConsent] = useState<boolean>(false);
  const [consentTs, setConsentTs] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  // 10.0.0 · En pantalla completa el chat nace abierto (no hay burbuja).
  const [isOpen, setIsOpen] = useState<boolean>(IS_FULLSCREEN);
  const [chatClosed, setChatClosed] = useState<boolean>(false);

  // Flag: el siguiente POST al webhook debe llevar new_chat: true
  const newChatRef = useRef<boolean>(false);
  // 10.0.0 · Generación de conversación. Se incrementa al reiniciar (quiosco):
  // una respuesta que llegue tarde de la conversación anterior se descarta y
  // nunca aparece en la pantalla del siguiente visitante.
  const generationRef = useRef<number>(0);
  // 10.0.0 · Momento de la última actividad (quiosco: reinicio por inactividad).
  const lastActivityRef = useRef<number>(Date.now());
  const markActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const closeConversation = useCallback(() => {
    setChatClosed((prev) => {
      if (prev) return prev;
      return true;
    });
    setMessages((msgs) => {
      const closeText = CONFIG.CLOSE_TEXT;
      const alreadyClosed = msgs.some(
        (m) => m.role === "assistant" && m.text === closeText,
      );
      if (alreadyClosed) return msgs;
      return [
        ...msgs,
        {
          id: newId(),
          role: "assistant",
          text: closeText,
        },
      ];
    });
  }, []);

  const lastUserMessageRef = useRef<string>("");
  const initializedRef = useRef<boolean>(false);

  // Seed inicial: bienvenida + petición de consentimiento RGPD
  const seedMessages = (): ChatMessage[] => [
    { id: newId(), role: "assistant", text: CONFIG.WELCOME },
    {
      id: newId(),
      role: "assistant",
      isConsentRequest: true,
      text: CONFIG.CONSENT_TEXT,
    },
  ];
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setMessages(seedMessages());
  }, []);

  // Analítica: primera apertura del widget
  const sendOpenEvent = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!CONFIG.EVENT_URL) return;
    if (window.sessionStorage.getItem(OPEN_EVENT_KEY)) return;
    window.sessionStorage.setItem(OPEN_EVENT_KEY, "1");
    try {
      await fetch(CONFIG.EVENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          evento: "apertura_chatbot",
          clientId: sessionId,
          params: {},
        }),
      });
    } catch {
      // silenciar errores de analítica
    }
  }, [sessionId]);

  const openWidget = useCallback(() => {
    setIsOpen(true);
    void sendOpenEvent();
  }, [sendOpenEvent]);

  // 10.0.0 · En pantalla completa el chat ya está abierto al cargar: se
  // registra la apertura una vez, igual que al pulsar la burbuja.
  // Tras un reinicio de quiosco, la apertura del siguiente visitante se registra
  // cuando ya está disponible su nuevo sessionId (sendOpenEvent cambia con él).
  const pendingOpenEventRef = useRef<boolean>(IS_FULLSCREEN);
  useEffect(() => {
    if (!pendingOpenEventRef.current) return;
    pendingOpenEventRef.current = false;
    void sendOpenEvent();
  }, [sendOpenEvent]);

  const closeWidget = useCallback(() => setIsOpen(false), []);
  const toggleWidget = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) void sendOpenEvent();
      return next;
    });
  }, [sendOpenEvent]);

  const acceptConsent = useCallback(() => {
    // Generar un sessionId NUEVO al iniciar conversación y guardarlo en
    // sessionStorage. Sobrescribe cualquier id provisional heredado de una
    // conversación anterior, para que el backend no arrastre estado en Redis.
    const newSessionId = newId();
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, newSessionId);
    }
    setSessionId(newSessionId);
    // El siguiente POST al webhook debe marcar new_chat: true
    newChatRef.current = true;

    const ts = new Date().toISOString();
    lastActivityRef.current = Date.now();
    setConsent(true);
    setConsentTs(ts);
    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: "assistant",
        text: CONFIG.ASK_NAME_TEXT,
      },
    ]);
  }, []);

  const postChat = useCallback(
    async (message: string) => {
      if (!CONFIG.WEBHOOK_URL) {
        throw new Error("WEBHOOK_URL no configurado");
      }
      // Leer el sessionId de sessionStorage en cada POST; si no existe, crear
      // uno nuevo. Nunca enviar null/vacío.
      const sid = getOrCreateSessionId();
      const body: Record<string, unknown> = {
        sessionId: sid,
        message,
        name: null,
        consent,
      };
      // 10.0.0 · Informativo para el backend (preparado para multipromoción).
      if (CONFIG.PROMOCION) body.promocion = CONFIG.PROMOCION;
      if (newChatRef.current) {
        body.new_chat = true;
      }
      const res = await fetch(CONFIG.WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Solo tras 2xx marcamos que ya no es el primer mensaje de la
      // conversación. Si falla, el reintento seguirá llevando new_chat: true.
      if (newChatRef.current) newChatRef.current = false;
      return res.json();
    },
    [consent],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (!consent) return;
      if (chatClosed) return;




      lastUserMessageRef.current = trimmed;
      lastActivityRef.current = Date.now();
      const generation = generationRef.current;
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "user", text: trimmed },
      ]);
      setIsTyping(true);

      try {
        const data = await postChat(trimmed);
        // Se reinició la conversación mientras esperábamos: respuesta huérfana.
        if (generation !== generationRef.current) return;
        lastActivityRef.current = Date.now();
        setIsTyping(false);

        // Mensaje intermedio (debounce en servidor) → no pintar nada
        if (data && data.skipped === true) return;

        const respuesta: string | undefined = data?.respuesta;
        const buttons: QuickReply[] | undefined = Array.isArray(data?.buttons)
          ? data.buttons
          : undefined;
        const cards: PromoCardData[] | undefined = Array.isArray(data?.cards)
          ? data.cards
          : undefined;

        if (respuesta || buttons?.length || cards?.length) {
          setMessages((prev) => [
            ...prev,
            {
              id: newId(),
              role: "assistant",
              text: respuesta,
              buttons,
              cards,
              feedback: null,
              userMessage: trimmed,
            },
          ]);
        }
      } catch {
        if (generation !== generationRef.current) return;
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            text: "Ups, ha habido un problema. ¿Puedes repetirlo?",
            isError: true,
          },
        ]);
      }
    },
    [consent, postChat, chatClosed],
  );

  const sendFeedback = useCallback(
    async (turnId: string, rating: FeedbackRating) => {
      const msg = messages.find((m) => m.id === turnId);
      if (!msg || msg.feedback) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === turnId ? { ...m, feedback: rating } : m)),
      );
      if (!CONFIG.FEEDBACK_URL) return;
      try {
        await fetch(CONFIG.FEEDBACK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            turnId,
            rating,
            mensaje: msg.userMessage ?? "",
            respuesta: msg.text ?? "",
          }),
        });
      } catch {
        // silenciar
      }
    },
    [messages, sessionId],
  );

  // 10.0.0 · Reinicio completo (quiosco / "Nueva conversación"): se borra lo
  // visible, se revoca el consentimiento (el siguiente visitante debe aceptar
  // la política) y se genera un sessionId nuevo. En el backend, el primer
  // mensaje tras aceptar lleva new_chat: true, así que Redis empieza limpio.
  const resetConversation = useCallback(() => {
    generationRef.current += 1;
    const sid = newId();
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(SESSION_KEY, sid);
        window.sessionStorage.removeItem(OPEN_EVENT_KEY);
      } catch {
        // almacenamiento no disponible: no pasa nada
      }
    }
    setSessionId(sid);
    newChatRef.current = false;
    pendingOpenEventRef.current = IS_FULLSCREEN;
    lastUserMessageRef.current = "";
    lastActivityRef.current = Date.now();
    setConsent(false);
    setConsentTs(null);
    setIsTyping(false);
    setChatClosed(false);
    setMessages(seedMessages());
  }, []);

  return {
    sessionId,
    messages,
    consent,
    consentTs,
    isTyping,
    isOpen,
    openWidget,
    closeWidget,
    toggleWidget,
    acceptConsent,
    sendMessage,
    sendFeedback,
    chatClosed,
    closeConversation,
    resetConversation,
    markActivity,
    lastActivityRef,
  };
}
