import { expect, test } from "@playwright/test";
import { API_URL, accessToken, findFreeCourseId, registerStudent } from "./helpers";

test.describe.serial("student learning flow", () => {
  test("register → enroll free course → learn → review → billing → logout", async ({ page }) => {
    // Sign-up sends new learners to onboarding first.
    await registerStudent(page);
    await expect(page).toHaveURL(/\/onboarding/);
    await expect(page.getByRole("button", { name: "Bắt đầu" })).toBeVisible();

    // A brand-new learner sees honest empty states, not sample data.
    await page.goto("/");
    await expect(page.getByText("Chưa có gợi ý cá nhân hóa")).toBeVisible();
    await expect(page.getByText(/Hydration errors/)).toHaveCount(0);

    const courseId = await findFreeCourseId(page);

    // Before enrolling: no review form, no lesson links.
    await page.goto(`/courses/detail?courseId=${courseId}`);
    await expect(page.getByText("Đăng ký khóa học để gửi nhận xét và đánh giá của bạn.")).toBeVisible();
    await expect(page.getByPlaceholder(/Viết nhận xét/)).toHaveCount(0);
    await expect(page.locator('a[href*="/courses/lesson"]')).toHaveCount(0);

    // Lesson page is gated before enrollment.
    await page.goto(`/courses/lesson?courseId=${courseId}`);
    await expect(page.getByRole("heading", { name: "Bạn chưa đăng ký khóa học này" })).toBeVisible();

    // Enroll through the free checkout modal.
    await page.goto(`/courses/detail?courseId=${courseId}`);
    await page.getByRole("button", { name: /Đăng ký ngay/ }).click();
    await page.getByRole("button", { name: /Xác nhận Nhận khóa học/ }).click();
    await expect(page.getByPlaceholder(/Viết nhận xét/)).toBeVisible();

    // Opening a lesson must not complete it instantly.
    const token = await accessToken(page);
    await page.goto(`/courses/lesson?courseId=${courseId}`);
    await page.waitForTimeout(8000);
    const detail = await page.request.get(`${API_URL}/student/courses/detail/${courseId}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    expect((await detail.json()).data.progress_card.completed_lessons_count).toBe(0);

    // Review once; afterwards the form is replaced by an explanation.
    await page.goto(`/courses/detail?courseId=${courseId}`);
    await page.getByPlaceholder(/Viết nhận xét/).fill("Khóa học rõ ràng, dễ theo dõi. (E2E)");
    await page.getByRole("button", { name: "Gửi nhận xét" }).click();
    await expect(page.getByText(/Bạn đã đánh giá khóa học này/)).toBeVisible();

    // Free enrolment is labelled correctly and cannot be refunded.
    await page.goto("/billing");
    await expect(page.getByText("Nhận miễn phí").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Hoàn tiền/ })).toHaveCount(0);

    // Logging out revokes the API token on the server.
    await page.getByRole("button", { name: "Đăng xuất" }).click();
    await expect(page).toHaveURL(/\/login/);
    const afterLogout = await page.request.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    expect(afterLogout.status()).toBe(401);
  });
});
