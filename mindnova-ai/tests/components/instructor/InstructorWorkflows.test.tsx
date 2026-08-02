import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DiscussionReplyContainer } from "@/src/components/page/instructor/discussion";
import { StudentAnalyticsContainer } from "@/src/components/page/instructor/analytic";
import { CreateCourseContainer } from "@/src/components/page/instructor/create-course";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/instructor/discussions",
}));

describe("Instructor Advanced Workflows UI/UX Suite", () => {
  describe("DiscussionReplyContainer (Q&A & Cohort Announcements)", () => {
    it("renders Q&A Inbox by default and supports interactive filter pills", () => {
      render(<DiscussionReplyContainer />);

      expect(screen.getByText(/Hòm thư Hỏi đáp/i)).toBeInTheDocument();
      expect(screen.getByText(/Thông báo Lớp học/i)).toBeInTheDocument();

      const needsAttentionFilter = screen.getByText("Cần phản hồi");
      const unansweredFilter = screen.getByText("Chưa trả lời");
      const allFilter = screen.getByText("Tất cả thảo luận");

      expect(needsAttentionFilter).toBeInTheDocument();
      expect(unansweredFilter).toBeInTheDocument();
      expect(allFilter).toBeInTheDocument();

      fireEvent.click(unansweredFilter);
      expect(unansweredFilter.className).toContain("text-white");
    });

    it("switches cleanly between Hòm thư Hỏi đáp tab and Thông báo Lớp học tab", () => {
      render(<DiscussionReplyContainer />);
      
      const announcementTab = screen.getByText("Thông báo Lớp học");
      fireEvent.click(announcementTab);

      expect(screen.getByText(/Cohort-Wide Rich Text Announcer/i)).toBeInTheDocument();
    });
  });

  describe("StudentAnalyticsContainer (Performance & AI Insights)", () => {
    it("renders Interaction report by default and switches to AI Insights tab", () => {
      render(<StudentAnalyticsContainer />);

      expect(screen.getByText("Báo cáo Tương tác & Tiến độ")).toBeInTheDocument();
      const aiInsightsTab = screen.getByText("Phân tích AI Chuyên sâu");
      expect(aiInsightsTab).toBeInTheDocument();

      fireEvent.click(aiInsightsTab);

      expect(screen.getByText(/Live Behavioral Telemetry/i)).toBeInTheDocument();
      expect(screen.getByText(/Lesson 2.1: Building Type-Safe Server Actions/i)).toBeInTheDocument();
    });
  });

  describe("CreateCourseContainer (AI Course Creation Studio)", () => {
    it("renders Step 1 Basic Info and progresses to Step 2 when clicking Next", () => {
      render(<CreateCourseContainer />);

      expect(screen.getByText("Thông tin cơ bản")).toBeInTheDocument();
      expect(screen.getByText("Thông tin chính")).toBeInTheDocument();
      
      const nextButtons = screen.getAllByText(/Tiếp theo/i);
      fireEvent.click(nextButtons[0]);

      expect(screen.getByText(/Bulk Video Uploader/i)).toBeInTheDocument();

      const backButton = screen.getByText(/← Quay lại/i);
      fireEvent.click(backButton);
      
      expect(screen.getByText("Thông tin cơ bản")).toBeInTheDocument();
    });
  });
});
