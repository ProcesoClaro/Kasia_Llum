import type { PromoCardData } from "../../hooks/useChat";
import { CONFIG } from "../../config";

export function PromoCard({ data }: { data: PromoCardData }) {
  const price =
    typeof data.precio_desde === "number"
      ? new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(data.precio_desde)
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {data.imagen && (
        <img
          src={data.imagen}
          alt={data.nombre}
          className="h-32 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="space-y-1 p-3">
        <div className="font-semibold text-gray-900">{data.nombre}</div>
        <div className="text-xs text-gray-600">
          {[data.municipio, data.dormitorios && `${data.dormitorios} dorm.`]
            .filter(Boolean)
            .join(" · ")}
        </div>
        {price && (
          <div className="text-sm font-medium text-gray-800">Desde {price}</div>
        )}
        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-full px-3 py-1.5 text-xs font-medium text-white transition-colors"
            style={{ backgroundColor: CONFIG.BRAND_COLOR }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR_DARK)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = CONFIG.BRAND_COLOR)
            }
          >
            Ver
          </a>
        )}
      </div>
    </div>
  );
}
