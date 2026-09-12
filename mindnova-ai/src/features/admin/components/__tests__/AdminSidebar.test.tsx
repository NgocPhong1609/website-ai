import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AdminSidebar } from "../AdminSidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/admin" }));

afterEach(() => {
  cleanup();
});

it("does not list AI & System in admin navigation", () => {
  render(<AdminSidebar />);

  expect(screen.queryByRole("link", { name: /AI & System/i })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Tổng quan" })).toHaveAttribute("href", "/admin");
  expect(screen.getByRole("link", { name: "Duyệt giáo viên" })).toHaveAttribute("href", "/admin/teacher-approvals");
  expect(screen.getByRole("link", { name: "Nội dung" })).toHaveAttribute("href", "/admin/content");
  expect(screen.getByRole("link", { name: "Quản lý danh mục" })).toHaveAttribute("href", "/admin/categories");
});
