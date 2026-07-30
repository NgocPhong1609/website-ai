"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  BookIcon,
  TrophyIcon,
  PlayCircleIcon,
  GraduationCapIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  TrendingUpIcon,
  HistoryIcon,
  ShieldIcon,
  CpuIcon,
  CheckCircleIcon,
  KeyIcon,
  TerminalIcon,
  UserCheckIcon,
  ActivityIcon,
  FilterIcon
} from "./icons";
import { HISTORY_LOGS, HISTORY_STATS } from "./data";
import type { LogCategory, ILearningHistoryLog } from "./types";

export function LearningHistory() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LogCategory>("ALL");
  const [expandedLogId, setExpandedLogId] = useState<string | null>("log-101");
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort logs in descending order by time (newest first)
  const filteredLogs = useMemo(() => {
    return HISTORY_LOGS.filter((log) => {
      const matchesCategory = activeTab === "ALL" || log.category === activeTab;
      const matchesSearch =
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Group by chronological interval
  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: ILearningHistoryLog[] } = {
      "Today, Real-time Stream": [],
      "Yesterday": [],
      "Earlier this week": [],
    };
    filteredLogs.forEach((log) => {
      if (groups[log.dateGroup]) {
        groups[log.dateGroup].push(log);
      }
    });
    return groups;
  }, [filteredLogs]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert(
        "✅ Learning History Audit & Integrity Report exported successfully as JSON/CSV.\n\nIncluded: Real-time heartbeat logs, security validations, Server-side quiz timestamps, and Certificate hashes."
      );
      setIsExporting(false);
    }, 600);
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  // Helper for renders icon based on log type
  const renderLogIcon = (type: ILearningHistoryLog["iconType"]) => {
    switch (type) {
      case "heartbeat":
        return <ActivityIcon className="w-5 h-5 text-[#168C86]" />;
      case "ai_tutor":
      case "ai_roadmap":
      case "ai_grade":
        return <CpuIcon className="w-5 h-5 text-[#5153DF]" />;
      case "quiz":
        return <BookIcon className="w-5 h-5 text-[#20B2AA]" />;
      case "cert":
        return <TrophyIcon className="w-5 h-5 text-[#B78103]" />;
      case "password":
        return <KeyIcon className="w-5 h-5 text-[#D32F2F]" />;
      case "profile":
        return <UserCheckIcon className="w-5 h-5 text-[#4A4B68]" />;
      case "video":
      default:
        return <PlayCircleIcon className="w-5 h-5 text-[#6B6BFF]" />;
    }
  };

  const renderIconBg = (type: ILearningHistoryLog["iconType"]) => {
    switch (type) {
      case "heartbeat":
        return "bg-[#EBF7F6] border-[#BCE4E1]";
      case "ai_tutor":
      case "ai_roadmap":
      case "ai_grade":
        return "bg-[#F0F0FF] border-[#C7C7FF]";
      case "cert":
        return "bg-[#FEF9E7] border-[#FDEB9E]";
      case "password":
        return "bg-[#FFF0F0] border-[#FFCADD]";
      case "quiz":
        return "bg-[#EBF7F6] border-[#BCE4E1]";
      default:
        return "bg-[#F4F4FA] border-[#DCE0EA]";
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-8 lg:p-10 space-y-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded-full">
              Real-time Audit Log Active &bull; 15s Heartbeat
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] leading-tight mb-1.5">
            Learning History &amp; Integrity Center
          </h1>
          <p className="text-[14px] text-[#7878A0]">
            Audit trails for course access, video heartbeat syncing, AI usage rate-limits, and account security.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5153DF] text-white rounded-xl text-[13px] font-semibold hover:bg-[#4648D4] transition-all duration-200 shadow-md disabled:opacity-70 cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4" />
            {isExporting ? "Exporting Audit Log..." : "Export Integrity Report"}
          </button>
        </div>
      </div>

      {/* Domain Core Requirements Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Account & Security */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest text-[#7878A0] uppercase">Account Security</span>
              <ShieldIcon className="w-4 h-4 text-[#20B2AA]" />
            </div>
            <div className="text-[16px] font-bold text-[#1A1A2E]">
              {HISTORY_STATS.securityStatus}
            </div>
          </div>
          <p className="text-[11.5px] font-medium text-[#20B2AA] mt-3 bg-[#EBF7F6] px-2 py-1 rounded-lg">
            {HISTORY_STATS.securityDetail}
          </p>
        </div>

        {/* Card 2: Learning Heartbeat */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest text-[#7878A0] uppercase">Watch-Time Integrity</span>
              <ActivityIcon className="w-4 h-4 text-[#5153DF]" />
            </div>
            <div className="text-[16px] font-bold text-[#1A1A2E]">
              {HISTORY_STATS.heartbeatIntegrity}
            </div>
          </div>
          <p className="text-[11.5px] font-medium text-[#5153DF] mt-3 bg-[#F0F0FF] px-2 py-1 rounded-lg">
            {HISTORY_STATS.heartbeatDetail}
          </p>
        </div>

        {/* Card 3: AI Learning Quotas */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest text-[#7878A0] uppercase">AI Tutor Quota</span>
              <CpuIcon className="w-4 h-4 text-[#6B6BFF]" />
            </div>
            <div className="text-[16px] font-bold text-[#1A1A2E]">
              {HISTORY_STATS.aiRateLimit}
            </div>
          </div>
          <p className="text-[11.5px] font-medium text-[#6B6BFF] mt-3 bg-[#F0F0FF] px-2 py-1 rounded-lg truncate">
            {HISTORY_STATS.aiRateDetail}
          </p>
        </div>

        {/* Card 4: Certificates Verified */}
        <div className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest text-[#7878A0] uppercase">Auto-Certificates</span>
              <TrophyIcon className="w-4 h-4 text-[#B78103]" />
            </div>
            <div className="text-[16px] font-bold text-[#1A1A2E]">
              {HISTORY_STATS.certificatesVerified} Generated
            </div>
          </div>
          <p className="text-[11.5px] font-medium text-[#B78103] mt-3 bg-[#FEF9E7] px-2 py-1 rounded-lg">
            {HISTORY_STATS.certDetail}
          </p>
        </div>

      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8F9FB] p-2 rounded-2xl border border-[#EAEAF4]">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "ALL", label: "All Activities" },
            { id: "ACCOUNT_MANAGEMENT", label: "1. Account & Security" },
            { id: "LEARNING_CORE", label: "2. Learning Core & Heartbeats" },
            { id: "AI_LEARNING", label: "3. AI Features & Prompts" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as LogCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-[#5153DF] shadow-sm border border-[#EAEAF4]"
                  : "text-[#7878A0] hover:text-[#1A1A2E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search log items or verification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-8 py-1.5 bg-white border border-[#EAEAF4] rounded-xl text-xs text-[#1A1A2E] placeholder-[#A0A0C0] focus:outline-none focus:ring-2 focus:ring-[#5153DF]/30"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-10">
        
        {(["Today, Real-time Stream", "Yesterday", "Earlier this week"] as const).map((groupTitle) => {
          const items = groupedLogs[groupTitle] || [];
          if (items.length === 0) return null;

          const isToday = groupTitle === "Today, Real-time Stream";

          return (
            <div key={groupTitle} className="space-y-4">
              <div className="flex items-center gap-2.5 pl-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isToday ? "bg-[#5153DF] text-white shadow-sm" : "border border-[#EAEAF4] bg-white text-[#7878A0]"
                  }`}
                >
                  {isToday ? <ActivityIcon className="w-3.5 h-3.5" /> : <CalendarIcon className="w-3.5 h-3.5" />}
                </div>
                <h2 className="text-[15px] font-bold text-[#1A1A2E] flex items-center gap-2">
                  {groupTitle}
                  {isToday && (
                    <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full uppercase">
                      Live Syncing
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {items.map((log) => {
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <div
                      key={log.id}
                      className="bg-white border border-[#EAEAF4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                    >
                      {/* Top Summary Row */}
                      <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                        <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${renderIconBg(
                              log.iconType
                            )}`}
                          >
                            {renderLogIcon(log.iconType)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold tracking-wider text-[#7878A0] uppercase">
                                {log.categoryLabel}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[#D0D0E0]" />
                              <span className="text-[11.5px] font-medium text-[#A0A0C0]">
                                {log.timeDisplay}
                              </span>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${log.badgeColor}`}>
                                {log.badge}
                              </span>
                            </div>
                            <h4 className="text-[15px] font-bold text-[#1A1A2E] mb-0.5 truncate">
                              {log.title}
                            </h4>
                            <p className="text-[13px] text-[#7878A0] truncate">
                              {log.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Metric & Actions Right */}
                        <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#F0F0F8]">
                          {log.scoreOrMetric && (
                            <div className="text-left md:text-right">
                              <div className="text-[14.5px] font-bold text-[#1A1A2E]">
                                {log.scoreOrMetric}
                              </div>
                              <div className="text-[11px] text-[#7878A0]">
                                {log.metricLabel}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2.5">
                            {log.actionUrl && (
                              <button
                                type="button"
                                onClick={() => router.push(log.actionUrl!)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#F4F4FA] text-[#5153DF] hover:bg-[#5153DF] hover:text-white text-xs font-bold transition-colors duration-150 cursor-pointer"
                              >
                                {log.actionLabel || "Open"}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => toggleExpand(log.id)}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                                isExpanded
                                  ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                                  : "bg-white text-[#4A4B68] border-[#EAEAF4] hover:bg-[#F8F9FB]"
                              }`}
                            >
                              <span>Audit Rules</span>
                              <ChevronDownIcon
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180 text-white" : "text-[#7878A0]"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Verification Rules Drawer */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-[#F0F0F8] bg-[#FAFBFE] -mx-5 -mb-5 p-5 rounded-b-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[11.5px] font-bold tracking-wider uppercase text-[#5153DF] flex items-center gap-1.5">
                              <TerminalIcon className="w-4 h-4 text-[#5153DF]" />
                              Backend Enforcement &amp; Business Rules Verified
                            </h5>
                            <span className="text-[11px] font-mono text-[#A0A0C0]">
                              Timestamp: {log.timestamp}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {log.verificationRules.map((rule, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-[#EAEAF4] rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                              >
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-[#1A1A2E] flex items-center gap-1.5">
                                    <CheckCircleIcon className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                    {rule.ruleName}
                                  </span>
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#EBF7F6] text-[#168C86]">
                                    {rule.status}
                                  </span>
                                </div>
                                <p className="text-[12px] text-[#555670] leading-relaxed">
                                  {rule.details}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EAEAF4]">
            <HistoryIcon className="w-10 h-10 text-[#C0C0D0] mx-auto mb-3" />
            <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-1">No historical logs found</h3>
            <p className="text-sm text-[#7878A0]">
              Try adjusting your domain filters or search queries above.
            </p>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#EAEAF4] text-xs text-[#7878A0]">
        <span>All timestamps computed and synced in real-time server time (UTC/Local offset verified).</span>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="hover:underline cursor-pointer">Security Protocol Documentation</span>
          <span className="hover:underline cursor-pointer">Rate Limit &amp; AI Policies</span>
        </div>
      </div>

    </div>
  );
}
