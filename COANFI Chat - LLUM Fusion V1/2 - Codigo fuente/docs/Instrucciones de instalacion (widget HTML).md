# Instrucciones de instalación — Widget COANFI Chat (HTML)

Versión 9.0.2 · Guía paso a paso para incorporar el chat de KasIA a un sitio HTML.

> **Novedad de esta versión:** cada conversación arranca con una sesión nueva, de modo que el asistente no arrastra el contexto de charlas anteriores. El snippet sigue viniendo **ya preconfigurado** con los webhooks de producción de COANFI — no tienes que configurar ninguna URL, sólo subir los archivos y pegar el fragmento.

---

## Índice

1. Qué vas a recibir
2. Requisitos previos
3. Contenido del ZIP
4. Paso 1 · Descomprimir el ZIP y probar la demo
5. Paso 2 · Subir los archivos al servidor
6. Paso 3 · Insertar el snippet en las páginas HTML
7. Paso 4 · Comprobar que funciona
8. Personalización (opcional)
9. Solución de problemas
10. Contacto y soporte

---

## 1. Qué vas a recibir

Un archivo comprimido llamado **`coanfi-chat-html.zip`** que contiene todo lo necesario para añadir a tu web una burbuja de chat flotante conectada a KasIA (asistente virtual de COANFI).

El widget aparecerá en la esquina inferior derecha de las páginas donde lo instales. Al hacer clic sobre la burbuja, se abre la ventana de chat.

**Importante:** el widget únicamente muestra la interfaz del chat. Toda la lógica (respuestas de KasIA, gestión de conversaciones) se ejecuta en el servicio de IA de COANFI. La conexión con ese servicio **ya viene configurada**; no tienes que preocuparte por URLs ni claves.

---

## 2. Requisitos previos

Antes de empezar necesitas:

- **Acceso a tu servidor web** para subir archivos. Normalmente por una de estas dos vías:
  - Un cliente FTP/SFTP (FileZilla, Cyberduck…) con tus credenciales.
  - El "Administrador de archivos" del panel de control de tu hosting (cPanel, Plesk, DirectAdmin…).
- **Acceso al código HTML de tus páginas**. Suele ser el mismo mecanismo que el anterior si tu web es estática.
- **Un editor de texto plano** para editar las plantillas HTML (Bloc de notas de Windows, TextEdit en modo texto plano en Mac, Notepad++, VSCode, Sublime Text…). No uses Word ni procesadores de texto.

No necesitas ninguna URL, clave ni credencial adicional: todo va incluido en el ZIP.

---

## 3. Contenido del ZIP

Al descomprimir el archivo verás una carpeta llamada `coanfi-chat/` con estos archivos dentro:

| Archivo | Para qué sirve |
|---|---|
| `coanfi-chat.js` | El widget en sí. **Hay que subirlo al servidor.** |
| `kasia-avatar.png` | Avatar de KasIA (aparece junto a cada respuesta del asistente). **Hay que subirlo al servidor.** |
| `coanfi-isotipo.jpg` | Isotipo de Coanfi (aparece en la cabecera del chat). **Hay que subirlo al servidor.** |
| `snippet.html` | Fragmento de código HTML listo para copiar y pegar en tus páginas. **Ya viene con los webhooks configurados.** |
| `demo.html` | Página HTML de ejemplo para probar el widget antes de tocar nada. |
| `Manual de uso.pdf` | Documentación completa del widget y de todos los parámetros disponibles. |
| `Instrucciones de instalacion.pdf` | Este mismo documento en PDF. |

---

## 4. Paso 1 · Descomprimir el ZIP y probar la demo

En tu ordenador:

- **Windows:** clic derecho sobre `coanfi-chat-html.zip` → *Extraer todo…* → elige una carpeta y pulsa *Extraer*.
- **Mac:** doble clic sobre el ZIP; se descomprime automáticamente al lado.
- **Linux:** clic derecho → *Extraer aquí*.

Verás la carpeta `coanfi-chat/` con los archivos anteriores.

**Antes de tocar tu web, prueba la demo:** haz doble clic sobre `demo.html`. Se abrirá en tu navegador y verás:

1. Una burbuja azul abajo a la derecha.
2. Al hacer clic, se abre la ventana del chat con el avatar de KasIA.
3. Puedes aceptar el aviso de privacidad y **mantener una conversación real** con KasIA — la demo ya está conectada al servicio de IA de COANFI.

Si la conversación funciona, tienes garantía de que el widget está bien y sólo falta llevarlo a tu web.

---

## 5. Paso 2 · Subir los archivos al servidor

Vas a subir **tres archivos** al servidor de tu web:

- `coanfi-chat.js`
- `kasia-avatar.png`
- `coanfi-isotipo.jpg`

### Dónde subirlos

Puedes usar cualquier ruta, pero para mantener el orden lo recomendable es:

- Crea (si no existen) dos carpetas en la raíz de tu web:
  - `/js/` — para archivos JavaScript.
  - `/img/` — para imágenes.
- Sube `coanfi-chat.js` dentro de `/js/`.
- Sube `kasia-avatar.png` y `coanfi-isotipo.jpg` dentro de `/img/`.

Cuando termines, deberías poder acceder a los archivos escribiendo en el navegador algo similar a:

```
https://tu-dominio.com/js/coanfi-chat.js
https://tu-dominio.com/img/kasia-avatar.png
https://tu-dominio.com/img/coanfi-isotipo.jpg
```

Si el primero muestra código y los otros dos muestran las imágenes correspondientes, la subida ha sido correcta.

> **Si prefieres usar otras rutas** (por ejemplo `/assets/js/` y `/assets/img/`), es perfectamente válido — sólo tendrás que ajustar dos líneas del snippet en el paso siguiente.

### Cómo subirlos

**Con cliente FTP (FileZilla):**
1. Abre FileZilla e introduce tus credenciales FTP.
2. En el panel derecho (servidor) navega hasta la raíz de tu web (habitualmente carpetas como `public_html`, `htdocs`, `www` o similar).
3. Si no existen, crea las carpetas `js` e `img` (clic derecho → *Crear directorio*).
4. Arrastra los archivos desde tu ordenador (panel izquierdo) a las carpetas correspondientes en el servidor.

**Con el Administrador de archivos del hosting (cPanel):**
1. Entra al panel de control de tu hosting.
2. Abre *Administrador de archivos*.
3. Navega a la raíz de la web (habitualmente `public_html`).
4. Crea las carpetas `js` e `img` si no existen (botón *+ Carpeta*).
5. Entra en cada carpeta y usa el botón *Cargar* para subir el archivo correspondiente.

---

## 6. Paso 3 · Insertar el snippet en las páginas HTML

Abre `snippet.html` con tu editor de texto plano y copia todo su contenido. Es este bloque:

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

Este código ya está **totalmente configurado**: los webhooks apuntan al servicio de IA de COANFI en producción, el avatar y logo referencian a `kasia-avatar.jpg`, y todos los textos están listos.

> **Sólo tienes que ajustarlo si subiste los archivos a rutas distintas** a `/js/` y `/img/`. En ese caso, cambia:
>
> - `ASSISTANT_AVATAR` → a la ruta donde subiste `kasia-avatar.png`.
> - `LOGO_URL` → a la ruta donde subiste `coanfi-isotipo.jpg`.
> - El `src` del segundo `<script>` (última línea) → a la ruta donde subiste `coanfi-chat.js`.

### Dónde va exactamente el snippet

El snippet tiene que ir **justo antes de la etiqueta `</body>`** (que marca el final del cuerpo de la página).

Ejemplo de cómo debe quedar una página HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Promoción Los Almendros</title>
    ...
</head>
<body>

    ... aquí el contenido normal de tu página ...

    <!-- ▼▼▼ Aquí pegas el snippet ▼▼▼ -->
    <script>
        window.COANFI_CHAT_CONFIG = { ... };
    </script>
    <script src="/js/coanfi-chat.js"></script>
    <!-- ▲▲▲ Fin del snippet ▲▲▲ -->

</body>
</html>
```

### Caso 1 — Tu web usa un footer común (una sola plantilla para todas las páginas)

Si tu web se genera con un archivo de plantilla (por ejemplo, un `footer.html` que se incluye en todas las páginas), es la situación **ideal**:

1. Abre el archivo de plantilla que contiene el `</body>`.
2. Pega el snippet justo antes de esa etiqueta.
3. Sube el archivo modificado al servidor.
4. La burbuja aparecerá automáticamente en todas las páginas que usen esa plantilla.

### Caso 2 — Cada página es un archivo HTML independiente

Si no usas plantilla común, tienes que pegar el snippet **en cada archivo HTML** donde quieras que aparezca el chat:

1. Descarga desde el servidor la página HTML que quieras modificar (por ejemplo `index.html`, `contacto.html`, etc.).
2. Ábrela con tu editor de texto plano.
3. Busca la etiqueta `</body>` (normalmente al final del archivo).
4. Pega el snippet justo antes.
5. Guarda y sube la página modificada al servidor, sobrescribiendo la anterior.
6. Repite con cada página donde quieras el chat.

> **Consejo:** si sólo quieres el chat en algunas páginas concretas (por ejemplo, la ficha de una promoción), pégalo únicamente en esas páginas.

---

## 7. Paso 4 · Comprobar que funciona

1. Abre tu web en el navegador (Chrome, Firefox, Edge…) — o refresca si ya estaba abierta.
2. En la esquina inferior derecha debe aparecer la **burbuja azul** con un icono de chat.
3. Haz clic sobre ella → se abre la ventana del chat con el avatar de KasIA en la cabecera y el mensaje de bienvenida.
4. Pulsa **Acepto** en el mensaje de política de privacidad.
5. Escribe un mensaje y pulsa Enter → KasIA debería responderte a los pocos segundos.

**Si todo funciona hasta aquí, la instalación está completada.**

---

## 8. Personalización (opcional)

El snippet incluye una serie de parámetros de texto y color que puedes ajustar libremente si quieres adaptar el chat a la línea de una promoción concreta. Basta con editar el snippet en tu HTML y volver a subir la página.

Ejemplos típicos:

- **`BRAND_COLOR`** — color de la burbuja, cabecera y botones (formato `#RRGGBB`).
- **`WELCOME`** — mensaje que ve el usuario al abrir el chat por primera vez.
- **`TOOLTIP_TEXT`** — texto que aparece encima de la burbuja invitando a hacer clic.
- **`ASSISTANT_AVATAR`** — si prefieres otro avatar (por ejemplo, uno distinto por promoción), sube la nueva imagen al servidor y cambia esta ruta.

Todos los parámetros disponibles y su descripción están detallados en el archivo `Manual de uso.pdf` incluido en el mismo ZIP.

> **No modifiques `WEBHOOK_URL`, `FEEDBACK_URL` ni `EVENT_URL`** salvo que te indiquemos expresamente lo contrario. Son las URLs del servicio de IA de COANFI y cambiarlas hará que el chat deje de funcionar.

---

## 9. Solución de problemas

**La burbuja no aparece en la web.**
- Comprueba que el snippet está **antes de `</body>`**, no dentro del `<head>`.
- Abre la consola del navegador (tecla F12 → pestaña *Consola*). Si ves un error tipo `404` sobre `coanfi-chat.js`, es que la ruta del `src` no es correcta — verifica dónde subiste el archivo.
- Vacía la caché del navegador (Ctrl+F5 en Windows/Linux, Cmd+Shift+R en Mac).

**La burbuja aparece pero sin las imágenes (avatar de KasIA o isotipo de Coanfi en la cabecera).**
La ruta de `ASSISTANT_AVATAR` o `LOGO_URL` no es correcta. Comprueba escribiendo en el navegador:
`https://tu-dominio.com/img/kasia-avatar.png` y `https://tu-dominio.com/img/coanfi-isotipo.jpg` — si no ves las imágenes, es que no están en esa ruta.

**El chat se abre pero al enviar un mensaje aparece "Ups, ha habido un problema".**
- El servicio de IA podría estar temporalmente inaccesible. Espera unos minutos y prueba de nuevo.
- Si persiste, contacta con ProcesoClaro.

**Los cambios que hago no se ven en la web.**
- Vacía la caché del navegador (Ctrl+F5 / Cmd+Shift+R).
- Si tu hosting tiene un plugin de caché de servidor, purga también esa caché.
- Comprueba que subiste el archivo modificado y no una versión antigua.

---

## 10. Contacto y soporte

Ante cualquier problema o si necesitas cambiar algún parámetro y no sabes cómo, contacta con **ProcesoClaro**. Podemos hacer los ajustes por ti o guiarte por el proceso.

Guarda este documento y el ZIP original. Si algún día necesitas reinstalar el widget o hacer cambios, tendrás toda la información a mano.
