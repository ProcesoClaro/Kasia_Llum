=== COANFI Chat ===
Contributors: procesoclaro
Tags: chat, chatbot, n8n, widget, ai
Requires at least: 6.0
Tested up to: 6.7
Stable tag: 4.1.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Widget de chat KasIA embebible. Configurable desde Ajustes → COANFI Chat.

== Description ==

Añade a tu WordPress un widget de chat flotante que se conecta a un webhook (n8n, Make, tu propia API, etc.).
La conversación, respuestas y feedback se procesan en el servicio que tú configures — el plugin no depende de servidores de terceros.

= Características =

* Widget flotante en esquina inferior derecha.
* Consentimiento RGPD antes de conversar.
* Feedback 👍 / 👎 por cada respuesta.
* Cierre automático de la conversación (por ejemplo, tras agendar una cita).
* Nombre del asistente resaltado en negrita cuando aparece en las respuestas.
* Personalización de nombre, avatar, logo, colores, textos y URLs.
* Modo automático (todas las páginas) o mediante shortcode `[coanfi_chat]`.
* Aislamiento total del tema mediante Shadow DOM.

== Installation ==

1. Sube el ZIP desde Plugins → Añadir nuevo → Subir plugin.
2. Actívalo.
3. Ve a Ajustes → COANFI Chat y configura al menos la URL del webhook de chat.

== Changelog ==

= 4.1.0 =
* Bundle 10.0.0 (LLUM Fusión). Compatible hacia atrás: sin claves nuevas, el widget funciona igual que en 4.0.2.
* Nuevas claves opcionales en window.COANFI_CHAT_CONFIG: DISPLAY_MODE ("bubble" | "fullscreen"), KIOSK, KIOSK_IDLE_SECONDS, KIOSK_WARNING_SECONDS, PROMOCION, HEADER_SUBTITLE. (La página de Ajustes del plugin aún no las muestra.)
* Pantalla completa (enlace QR) y modo quiosco para tablet compartida: botón "Nueva conversación" y reinicio automático por inactividad.

= 4.0.2 =
* Arreglado el tamano en movil con plantillas que reducen el font-size base de la pagina (el widget se veia encogido).
* La burbuja flotante se oculta en movil mientras el chat esta abierto (tapaba el boton de enviar).
* La ventana se ajusta al teclado virtual (iOS): la caja de escritura queda siempre visible.
* Sin auto-zoom de iOS al enfocar el campo (letra a 16px en movil).

= 4.0.1 =
* Compatibilidad ampliada: funciona en navegadores desde principios de 2022 (Chrome/Edge 99+, Safari/iOS 15.4+, Firefox 97+); en anteriores no se muestra sin afectar a la web.
* El boton "Acepto" pasa a "✓ Aceptado" (verde) y se desactiva tras aceptar la politica, evitando ademas que pulsaciones repetidas regeneren la sesion.
* Blindaje de teclado frente a librerias de la plantilla anfitriona (p. ej. SmoothScroll.js) que cancelan espacio/flechas a nivel de document: por el retargeting del Shadow DOM no detectaban que el usuario escribia en el chat. Las teclas nacidas en el input ya no salen del widget.

= 4.0.0 =
* Cada conversacion usa un sessionId nuevo, generado al aceptar la politica de privacidad, y el primer mensaje viaja con `new_chat: true` para que el backend no arrastre estado de conversaciones anteriores.
* Los webhooks de produccion de COANFI vienen preconfigurados; siguen siendo editables desde Ajustes.
* La cabecera del chat muestra el isotipo de Coanfi (antes repetia el avatar).
* Avatar de KasIA en PNG con transparencia.

= 3.0.0 =
* Avatar y logo por defecto de KasIA incluidos en el plugin (bundled).
* Actualizado el nombre del asistente por defecto a KasIA (I mayúscula).
* El resaltado en negrita del nombre del asistente ahora es case-insensitive.

= 2.0.0 =
* Actualización del asistente a KasiA (nombre, mensaje de bienvenida, avatar).
* Nueva funcionalidad: cierre automático de conversación cuando el webhook lo indica.
* Los botones de respuesta rápida pueden ser tipo botón o enlace, con soporte de `target`.
* Nuevo campo configurable: texto al cerrar la conversación.
* El nombre del asistente se resalta en negrita cuando aparece en las respuestas.
* Ya no se envía el nombre del usuario al webhook (se conserva el intercambio conversacional).

= 1.0.0 =
* Primera versión.
