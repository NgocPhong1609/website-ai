"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function EngagementChart({ data, timeRange, setTimeRange }: { data: any[], timeRange: number, setTimeRange: (val: number) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getRangeText = (val: number) => {
    if (val === 7) return "7 ngày qua";
    if (val === 14) return "14 ngày qua";
    if (val === 30) return "30 ngày qua";
    return `${val} ngày qua`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-gray-900">Biểu Đồ Tương Tác Học Tập</h3>
          <p className="text-xs text-gray-500 mt-1">Tối ưu hóa tần suất hoạt động theo từng ngày trong tuần.</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-[130px] bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl px-4 py-2 hover:bg-gray-50 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm transition-colors"
          >
            <span>{getRangeText(timeRange)}</span>
            <svg className={twMerge("w-4 h-4 text-gray-500 transition-transform duration-200", isOpen ? "rotate-180" : "")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-[130px] bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                {[7, 14, 30].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setTimeRange(val);
                      setIsOpen(false);
                    }}
                    className={twMerge(
                      "w-full text-left px-4 py-2 text-xs font-bold cursor-pointer transition-colors",
                      timeRange === val ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {getRangeText(val)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[250px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="dayLabel" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                labelStyle={{ color: '#6b7280', marginBottom: '4px', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="interactions" 
                name="Tương tác"
                stroke="#4F46E5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorInteractions)" 
                activeDot={{ r: 6, fill: "#4F46E5", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-semibold">Chưa có dữ liệu tương tác</p>
          </div>
        )}
      </div>
    </div>
  );
}
