import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LessonAttachments } from "../LessonAttachments";
import {
  deleteLessonAttachment,
  downloadLessonAttachment,
  renameLessonAttachment,
  uploadLessonAttachments,
} from "../../api";

vi.mock("../../api", () => ({
  uploadLessonAttachments: vi.fn(),
  renameLessonAttachment: vi.fn(),
  deleteLessonAttachment: vi.fn(),
  downloadLessonAttachment: vi.fn(),
}));

describe("LessonAttachments", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uploads an allowed document and renders returned metadata", async () => {
    vi.mocked(uploadLessonAttachments).mockResolvedValue([
      {
        id: 7,
        display_name: "slides.pdf",
        original_name: "slides.pdf",
        extension: "pdf",
        mime_type: "application/pdf",
        size_bytes: 1024,
      },
    ]);
    render(<LessonAttachments lessonId={3} initialAttachments={[]} />);

    const file = new File(["slides"], "slides.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Chọn tài liệu"), {
      target: { files: [file] },
    });

    await waitFor(() => expect(uploadLessonAttachments).toHaveBeenCalledWith(3, [file]));
    expect(await screen.findByDisplayValue("slides.pdf")).toBeInTheDocument();
  });

  it("rejects a document larger than 25 MB before upload", async () => {
    render(<LessonAttachments lessonId={3} initialAttachments={[]} />);
    const file = new File(["x"], "large.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 25 * 1024 * 1024 + 1 });

    fireEvent.change(screen.getByLabelText("Chọn tài liệu"), {
      target: { files: [file] },
    });

    expect(await screen.findByText(/không vượt quá 25 MB/i)).toBeInTheDocument();
    expect(uploadLessonAttachments).not.toHaveBeenCalled();
  });

  it("renames, downloads, and removes an attachment", async () => {
    vi.mocked(renameLessonAttachment).mockResolvedValue({
      id: 7,
      display_name: "Workbook",
      original_name: "notes.docx",
      extension: "docx",
      mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size_bytes: 2048,
    });
    vi.mocked(downloadLessonAttachment).mockResolvedValue("https://signed.example/notes.docx");
    vi.mocked(deleteLessonAttachment).mockResolvedValue(undefined);
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    render(
      <LessonAttachments
        lessonId={3}
        initialAttachments={[{
          id: 7,
          display_name: "Notes",
          original_name: "notes.docx",
          extension: "docx",
          mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size_bytes: 2048,
        }]}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("Notes"), { target: { value: "Workbook" } });
    fireEvent.click(screen.getByRole("button", { name: "Lưu tên Workbook" }));
    await waitFor(() => expect(renameLessonAttachment).toHaveBeenCalledWith(3, 7, "Workbook"));

    fireEvent.click(screen.getByRole("button", { name: "Tải Workbook" }));
    await waitFor(() => expect(open).toHaveBeenCalledWith("https://signed.example/notes.docx", "_blank", "noopener,noreferrer"));

    fireEvent.click(screen.getByRole("button", { name: "Xóa Workbook" }));
    await waitFor(() => expect(deleteLessonAttachment).toHaveBeenCalledWith(3, 7));
    expect(screen.queryByText("Workbook")).not.toBeInTheDocument();
  });
});
