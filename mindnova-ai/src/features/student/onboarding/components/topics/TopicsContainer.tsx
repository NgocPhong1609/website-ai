"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, ArrowRightIcon } from "@shared/components/ui";
import { useOnboardingStore } from "@/src/features/student/onboarding/stores/onboardingStore";
import { AiProjectionCard } from "./AiProjectionCard";

// ─── Static Icons ─────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useTopicsSelection() {
  const router = useRouter();
  // Chuyển sang dùng string thay vì ID vì lấy trực tiếp tên danh mục từ API
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const selectTopicsToStore = useOnboardingStore((s) => s.selectTopics);

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // Gọi API lấy Categories khi load trang
  useEffect(() => {
    // 1. Chuẩn bị sẵn một danh sách mồi nếu API sập
    const fallbackCategories = [
      "Web Development", "Mobile Apps", "UI/UX Design", 
      "Data Science", "Artificial Intelligence", "DevOps"
    ];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${apiUrl}/api/student/available-topics`)
      .then(async (res) => {
        // 2. Chặn lỗi từ vòng gửi xe: Kiểm tra xem server có trả về HTML thay vì JSON không
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error("Backend không trả về JSON hợp lệ.");
        }
        return res.json();
      })
      .then((data) => {
        // 3. Có JSON rồi nhưng vẫn kiểm tra xem dữ liệu có rỗng không
        if (data && data.status === "success" && data.topics && data.topics.length > 0) {
          setAvailableCategories(data.topics);
        } else {
          setAvailableCategories(fallbackCategories);
        }
      })
      .catch((err) => {
        // 4. Nếu có bất kỳ lỗi gì (sập server, mất mạng, lỗi parse), cứ âm thầm dùng danh sách mồi
        console.warn("Đang dùng dữ liệu dự phòng do lỗi API:", err.message);
        setAvailableCategories(fallbackCategories); 
      })
      .finally(() => setIsLoadingCats(false));
  }, []);

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      next.has(topic) ? next.delete(topic) : next.add(topic);
      return next;
    });
  }, []);

  const handleAddCustomCategory = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customCategory.trim();
    if (!trimmed) return;

    setAvailableCategories((prev) => 
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );

    setSelectedTopics((prev) => {
      const next = new Set(prev);
      next.add(trimmed);
      return next;
    });

    setCustomCategory("");
  }, [customCategory]);

  const handleGenerate = useCallback(() => {
    const labels = Array.from(selectedTopics);
    selectTopicsToStore(labels);
    router.push("/onboarding/generating");
  }, [selectedTopics, selectTopicsToStore, router]);

  return {
    selectedTopics,
    selectedCount: selectedTopics.size,
    canGenerate: selectedTopics.size > 0,
    toggleTopic,
    handleGenerate,
    availableCategories,
    customCategory,
    setCustomCategory,
    isLoadingCats,
    handleAddCustomCategory
  };
}

// ─── Step Badge ───────────────────────────────────────────────────────────────

function StepBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B6BFF]/8 border border-[#6B6BFF]/20">
      <SparkleIcon />
      <span className="text-xs font-semibold text-[#6B6BFF] tracking-wide">
        Step 3 of 4 — Personalization
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TopicsContainer() {
  const {
    selectedTopics,
    selectedCount,
    canGenerate,
    toggleTopic,
    handleGenerate,
    availableCategories,
    customCategory,
    setCustomCategory,
    isLoadingCats,
    handleAddCustomCategory
  } = useTopicsSelection();

  return (
    <div className="w-full flex flex-col items-center gap-8 px-6 py-12">
      {/* Step badge */}
      <StepBadge />

      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-[#131B2E] leading-tight tracking-tight">
          Which topics spark{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B6BFF] to-[#4cd7f6]">
            your curiosity?
          </span>
        </h1>
        <p className="text-[15px] text-[#64647A] leading-relaxed max-w-lg">
          Select one or more topics below. Our AI will curate a{" "}
          <span className="text-[#4648D4] font-semibold">
            personalized curriculum
          </span>{" "}
          built around your exact interests.
        </p>
      </div>

      {/* Content: topics grid + AI sidebar */}
      <div className="flex items-start gap-5 w-full max-w-4xl">
        
        {/* KHU VỰC TRÁI: Box chứa Categories và Input (Thay thế TopicsGrid tĩnh) */}
        <div className="flex-1 bg-white border border-[#E8E8F0] rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6B6BFF]" />
            <h3 className="text-xs font-bold text-[#84849A] uppercase tracking-wider">Available Topics</h3>
          </div>

          <div className="flex flex-wrap gap-2.5 min-h-[120px] content-start">
            {isLoadingCats ? (
              <span className="text-sm text-gray-400 w-full text-center mt-4">Loading topics from database...</span>
            ) : (
              availableCategories.map((topic) => {
                const isSelected = selectedTopics.has(topic);
                return (
                  <button
                    key={topic} // Dùng luôn tên topic làm key thay vì idx
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-4 py-2.5 flex items-center gap-2 rounded-xl text-[13px] font-semibold transition-all border ${
                      isSelected
                        ? "bg-[#6B6BFF] text-white border-[#6B6BFF] shadow-md"
                        : "bg-white text-[#464554] border-[#E8E8F0] hover:border-[#C7C4D7] hover:bg-[#F8F8FF]"
                    }`}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    {topic}
                  </button>
                );
              })
            )}
          </div>

          {/* Ô input thêm Category tùy chỉnh */}
          <form onSubmit={handleAddCustomCategory} className="flex gap-3 mt-2 border-t border-[#F0F0F7] pt-5">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Can't find it? Add a custom category..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E8F0] text-sm focus:outline-none focus:border-[#6B6BFF] transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#F5F5F8] text-[#464554] text-xs font-bold rounded-xl hover:bg-[#E8E8F0] transition-colors cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        {/* KHU VỰC PHẢI: Giữ nguyên Card tĩnh */}
        <AiProjectionCard selectedCount={selectedCount} />
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate}
          size="unstyled"
          variant="unstyled"
          className={[
            "relative px-12 py-3.5 rounded-xl text-sm font-semibold text-white",
            "bg-gradient-to-r from-[#6B6BFF] to-[#4648D4]",
            "shadow-[0_4px_20px_rgba(107,107,255,0.4)]",
            "hover:shadow-[0_6px_28px_rgba(107,107,255,0.55)] hover:-translate-y-0.5",
            "active:translate-y-0 active:shadow-[0_2px_12px_rgba(107,107,255,0.3)]",
            "transition-all duration-200 ease-out",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none",
          ].join(" ")}
          rightIcon={<ArrowRightIcon />}
        >
          Generate My Learning Path
        </Button>

        <p className="flex items-center gap-1.5 text-[11px] text-[#ADADC0]">
          <ShieldCheckIcon />
          <span>
            Data-driven pathing based on{" "}
            <span className="text-[#4648D4] font-medium">
              50,000+ career trajectories
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}