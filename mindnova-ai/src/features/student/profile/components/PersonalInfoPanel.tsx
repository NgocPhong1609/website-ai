"use client";

import { useState, useEffect } from "react";
import { useUpdateProfile } from "../api";
import { Save, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

interface PersonalInfoPanelProps {
  fullName: string;
  email: string;
  bio: string;
  completionPercent?: number;
}

function FormLabel({ htmlFor, children, required = false }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-slate-700 mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-1 font-normal">*</span>}
    </label>
  );
}

function FormInput({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
    />
  );
}

export function PersonalInfoPanel({
  fullName: initialName,
  email: initialEmail,
  bio: initialBio,
}: PersonalInfoPanelProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [bio, setBio] = useState(initialBio);
  const [saved, setSaved] = useState(false);
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    setFullName(initialName);
    setEmail(initialEmail);
    setBio(initialBio);
  }, [initialName, initialEmail, initialBio]);

  const isDirty =
    fullName !== initialName || email !== initialEmail || bio !== initialBio;

  async function handleSave() {
    try {
      await updateProfileMutation.mutateAsync({
        fullName,
        email,
        bio,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error: any) {
      console.error("Failed to save profile", error);
      const err = error?.response?.data;
      const message = err?.message || (err?.errors ? Object.values(err.errors).flat().join(', ') : null) || "Không thể lưu thông tin hồ sơ. Vui lòng thử lại.";
      toast.error(message);
    }
  }

  function handleDiscard() {
    setFullName(initialName);
    setEmail(initialEmail);
    setBio(initialBio);
  }

  return (
    <div className="flex flex-col h-full">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Thông tin Cá nhân</h2>
        <p className="text-sm text-slate-500 mt-1">
          Cập nhật định danh cá nhân và địa chỉ email chính thức sử dụng cho lộ trình rèn luyện AI.
        </p>
      </div>

      {/* Form Grid */}
      <div className="flex flex-col gap-6 flex-1">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel htmlFor="profile-fullname" required>Họ và Tên đầy đủ</FormLabel>
            <FormInput
              id="profile-fullname"
              value={fullName}
              onChange={setFullName}
              placeholder="Nhập họ và tên của bạn..."
            />
          </div>
          <div>
            <FormLabel htmlFor="profile-email" required>Địa chỉ Email liên hệ</FormLabel>
            <FormInput
              id="profile-email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="nhaptentailhoan@email.com"
            />
          </div>
        </div>

        <div>
          <FormLabel htmlFor="profile-bio">Giới thiệu bản thân &amp; Định hướng chuyên sâu</FormLabel>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            placeholder="Hãy chia sẻ ngắn gọn về sở trường, năng lực kỹ thuật và những mục tiêu bạn muốn Trợ lý Nova đồng hành..."
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-900 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isDirty || updateProfileMutation.isPending}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" /> Khôi phục
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          disabled={updateProfileMutation.isPending || !isDirty}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" /> 
          {updateProfileMutation.isPending ? "Đang lưu..." : saved ? "Đã lưu thành công" : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
