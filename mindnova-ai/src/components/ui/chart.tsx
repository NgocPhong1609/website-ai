/**
 * chart.tsx — MindNova Chart System
 * ─────────────────────────────────────────────────────────────────────────────
 * Thư viện chart component dựa trên Recharts v3, thiết kế theo nguyên tắc:
 *
 *  1. TYPE SAFETY   — Config-driven theo ChartConfig, không magic string
 *  2. PERFORMANCE   — memo / stable refs / lazy-import-safe
 *  3. COMPOSABILITY — Mỗi sub-component dùng độc lập hoặc kết hợp tự do
 *  4. CONSISTENCY   — Tự động áp dụng màu sắc từ ChartConfig (hỗ trợ CSS var)
 *  5. ACCESSIBILITY — aria-label, role, keyboard-safe tooltip
 *
 * ── Danh sách Export ──────────────────────────────────────────────────────────
 *  Components:
 *    ChartContainer          — Wrapper với ResponsiveContainer + CSS token scope
 *    ChartTooltip            — Recharts Tooltip wrapper
 *    ChartTooltipContent     — Nội dung tooltip tuỳ chỉnh đẹp
 *    ChartLegend             — Recharts Legend wrapper
 *    ChartLegendContent      — Nội dung legend tuỳ chỉnh
 *
 *  Types:
 *    ChartConfig             — Cấu hình màu + label cho từng dataKey
 *    ChartConfigItem
 *
 * ── Cách sử dụng ─────────────────────────────────────────────────────────────
 * ```tsx
 * const config: ChartConfig = {
 *   revenue:  { label: "Doanh thu",  color: "#4F46E5" },
 *   students: { label: "Học viên",   color: "#22D3EE" },
 * };
 *
 * <ChartContainer config={config} className="h-[300px]">
 *   <AreaChart data={data}>
 *     <XAxis dataKey="month" />
 *     <YAxis />
 *     <ChartTooltip content={<ChartTooltipContent />} />
 *     <ChartLegend content={<ChartLegendContent />} />
 *     <Area type="monotone" dataKey="revenue" fill="var(--color-revenue)" />
 *     <Area type="monotone" dataKey="students" fill="var(--color-students)" />
 *   </AreaChart>
 * </ChartContainer>
 * ```
 */

"use client";

import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";
import type { NameType, Payload as TooltipPayload, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Cấu hình cho một data series (dataKey) */
export interface ChartConfigItem {
  /** Nhãn hiển thị trên tooltip / legend (hỗ trợ tiếng Việt) */
  label: string;
  /**
   * Màu sắc — có thể là:
   * - Hex: "#4F46E5"
   * - HSL: "hsl(245, 75%, 58%)"
   * - CSS var: "var(--color-indigo)"
   * Nếu không truyền, sẽ fallback về palette mặc định theo index
   */
  color?: string;
  /** Icon hiển thị cạnh label trong legend (optional) */
  icon?: React.ElementType;
}

/** Map từ dataKey → ChartConfigItem */
export type ChartConfig = Record<string, ChartConfigItem>;

// ─── Default Palette ──────────────────────────────────────────────────────────
// Được dùng khi ChartConfigItem.color không truyền vào

const DEFAULT_PALETTE = [
  "#4F46E5", // Indigo (primary)
  "#22D3EE", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
] as const;

function getDefaultColor(index: number): string {
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ChartContextValue {
  config: ChartConfig;
  /** Unique ID của container — dùng làm prefix cho CSS vars */
  containerId: string;
}

const ChartContext = createContext<ChartContextValue | null>(null);

function useChartContext(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx) {
    throw new Error("[ChartContainer] Các chart sub-component phải được dùng bên trong <ChartContainer>.");
  }
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve màu cho một dataKey — ưu tiên ChartConfig, fallback palette
 */
function resolveColor(config: ChartConfig, key: string, index = 0): string {
  return config[key]?.color ?? getDefaultColor(index);
}

/**
 * Tạo CSS custom properties từ ChartConfig để inject vào container scope.
 * Kết quả: { "--color-revenue": "#4F46E5", "--color-students": "#22D3EE" }
 */
function buildCssVars(config: ChartConfig): CSSProperties {
  return Object.entries(config).reduce<CSSProperties>((acc, [key, item], index) => {
    (acc as Record<string, string>)[`--color-${key}`] = resolveColor(config, key, index);
    return acc;
  }, {});
}

// ─── ChartContainer ───────────────────────────────────────────────────────────

export interface ChartContainerProps {
  /** ChartConfig: map từ dataKey → { label, color } */
  config: ChartConfig;
  children: ReactNode;
  /** Tailwind class cho height. Mặc định: "aspect-video" (16:9) */
  className?: string;
  /** Nếu false, bỏ qua ResponsiveContainer (dùng khi đã có width cố định) */
  responsive?: boolean;
}

/**
 * ChartContainer
 * Wrapper chính — tự động:
 *  - Inject CSS vars (--color-{key}) vào scope
 *  - Bọc content trong ResponsiveContainer (có thể tắt)
 *  - Cung cấp ChartContext cho tất cả sub-component
 */
export const ChartContainer = memo(function ChartContainer({
  config,
  children,
  className = "aspect-video",
  responsive = true,
}: ChartContainerProps) {
  const uniqueId   = useId();
  const containerId = uniqueId.replace(/:/g, "");
  const cssVars     = useMemo(() => buildCssVars(config), [config]);

  const contextValue = useMemo<ChartContextValue>(
    () => ({ config, containerId }),
    [config, containerId]
  );

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        id={containerId}
        style={cssVars}
        className={`w-full ${className}`}
        role="img"
        aria-label="Biểu đồ dữ liệu"
      >
        {responsive ? (
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        ) : (
          children
        )}
      </div>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = "ChartContainer";

// ─── ChartTooltip ─────────────────────────────────────────────────────────────

/**
 * ChartTooltip — Wrapper mỏng của Recharts <Tooltip />.
 * Truyền thẳng mọi props vào Tooltip gốc.
 * Mặc định `cursor` là một indicator line nhạt.
 */
export const ChartTooltip = memo(function ChartTooltip(
  props: React.ComponentProps<typeof Tooltip>
) {
  return (
    <Tooltip
      cursor={{ strokeDasharray: "4 4", stroke: "#E5E7EB", strokeWidth: 1 }}
      isAnimationActive={false}
      {...props}
    />
  );
});

(ChartTooltip as { displayName?: string }).displayName = "ChartTooltip";

// ─── ChartTooltipContent ──────────────────────────────────────────────────────

export interface ChartTooltipContentProps {
  /**
   * Nếu true — hiển thị tổng cộng ở cuối tooltip.
   * Chỉ có nghĩa với các chart có nhiều series.
   */
  showTotal?: boolean;
  /**
   * Hiển thị chỉ label (không hiển thị icon màu dot)?
   */
  labelOnly?: boolean;
  /** Custom formatter cho value — (value, name) => ReactNode */
  formatter?: (value: ValueType, name: NameType) => ReactNode;
  /** Custom label hiển thị phía trên tooltip */
  label?: string;
  /** Recharts injected props (tự động nhận khi dùng content={<ChartTooltipContent />}) */
  active?: boolean;
  payload?: TooltipPayload<ValueType, NameType>[];
}

export const ChartTooltipContent = memo(function ChartTooltipContent({
  active,
  payload,
  label,
  showTotal = false,
  labelOnly = false,
  formatter,
}: ChartTooltipContentProps) {
  const { config } = useChartContext();

  if (!active || !payload?.length) return null;

  const total = showTotal
    ? payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0)
    : null;

  return (
    <div className="min-w-[140px] rounded-xl border border-gray-200 bg-white p-3 shadow-lg text-xs">
      {/* Label trên đầu */}
      {label && (
        <p className="mb-2 font-mono font-black text-gray-400 uppercase tracking-wider text-[10px]">
          {label}
        </p>
      )}

      {/* Các series */}
      <div className="flex flex-col gap-1.5">
        {payload.map((item, i) => {
          const key       = (item.dataKey as string) ?? String(item.name ?? "");
          const cfg       = config[key];
          const itemColor = (item.color as string | undefined) ?? resolveColor(config, key, i);
          const itemLabel = cfg?.label ?? String(item.name ?? key);
          const rendered  = formatter
            ? formatter(item.value, item.name as string)
            : typeof item.value === "number"
            ? item.value.toLocaleString("vi-VN")
            : String(item.value ?? "—");

          if (labelOnly) {
            return (
              <span key={key} className="font-semibold text-gray-800">
                {itemLabel}: {rendered}
              </span>
            );
          }

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: itemColor }}
                  aria-hidden="true"
                />
                <span className="truncate font-semibold text-gray-600">{itemLabel}</span>
              </div>
              <span className="font-mono font-black text-gray-900 tabular-nums shrink-0">
                {rendered}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tổng cộng */}
      {total !== null && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-500">Tổng</span>
          <span className="font-mono font-black text-gray-900 tabular-nums">
            {total.toLocaleString("vi-VN")}
          </span>
        </div>
      )}
    </div>
  );
});

(ChartTooltipContent as { displayName?: string }).displayName = "ChartTooltipContent";

// ─── ChartLegend ─────────────────────────────────────────────────────────────

/**
 * ChartLegend — Wrapper mỏng của Recharts <Legend />.
 * Mặc định verticalAlign="bottom", wrapperStyle cho padding.
 */
export const ChartLegend = memo(function ChartLegend(
  props: React.ComponentProps<typeof Legend>
) {
  return (
    <Legend
      verticalAlign="bottom"
      wrapperStyle={{ paddingTop: "16px" }}
      {...props}
    />
  );
}) as typeof Legend;

ChartLegend.displayName = "ChartLegend";

// ─── ChartLegendContent ───────────────────────────────────────────────────────

export interface ChartLegendContentProps {
  /** Recharts injected */
  payload?: LegendPayload[];
  /** Căn giữa các item (default: true) */
  centered?: boolean;
}

export const ChartLegendContent = memo(function ChartLegendContent({
  payload,
  centered = true,
}: ChartLegendContentProps) {
  const { config } = useChartContext();

  if (!payload?.length) return null;

  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-gray-600 ${
        centered ? "justify-center" : "justify-start"
      }`}
      role="list"
      aria-label="Chú giải biểu đồ"
    >
      {payload.map((item, i) => {
        const key        = (item.dataKey as string) ?? (item.value as string);
        const cfg        = config[key];
        const itemLabel  = cfg?.label ?? (item.value as string);
        const itemColor  = (item.color as string) ?? resolveColor(config, key, i);
        const Icon       = cfg?.icon;

        return (
          <div
            key={key ?? i}
            className="flex items-center gap-1.5"
            role="listitem"
          >
            {Icon ? (
              <Icon
                className="w-3 h-3 shrink-0"
                style={{ color: itemColor }}
                aria-hidden="true"
              />
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: itemColor }}
                aria-hidden="true"
              />
            )}
            <span>{itemLabel}</span>
          </div>
        );
      })}
    </div>
  );
});

ChartLegendContent.displayName = "ChartLegendContent";

// ─── ChartStyle ───────────────────────────────────────────────────────────────
// Inject CSS vars vào <head> khi cần scope global (dùng trong SSR / Storybook)

export interface ChartStyleProps {
  id: string;
  config: ChartConfig;
}

export function ChartStyle({ id, config }: ChartStyleProps) {
  const cssContent = useMemo(() => {
    const vars = Object.entries(config)
      .map(([key, item], index) => `  --color-${key}: ${resolveColor(config, key, index)};`)
      .join("\n");
    return `#${id} {\n${vars}\n}`;
  }, [id, config]);

  return <style dangerouslySetInnerHTML={{ __html: cssContent }} />;
}

ChartStyle.displayName = "ChartStyle";

// ─── useChartConfig ───────────────────────────────────────────────────────────
// Utility hook dùng bên ngoài ChartContainer để truy cập config

export function useChartConfig(): ChartContextValue {
  return useChartContext();
}

// ─── getChartColor ────────────────────────────────────────────────────────────
// Pure helper — lấy màu theo key + config, không cần context

export function getChartColor(config: ChartConfig, key: string, index = 0): string {
  return resolveColor(config, key, index);
}

// ─── Re-export Recharts primitives ────────────────────────────────────────────
// Để consumer không cần import trực tiếp từ recharts

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
