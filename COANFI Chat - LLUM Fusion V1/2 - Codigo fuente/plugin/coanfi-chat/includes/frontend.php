<?php
if (!defined('ABSPATH')) {
    exit;
}

add_shortcode('coanfi_chat', 'coanfi_chat_shortcode');
function coanfi_chat_shortcode() {
    coanfi_chat_enqueue(true);
    return '';
}

add_action('wp_enqueue_scripts', 'coanfi_chat_maybe_enqueue');
function coanfi_chat_maybe_enqueue() {
    $settings = coanfi_chat_get_settings();
    if (empty($settings['enabled'])) return;
    if ($settings['mode'] !== 'auto') return;
    if (is_admin()) return;
    coanfi_chat_enqueue();
}

function coanfi_chat_enqueue($force = false) {
    static $done = false;
    if ($done) return;
    $done = true;

    $settings = coanfi_chat_get_settings();
    if (empty($settings['enabled']) && !$force) return;

    $handle = 'coanfi-chat-widget';
    $src = COANFI_CHAT_URL . 'assets/coanfi-chat.js';

    wp_register_script($handle, $src, [], COANFI_CHAT_VERSION, true);

    $config = [
        'WEBHOOK_URL'      => $settings['webhook_url'],
        'FEEDBACK_URL'     => $settings['feedback_url'],
        'EVENT_URL'        => $settings['event_url'],
        'ASSISTANT_NAME'   => $settings['assistant_name'],
        'ASSISTANT_AVATAR' => $settings['assistant_avatar'],
        'LOGO_URL'         => $settings['logo_url'],
        'BRAND_COLOR'      => $settings['brand_color'],
        'BRAND_COLOR_DARK' => $settings['brand_color_dark'],
        'PRIVACY_URL'      => $settings['privacy_url'] ?: '#',
        'WELCOME'          => $settings['welcome'],
        'TOOLTIP_TEXT'     => $settings['tooltip_text'],
        'CONSENT_TEXT'     => $settings['consent_text'],
        'ASK_NAME_TEXT'    => $settings['ask_name_text'],
        'CLOSE_TEXT'       => $settings['close_text'],
    ];

    wp_add_inline_script(
        $handle,
        'window.COANFI_CHAT_CONFIG = ' . wp_json_encode($config) . ';',
        'before'
    );

    wp_enqueue_script($handle);
}
