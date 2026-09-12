"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics, getEngagementChart } from "../api";
import { EngagementChart } from "./EngagementChart";

function StudentAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
    const [hasError, setHasError] = useState(false);
    React.useEffect(() => { setHasError(false); }, [avatarUrl]);
    const initials = name ? name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "U";

    if (avatarUrl && !hasError) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                onError={() => setHasError(true)}
                className="w-10 h-10 rounded-2xl shadow-sm object-cover shrink-0 group-hover:scale-105 transition-transform"
            />
        );
    }
    return (
        <div className="w-10 h-10 rounded-2xl bg-[#C0392B] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {initials}
        </div>
    );
}

export function EngagementDashboard({ onSelectStudent }: { onSelectStudent: (id: string) => void }) {
    const [timeRange, setTimeRange] = useState(7);

    const { data: metricsData, isLoading: metricsLoading } = useQuery({
        queryKey: ["dashboard-metrics"],
        queryFn: getDashboardMetrics
    });

    const { data: chartData, isLoading: chartLoading } = useQuery({
        queryKey: ["engagement-chart", timeRange],
        queryFn: () => getEngagementChart({ days: timeRange })
    });

    const metrics = metricsData?.data || { total_learning_hours: 0, total_certificates: 0, new_students: [] };
    const chart = chartData?.data || [];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Top Section: Chart & Stats */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-stretch">
                <div className="min-h-[300px] w-full">
                    {chartLoading ? (
                        <div className="w-full h-full bg-white rounded-2xl border border-[#FAF7F2] animate-pulse flex items-center justify-center">

                        </div>
                    ) : (
                        <EngagementChart data={chart} timeRange={timeRange} setTimeRange={setTimeRange} />
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-[#FAF7F2] flex flex-col justify-center h-full shadow-2xs">

                        <h2 className="text-3xl font-black text-indigo-950 mb-1">
                            {metricsLoading ? "..." : metrics.total_learning_hours} Giờ
                        </h2>
                        <p className="text-xs font-bold text-indigo-700/80 uppercase tracking-wider">Tổng Thời Gian Học Tập</p>
                    </div>

                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-[#FAF7F2] flex flex-col justify-center h-full shadow-2xs">

                        <h2 className="text-3xl font-black text-emerald-950 mb-1">
                            {metricsLoading ? "..." : metrics.total_certificates} Chứng Chỉ
                        </h2>
                        <p className="text-xs font-bold text-emerald-700/80 uppercase tracking-wider">Hoàn Thành Xuất Sắc</p>
                    </div>
                </div>
            </div>

            {/* Bottom Section: New Students List */}
            <div className="bg-white rounded-2xl border border-[#FAF7F2] shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-black text-[#2C3039]">Danh Sách Học Viên Mới Gia Nhập</h3>
                        <p className="text-xs text-[#8A8478] mt-1">Theo dõi hồ sơ và tiến độ chi tiết của học viên mới ghi danh trong 30 ngày qua.</p>
                    </div>
                    <button className="text-sm font-bold text-[#C0392B] hover:text-[#4338CA] transition-colors cursor-pointer">
                        Xem Toàn Bộ Học Viên &rarr;
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FEFCF9]/50">
                                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider w-1/3">Học viên ghi danh</th>
                                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Trạng thái tương tác</th>
                                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">Khóa học gia nhập</th>
                                <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Ngày</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {metricsLoading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-sm">Đang tải dữ liệu...</td></tr>
                            ) : metrics.new_students.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-4xl mb-3 opacity-50 grayscale">‍</span>
                                            <span className="text-sm font-bold text-[#8A8478]">Chưa có học viên mới nào</span>
                                            <span className="text-xs font-medium text-gray-400 mt-1">Học viên ghi danh trong 30 ngày qua sẽ xuất hiện ở đây</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                metrics.new_students.map((st: any, index: number) => (
                                    <tr key={`${st.id}-${index}`} className="hover:bg-[#FEFCF9]/50 transition-colors cursor-pointer group" onClick={() => onSelectStudent(st.id)}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <StudentAvatar name={st.name} avatarUrl={st.avatar_url || st.avatar || st.profile_image} />
                                                <div>
                                                    <p className="text-sm font-bold text-[#2C3039]">{st.name}</p>
                                                    <p className="text-xs text-[#8A8478]">{st.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {st.status === 'ĐANG HOẠT ĐỘNG' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 -[#2C3039] border -[#FAF7F2]">

                                                    ĐANG HOẠT ĐỘNG
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100">

                                                    TẠM VẮNG MẶT
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-xs font-bold text-gray-700">{st.course_name}</p>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <p className="text-xs text-[#8A8478] font-medium">{st.enrolled_at}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
