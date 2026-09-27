# Prompt: Refactor toàn bộ portal Instructor — MindNova AI

> Dán toàn bộ nội dung file này cho Gemini (agent có quyền đọc/sửa repo và chạy lệnh).

---

## 0. Vai trò và mục tiêu

Bạn là kỹ sư full-stack làm việc trong monorepo **MindNova AI**:
- Frontend Next.js 16 (App Router, React 19, TanStack Query, Zustand, Tailwind 4, lucide-react): `mindnova-ai/`
- Backend Laravel 13 (Sanctum, Pest trên MySQL `du_an_testing`): `website-MindNova-AI/`

Nhiệm vụ: sửa các lỗi logic và refactor UI/UX của **toàn bộ portal giảng viên** (`/instructor/*` và wizard `/instructor/create-course`). Danh sách lỗi bên dưới đã được **kiểm chứng bằng test thật trên trình duyệt và DB** — đừng "phát hiện lại", hãy sửa đúng root cause.

Làm tuần tự theo từng Phase. Hết mỗi Phase: chạy lệnh kiểm tra, commit, rồi mới sang Phase tiếp.

---

## 1. Quy tắc bắt buộc (vi phạm = làm lại)

1. **Đọc trước khi sửa**: `AGENTS.md` (gốc repo), `mindnova-ai/DESIGN.md`, `mindnova-ai/src/shared/theme/palette.ts`, và mọi file bạn định sửa + test liên quan.
2. **Nhánh**: tạo nhánh mới `feature/instructor-refactor-v2` từ nhánh hiện tại `feature/onboarding-refactor`. Không commit lên `main`. **Không push**, không merge.
3. **Không** sửa `.env`, không in/log secret, không chạy `php artisan db:seed`, `migrate:fresh`, `demo:*`, `mock:*` trên DB local `laravel`. Test backend dùng DB `du_an_testing` (Pest tự `RefreshDatabase`).
4. **Không phá API contract** mà student/admin đang dùng. Được thêm endpoint/field mới; khi đổi response phải giữ field cũ hoặc cập nhật mọi nơi gọi (grep toàn repo).
5. **Business rule phải giữ nguyên** (AGENTS.md §8): giảng viên không tự publish; không xóa khóa/bài đã publish; ownership theo `courses.teacher_id`; commission standard 30/70, exclusive 15/85; submit review chỉ khi `CourseHealth.can_submit = true` và từ `draft|needs_fixes|rejected`.
6. **UI**:
   - Palette Blue duy nhất (`blue-50…blue-700`, `slate-*`), lỗi/destructive dùng `rose-*`, thành công `emerald-*`, cảnh báo `amber-*`. Cấm hex cũ `#C0392B` và họ hàng; hạn chế hex tùy ý — dùng token Tailwind.
   - Icon chỉ từ `lucide-react`; không emoji, không SVG tự vẽ.
   - Trạng thái tải dùng skeleton từ `mindnova-ai/src/shared/components/ui/Skeleton.tsx` (`Skeleton`, `SkeletonCard`, `SkeletonTable`, `SkeletonList`, `SkeletonStatGrid`, `SkeletonPage`). Không dùng chữ "Đang tải…" trần hay spinner toàn trang.
   - Toàn bộ chữ hiển thị bằng **tiếng Việt** (giữ nguyên tên công nghệ). Tiêu đề dùng *sentence case* ("Danh sách học viên", không "Danh Sách & Quản Trị Học Viên").
   - Hộp thoại xác nhận dùng `useConfirmDialog` (`src/shared/components/ui/ConfirmDialog.tsx`); không dùng `window.confirm/alert/prompt`.
   - Modal phải có `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, đóng bằng Esc, trả focus về nút mở, khóa scroll nền.
   - Nút chỉ có icon phải có `aria-label` tiếng Việt.
   - Mọi trang phải dùng được ở 375px (không cuộn ngang toàn trang; bảng rộng thì bọc `overflow-x-auto` hoặc đổi sang dạng thẻ trên mobile).
7. Sửa đúng phạm vi. Không refactor module student/admin, không đổi thư viện, không thêm dependency trừ khi Phase yêu cầu.
8. Không để `// @ts-nocheck`, `any` mới, `console.log` debug trong code bạn viết.
9. Cập nhật `AGENTS.md` khi thay đổi hành vi công khai/API (Phase 7).

---

## 2. Môi trường và lệnh kiểm tra

Windows + Git Bash. PHP: `/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php` (gọi là `$PHP`).

```bash
# Backend
cd website-MindNova-AI
$PHP artisan test tests/Feature/Instructor            # nhóm instructor
$PHP artisan test --filter=<TênTest>                   # một test

# Frontend
cd mindnova-ai
npx tsc --noEmit -p .        # type check (lỗi có sẵn được phép: RevenueChart.tsx, .next/dev/types/validator.ts)
npx vitest run src/features/instructor
pnpm build                   # phải build thành công
pnpm test:e2e                # cần BE :8000 và FE :3000 đang chạy
```

Tài khoản seed để test tay: `teacher@mindnova.ai` / `password` (có 3 khóa học, doanh thu, học viên).

Baseline hiện tại: Vitest instructor 39/39 pass; Pest instructor **73/109 pass (36 fail do fixture — xem Phase 0)**.

---

## 3. Các Phase

### Phase 0 — Sửa test fixture backend (điều kiện tiên quyết)

**Vấn đề (đã xác minh):** 36 test trong `tests/Feature/Instructor/*`, `tests/Feature/RoleAccessTest.php`, `tests/Feature/AttachQuizTest.php`… fail với:
- `Duplicate entry 'teacher' for key 'roles.roles_name_unique'` — migration `database/migrations/2026_09_12_160000_seed_default_roles.php` đã seed sẵn `admin/teacher/student`, nhưng test vẫn gọi `Role::create(['name' => 'teacher', ...])`.
- `Duplicate entry '3-90' for key 'role_user.PRIMARY'` — `User` có hook `saved` tự `syncNamedRole()` khi set thuộc tính `role` (xem `app/Models/User.php` ~dòng 204–220), sau đó test lại `roles()->attach()` thủ công.

**Việc cần làm:**
- Trong các test: thay `Role::create([...])` bằng `Role::firstOrCreate(['name' => ...])` hoặc dùng `Role::idFor('teacher')`; tạo user bằng một cách duy nhất (hoặc truyền `role` cho factory, hoặc `roles()->syncWithoutDetaching`), không làm cả hai.
- Nếu có nhiều test lặp lại cùng setup, tạo helper chung trong `tests/Pest.php` hoặc trait `tests/Concerns/CreatesUsersWithRoles.php` (ví dụ `teacher()`, `student()`), rồi dùng lại.
- **Không** sửa migration/model để "chiều" test.

**Chấp nhận:** `$PHP artisan test tests/Feature/Instructor tests/Feature/RoleAccessTest.php tests/Feature/AttachQuizTest.php tests/Feature/CommissionConfigurationTest.php tests/Feature/InstructorPayoutTest.php tests/Feature/ChatTeacherRoleTest.php` pass 100% (nếu có test fail vì lỗi nghiệp vụ thật, ghi lại và xử lý ở Phase 1, không xóa test).

Commit: `test(instructor): fix role fixtures after pivot-only roles`

---

### Phase 1 — Lỗi logic backend

**1.1 Quiz: danh sách hiện quiz nhưng mở ra bị 403.**
- `App\Services\Instructor\QuizService::getInstructorQuizzes()` (~dòng 331) trả quiz có `instructor_id = user` **hoặc** gắn (attachment / lesson / module) vào khóa học của giảng viên.
- `app/Policies/QuizPolicy.php` (`view`, `update`, `delete`, `attach`) chỉ cho phép khi `quiz.instructor_id === user.id` → quiz seed có `instructor_id = null` (ví dụ id 6–10 của `teacher@mindnova.ai`) hiện trong danh sách nhưng `GET /api/instructor/ai-quiz/7` trả 403.
- Sửa: tạo một hàm sở hữu dùng chung (ví dụ `Quiz::isOwnedBy(User $user): bool` hoặc private helper trong policy) với **cùng điều kiện** như `getInstructorQuizzes`, dùng cho mọi ability trong `QuizPolicy`. Admin vẫn được phép.
- Viết migration backfill: `quizzes.instructor_id` đang null thì gán `courses.teacher_id` suy ra từ lesson → course (hoặc module → course, hoặc attachment → course); bỏ qua nếu suy ra nhiều giáo viên khác nhau.
- Test: giảng viên A xem/sửa/xóa được quiz gắn vào khóa học của mình dù `instructor_id` null; giảng viên B nhận 403.

**1.2 Trạng thái xác minh giảng viên mặc định sai.**
- Cột `users.teacher_verification_status` có DEFAULT `pending` → mọi giảng viên mới (và cả học viên) hiện "Đang chờ xét duyệt" dù chưa nộp hồ sơ nào.
- Sửa: migration đổi default thành `none`; backfill `pending` → `none` cho user **không có** bản ghi nào trong `teacher_verifications` (kiểm tra tên bảng/cột thực tế trước). Kiểm tra `TeacherVerificationService` chuyển sang `pending` đúng lúc nộp hồ sơ.
- FE `src/features/instructor/profile/`: trạng thái `none` hiển thị "Chưa gửi hồ sơ xác minh" + CTA "Gửi hồ sơ xác minh"; chỉ `pending` mới hiện "Đang chờ xét duyệt".
- Test: user mới có `none`; sau khi nộp hồ sơ → `pending`.

**1.3 Doanh thu không nhất quán giữa các màn.**
- `/instructor/revenue` (overview) hiện "Tổng doanh thu tháng này 1.113.000đ" + giao dịch PENDING, trong khi `/instructor/revenue/sales-report` hiện "Tổng doanh thu 0đ, lượt bán 0" cho cùng giảng viên `teacher@mindnova.ai`.
- Đọc `RevenueService`, controller sales-report và overview; xác định nguồn dữ liệu và bộ lọc thời gian mỗi bên. Thống nhất: doanh thu = tổng `revenue_allocations` của giảng viên (mọi trạng thái trừ `REFUNDED`) trong khoảng thời gian đang chọn; lượt bán = số order item đã hoàn tất. Hai màn cùng khoảng thời gian phải ra cùng số.
- Test feature: seed 1 order hoàn tất + allocation → overview và sales-report trả cùng tổng.

**1.4 Chỉ số phân tích học viên luôn 0.**
- `/instructor/analytics` hiện "0 Giờ tổng thời gian học", "0 Chứng chỉ", biểu đồ tương tác toàn 0 trong khi học viên có tiến độ 40–100%.
- Đọc `StudentAnalyticsController` + service; tìm nguồn thật: thời gian học (từ `lesson_completions` × thời lượng bài, hoặc dữ liệu `start`/`complete` bài học), chứng chỉ (bảng `certificates` theo khóa của giảng viên), tương tác theo ngày (`lesson_completions.completed_at`, quiz attempts, discussions). Nếu không có dữ liệu → trả `null`/mảng rỗng để FE hiện empty state, **không** trả 0 giả.
- Test: có 1 lesson completion hôm nay → chart ngày hôm nay ≥ 1.

**1.5 Trang học viên chậm (~12s local, gấp 3–4 lần các trang khác).**
- Bật query log cho `GET /api/instructor/students` (và các endpoint trang này gọi), tìm N+1; dùng eager loading / aggregate subquery. Mục tiêu: số query không tăng theo số học viên. Ghi số query trước/sau vào báo cáo cuối.

**1.6 Khóa học — level.**
- Backend chấp nhận `level in:beginner,intermediate,advanced`, nhưng UI (wizard + tab thông tin) chỉ có "Cơ bản" / "Nâng cao" → khóa có `intermediate` không hiện lựa chọn nào. Sửa FE ở Phase 3.

Commit: `fix(instructor): quiz ownership, verification default, revenue and analytics data`

---

### Phase 2 — Wizard tạo khóa học: tạo nguyên tử, không mất dữ liệu

Hiện trạng (`src/features/instructor/create-course/components/CreateCourseContainer.tsx`, `handlePublish`):
- Frontend gọi **tuần tự** `POST courses` → `POST modules` ×N → `POST lessons` ×M → `createQuiz` → `PATCH price` → `PATCH status`. Lỗi giữa chừng để lại khóa học dở dang; bấm lại tạo **trùng**. Một khóa 1 bài đã mất ~11s.
- Nếu `courseInfo.thumbnailFile` mất (File không lưu được vào localStorage → reload trang là mất) thì code gửi `new File(["mock"], "mock.png")` làm ảnh bìa.
- Gửi `status: 'published'` cho lesson từ client (backend đã ép về draft — bỏ đi).
- Lỗi tạo quiz bị nuốt (`console.error`).
- Store lưu dữ liệu nhưng không lưu bước hiện tại → reload quay về bước 1.

**Việc cần làm:**

Backend
- Endpoint mới `POST /api/instructor/courses/wizard` (trong group `auth:sanctum` + `role:teacher`), FormRequest riêng validate toàn bộ payload:
  `title, description, category_id | other_category_name, level, thumbnail_media_id, modules[{title, order, lessons[{title, type(video|article|quiz_module), content?, order, temp_media_ids?[], video_url?, quiz?{...}}]}], price, partnership_tier, flash_sale?{sale_price, start, end}`.
- Service `App\Services\Instructor\CourseWizardService::create(User $teacher, array $data, string $idempotencyKey): Course` chạy trong `DB::transaction`, **tái sử dụng** các service hiện có (CourseService, module/lesson service, QuizService, pricing) — không copy logic. Khóa học tạo ra ở trạng thái `draft`.
- Idempotency: header `Idempotency-Key` bắt buộc; lưu key → course_id (cache 24h hoặc bảng nhỏ). Gửi lại cùng key trả về khóa học đã tạo (200), không tạo mới.
- Ảnh bìa: dùng endpoint sẵn có `POST /api/instructor/media/temp` (đã hỗ trợ jpg/png/webp) — FE upload ngay khi chọn ảnh, gửi `thumbnail_media_id`; service promote media tạm thành thumbnail. Nếu transaction lỗi, không để file mồ côi (dọn trong `catch` hoặc dựa vào job `app:cleanup-temp-media`).
- Test Pest: tạo thành công (course+modules+lessons+quiz+price); payload thiếu → 422 không tạo gì; lỗi giữa chừng (mock service ném exception) → rollback hoàn toàn; gửi lại cùng key → không trùng; giảng viên khác không dùng được media tạm của người khác.

Frontend
- `handlePublish` gọi **một** request tới endpoint mới với `Idempotency-Key` (sinh 1 lần cho mỗi bản nháp, lưu trong store).
- Ảnh bìa: upload lên `media/temp` khi chọn, lưu `thumbnailMediaId` + URL preview vào store (persist) → reload không mất. Xóa hoàn toàn nhánh `new File(["mock"]...)`.
- Persist `step` trong store (`createCourseStore.ts`).
- Validate đầy đủ ở từng bước, hiện lỗi **inline dưới từng trường** (không chỉ toast), theo đúng quy tắc CourseHealth: tên ≥ 3 ký tự, mô tả ≥ 30, có ảnh bìa, có lĩnh vực (hoặc tên lĩnh vực khác) ở **bước 1**; ≥ 1 chương và ≥ 1 bài ở bước 2; giá hợp lệ (0 hoặc 100.000–100.000.000), flash sale hợp lệ ở bước 3.
- Lỗi quiz/bất kỳ lỗi nào từ server hiển thị rõ cho người dùng; không nuốt lỗi.
- Nút "Hoàn tất & Tạo khóa học" có trạng thái đang xử lý, không bấm được 2 lần.

Commit: `feat(instructor): atomic course creation wizard with idempotency`

---

### Phase 3 — Khung portal (layout, điều hướng, mobile)

Files chính: `app/(instructor)/layout.tsx`, `src/features/instructor/management/components/InstructorSidebar.tsx`, `InstructorTopbar.tsx`, `app/(create-course)/…`, `src/features/instructor/create-course/components/CreateCourseTopbar.tsx`.

1. **Mobile sidebar**: hiện sidebar luôn chiếm ~½ màn hình ở 375px, bóp nội dung (xác minh bằng ảnh chụp Pixel 7). Chuyển thành off-canvas drawer giống phía học viên (`src/features/student/layout/components/Sidebar.tsx` + `src/features/student/layout/components/mobileSidebar.ts` + nút hamburger trong `src/features/student/dashboard/components/DashboardTopbar.tsx`): ẩn dưới `lg`, nút "Mở menu" ở topbar, overlay, đóng bằng Esc / bấm overlay / khi đổi route, khóa scroll nền, `aria-expanded`.
2. **Bug hiển thị "Alex Rivera 0"**: `InstructorSidebar.tsx:139` `{user?.is_verified && <VerifiedTeacherBadge …/>}` với `is_verified = 0` render ra chữ "0". Dùng `Boolean(user?.is_verified) && …`. Grep toàn `src/features/instructor` các mẫu `{số && …}` tương tự và sửa.
3. **Widget "Hỏi Gia sư AI" của học viên** (`FloatingAiChat` từ `src/features/student/layout`) đang được mount trong layout instructor, che nút "Lưu thay đổi", cột bảng và dùng quota AI của học viên. Gỡ khỏi `app/(instructor)/layout.tsx`.
4. **Title trang**: layout đặt mặc định "Quản lý Khóa học — MindNova AI Instructor" nên các trang không khai báo metadata bị sai tên (`/instructor/quiz-generator/create`, `/instructor/messages`); một số title tiếng Anh ("My Courses", "Student Analytics", "Detailed Sales Analytics"). Đặt `metadata.title` tiếng Việt cho **mọi** `page.tsx` instructor, dùng template `%s — MindNova Giảng viên` ở layout.
5. **Điều hướng**:
   - `/instructor` đang redirect thẳng sang `/instructor/courses` — giữ redirect (không làm dashboard mới).
   - Sidebar thiếu mục cho "Tin nhắn" (khi ở `/instructor/messages` lại highlight "Thảo luận & Hỏi đáp") và "Hồ sơ". Thêm mục "Tin nhắn" (`MessageSquare`) và "Hồ sơ & xác minh" (`UserRound`); active state theo `pathname.startsWith`.
   - `/instructor/analytics` trùng nội dung với tab "Phân tích tương tác" trong `/instructor/students`. Giữ một nguồn: tab trong trang học viên điều hướng tới `/instructor/analytics` (hoặc ngược lại) — không render hai bản.
6. **Wizard tạo khóa học dùng chrome riêng**: header "MindNova AI" với link "Hướng dẫn" (`/instructor/guide`) và "Cộng đồng" (`/instructor/community`) đều **404**; avatar hiện chữ "N" trong khi portal hiện "A" (nguồn user khác nhau). Gỡ 2 link chết; avatar/tên lấy cùng nguồn user với `InstructorTopbar`.
7. **HTML hợp lệ**: trang tạo khóa học có 2 thẻ `<main>` lồng nhau — chỉ giữ một.
8. Nền layout `bg-[#F7F7FB]` → `bg-slate-50`.
9. Topbar: pill "5 thảo luận mới" phải khớp số ở trang thảo luận ("Cần phản hồi"); dùng chung một query/endpoint.

Commit: `refactor(instructor): responsive shell, navigation and page titles`

---

### Phase 4 — Khóa học: danh sách, sửa, wizard (UI)

1. **CourseHealthCard** (`create-course/components/CourseHealthCard.tsx`):
   - Tiếng Việt: "Mức độ hoàn thiện · 70/100".
   - Mỗi vấn đề nêu **đối tượng cụ thể** (ví dụ "Bài 'Giới thiệu' chưa có video") — hiện khóa #1 có 2 dòng y hệt "Bài video chưa có video sẵn sàng phát." (backend `CourseHealthService` cần trả thêm `lesson_id`/`lesson_title`; cập nhật FE tương ứng).
   - Mỗi vấn đề có nút/đường dẫn tới đúng tab cần sửa.
   - Màu: chưa đạt → `amber` (cảnh báo), đạt → `emerald`; không dùng nền đỏ cho trạng thái "chưa hoàn thiện".
2. **Nút "Gửi xét duyệt"** đang bấm được khi `can_submit = false`, hiện hộp xác nhận, rồi backend trả 422 và toast dài 6 dòng. Disable khi `can_submit = false`, tooltip/hint "Hoàn thiện các mục còn thiếu để gửi duyệt" và cuộn tới HealthCard khi bấm.
3. **Trình độ**: 3 lựa chọn "Cơ bản / Trung cấp / Nâng cao" ↔ `beginner / intermediate / advanced` ở cả wizard và tab thông tin; hiện đúng giá trị đã lưu.
4. **Bộ chọn lĩnh vực** (dropdown tự chế ở Step1 và tab thông tin) không có role combobox/listbox, không điều khiển được bằng bàn phím: làm lại theo pattern combobox (`role="combobox"`, `aria-expanded`, `aria-controls`, listbox `role="option"`, phím ↑↓ Enter Esc, ô tìm kiếm). Có thể tái sử dụng `src/shared/components/ui/SingleSelect.tsx` nếu đáp ứng.
5. **Step 2 (cấu trúc bài giảng)**: nhãn tiếng Anh "+ Video / + Quiz AI / + Manual Quiz / + Doc" → "Thêm video", "Tạo quiz bằng AI", "Tạo quiz thủ công", "Thêm bài đọc"; nút icon (xóa chương, kéo thả, thu gọn) có `aria-label`. Modal soạn bài học (`CreateLessonEditModal.tsx`) theo chuẩn modal ở §1.6.
6. **Tab Giá bán**: trong lúc tải cấu hình hoa hồng, thẻ hạng đối tác hiện nhãn thô "standard" / "exclusive" và "Phí hạ tầng (—%)" → hiện skeleton cho cả khối; nhãn hiển thị "Đối tác tiêu chuẩn" / "Hợp tác độc quyền". Ô ngày của coupon/flash sale hiển thị định dạng `dd/mm/yyyy`.
7. **Trang danh sách khóa học**: thẻ khóa học giữ nguyên bố cục; bảo đảm skeleton khi tải, empty state khi không có khóa (tài khoản mới), filter tab + tìm kiếm hoạt động trên mobile.

Commit: `refactor(instructor): course editor UX, health card and accessible controls`

---

### Phase 5 — Quiz, học viên, thảo luận, doanh thu, hồ sơ (UI)

**Quiz** (`src/features/instructor/quiz-generator/`)
- Thẻ quiz trong danh sách đều hiện cùng một ảnh `exam.svg` phóng to, bị cắt → khi không có thumbnail, hiện ô vuông `bg-blue-50` với icon lucide `ClipboardCheck` (kích thước cố định), không dùng ảnh fallback.
- Trang chi tiết lỗi quyền: giữ màn "Không có quyền" hiện có (đã ổn) nhưng sau Phase 1.1 quiz của mình phải mở được.

**Học viên** (`student-management/`, `analytic/`)
- Bảng học viên tràn ngang ở 1440px (cột "Điểm & …" bị cắt): đặt bảng trong `overflow-x-auto`, cố định độ rộng cột hợp lý; dưới `md` chuyển sang danh sách thẻ.
- Tiêu đề sentence case; biểu đồ/khối số liệu dùng empty state khi backend trả rỗng (Phase 1.4).

**Thảo luận** (`discussion/`)
- Nút "Gửi trả lời" đang `bg-slate-900` → nút primary xanh chuẩn.
- Dữ liệu seed đang có 3 cặp thảo luận trùng nội dung (không phải lỗi render) — không sửa seeder trong task này, chỉ ghi chú trong báo cáo.

**Doanh thu** (`revenue/`)
- Bỏ các text cứng: "Cực kỳ an toàn (Trung bình: 2.4%)"; nhãn "Link Giới thiệu Giảng viên: 85% Thực nhận" sai nghĩa → "Hợp tác độc quyền: nhận 85%", "Đối tác tiêu chuẩn: nhận 70%" (lấy từ API commission, không hardcode số).
- Thanh tiến độ trong các thẻ KPI ở "Báo cáo bán hàng" đang tô sẵn dù giá trị 0 → tính từ dữ liệu hoặc bỏ.
- Trục Y biểu đồ bị cắt chữ (".200.000 đ") → format rút gọn ("1,2 tr") và đủ `width` cho trục.
- Trạng thái giao dịch tiếng Anh ("PENDING"…) → map tiếng Việt: PENDING "Đang tạm giữ", AVAILABLE "Khả dụng", WITHDRAWING "Đang rút", WITHDRAWN "Đã rút", REFUNDED "Đã hoàn tiền".

**Hồ sơ** (`profile/`)
- Theo Phase 1.2 (trạng thái `none`).
- Nút "Lưu thay đổi" không bị che (sau khi gỡ widget ở Phase 3).

Commit: `refactor(instructor): quiz, students, discussions, revenue and profile UI`

---

### Phase 6 — Tách component lớn và dọn code chết

Tách file > 400 dòng thành component con + hook, **không đổi hành vi** (test hiện có phải pass):
- `create-course/components/Step2CourseStructure.tsx` (1207 dòng): tách `ChapterCard`, `LessonRow`, `GeneralQuizSection` (capability + end-of-course), hook `useCourseStructureActions`.
- `quiz-generator/components/QuizDetailContainer.tsx` (816), `QuizListContainer.tsx` (780).
- `profile/components/TeacherProfileContainer.tsx` (577), `student-management/components/AINotificationModal.tsx` (557), `create-course/components/QuizEditor.tsx` (555), `revenue/components/TransactionHistoryContainer.tsx` (437).

Xóa code chết (grep xác nhận không còn import trước khi xóa):
- `app/(instructor)/instructor/courses/[courseId]/lessons/page.tsx` (chỉ redirect) — **giữ** redirect này vì có thể có link cũ; nhưng xóa `src/features/instructor/lesson-management/components/LessonManagementContainer.tsx` (792 dòng, không trang nào render) và những gì chỉ nó dùng. Giữ `LessonEditModal`/`AIAssistCard` nếu nơi khác còn import.
- `src/features/instructor/pricing/` `PricingContainer` (không mount).
- `src/features/ads-hourly/` (không gắn route).
- Bỏ `// @ts-nocheck` và `any` trong các file bạn đã động tới ở Phase 2–6 nếu làm được mà không đổi hành vi.

Commit: `refactor(instructor): split oversized components and remove dead code`

---

### Phase 7 — Test E2E, tài liệu, báo cáo

1. Playwright `mindnova-ai/e2e/instructor.spec.ts` (theo phong cách `e2e/student-flow.spec.ts`, helper trong `e2e/helpers.ts`):
   - Đăng ký giảng viên qua API `POST /api/register` với `role: "teacher"`, email dạng `e2e.student.teacher<timestamp>@mindnova.test` (để lệnh `php artisan e2e:purge-users` dọn được), đăng nhập qua UI → về `/instructor/courses`, thấy empty state.
   - Wizard: bước 1 bấm "Tiếp theo" khi trống → thấy lỗi inline cho tên/mô tả/ảnh/lĩnh vực; điền đủ → bước 2 thêm chương + bài đọc → bước 3 đặt giá → tạo khóa học; reload giữa chừng không mất dữ liệu/bước/ảnh bìa; bấm tạo 2 lần không sinh 2 khóa.
   - Trang sửa: "Gửi xét duyệt" bị disable khi chưa đủ điều kiện.
   - Mobile (Pixel 7): mở/đóng drawer sidebar; không cuộn ngang ở `/instructor/students`.
   - Không còn chữ "0" sau tên giảng viên; không còn widget "Hỏi Gia sư AI" trong portal.
2. Cập nhật `AGENTS.md`: endpoint wizard mới + idempotency, quy tắc sở hữu quiz, trạng thái xác minh `none`, bỏ FloatingAiChat khỏi instructor.
3. Chạy toàn bộ: Pest instructor, Vitest toàn bộ, `pnpm build`, `pnpm test:e2e`. Sau E2E chạy `$PHP artisan e2e:purge-users`.

Commit: `test(instructor): e2e coverage and docs`

---

## 4. Điều kiện dừng và hỏi lại

Dừng và báo cáo (không tự quyết) nếu:
- Cần thay đổi làm vỡ API mà student/admin đang dùng.
- Migration có thể mất dữ liệu (ngoài backfill mô tả ở trên).
- Một business rule ở §1.5 mâu thuẫn với yêu cầu trong Phase.
- Test có sẵn fail vì nghiệp vụ (không phải fixture) và cách sửa không hiển nhiên.

---

## 5. Báo cáo cuối cùng (bắt buộc)

Trả về bằng tiếng Việt:
1. Danh sách commit (hash + message).
2. Với từng mục đã đánh số ở Phase 0–7: `đã sửa` / `bỏ qua (lý do)` / `cần quyết định`.
3. Kết quả lệnh kiểm tra: số test pass/fail của Pest instructor, Vitest, build, E2E (dán dòng tổng kết).
4. Số query của `GET /api/instructor/students` trước/sau (Phase 1.5).
5. Những gì chưa kiểm chứng được và vì sao.
