#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
WIDGET_DIR="$ROOT_DIR/widget"
PLUGIN_DIR="$ROOT_DIR/plugin/coanfi-chat"
DIST_DIR="$ROOT_DIR/dist"
ZIP_NAME="coanfi-chat.zip"

echo "==> Instalando dependencias del widget"
cd "$WIDGET_DIR"
if command -v bun >/dev/null 2>&1; then
    bun install
    echo "==> Compilando widget (bun run build)"
    bun run build
else
    npm install
    echo "==> Compilando widget (npm run build)"
    npm run build
fi

echo "==> Verificando salida"
if [ ! -f "$PLUGIN_DIR/assets/coanfi-chat.js" ]; then
    echo "ERROR: no se generó assets/coanfi-chat.js" >&2
    exit 1
fi

echo "==> Empaquetando ZIP"
mkdir -p "$DIST_DIR"
rm -f "$DIST_DIR/$ZIP_NAME"
cd "$ROOT_DIR/plugin"
zip -r "$DIST_DIR/$ZIP_NAME" "coanfi-chat" \
    -x "*.DS_Store" -x "*/.git/*" -x "*/node_modules/*"

echo ""
echo "OK: $DIST_DIR/$ZIP_NAME"
ls -lh "$DIST_DIR/$ZIP_NAME"
