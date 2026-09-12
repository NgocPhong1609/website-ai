import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminCategoriesQuickActions } from "../AdminCategoriesQuickActions";
import type { AdminCategoryRow } from "@/src/features/admin/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const rows: AdminCategoryRow[] = [
  { id: 1, name: "Trí tuệ nhân tạo", slug: "tri-tue-nhan-tao", description: "", status: "active" },
  { id: 2, name: "Blockchain nông nghiệp", slug: "blockchain-nong-nghiep", description: "", status: "pending" },
  { id: 3, name: "Khoa học dữ liệu", slug: "khoa-hoc-du-lieu", description: "", status: "inactive" },
];

afterEach(() => {
  cleanup();
});

describe("AdminCategoriesQuickActions pending filter", () => {
  it("shows all categories by default and only pending ones after clicking Chưa duyệt", () => {
    render(<AdminCategoriesQuickActions rows={rows} />);

    expect(screen.getByText("Trí tuệ nhân tạo")).toBeInTheDocument();
    expect(screen.getByText("Blockchain nông nghiệp")).toBeInTheDocument();
    expect(screen.getByText("Khoa học dữ liệu")).toBeInTheDocument();
    expect(screen.getByText("3 danh mục")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Chưa duyệt (1)" }));

    expect(screen.queryByText("Trí tuệ nhân tạo")).not.toBeInTheDocument();
    expect(screen.queryByText("Khoa học dữ liệu")).not.toBeInTheDocument();
    expect(screen.getByText("Blockchain nông nghiệp")).toBeInTheDocument();
    expect(screen.getByText("1 danh mục")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Chưa duyệt (1)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows an empty pending state when no category is waiting for review", () => {
    render(
      <AdminCategoriesQuickActions
        rows={[
          { id: 1, name: "Toán học", slug: "toan-hoc", description: "", status: "active" },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Chưa duyệt" }));

    expect(screen.getByText("Không có danh mục chờ duyệt.")).toBeInTheDocument();
    expect(screen.getByText("0 danh mục")).toBeInTheDocument();
  });
});
