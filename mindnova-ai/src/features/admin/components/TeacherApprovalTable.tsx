"use client";

import { useMemo, useState } from "react";

import type { AdminTeacherApprovalRow } from "@/src/features/admin/types";

interface TeacherApprovalTableProps {
  rows: AdminTeacherApprovalRow[];
}

export function TeacherApprovalTable({ rows }: TeacherApprovalTableProps) {
  const [selectedRow, setSelectedRow] = useState<AdminTeacherApprovalRow | null>(null);
  const [localRows, setLocalRows] = useState(rows);

  const selectedIndex = useMemo(
    () => localRows.findIndex((row) => row.id === selectedRow?.id),
    [localRows, selectedRow],
  );

  const handleDecision = (decision: "approved" | "rejected") => {
    if (!selectedRow) {
      return;
    }

    setLocalRows((currentRows) =>
      currentRows.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              status: decision,
            }
          : row,
      ),
    );

    setSelectedRow(null);
  };

  return (
    <>
      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Giáo viên</th>
                <th className="px-4 py-3 font-medium">Chuyên môn</th>
                <th className="px-4 py-3 font-medium">Kinh nghiệm</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày nộp</th>
                <th className="px-4 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {localRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.avatarUrl}
                          alt={row.name}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-700">
                          {row.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.expertise}</td>
                  <td className="px-4 py-3 text-slate-600">{row.experience}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : row.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {row.status === "approved" ? "Đã duyệt" : row.status === "rejected" ? "Từ chối" : "Chờ xét duyệt"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.submittedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedRow(row)}
                      className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white shadow-[0_35px_85px_-30px_rgba(15,23,42,0.65)]">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Teacher profile</p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">
                  Hồ sơ giáo viên
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {selectedRow.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedRow.avatarUrl}
                          alt={selectedRow.name}
                          className="h-14 w-14 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-lg font-semibold text-cyan-700">
                          {selectedRow.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-slate-500">Tên giáo viên</p>
                        <h4 className="mt-1 text-xl font-semibold text-slate-900">{selectedRow.name}</h4>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        selectedRow.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : selectedRow.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selectedRow.status === "approved" ? "Đã duyệt" : selectedRow.status === "rejected" ? "Từ chối" : "Chờ xét duyệt"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{selectedRow.email}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Chuyên môn</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{selectedRow.expertise}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Kinh nghiệm</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{selectedRow.experience}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Số bằng cấp</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{selectedRow.credentialCount}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Đánh giá</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{selectedRow.rating}/5.0</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">CV giáo viên</p>
                    {selectedRow.cvUrl ? (
                      <a
                        href={selectedRow.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:border-cyan-300 hover:bg-cyan-100"
                      >
                        Xem CV
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Chưa nộp CV</span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ảnh bằng cấp / chứng chỉ</p>
                  {selectedRow.credentials.length > 0 ? (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {selectedRow.credentials.map((credential) => (
                        <a
                          key={credential.id}
                          href={credential.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-xl border border-slate-200"
                          title={credential.title ?? undefined}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={credential.fileUrl}
                            alt={credential.title ?? "Bằng cấp"}
                            className="h-20 w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-400">Chưa có ảnh bằng cấp nào được nộp.</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ngày nộp</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{selectedRow.submittedAt}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tóm tắt hồ sơ</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Giáo viên này đã nộp hồ sơ chuyên môn với mức kinh nghiệm {selectedRow.experience},
                    {" "}có {selectedRow.credentialCount} bằng cấp và đạt điểm đánh giá {selectedRow.rating}/5.0.
                    {" "}Admin có thể xem xét kỹ trước khi phê duyệt hoặc từ chối quyền giảng dạy.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDecision("approved")}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Duyệt giáo viên
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision("rejected")}
                    className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Không duyệt
                  </button>
                </div>

                {selectedIndex >= 0 ? (
                  <p className="text-xs text-slate-500">
                    Hồ sơ đang xem: {selectedIndex + 1}/{localRows.length}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
