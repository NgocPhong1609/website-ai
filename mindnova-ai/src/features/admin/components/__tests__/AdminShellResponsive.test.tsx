import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminDashboardShell } from "../AdminDashboardShell";
import { AdminSidebar } from "../AdminSidebar";
import { AdminTopbar } from "../AdminTopbar";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
  useRouter: () => ({ refresh }),
}));

vi.mock("next/link", () => ({
  default: ({ children, onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));

function renderShell() {
  return render(
    <AdminDashboardShell>
      <div className="flex">
        <AdminSidebar />
        <AdminTopbar />
      </div>
    </AdminDashboardShell>,
  );
}

describe("responsive admin shell", () => {
  beforeEach(() => {
    refresh.mockClear();
  });

  it("opens and closes the mobile navigation with labeled controls", () => {
    renderShell();

    const menuButton = screen.getByRole("button", { name: "Mở menu quản trị" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Đóng menu quản trị", hidden: true })).not.toBeInTheDocument();

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Đóng menu quản trị" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Đóng menu quản trị" }));

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("closes after route selection and returns focus to the menu trigger", () => {
    renderShell();

    const menuButton = screen.getByRole("button", { name: "Mở menu quản trị" });
    fireEvent.click(menuButton);
    fireEvent.click(screen.getByRole("link", { name: /Tổng quan/ }));

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();
  });

  it("closes on Escape and returns focus to the menu trigger", () => {
    renderShell();

    const menuButton = screen.getByRole("button", { name: "Mở menu quản trị" });
    fireEvent.click(menuButton);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();
  });

  it("keeps refresh and logout available without unbacked live telemetry", () => {
    renderShell();

    expect(screen.getByRole("button", { name: "Làm mới dữ liệu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đăng xuất" })).toBeInTheDocument();
    expect(screen.queryByText("12ms")).not.toBeInTheDocument();
    expect(screen.queryByText("Tất cả dịch vụ đang ổn định")).not.toBeInTheDocument();
    expect(screen.queryByText(/Online sync/i)).not.toBeInTheDocument();
    expect(screen.queryByText("LIVE")).not.toBeInTheDocument();
  });
});
