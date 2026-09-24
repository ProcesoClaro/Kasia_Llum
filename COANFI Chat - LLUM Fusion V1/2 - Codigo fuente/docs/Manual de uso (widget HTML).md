# Manual de uso — Widget COANFI Chat (HTML)

Versión 9.0.2

---

## 1. ¿Qué es esto?

El **Widget COANFI Chat** es un pequeño componente de chat flotante (una burbuja en la esquina inferior derecha) que se puede añadir a cualquier página web HTML incluyendo dos etiquetas `<script>`. Al hacer clic sobre la burbuja, se abre una ventana de conversación con un asistente virtual llamado **KasIA**.

El widget se limita a mostrar la interfaz. Las respuestas del asistente se procesan en un servicio externo (por ejemplo n8n) al que el widget se conecta mediante URLs configurables llamadas **webhooks**.

Ventajas:

- **No requiere WordPress ni ningún CMS.** Funciona en cualquier página HTML.
- **Sin librerías externas ni dependencias.** Un único archivo JavaScript.
- **No modifica el diseño del sitio.** El widget se renderiza en un contenedor aislado (**Shadow DOM**), por lo que sus estilos no interfieren con la maquetación de tu página.
- **Independencia total.** El widget se comunica únicamente con el webhook que tú configures.

---

## 2. Contenido de la entrega

Dentro de la carpeta `coanfi-chat/` encontrarás:

| Archivo | Descripción |
|---|---|
| `coanfi-chat.js` | El widget compilado. Es el archivo principal que hay que subir al servidor. |
| `kasia-avatar.png` | Avatar oficial de KasIA (circular, fondo transparente). Se muestra junto a cada respuesta del asistente. |
| `coanfi-isotipo.jpg` | Isotipo de Coanfi. Se muestra en la cabecera de la ventana del chat. |
| `demo.html` | Página de ejemplo. Ábrela con doble clic para ver cómo se comporta el widget con la configuración por defecto. |
| `snippet.html` | Fragmento listo para copiar y pegar en las plantillas HTML de tu sitio. |

---

## 3. Instalación en tu web (3 pasos)

### Paso 1 — Sube los archivos al servidor

Sube al servidor de tu web:

- `coanfi-chat.js` — habitualmente en una carpeta `/js/`.
- `kasia-avatar.png` y `coanfi-isotipo.jpg` — habitualmente en una carpeta `/img/`.

Ejemplo:

```
https://tu-dominio.com/js/coanfi-chat.js
https://tu-dominio.com/img/kasia-avatar.png
https://tu-dominio.com/img/coanfi-isotipo.jpg
```

### Paso 2 — Añade el snippet a tus páginas

En cada página HTML donde quieras que aparezca la burbuja del chat, pega este fragmento **justo antes de la etiqueta `</body>`**:

```html
<script>
    window.COANFI_CHAT_CONFIG = {
        WEBHOOK_URL: "https://n8n-automation-u76494.vm.elestio.app/webhook/chat-velvet",
        FEEDBACK_URL: "https://n8n-automation-u76494.vm.elestio.app/webhook/feedback",
        EVENT_URL: "https://n8n-automation-u76494.vm.elestio.app/webhook/event",
        ASSISTANT_NAME: "KasIA",
        ASSISTANT_AVATAR: "/img/kasia-avatar.png",
        LOGO_URL: "/img/coanfi-isotipo.jpg",
        BRAND_COLOR: "#1E5BFF",
        BRAND_COLOR_DARK: "#1646C7",
        PRIVACY_URL: "https://www.coanfi.com/politica-privacidad/",
        WELCOME: "Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?",
        TOOLTIP_TEXT: "Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?",
        CONSENT_TEXT: "Antes de empezar, necesito que aceptes nuestra política de privacidad.",
        ASK_NAME_TEXT: "¡Gracias! ¿Cómo te llamas?",
        CLOSE_TEXT: "Gracias por agendar una cita con nosotros. Si necesitas algo más, puedes escribirnos de nuevo cuando lo desees."
    };
</script>
<script src="/js/coanfi-chat.js"></script>
```

> **Consejo:** si tu web se genera con una plantilla común (header/footer compartidos), añade el snippet en el footer para que aparezca en todas las páginas de una sola vez.

### Paso 3 — Ajusta la ruta y el webhook

- En el segundo `<script>`, ajusta el atributo `src` para que apunte a la ubicación donde has subido `coanfi-chat.js`.
- En el primer `<script>`, sustituye `WEBHOOK_URL` por la URL real del webhook que procesa la conversación (obligatorio).

Guarda, sube el HTML y recarga la página: la burbuja debe aparecer abajo a la derecha.

---

## 4. Descripción de cada parámetro de configuración

Todos los parámetros van dentro del objeto `window.COANFI_CHAT_CONFIG`.

### 4.1. Webhooks

| Parámetro | Obligatorio | Descripción |
|---|---|---|
| `WEBHOOK_URL` | **Sí** | Endpoint al que se envían por `POST` los mensajes del usuario. La respuesta JSON de este endpoint es lo que verá el usuario como respuesta del asistente. Formato esperado: `{ respuesta: "...", buttons: [...], cards: [...] }`. Los `buttons` pueden ser botones normales o enlaces (`action: "link"`), y pueden incluir `close_on_click: true` para cerrar la conversación al pulsarlos. |
| `FEEDBACK_URL` | No | Endpoint que recibe los votos 👍 / 👎 que el usuario da a cada respuesta. Si se deja vacío, los botones siguen apareciendo pero no se envía nada. |
| `EVENT_URL` | No | Endpoint que recibe eventos analíticos (actualmente: apertura del chat). Si se deja vacío, los eventos no se envían. |

### 4.2. Identidad

| Parámetro | Descripción |
|---|---|
| `ASSISTANT_NAME` | Nombre del asistente. Aparece en la cabecera de la ventana del chat y **se resalta en negrita** cuando aparece en las respuestas del asistente. |
| `ASSISTANT_AVATAR` | URL de la imagen (PNG cuadrado con fondo transparente recomendado) que se muestra junto a cada respuesta del asistente. |
| `LOGO_URL` | URL del logo que aparece en la cabecera del chat, dentro del círculo blanco a la izquierda del nombre. Si se deja vacío, se usa el mismo `ASSISTANT_AVATAR`. |
| `PRIVACY_URL` | URL de tu página de política de privacidad. Se enlaza desde el mensaje de consentimiento RGPD que aparece al abrir el chat. |

### 4.3. Colores de marca

| Parámetro | Descripción |
|---|---|
| `BRAND_COLOR` | Color principal (hexadecimal, ej. `#1E5BFF`). Se aplica a la burbuja flotante, la cabecera del chat, las burbujas del usuario, los botones y los enlaces. |
| `BRAND_COLOR_DARK` | Color al pasar el cursor por encima de los elementos anteriores. Suele ser una versión más oscura del principal (ej. `#1646C7`). |

### 4.4. Textos

| Parámetro | Descripción |
|---|---|
| `WELCOME` | Primer mensaje del asistente al abrir el chat. Ejemplo: *"Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?"* |
| `TOOLTIP_TEXT` | Mensaje pequeño que aparece encima de la burbuja invitando a hacer clic. Sólo visible en pantallas grandes. |
| `CONSENT_TEXT` | Texto que solicita al usuario aceptar la política de privacidad antes de conversar. |
| `ASK_NAME_TEXT` | Mensaje que muestra el asistente tras aceptar el consentimiento. |
| `CLOSE_TEXT` | Mensaje que aparece cuando la conversación se da por finalizada (por ejemplo, cuando el usuario acaba de agendar una cita mediante un botón con `close_on_click: true`). Una vez mostrado, la caja de entrada se bloquea. |

---

## 5. Cómo funciona el chat (flujo)

1. El visitante ve una **burbuja flotante** abajo a la derecha.
2. Al hacer clic, se abre la **ventana del chat**.
3. El asistente saluda con `WELCOME` y pide al usuario aceptar la **política de privacidad**.
4. Tras aceptar, el asistente muestra `ASK_NAME_TEXT`.
5. El usuario ya puede conversar libremente. Cada mensaje se envía al `WEBHOOK_URL` junto con el `sessionId`, y el asistente responde según lo que devuelva el webhook.
6. En cada respuesta aparecen dos botones (👍 y 👎) para valorarla.
7. Si el webhook devuelve un botón con `close_on_click: true`, al pulsarlo se muestra `CLOSE_TEXT` y la conversación se cierra.

**Sesión:** cada **conversación** recibe un identificador único (`sessionId`), que se genera en el momento en que el usuario pulsa "Acepto" y se envía en cada petición. Vive en `sessionStorage` y se borra al cerrar la pestaña. El primer mensaje de cada conversación viaja además con `new_chat: true`, para que el asistente arranque sin memoria de conversaciones anteriores.

**Aislamiento visual:** el widget se renderiza dentro de un **Shadow DOM**, por lo que sus estilos no afectan al resto de la página ni al revés.

---

## 6. Ejemplo mínimo de página HTML completa

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi web</title>
</head>
<body>
    <h1>Contenido de mi página</h1>
    <p>Aquí va el contenido normal de la web.</p>

    <script>
        window.COANFI_CHAT_CONFIG = {
            WEBHOOK_URL: "https://n8n-automation-u76494.vm.elestio.app/webhook/chat-velvet",
            ASSISTANT_NAME: "KasIA",
            BRAND_COLOR: "#1E5BFF",
            PRIVACY_URL: "/politica-privacidad/",
            WELCOME: "Hola, ¿en qué puedo ayudarte?"
        };
    </script>
    <script src="/js/coanfi-chat.js"></script>
</body>
</html>
```

Cualquier parámetro que no incluyas usará su valor por defecto.

---

## 7. Preguntas frecuentes

**La burbuja no aparece.**
- Verifica que el archivo `coanfi-chat.js` se está cargando (abre la consola del navegador con F12 y mira la pestaña *Network* / *Red*).
- Comprueba que la ruta del `src` es correcta.
- Comprueba que el snippet está antes de `</body>`.

**Al enviar un mensaje aparece "Ups, ha habido un problema".**
El webhook no está respondiendo o la URL es incorrecta. Comprueba que responde con un JSON válido, con al menos un campo `respuesta`.

**Quiero cambiar los colores / nombre / avatar.**
Modifica los valores del objeto `window.COANFI_CHAT_CONFIG` en el HTML. Al recargar la página, los cambios se aplican inmediatamente.

**¿El widget envía datos a servidores de terceros?**
No. Sólo se comunica con las URLs de webhook que tú configures. No hay telemetría ni analítica externa.

**¿Puedo mostrar el widget sólo en algunas páginas?**
Sí. Incluye el snippet únicamente en las plantillas HTML donde quieras que aparezca.

**¿Funciona en móvil?**
Sí. En pantallas pequeñas la ventana del chat ocupa toda la pantalla; en pantallas grandes aparece como una ventana flotante de 380x560 px.

---

## Convivencia con la plantilla de tu web

El widget está diseñado para **no verse afectado por la plantilla del sitio donde se instala, ni afectarla**:

- Se renderiza en un contenedor aislado (Shadow DOM): el CSS de tu plantilla no entra en el chat y el del chat no sale.
- Sus medidas son **absolutas (px)**: aunque tu plantilla cambie el tamaño de letra base de la página (`html { font-size: ... }`, habitual en muchos themes), el chat se ve siempre al tamaño correcto.
- Su teclado está **blindado**: si tu plantilla usa librerías de scroll suave (SmoothScroll y similares) que capturan la barra espaciadora o las flechas, no interfieren al escribir dentro del chat.
- En móvil, la ventana se ajusta automáticamente al teclado en pantalla.

Por tanto, **no hay que tocar nada en la plantilla** para que el chat funcione y se vea bien.

---

## 8. Cambios respecto a la versión anterior

**Versión 9.0.2**
- **Arreglado el tamaño en móvil**: en plantillas web que reducen el `font-size` base de la página (como la de Arquerías Velvet, que lo baja a 11–13px en móvil), el widget entero se veía encogido. Ahora el widget usa medidas absolutas y se ve siempre al tamaño correcto, sea cual sea la plantilla.
- **La burbuja de cierre ya no tapa el botón de enviar** en móvil: mientras el chat está abierto a pantalla completa, la burbuja flotante se oculta (la ventana tiene su propia X en la cabecera).
- **El teclado del móvil ya no tapa la caja de escritura** (iOS): la ventana se ajusta al hueco visible cuando se despliega el teclado.
- **Sin auto-zoom en iPhone** al tocar el campo de escritura (la letra del campo pasa a 16px en móvil).

**Versión 9.0.1**
- **Compatibilidad ampliada de navegadores**: el widget funciona ahora en cualquier navegador desde principios de 2022 (Chrome/Edge 99+, Safari/iOS 15.4+, Firefox 97+). En navegadores más antiguos no se muestra, pero la web del cliente queda intacta.
- El botón **Acepto** cambia a **"✓ Aceptado"** (verde) y se desactiva tras aceptar la política de privacidad.
- **Blindaje de teclado**: algunas plantillas web (por ejemplo las que usan SmoothScroll.js) capturan la barra espaciadora y las flechas en toda la página y, por una particularidad técnica (retargeting del Shadow DOM), no detectaban que el usuario estaba escribiendo dentro del chat — los espacios no se insertaban. El widget ahora impide que esas librerías interfieran con el teclado del chat, sin afectar al scroll del resto de la web.

**Versión 9.0.0**
- **Cada conversación empieza de cero.** Hasta ahora, si el usuario recargaba la página y volvía a abrir el chat, el asistente podía arrastrar el contexto de la conversación anterior. Ahora se genera un `sessionId` nuevo en el momento en que se acepta la política de privacidad, y el primer mensaje avisa al backend (`new_chat: true`) para que descarte cualquier estado residual.
- Los webhooks de producción pasan a ser `https://n8n-automation-u76494.vm.elestio.app/webhook/...`. El `snippet.html` y la `demo.html` ya vienen apuntando ahí.
- Sin cambios visuales: la interfaz es idéntica a la de la V8.

**Versión 8.0.0** *(parte de la V6, no de la V7)*
- **Nuevo icono en la burbuja**: en lugar del icono genérico de mensaje, la burbuja muestra ahora el **avatar de KasIA** (usa el valor de `ASSISTANT_AVATAR`). Al abrir el chat sigue mostrándose una X para cerrar.
- **Nuevo tooltip y mensaje de bienvenida** unificados: *"Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?"* — el mismo texto encima de la burbuja (invitación) y como primer mensaje al abrir el chat.
- Aumento mínimo del tamaño de la burbuja (de 56 px a 80 px) para que el avatar se vea bien.
- Sin dependencias nuevas ni decoraciones extra: el bundle sigue pesando prácticamente lo mismo que en la V6.

**Versión 6.0.0**
- **Corrección visual de los botones de respuesta rápida.** En la V5 los botones (Requisitos, Precio, Tipologías…) aparecían sin borde ni fondo por un problema de aplicación de estilos dentro del Shadow DOM. Ahora se muestran con su aspecto correcto de "píldora": fondo blanco, borde azul y texto azul, tal como aparece en la maqueta de referencia.

**Versión 5.0.0**
- Correcciones visuales:
  - La cabecera del chat ahora muestra el **isotipo de Coanfi** (`coanfi-isotipo.jpg`) en lugar del avatar, para reforzar la identidad corporativa.
  - El **avatar de KasIA** que aparece junto a cada mensaje se ha sustituido por una versión mejorada, ya recortada en formato circular con fondo transparente (`kasia-avatar.png`). Se muestra correctamente sin fondo cuadrado.
- La configuración añade una tercera imagen a subir (`coanfi-isotipo.jpg`).

**Versión 4.0.0**
- El snippet viene **preconfigurado con los webhooks de producción de COANFI** (entonces `https://procn8nwh.procesoclaro.com/webhook/...`). Ya no hay que configurar la URL manualmente.
- La `demo.html` también viene conectada al servicio real: al abrirla se puede mantener una conversación real con KasIA sin ningún ajuste previo.
- Se acompaña de una guía específica **`Instrucciones de instalación.pdf`** con el flujo simplificado en 4 pasos.

**Versión 3.0.0**
- Se incluye el **avatar oficial de KasIA** (`kasia-avatar.jpg`) dentro de la entrega.
- El nombre del asistente por defecto pasa a ser **KasIA** (con I mayúscula).
- El resaltado en negrita del nombre del asistente es **case-insensitive**: si el webhook devuelve "KasiA", "KasIA", "kasia" o "KASIA", todas las variantes se resaltarán en el chat.

**Versión 2.0.0**
- Nombre del asistente por defecto: **KasIA** (antes "Asistente").
- **Nueva funcionalidad de cierre**: si un botón del asistente incluye `close_on_click: true`, al pulsarlo se muestra `CLOSE_TEXT` y la caja de entrada se bloquea (útil para flujos tipo "agendar cita").
- Los **botones de respuesta rápida** ahora distinguen entre botón y enlace mediante `action: "link"`, con `target` configurable.
- **Nuevo parámetro configurable**: `CLOSE_TEXT`.
- El nombre del asistente se **resalta en negrita** cuando aparece en el texto de las respuestas.
- Ya no se envía el nombre del usuario en las peticiones al webhook.

---

## 9. Soporte

Para incidencias o solicitudes de cambios en el widget, contacta con **ProcesoClaro** (creador y mantenedor).
