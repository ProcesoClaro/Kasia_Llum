<?php
/**
 * Plugin Name: COANFI Chat
 * Plugin URI:  https://www.coanfi.com/
 * Description: Widget de chat KasIA embebible en tu WordPress. Configurable desde Ajustes → COANFI Chat.
 * Version:     4.1.0
 * Author:      ProcesoClaro
 * Author URI:  https://procesoclaro.com/
 * License:     GPL-2.0-or-later
 * Text Domain: coanfi-chat
 */

if (!defined('ABSPATH')) {
    exit;
}

define('COANFI_CHAT_VERSION', '4.1.0');
define('COANFI_CHAT_PATH', plugin_dir_path(__FILE__));
define('COANFI_CHAT_URL', plugin_dir_url(__FILE__));
define('COANFI_CHAT_OPTION', 'coanfi_chat_settings');

require_once COANFI_CHAT_PATH . 'includes/settings.php';
require_once COANFI_CHAT_PATH . 'includes/frontend.php';

register_activation_hook(__FILE__, 'coanfi_chat_activate');
function coanfi_chat_activate() {
    if (get_option(COANFI_CHAT_OPTION) === false) {
        add_option(COANFI_CHAT_OPTION, coanfi_chat_default_settings());
    }
}

function coanfi_chat_default_settings() {
    // Imagenes empaquetadas con el plugin. kasia-avatar.jpg se mantiene en
    // img/ por compatibilidad con instalaciones de la v3 que la tengan guardada.
    $bundled_avatar = COANFI_CHAT_URL . 'img/kasia-avatar.png';
    $bundled_logo   = COANFI_CHAT_URL . 'img/coanfi-isotipo.jpg';
    // Endpoints de produccion de COANFI. El cliente puede cambiarlos desde
    // Ajustes -> COANFI Chat sin tocar codigo.
    $n8n = 'https://n8n-automation-u76494.vm.elestio.app/webhook/';
    return [
        'enabled'          => 1,
        'webhook_url'      => $n8n . 'chat-velvet',
        'feedback_url'     => $n8n . 'feedback',
        'event_url'        => $n8n . 'event',
        'assistant_name'   => 'KasIA',
        'assistant_avatar' => $bundled_avatar,
        'logo_url'         => $bundled_logo,
        'brand_color'      => '#1E5BFF',
        'brand_color_dark' => '#1646C7',
        'privacy_url'      => 'https://www.coanfi.com/politica-privacidad/',
        'welcome'          => 'Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?',
        'tooltip_text'     => 'Hola, soy KasIA, tu asistente inmobiliario, ¿Necesitas ayuda?',
        'consent_text'     => 'Antes de empezar, necesito que aceptes nuestra política de privacidad.',
        'ask_name_text'    => '¡Gracias! ¿Cómo te llamas?',
        'close_text'       => 'Gracias por agendar una cita con nosotros. Si necesitas algo más, puedes escribirnos de nuevo cuando lo desees.',
        'mode'             => 'auto', // auto = todas las páginas, shortcode = solo con [coanfi_chat]
    ];
}

function coanfi_chat_get_settings() {
    $saved = get_option(COANFI_CHAT_OPTION, []);
    return wp_parse_args(is_array($saved) ? $saved : [], coanfi_chat_default_settings());
}
