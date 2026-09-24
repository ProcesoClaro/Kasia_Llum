# Manual de uso — Plugin COANFI Chat

Versión 4.0.2

---

## 1. ¿Qué es este plugin?

**COANFI Chat** es un plugin de WordPress que añade a tu web un **widget de chat flotante** (burbuja en la esquina inferior derecha) para atender a los visitantes con un asistente virtual llamado **KasIA**.

El asistente no vive dentro del plugin: el plugin se limita a mostrar la interfaz de chat. Todas las respuestas, la inteligencia y la lógica se procesan en un servicio externo (por ejemplo, n8n) al que el plugin se conecta mediante **webhooks** (URLs configurables).

Esto significa que **tú decides dónde se procesa la conversación**: en tu propio servidor, en el de un proveedor de tu confianza, etc. El plugin no depende de servidores de terceros ajenos.

---

## 2. Instalación

1. Entra en el panel de administración de WordPress.
2. Ve a **Plugins → Añadir nuevo → Subir plugin**.
3. Selecciona el archivo `coanfi-chat.zip` y pulsa **Instalar ahora**.
4. Cuando termine, pulsa **Activar plugin**.

Una vez activo, el widget **ya funciona**: la página de configuración se crea con los webhooks de producción de COANFI, el avatar, el isotipo y los textos ya rellenos. Sólo tienes que entrar en Ajustes si quieres cambiar algo.

---

## 3. ¿Dónde se configura?

En el menú lateral izquierdo del panel de WordPress:

> **Ajustes → COANFI Chat**

Todos los ajustes están en una sola página. Al final del formulario, pulsa **Guardar cambios** para aplicar cualquier modificación.

---

## 4. Descripción de cada campo

La página de ajustes está organizada en cinco secciones:

### 4.1. General

| Campo | Qué hace |
|---|---|
| **Activo** | Casilla maestra que enciende o apaga el widget en toda la web. Si se desactiva, la burbuja desaparece del frontend aunque el resto de ajustes esté relleno. |
| **Modo de inserción** | Controla en qué páginas aparece el widget:<br>• **Automático (todas las páginas):** la burbuja se muestra en cualquier página pública del sitio.<br>• **Sólo shortcode `[coanfi_chat]`:** la burbuja sólo aparece en las páginas o entradas donde hayas insertado ese shortcode. Útil para mostrar el chat sólo en una landing, ficha de promoción, etc. |

---

### 4.2. Webhooks (n8n u otra plataforma)

Estas URLs son los puntos donde el widget envía las peticiones al servicio externo que procesa la conversación.

| Campo | Qué hace |
|---|---|
| **URL del webhook de chat** *(obligatorio)* | El endpoint principal. Cada mensaje que escribe el usuario se envía por `POST` a esta URL, junto con el identificador de sesión y el estado de consentimiento. La respuesta que devuelva este webhook es lo que verá el usuario como respuesta del asistente.<br><br>**Formato esperado en la respuesta (JSON):**<br>• `respuesta` — texto de la respuesta.<br>• `buttons` — (opcional) botones de respuesta rápida. Cada botón puede tener `label`, `value`, `action` (`"link"` para enlaces), `url`, `target` y `close_on_click` (si es `true`, cierra la conversación al pulsarlo).<br>• `cards` — (opcional) fichas de promociones (nombre, municipio, dormitorios, precio, imagen, URL). |
| **URL del webhook de feedback** *(opcional)* | Endpoint que recibe los votos 👍 / 👎 que el usuario da a cada respuesta del asistente. Sirve para medir la calidad de las respuestas. Si se deja en blanco, los botones de feedback siguen apareciendo pero no se envía nada. |
| **URL del webhook de eventos** *(opcional)* | Endpoint que recibe eventos de analítica del widget (actualmente: apertura del chat). Útil para medir cuántas conversaciones se inician. Si se deja en blanco, los eventos no se envían. |

> **Nota:** estos tres campos vienen rellenos con los endpoints de producción de COANFI. Si los vacías, el widget dejará de responder.

---

### 4.3. Identidad

Personaliza cómo se presenta el asistente ante el usuario.

| Campo | Qué hace |
|---|---|
| **Nombre del asistente** | Nombre que aparece en la cabecera del chat (ej: `KasIA`). También se usa en el título de la ventana y **se resalta en negrita** cuando aparece en el texto de las respuestas del asistente. |
| **URL avatar del asistente** | Imagen redonda que se muestra a la izquierda de cada respuesta del asistente. Recomendado: PNG cuadrado, mínimo 60x60 px, con fondo transparente. Sube la imagen a la Biblioteca de Medios de WordPress y copia aquí su URL. |
| **URL logo cabecera** | Imagen que aparece en la cabecera del chat, dentro del círculo blanco a la izquierda del nombre. Puede ser el logo de la marca. Si se deja vacío, se usa el mismo avatar. |
| **URL política de privacidad** | Enlace a la página de política de privacidad de la web. Se muestra al usuario en el mensaje de consentimiento RGPD antes de iniciar la conversación. |

---

### 4.4. Colores de marca

Los colores de la burbuja, los mensajes del usuario, los botones y los enlaces del chat.

| Campo | Qué hace |
|---|---|
| **Color principal** | Color base del widget. Se aplica a: la burbuja flotante, la cabecera del chat, las burbujas de los mensajes del usuario, el botón de enviar y los botones de respuesta rápida. Formato hexadecimal (ej: `#1E5BFF`). |
| **Color hover** | Color al pasar el cursor por encima de los elementos anteriores. Suele ser una versión más oscura del color principal (ej: `#1646C7`). |

---

### 4.5. Textos

Todos los textos del asistente se pueden personalizar para adaptarlos al tono de la marca.

| Campo | Qué hace |
|---|---|
| **Mensaje de bienvenida** | Primer mensaje que muestra el asistente al abrir el chat. Ejemplo: *"Hola, soy KasIA, tu agente virtual de Coanfi."* |
| **Texto del tooltip (burbuja)** | Mensaje pequeño que aparece encima de la burbuja flotante para invitar al usuario a hacer clic. Ejemplo: *"¿Te ayudo?"* (sólo visible en pantallas grandes). |
| **Texto de consentimiento RGPD** | Mensaje que pide al usuario aceptar la política de privacidad antes de conversar. Se muestra junto a un botón **Acepto** y un enlace a la política. |
| **Texto solicitando el nombre** | Mensaje que muestra el asistente inmediatamente después de que el usuario acepte el consentimiento. Ejemplo: *"¡Gracias! ¿Cómo te llamas?"*. |
| **Texto al cerrar la conversación** | Mensaje que aparece cuando la conversación se da por finalizada (por ejemplo, cuando el usuario acaba de agendar una cita mediante un botón de acción). Una vez mostrado, la caja de entrada se bloquea. |

---

## 5. Uso del shortcode

Si has elegido el modo **"Sólo shortcode"**, tienes que insertar manualmente el widget en las páginas o entradas donde quieras que aparezca:

```
[coanfi_chat]
```

Puedes ponerlo en cualquier sitio del contenido: bloque de shortcode del editor Gutenberg, un widget de texto, una plantilla PHP, etc. La burbuja aparecerá en la esquina inferior derecha en cuanto se cargue esa página.

---

## 6. Comportamiento del chat en el frontend

El flujo de una conversación es siempre:

1. El usuario ve una **burbuja azul flotante** abajo a la derecha.
2. Al hacer clic, se abre la **ventana del chat**.
3. El asistente saluda con el mensaje de bienvenida.
4. Antes de conversar, el asistente pide al usuario que **acepte la política de privacidad** (RGPD).
5. Tras aceptar, el asistente pregunta al usuario (texto configurable, típicamente su nombre).
6. A partir de ahí, el usuario puede conversar libremente. Cada mensaje se envía al webhook y el asistente responde según lo que devuelva.
7. En cada respuesta del asistente aparecen dos botones (👍 y 👎) para valorarla.
8. Cuando el webhook devuelve un botón con `close_on_click: true` (por ejemplo, un botón "Confirmar cita"), la conversación se cierra automáticamente y se muestra el texto de cierre.

**Sesión:** cada **conversación** genera un identificador único (`sessionId`), creado en el momento en que el usuario acepta la política de privacidad, que se envía en cada petición al webhook para mantener el hilo. Vive en la memoria del navegador (`sessionStorage`) y se borra al cerrar la pestaña. El primer mensaje de cada conversación incluye además `new_chat: true`, para que el asistente arranque sin memoria de conversaciones anteriores.

**Aislamiento visual:** el widget se renderiza dentro de un contenedor aislado (**Shadow DOM**) para garantizar que sus estilos no interfieran con la maquetación del tema de WordPress, ni al revés.

---

## 7. Preguntas frecuentes

**No veo la burbuja en el frontend.**
Verifica:
- Que en **Ajustes → COANFI Chat**, la casilla **Activo** está marcada.
- Que la **URL del webhook de chat** está rellenada.
- Que el modo está en **Automático** (o que has insertado el shortcode en la página que estás viendo).
- Que has pulsado **Guardar cambios**.

**El chat se abre pero al enviar un mensaje da error.**
El webhook de chat no está respondiendo, o la URL es incorrecta. Comprueba que la URL responde con un JSON válido (con un campo `respuesta` como mínimo).

**Quiero cambiar el color / avatar / nombre.**
Todo se cambia desde **Ajustes → COANFI Chat**. Los cambios se aplican inmediatamente al guardar; puede que necesites refrescar la caché del navegador si tienes un plugin de caché instalado.

**¿El plugin envía datos a servidores de terceros?**
No. Sólo se comunica con las URLs de webhook que hayas configurado. No hay telemetría ni analítica externa.

**¿Guarda las conversaciones en la base de datos de WordPress?**
No. Todas las conversaciones y su lógica están en el lado del servicio externo (n8n). El plugin sólo guarda en la base de datos los ajustes de configuración.

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

**Versión 4.0.2**
- **Arreglado el tamaño en móvil**: en plantillas web que reducen el `font-size` base de la página (como la de Arquerías Velvet, que lo baja a 11–13px en móvil), el widget entero se veía encogido. Ahora el widget usa medidas absolutas y se ve siempre al tamaño correcto, sea cual sea la plantilla.
- **La burbuja de cierre ya no tapa el botón de enviar** en móvil: mientras el chat está abierto a pantalla completa, la burbuja flotante se oculta (la ventana tiene su propia X en la cabecera).
- **El teclado del móvil ya no tapa la caja de escritura** (iOS): la ventana se ajusta al hueco visible cuando se despliega el teclado.
- **Sin auto-zoom en iPhone** al tocar el campo de escritura (la letra del campo pasa a 16px en móvil).

**Versión 4.0.1**
- **Compatibilidad ampliada de navegadores**: el widget funciona ahora en cualquier navegador desde principios de 2022 (Chrome/Edge 99+, Safari/iOS 15.4+, Firefox 97+). En navegadores más antiguos no se muestra, pero la web del cliente queda intacta.
- El botón **Acepto** cambia a **"✓ Aceptado"** (verde) y se desactiva tras aceptar la política de privacidad.
- **Blindaje de teclado**: algunas plantillas web (por ejemplo las que usan SmoothScroll.js) capturan la barra espaciadora y las flechas en toda la página y, por una particularidad técnica (retargeting del Shadow DOM), no detectaban que el usuario estaba escribiendo dentro del chat — los espacios no se insertaban. El widget ahora impide que esas librerías interfieran con el teclado del chat, sin afectar al scroll del resto de la web.

**Versión 4.0.0**
- **Cada conversación empieza de cero.** Antes, si el visitante recargaba la página y volvía a abrir el chat, el asistente podía arrastrar el contexto de la conversación anterior. Ahora se genera un `sessionId` nuevo al aceptar la política de privacidad y el primer mensaje avisa al backend (`new_chat: true`) para que descarte cualquier estado residual.
- **El plugin viene preconfigurado**: los tres webhooks de producción de COANFI, el avatar, el isotipo y los textos ya están rellenos al activarlo. Se pueden cambiar en cualquier momento desde Ajustes.
- La **cabecera del chat muestra el isotipo de Coanfi** (`coanfi-isotipo.jpg`), en lugar de repetir el avatar de KasIA.
- El avatar de KasIA pasa a **PNG con transparencia**, que se recorta limpio en círculo.

**Versión 3.0.0**
- El plugin ya incluye el **avatar de KasIA** empaquetado. Al activarlo, el widget ya funciona con el avatar oficial sin necesidad de subir una imagen aparte.
- El nombre del asistente por defecto pasa a ser **KasIA** (con I mayúscula).
- El resaltado en negrita del nombre del asistente es **case-insensitive**: si el webhook devuelve "KasiA", "KasIA", "kasia" o "KASIA", todas las variantes se resaltarán en el chat.

**Versión 2.0.0**
- El asistente ha pasado a llamarse **KasIA** por defecto.
- **Nueva funcionalidad de cierre**: el webhook puede indicar el fin de la conversación (típicamente tras agendar una cita) mediante un botón con `close_on_click: true`. Al pulsarlo, aparece el texto de cierre y la caja de entrada se bloquea.
- Los **botones de respuesta rápida** ahora pueden ser botones normales o enlaces (según `action: "link"`), con `target` configurable.
- **Nuevo campo configurable**: *Texto al cerrar la conversación*.
- El nombre del asistente se **resalta en negrita** cuando aparece en el texto de las respuestas.
- Ya no se envía el nombre del usuario al webhook (el intercambio conversacional se mantiene igual, pero la lógica de qué hacer con el nombre queda en el propio flujo del asistente).

---

## 9. Desinstalación

1. **Plugins → Plugins instalados**.
2. Pulsa **Desactivar** bajo *COANFI Chat*.
3. Pulsa **Borrar**.

Al borrar el plugin se eliminan automáticamente todos los ajustes guardados en la base de datos.

---

## 10. Soporte

Para incidencias o solicitudes de cambios en el plugin, contacta con **ProcesoClaro** (creador y mantenedor del plugin).
