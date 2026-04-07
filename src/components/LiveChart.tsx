"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import ShareButton from "./ShareButton";

interface LiveChartProps {
  data: { time: string; value: number }[];
  title: string;
  color?: string;
  unit?: string;
  type?: "line" | "area";
  height?: number;
  subtitle?: string;
}

export default function LiveChart({
  data,
  title,
  color = "#ff3b3b",
  unit = "",
  type = "area",
  height = 200,
  subtitle,
}: LiveChartProps) {
  const lastValue = data[data.length - 1]?.value;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastValue !== undefined && (
            <div className="text-right">
              <div className="text-lg font-bold font-mono tabular-nums" style={{ color }}>
                {unit === "$" ? `$${lastValue}` : `${lastValue}${unit}`}
              </div>
              <div className="text-[10px] text-muted">Latest</div>
            </div>
          )}
          <ShareButton
            title={`${title}: ${lastValue !== undefined ? (unit === "$" ? `$${lastValue}` : `${lastValue}${unit}`) : ""} — Crisis Watch`}
            variant="icon"
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {type === "area" ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#5a5a72" }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#5a5a72" }}
              axisLine={false}
              tickLine={false}
              width={55}
              tickFormatter={(v) => (unit === "$" ? `$${v}` : `${v}${unit}`)}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(14, 14, 24, 0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                fontSize: 12,
                color: "#f0f0f5",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                backdropFilter: "blur(12px)",
              }}
              formatter={(value) => [
                unit === "$" ? `$${value}` : `${value}${unit}`,
                title,
              ]}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#grad-${color})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#06060b", strokeWidth: 2 }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#5a5a72" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#5a5a72" }}
              axisLine={false}
              tickLine={false}
              width={55}
              tickFormatter={(v) => (unit === "$" ? `$${v}` : `${v}${unit}`)}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(14, 14, 24, 0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                fontSize: 12,
                color: "#f0f0f5",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
              formatter={(value) => [
                unit === "$" ? `$${value}` : `${value}${unit}`,
                title,
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#06060b", strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
