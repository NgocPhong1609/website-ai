import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuizThumbnail } from "../QuizThumbnail";

describe("Instructor quiz thumbnails", () => {
  it("uses stored thumbnails and a local fallback, including when a remote image breaks", () => {
    render(
      <>
        <QuizThumbnail title="Quiz có ảnh" src="https://cdn.example/cover.png" />
        <QuizThumbnail title="Quiz chưa có ảnh" />
      </>,
    );

    const stored = screen.getByRole("img", { name: "Ảnh đại diện quiz Quiz có ảnh" });
    const missing = screen.getByRole("img", { name: "Ảnh đại diện quiz Quiz chưa có ảnh" });
    expect(stored).toHaveAttribute("src", "https://cdn.example/cover.png");
    expect(missing).toHaveAttribute("src", "/icons/exam.svg");
    expect(stored).toHaveClass("aspect-square");
    expect(stored).toHaveClass("shrink-0");

    fireEvent.error(stored);
    expect(stored).toHaveAttribute("src", "/icons/exam.svg");
  });
});
