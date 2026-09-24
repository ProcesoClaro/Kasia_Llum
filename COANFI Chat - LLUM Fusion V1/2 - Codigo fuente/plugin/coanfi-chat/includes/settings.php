<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'coanfi_chat_admin_menu');
function coanfi_chat_admin_menu() {
    add_options_page(
        'COANFI Chat',
        'COANFI Chat',
        'manage_options',
        'coanfi-chat',
        'coanfi_chat_render_settings_page'
    );
}

add_action('admin_init', 'coanfi_chat_register_settings');
function coanfi_chat_register_settings() {
    register_setting(
        'coanfi_chat_group',
        COANFI_CHAT_OPTION,
        ['sanitize_callback' => 'coanfi_chat_sanitize_settings']
    );
}

function coanfi_chat_sanitize_settings($input) {
    $defaults = coanfi_chat_default_settings();
    $out = [];

    $out['enabled']          = !empty($input['enabled']) ? 1 : 0;
    $out['webhook_url']      = esc_url_raw($input['webhook_url'] ?? '');
    $out['feedback_url']     = esc_url_raw($input['feedback_url'] ?? '');
    $out['event_url']        = esc_url_raw($input['event_url'] ?? '');
    $out['assistant_name']   = sanitize_text_field($input['assistant_name'] ?? $defaults['assistant_name']);
    $out['assistant_avatar'] = esc_url_raw($input['assistant_avatar'] ?? '');
    $out['logo_url']         = esc_url_raw($input['logo_url'] ?? '');
    $out['brand_color']      = coanfi_chat_sanitize_hex($input['brand_color'] ?? $defaults['brand_color']);
    $out['brand_color_dark'] = coanfi_chat_sanitize_hex($input['brand_color_dark'] ?? $defaults['brand_color_dark']);
    $out['privacy_url']      = esc_url_raw($input['privacy_url'] ?? '');
    $out['welcome']          = sanitize_textarea_field($input['welcome'] ?? $defaults['welcome']);
    $out['tooltip_text']     = sanitize_text_field($input['tooltip_text'] ?? $defaults['tooltip_text']);
    $out['consent_text']     = sanitize_textarea_field($input['consent_text'] ?? $defaults['consent_text']);
    $out['ask_name_text']    = sanitize_text_field($input['ask_name_text'] ?? $defaults['ask_name_text']);
    $out['close_text']       = sanitize_textarea_field($input['close_text'] ?? $defaults['close_text']);
    $out['mode']             = in_array($input['mode'] ?? '', ['auto', 'shortcode'], true) ? $input['mode'] : 'auto';

    return $out;
}

function coanfi_chat_sanitize_hex($value) {
    $value = trim((string) $value);
    if (preg_match('/^#([A-Fa-f0-9]{3}){1,2}$/', $value)) {
        return $value;
    }
    return '#1E5BFF';
}

function coanfi_chat_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $settings = coanfi_chat_get_settings();
    ?>
    <div class="wrap">
        <h1>COANFI Chat</h1>
        <p>Configura el widget de chat que se muestra en el frontend de tu web. Los campos vienen rellenos con los valores de produccion de COANFI; cambialos solo si sabes lo que haces.</p>

        <form action="options.php" method="post">
            <?php settings_fields('coanfi_chat_group'); ?>

            <h2 class="title">General</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="cc_enabled">Activo</label></th>
                    <td>
                        <label>
                            <input type="checkbox" id="cc_enabled" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[enabled]" value="1" <?php checked($settings['enabled'], 1); ?> />
                            Mostrar el widget en el frontend
                        </label>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_mode">Modo de inserción</label></th>
                    <td>
                        <select id="cc_mode" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[mode]">
                            <option value="auto" <?php selected($settings['mode'], 'auto'); ?>>Automático (todas las páginas)</option>
                            <option value="shortcode" <?php selected($settings['mode'], 'shortcode'); ?>>Sólo shortcode <code>[coanfi_chat]</code></option>
                        </select>
                    </td>
                </tr>
            </table>

            <h2 class="title">Webhooks (n8n u otra plataforma)</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="cc_webhook">URL del webhook de chat</label></th>
                    <td>
                        <input type="url" id="cc_webhook" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[webhook_url]" value="<?php echo esc_attr($settings['webhook_url']); ?>" placeholder="https://tu-servidor.com/webhook/chat" required />
                        <p class="description">Endpoint POST donde se envían los mensajes del usuario y desde donde se recibe la respuesta del asistente.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_feedback">URL del webhook de feedback</label></th>
                    <td>
                        <input type="url" id="cc_feedback" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[feedback_url]" value="<?php echo esc_attr($settings['feedback_url']); ?>" placeholder="https://tu-servidor.com/webhook/feedback" />
                        <p class="description">Opcional. Recibe los 👍/👎 de cada respuesta.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_event">URL del webhook de eventos</label></th>
                    <td>
                        <input type="url" id="cc_event" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[event_url]" value="<?php echo esc_attr($settings['event_url']); ?>" placeholder="https://tu-servidor.com/webhook/event" />
                        <p class="description">Opcional. Recibe eventos como la apertura del chat.</p>
                    </td>
                </tr>
            </table>

            <h2 class="title">Identidad</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="cc_name">Nombre del asistente</label></th>
                    <td>
                        <input type="text" id="cc_name" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[assistant_name]" value="<?php echo esc_attr($settings['assistant_name']); ?>" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_avatar">URL avatar del asistente</label></th>
                    <td>
                        <input type="url" id="cc_avatar" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[assistant_avatar]" value="<?php echo esc_attr($settings['assistant_avatar']); ?>" placeholder="https://tu-web.com/avatar.png" />
                        <p class="description">Se muestra junto a cada respuesta del asistente.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_logo">URL logo cabecera</label></th>
                    <td>
                        <input type="url" id="cc_logo" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[logo_url]" value="<?php echo esc_attr($settings['logo_url']); ?>" placeholder="https://tu-web.com/logo.png" />
                        <p class="description">Opcional. Si se deja vacío se usa el avatar.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_privacy">URL política de privacidad</label></th>
                    <td>
                        <input type="url" id="cc_privacy" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[privacy_url]" value="<?php echo esc_attr($settings['privacy_url']); ?>" placeholder="https://tu-web.com/politica-privacidad/" />
                    </td>
                </tr>
            </table>

            <h2 class="title">Colores de marca</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="cc_color">Color principal</label></th>
                    <td>
                        <input type="text" id="cc_color" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[brand_color]" value="<?php echo esc_attr($settings['brand_color']); ?>" placeholder="#1E5BFF" />
                        <p class="description">Formato hexadecimal (ej: #1E5BFF).</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_color_dark">Color hover</label></th>
                    <td>
                        <input type="text" id="cc_color_dark" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[brand_color_dark]" value="<?php echo esc_attr($settings['brand_color_dark']); ?>" placeholder="#1646C7" />
                    </td>
                </tr>
            </table>

            <h2 class="title">Textos</h2>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="cc_welcome">Mensaje de bienvenida</label></th>
                    <td>
                        <textarea id="cc_welcome" class="large-text" rows="2" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[welcome]"><?php echo esc_textarea($settings['welcome']); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_tooltip">Texto del tooltip (burbuja)</label></th>
                    <td>
                        <input type="text" id="cc_tooltip" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[tooltip_text]" value="<?php echo esc_attr($settings['tooltip_text']); ?>" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_consent">Texto de consentimiento RGPD</label></th>
                    <td>
                        <textarea id="cc_consent" class="large-text" rows="2" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[consent_text]"><?php echo esc_textarea($settings['consent_text']); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_askname">Texto solicitando el nombre</label></th>
                    <td>
                        <input type="text" id="cc_askname" class="regular-text" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[ask_name_text]" value="<?php echo esc_attr($settings['ask_name_text']); ?>" />
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cc_close">Texto al cerrar la conversación</label></th>
                    <td>
                        <textarea id="cc_close" class="large-text" rows="2" name="<?php echo esc_attr(COANFI_CHAT_OPTION); ?>[close_text]"><?php echo esc_textarea($settings['close_text']); ?></textarea>
                        <p class="description">Mensaje que muestra el asistente cuando el webhook indica el cierre de la conversación (por ejemplo, tras agendar una cita).</p>
                    </td>
                </tr>
            </table>

            <?php submit_button('Guardar cambios'); ?>
        </form>
    </div>
    <?php
}
