"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  height?: number;
  color?: string;
  formatCurrency?: (value: number) => string;
}

export function RevenueChart({
  data,
  height = 300,
  color = "#2563eb", // blue-600
  formatCurrency = (val) => `${val.toLocaleString("vi-VN")} ₫`,
}: RevenueChartProps) {
  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#64748b", fontSize: 12 }} 
            dy={10} 
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "#0f172a", fontWeight: 600 }}
            labelStyle={{ color: "#64748b", marginBottom: "4px", fontSize: "13px" }}
            formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
