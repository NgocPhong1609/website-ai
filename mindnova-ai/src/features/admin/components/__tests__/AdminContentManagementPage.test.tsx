import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminApi } from "../../lib/admin-api";
import { AdminContentManagementPage } from "../AdminContentManagementPage";

vi.mock("../../lib/admin-api", () => ({ adminApi: vi.fn() }));

const instructors = [
  { id: 11, name: "Giảng viên Alpha", email: "alpha@example.com" },
  { id: 22, name: "Giảng viên Beta", email: "beta@example.com" },
];

function courseResponse(title: string, overrides: Record<string, unknown> = {}) {
  return {
    data: [{ id: 101, title, status: "pending_review", teacher: { name: "Giảng viên Alpha" } }],
    meta: { current_page: 1, last_page: 2, per_page: 20, total: 21 },
    summary: { total: 21, pending_review: 7 },
    filters: { instructors },
    ...overrides,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => { resolve = next; });
  return { promise, resolve };
}

beforeEach(() => {
  vi.mocked(adminApi).mockImplementation(async (path) => {
    if (path.startsWith("/admin/content/courses")) return courseResponse("Khóa học ban đầu");
    return { data: [] };
  });
});

afterEach(() => {
  cleanup();
  vi.mocked(adminApi).mockReset();
});

describe("AdminContentManagementPage course filters", () => {
  it("combines search and instructor filter with server pagination, then resets to page one when the instructor changes", async () => {
    vi.mocked(adminApi).mockImplementation(async (path) => {
      if (!path.startsWith("/admin/content/courses")) return { data: [] };
      const query = new URLSearchParams(path.split("?")[1]);
      const page = Number(query.get("page") || 1);
      const teacher = query.get("teacher_id");
      return courseResponse(`Kết quả ${teacher || "all"} trang ${page}`, {
        meta: { current_page: page, last_page: 2, per_page: 20, total: 21 },
      });
    });

    render(<AdminContentManagementPage />);
    await screen.findByText("Kết quả all trang 1");

    fireEvent.change(screen.getByLabelText("Tìm khóa học"), { target: { value: "Laravel" } });
    fireEvent.change(screen.getByLabelText("Lọc theo giảng viên"), { target: { value: "11" } });
    fireEvent.click(screen.getByRole("button", { name: "Tìm kiếm" }));

    expect(await screen.findByText("Kết quả 11 trang 1")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Trang sau" }));
    expect(await screen.findByText("Kết quả 11 trang 2")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Lọc theo giảng viên"), { target: { value: "22" } });
    expect(await screen.findByText("Kết quả 22 trang 1")).toBeVisible();

    await waitFor(() => {
      expect(adminApi).toHaveBeenCalledWith(
        "/admin/content/courses?visibility=all&status=pending_review&search=Laravel&teacher_id=22&page=1&per_page=20",
      );
    });
  });

  it("renders accurate filtered totals and an empty course state", async () => {
    vi.mocked(adminApi).mockImplementation(async (path) => {
      if (path.startsWith("/admin/content/courses")) {
        return courseResponse("", {
          data: [],
          meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
          summary: { total: 0, pending_review: 0 },
        });
      }
      return { data: [] };
    });

    render(<AdminContentManagementPage />);

    expect(await screen.findByText("Không có khóa học nào đang chờ duyệt.")).toBeVisible();
    expect(screen.getByText("0 kết quả")).toBeVisible();
    expect(screen.getByText("Trang 1 / 1")).toBeVisible();
  });

  it("describes an empty filtered result without implying the catalog is empty", async () => {
    vi.mocked(adminApi).mockImplementation(async (path) => {
      if (path.startsWith("/admin/content/courses")) {
        const query = new URLSearchParams(path.split("?")[1]);
        if (query.get("search")) {
          return courseResponse("", {
            data: [],
            meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
            summary: { total: 0, pending_review: 0 },
          });
        }
        return courseResponse("Khóa học ban đầu");
      }
      return { data: [] };
    });

    render(<AdminContentManagementPage />);
    await screen.findByText("Khóa học ban đầu");
    fireEvent.change(screen.getByLabelText("Tìm khóa học"), { target: { value: "không tồn tại" } });
    fireEvent.click(screen.getByRole("button", { name: "Tìm kiếm" }));

    expect(await screen.findByText("Không tìm thấy khóa học phù hợp.")).toBeVisible();
    expect(screen.queryByText("Không có khóa học nào đang chờ duyệt.")).not.toBeInTheDocument();
  });

  it("keeps the newest instructor result when an older request finishes later", async () => {
    const alpha = deferred<ReturnType<typeof courseResponse>>();
    const beta = deferred<ReturnType<typeof courseResponse>>();
    vi.mocked(adminApi).mockImplementation(async (path) => {
      if (!path.startsWith("/admin/content/courses")) return { data: [] };
      const teacher = new URLSearchParams(path.split("?")[1]).get("teacher_id");
      if (teacher === "11") return alpha.promise;
      if (teacher === "22") return beta.promise;
      return courseResponse("Kết quả ban đầu");
    });

    render(<AdminContentManagementPage />);
    await screen.findByText("Kết quả ban đầu");
    fireEvent.change(screen.getByLabelText("Lọc theo giảng viên"), { target: { value: "11" } });
    await waitFor(() => expect(adminApi).toHaveBeenCalledWith(expect.stringContaining("teacher_id=11")));
    fireEvent.change(screen.getByLabelText("Lọc theo giảng viên"), { target: { value: "22" } });

    await act(async () => { beta.resolve(courseResponse("Kết quả Beta mới nhất")); });
    expect(await screen.findByText("Kết quả Beta mới nhất")).toBeVisible();
    await act(async () => { alpha.resolve(courseResponse("Kết quả Alpha đã cũ")); });

    expect(screen.getByText("Kết quả Beta mới nhất")).toBeVisible();
    expect(screen.queryByText("Kết quả Alpha đã cũ")).not.toBeInTheDocument();
  });

  it("shows course results even when ancillary content fails to load", async () => {
    vi.mocked(adminApi).mockImplementation(async (path) => {
      if (path.startsWith("/admin/content/courses")) return courseResponse("Khóa học vẫn hiển thị");
      if (path === "/admin/content/resources") throw new Error("Không tải được tài liệu");
      return { data: [] };
    });

    render(<AdminContentManagementPage />);

    expect(await screen.findByText("Khóa học vẫn hiển thị")).toBeVisible();
    expect(screen.getByText("21 kết quả")).toBeVisible();
  });

  it("returns to the last valid page when moderation empties the current page", async () => {
    let moderated = false;
    vi.mocked(adminApi).mockImplementation(async (path, options) => {
      if (path.endsWith("/moderate") && options?.method === "PATCH") {
        moderated = true;
        return {};
      }
      if (!path.startsWith("/admin/content/courses")) return { data: [] };

      const requestedPage = Number(new URLSearchParams(path.split("?")[1]).get("page") || 1);
      if (requestedPage === 2 && moderated) {
        return courseResponse("", {
          data: [],
          meta: { current_page: 2, last_page: 1, per_page: 20, total: 1 },
          summary: { total: 1, pending_review: 1 },
        });
      }
      if (requestedPage === 2) {
        return courseResponse("Khóa học cuối trang hai", {
          meta: { current_page: 2, last_page: 2, per_page: 20, total: 21 },
        });
      }
      return courseResponse(moderated ? "Khóa học còn lại trang một" : "Khóa học trang một", {
        meta: { current_page: 1, last_page: moderated ? 1 : 2, per_page: 20, total: moderated ? 1 : 21 },
      });
    });

    render(<AdminContentManagementPage />);
    await screen.findByText("Khóa học trang một");
    fireEvent.click(screen.getByRole("button", { name: "Trang sau" }));
    await screen.findByText("Khóa học cuối trang hai");
    fireEvent.click(screen.getByRole("button", { name: "Duyệt" }));

    expect(await screen.findByText("Khóa học còn lại trang một")).toBeVisible();
    expect(screen.getByText("Trang 1 / 1")).toBeVisible();
  });

  it("refreshes with the newest instructor after a delayed moderation finishes", async () => {
    const moderation = deferred<Record<string, never>>();
    vi.mocked(adminApi).mockImplementation(async (path, options) => {
      if (path.endsWith("/moderate") && options?.method === "PATCH") return moderation.promise;
      if (!path.startsWith("/admin/content/courses")) return { data: [] };

      const teacher = new URLSearchParams(path.split("?")[1]).get("teacher_id");
      return courseResponse(teacher === "22" ? "Kết quả giảng viên Beta" : "Kết quả chưa lọc");
    });

    render(<AdminContentManagementPage />);
    await screen.findByText("Kết quả chưa lọc");
    fireEvent.click(screen.getByRole("button", { name: "Duyệt" }));
    fireEvent.change(screen.getByLabelText("Lọc theo giảng viên"), { target: { value: "22" } });
    expect(await screen.findByText("Kết quả giảng viên Beta")).toBeVisible();

    await act(async () => { moderation.resolve({}); });

    await waitFor(() => {
      const courseRequests = vi.mocked(adminApi).mock.calls
        .map(([path]) => path)
        .filter((path) => path.includes("/admin/content/courses?"));
      expect(courseRequests.at(-1)).toContain("teacher_id=22");
    });
    expect(screen.getByText("Kết quả giảng viên Beta")).toBeVisible();
  });
});
