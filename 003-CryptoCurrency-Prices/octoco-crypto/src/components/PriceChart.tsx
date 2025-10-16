import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { fetchMarketChart } from "../api/market";

// Register required ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = { id: string };

export default function PriceChart({ id }: Props) {
  const [range, setRange] = useState<"1d" | "1m" | "1y">("1m");
  const [points, setPoints] = useState<number[][]>([]);
  const [themeKey, setThemeKey] = useState<string>(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  // Watch for theme changes
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() =>
      setThemeKey(el.getAttribute("data-theme") || "light")
    );
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // Fetch chart data
  useEffect(() => {
    fetchMarketChart(id, range).then((res: any) => setPoints(res?.prices || []));
  }, [id, range]);

  function getCssVar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function hexToRgba(hex: string, alpha = 1) {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function toRgba(value: string, alpha = 1) {
    if (!value) return `rgba(96,165,250,${alpha})`;
    if (value.startsWith("rgba")) return value;
    if (value.startsWith("rgb")) return value.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    if (value.startsWith("#")) return hexToRgba(value, alpha);
    return value;
  }

  const accent = getCssVar("--accent") || "#60a5fa";
  const textColor = getCssVar("--text") || "#111827";
  const cardBorder = getCssVar("--card-border") || "#e5e7eb";

  function formatLabel(ts: number) {
    const d = new Date(ts);
    if (range === "1d") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (range === "1m") return d.toLocaleDateString([], { month: "short", day: "numeric" });
    return d.toLocaleDateString([], { month: "short", year: "numeric" });
  }

  const labels = points.map((p) => formatLabel(p[0]));

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: points.map((p) => p[1]),
        borderColor: toRgba(accent, 1),
        backgroundColor: toRgba(accent, 0.12),
        tension: 0.15,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      ...(points.length
        ? [
            {
              label: "",
              data: (() => {
                const arr = new Array(points.length).fill(null) as (number | null)[];
                arr[points.length - 1] = points[points.length - 1][1];
                return arr;
              })(),
              borderColor: toRgba(accent, 1),
              backgroundColor: toRgba(accent, 1),
              pointRadius: 6,
              pointHoverRadius: 6,
              showLine: false,
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor } },
      tooltip: { titleColor: textColor, bodyColor: textColor },
    },
    scales: {
      x: {
        display: true,
        grid: { color: toRgba(cardBorder, 0.6) },
        ticks: { color: textColor },
      },
      y: { grid: { color: toRgba(cardBorder, 0.6) }, ticks: { color: textColor } },
    },
  } as any;

  return (
    <div style={{ marginTop: 16 }}>
      <div className="chart-range" style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button className={range === "1d" ? "active" : ""} onClick={() => setRange("1d")}>
          1D
        </button>
        <button className={range === "1m" ? "active" : ""} onClick={() => setRange("1m")}>
          1M
        </button>
        <button className={range === "1y" ? "active" : ""} onClick={() => setRange("1y")}>
          1Y
        </button>
      </div>
      <div style={{ height: 300 }}>
        <Line key={`${range}-${themeKey}`} data={data as any} options={options as any} />
      </div>
    </div>
  );
}
