import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AdminDashboardShell } from "../AdminDashboardShell";
import { AdminSidebar } from "../AdminSidebar";
import { AdminTopbar } from "../AdminTopbar";

const refresh = vi.fn();

function mockDesktopViewport(isDesktop: boolean) {
  vi.mocked(window.matchMedia).mockImplementation((query) => ({
    matches: isDesktop,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

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
    mockDesktopViewport(false);
  });

  it("keeps closed mobile navigation links out of the accessibility tree", () => {
    renderShell();

    const navigation = screen.getByRole("complementary", { hidden: true });

    expect(navigation).toHaveAttribute("aria-hidden", "true");
    expect(navigation).toHaveAttribute("inert");
    expect(screen.queryByRole("link", { name: /Tổng quan/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tổng quan/, hidden: true })).toBeInTheDocument();
  });

  it("keeps desktop navigation links accessible while the mobile drawer is closed", () => {
    mockDesktopViewport(true);
    renderShell();

    const navigation = screen.getByRole("complementary", { name: "Điều hướng quản trị" });

    expect(navigation).not.toHaveAttribute("aria-hidden");
    expect(navigation).not.toHaveAttribute("inert");
    expect(screen.getByRole("link", { name: /Tổng quan/ })).toBeInTheDocument();
  });

  it("opens and closes the mobile navigation with labeled controls", () => {
    renderShell();

    const menuButton = screen.getByRole("button", { name: "Mở menu quản trị" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Đóng menu quản trị", hidden: true })).not.toBeInTheDocument();

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("complementary", { name: "Điều hướng quản trị" })).not.toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "Đóng menu quản trị" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Đóng menu quản trị" }));

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("contains forward and reverse Tab navigation within the open drawer", () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: "Mở menu quản trị" }));
    const closeButton = screen.getByRole("button", { name: "Đóng menu quản trị" });
    const lastLink = screen.getByRole("link", { name: /Kiểm duyệt/ });

    lastLink.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(lastLink).toHaveFocus();
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
