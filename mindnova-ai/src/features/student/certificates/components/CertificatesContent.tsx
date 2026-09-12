"use client";

import React from "react";
import {
  ShareIcon,
  PartyPopperIcon,
  ArrowRightIcon,
  VerifiedBadgeIcon,
  GraduationCapIcon,
  MedalIcon
} from "./icons";
import { useClaimCertificate, useGetCertificates } from "../api";
import toast from "react-hot-toast";

export function CertificatesContent() {
  const { data, isLoading, isError, refetch } = useGetCertificates();
  const claimMutation = useClaimCertificate();
  const issued = data?.issued ?? [];
  const claimable = data?.claimable ?? [];
  const firstClaimable = claimable[0];

  const handleClaim = async (courseId: number) => {
    try {
      await claimMutation.mutateAsync(courseId);
      toast.success("Đã nhận chứng chỉ.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể nhận chứng chỉ.");
    }
  };

  const handleShare = (url: string | null) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    toast("Chứng chỉ chưa có tệp để chia sẻ.");
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-8 lg:p-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase mb-2">
            Your Achievements
          </h3>
          <h1 className="text-3xl font-bold text-[#0F172A] leading-tight mb-3">
            Certificates &amp; Credentials
          </h1>
          <p className="text-[14px] text-[#64748B] max-w-2xl leading-relaxed">
            Chứng chỉ khóa học bạn đã hoàn thành trên MindNova.
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-[#64748B]">Đang tải chứng chỉ...</p>}
      {isError && (
        <p className="text-sm text-rose-600">
          Không thể tải chứng chỉ.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>Thử lại</button>
        </p>
      )}

      {firstClaimable && (
        <div className="bg-white border border-[#64748B]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-[#EAEAF4] flex items-center justify-center shrink-0">
              <PartyPopperIcon className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#0F172A] mb-1">Sẵn sàng nhận chứng chỉ</h2>
              <p className="text-[14px] text-[#64748B]">
                Bạn đã hoàn thành <span className="font-bold text-[#0F172A]">{firstClaimable.course_title}</span>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleClaim(firstClaimable.course_id)}
            className="w-full md:w-auto px-8 py-3.5 bg-[#3B82F6] text-white rounded-xl text-[15px] font-bold flex items-center justify-center gap-2 hover:bg-[#2563EB] shrink-0"
          >
            Claim Your Certificate
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issued.map((certificate) => (
          <div key={certificate.id} className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="w-full h-[180px] rounded-xl mb-5 bg-[#F8F9FB] border border-[#EAEAF4] flex flex-col items-center justify-center p-4 text-center">
              <div className="text-[10px] font-bold tracking-[0.2em] text-[#3B82F6] uppercase mb-2">MindNova</div>
              <div className="text-[14px] font-serif text-[#0F172A]">{certificate.student_name}</div>
              <div className="text-[12px] text-[#64748B] mt-2">{certificate.course_title}</div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-[17px] font-bold text-[#0F172A] leading-tight">{certificate.course_title}</h3>
                <VerifiedBadgeIcon className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
              </div>
              <p className="text-[13px] text-[#64748B] mb-5">
                {certificate.issued_at ? `Completed on ${certificate.issued_at}` : "Đã cấp"}
              </p>
              <button
                type="button"
                onClick={() => handleShare(certificate.certificate_url)}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6]"
              >
                <ShareIcon className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ))}
        {!isLoading && issued.length === 0 && (
          <p className="text-sm text-[#64748B] col-span-full">Bạn chưa có chứng chỉ nào.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F0FF] text-[#64748B] flex items-center justify-center shrink-0">
            <GraduationCapIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B] mb-0.5">Total Certificates</p>
            <p className="text-2xl font-bold text-[#0F172A]">{data?.stats.total_certificates ?? 0}</p>
          </div>
        </div>
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#F0F0FF] text-[#64748B] flex items-center justify-center shrink-0">
            <MedalIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#64748B] mb-0.5">Completed courses</p>
            <p className="text-2xl font-bold text-[#0F172A]">{data?.stats.completed_courses ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
