const fs = require('fs');
let code = fs.readFileSync('src/features/instructor/create-course/components/EditCourseContainer.tsx', 'utf-8');

// Replace imports
code = code.replace(
  'import { Step1BasicInfo } from "./Step1BasicInfo";',
  'import { Step1BasicInfo } from "./Step1BasicInfo";\nimport { Step3SettingsPrice } from "./Step3SettingsPrice";\nimport { CourseEditTabs, EditCourseTab } from "./CourseEditTabs";'
);

// Replace state
code = code.replace(
  'const [saveSuccess, setSaveSuccess] = useState(false);',
  'const [activeTab, setActiveTab] = useState("overview");\n  const [saveSuccess, setSaveSuccess] = useState(false);'
);

// Replace return statement
const returnStart = code.indexOf('return (');
const newReturn = `return (
    <div className="min-h-screen bg-[#F4F4F8] flex flex-col font-sans pb-16">
      {/* ── HEADER CẬP NHẬT ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Header - Breadcrumb & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/instructor/courses"
                className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-2xs border border-gray-100"
              >
                <ArrowLeftIcon size={18} />
              </Link>
              <div>
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-0.5">
                  <Link href="/instructor/courses" className="hover:text-gray-800 transition-colors">
                    Khóa học của tôi
                  </Link>
                  <span>/</span>
                  <span className="text-[#4F46E5]">
                    Chỉnh sửa khóa học #{courseId}
                  </span>
                </nav>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-md md:max-w-2xl">
                    {basicInfo.title || "Tên khóa học"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase border bg-emerald-50 text-emerald-600 border-emerald-200">
                    {course.status === "published" ? "PUBLISHED" : "DRAFT MODE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Header - Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                href={\`/courses/\${courseId}\`}
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-2xs"
              >
                <EyeIcon size={14} />
                <span className="hidden sm:inline">Xem trước</span>
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className={twMerge(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all shadow-sm cursor-pointer",
                  saveSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-gray-400"
                )}
              >
                {isUpdating || isUploading ? (
                  <span>⏳ Đang lưu...</span>
                ) : saveSuccess ? (
                  <>
                    <CheckIcon size={14} />
                    <span>Đã lưu thay đổi</span>
                  </>
                ) : (
                  <>
                    <SaveIcon size={14} />
                    <span>Lưu & Cập nhật</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── THÂN TRANG & HIỂN THỊ THEO TAB ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 flex flex-col">
        
        {/* Render Thanh Tabs */}
        <CourseEditTabs activeTab={activeTab as EditCourseTab} onChangeTab={setActiveTab} />

        {/* Nội dung render tương ứng với tab được chọn */}
        <div className="mt-2">
          {activeTab === "overview" && (
            <Step1BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />
          )}

          {activeTab === "curriculum" && (
            <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-2xl border border-gray-200 shadow-2xs">
              Đang phát triển chương trình & AI
            </div>
          )}

          {activeTab === "pricing" && (
            <Step3SettingsPrice 
              courseTitle={basicInfo.title} 
              thumbnailPreview={basicInfo.thumbnailPreview} 
            />
          )}

          {activeTab === "advanced" && (
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-6">
                {/* Đưa phần Cài đặt nâng cao và Danger Zone vào đây */}
                <div>
                  <h2 className="text-base font-black text-gray-900">Cấu hình & Quản lý</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Quản lý trạng thái khóa học và cài đặt nâng cao.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 gap-4">
                  <div>
                    <span className="block text-sm font-bold text-gray-900">Trạng thái khóa học</span>
                    <span className="text-[12px] text-gray-500 mt-1 block">
                      Chuyển khóa học sang trạng thái <strong>{course.status === "published" ? "Bản nháp" : "Công khai"}</strong>. Khóa học dạng nháp sẽ không hiển thị trên cửa hàng.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={isPending}
                    className={twMerge(
                      "px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer disabled:opacity-50",
                      course.status === "published"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    )}
                  >
                    {isUpdatingStatus ? "Đang xử lý..." : course.status === "published" ? "Chuyển về Nháp" : "Công khai khóa học"}
                  </button>
                </div>

                <div className="mt-4 pt-6 border-t border-rose-100 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <TrashIcon size={14} />
                    <span>Khu Vực Nguy Hiểm (Danger Zone)</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="block text-xs font-bold text-rose-950">Xóa vĩnh viễn khóa học này</span>
                      <span className="text-[11px] text-rose-800 block mt-1">
                        Hành động này sẽ xóa vĩnh viễn khóa học cùng toàn bộ module và bài học liên quan. Không thể khôi phục!
                      </span>
                      {course.status === "published" && (
                        <span className="block mt-1 text-[11px] font-black text-rose-900">
                          * Vui lòng chuyển khóa học về trạng thái Nháp để có thể xóa.
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending || course.status === "published"}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 cursor-pointer disabled:bg-rose-300 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "Đang xóa..." : "Xóa bài giảng"}
                    </button>
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}`;

code = code.substring(0, returnStart) + newReturn;

fs.writeFileSync('src/features/instructor/create-course/components/EditCourseContainer.tsx', code);
console.log('Done rewriting.');
