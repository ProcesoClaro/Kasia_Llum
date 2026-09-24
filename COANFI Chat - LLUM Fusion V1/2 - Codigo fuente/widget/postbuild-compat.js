// Post-build: convierte los oklch() que quedan en el bundle (definiciones de
// variables CSS de la paleta de Tailwind, que esbuild no puede bajar porque
// las custom properties son opacas) a su hex sRGB equivalente, usando el
// propio esbuild como conversor. Así los colores funcionan también en
// navegadores sin oklch (Chrome 99-110, Safari 15.4-16.1, Firefox 97-112).
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const BUNDLE = "../plugin/coanfi-chat/assets/coanfi-chat.js";
const ESBUILD = "node_modules/@esbuild/linux-x64/bin/esbuild";

let js = readFileSync(BUNDLE, "utf8");

// Las plantillas anfitrionas a menudo cambian el font-size del <html>
// (p. ej. arqueriasvelvet.com: 14px, y 11-13px en móvil). El rem se calcula
// SIEMPRE sobre ese valor — el Shadow DOM no protege — así que todo el widget
// se encogería. Convertimos cada rem del CSS a px (1rem = 16px) para que el
// widget sea inmune al root font-size del sitio donde se incruste.
let rems = 0;
js = js.replace(/(\d*\.?\d+)rem\b/g, (_, n) => {
  rems++;
  return `${Number((parseFloat(n) * 16).toFixed(3))}px`;
});
console.log(`postbuild-compat: ${rems} valores rem convertidos a px`);
const tokens = [...new Set(js.match(/oklch\([^()]*\)/g) ?? [])];
if (tokens.length === 0) {
  console.log("postbuild-compat: sin oklch que convertir");
  process.exit(0);
}

// Un solo lote: una regla por token, esbuild las baja todas a hex/rgba.
const cssIn = tokens.map((t, i) => `.t${i}{color:${t}}`).join("\n");
const out = spawnSync(ESBUILD, ["--loader=css", "--target=chrome99", "--minify"], {
  input: cssIn,
  encoding: "utf8",
});
if (out.status !== 0) {
  console.error("postbuild-compat: esbuild falló:", out.stderr);
  process.exit(1);
}

const converted = {};
for (const m of out.stdout.matchAll(/\.t(\d+)\{color:([^}]+)\}/g)) {
  converted[Number(m[1])] = m[2];
}
let replaced = 0;
tokens.forEach((t, i) => {
  let hex = converted[i];
  if (!hex) return;
  // Colores fuera del gamut sRGB: esbuild emite "hex;color:oklch(...)"
  // (fallback + mejora). Dentro de una variable solo cabe un valor: nos
  // quedamos con el fallback hex.
  if (hex.includes(";")) hex = hex.split(";")[0];
  // Si aun así no lo pudo convertir (p. ej. oklch con var()), se deja tal cual.
  if (hex.includes("oklch")) return;
  js = js.split(t).join(hex);
  replaced++;
});
writeFileSync(BUNDLE, js);
console.log(`postbuild-compat: ${replaced}/${tokens.length} colores oklch convertidos a hex`);
