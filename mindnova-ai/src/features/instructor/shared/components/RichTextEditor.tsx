"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Loader } from "@/src/shared/components/ui/Loader";

const videoMetadataCache = new Map<string, { name: string; size: string }>();

const formatBytes = (bytes: number, decimals = 2) => {
 if (!+bytes) return '0 Bytes';
 const k = 1024;
 const dm = decimals < 0 ? 0 : decimals;
 const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
 const i = Math.floor(Math.log(bytes) / Math.log(k));
 return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const renderVideoPreview = (url: string) => {
 const meta = videoMetadataCache.get(url);
 const displayName = meta?.name || 'Video đã tải lên';
 const displaySize = meta?.size ? ` • ${meta.size}` : '';

 return `
 <div style="width: 100%; max-width: 100%; padding: 24px; border-radius: 12px; background-color: #E8E2D9; border: 2px dashed #D5D5F0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; cursor: default;">
 <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #EEF0FF; color: #C0392B; display: flex; align-items: center; justify-content: center;">
 <></>
 </div>
 <div style="text-align: center;">
 <div style="font-family: sans-serif; font-size: 14px; font-weight: 600; color: #1A1A2E;">${displayName}</div>
 <div style="font-family: sans-serif; font-size: 12px; color: #64647A; margin-top: 4px;">Click để xem/đổi video (Preview tạm thời tắt)${displaySize}</div>
 </div>
 </div>
 `;
};

// CKEditor accesses `window` at module level — must be loaded client-only
const CKEditorComponent = dynamic(
 () =>
 Promise.all([
 import("@ckeditor/ckeditor5-react"),
 import("@ckeditor/ckeditor5-build-classic"),
 ]).then(([{ CKEditor }, { default: ClassicEditor }]) => {
 // MindNova custom video plugin
 function MindNovaVideoPlugin(editor: any) {
 let ButtonView: any = null;

 const getButtonViewClass = () => {
 if (ButtonView) return ButtonView;
 try {
 // Try to create a standard button to extract its constructor
 // This must be done lazily to ensure other plugins have initialized
 const templateBtn = editor.ui.componentFactory.create('undo') || editor.ui.componentFactory.create('bold');
 if (templateBtn) {
 ButtonView = templateBtn.constructor;
 }
 } catch (e) {
 console.warn("Could not extract ButtonView from factory:", e);
 }
 return ButtonView;
 };

 editor.ui.componentFactory.add('mindNovaVideo', (locale: any) => {
 const BtnClass = getButtonViewClass();
 if (!BtnClass) return null;

 const view = new BtnClass(locale);
 view.set({
 label: 'Video',
 icon: '<></>',
 tooltip: true
 });
 view.on('execute', () => {
 window.dispatchEvent(new CustomEvent('mindNovaVideoAction'));
 });
 return view;
 });

 // Balloon toolbar actions
 editor.ui.componentFactory.add('mindNovaVideoReplaceFile', (locale: any) => {
 const BtnClass = getButtonViewClass();
 if (!BtnClass) return null;
 const btn = new BtnClass(locale);
 btn.set({ label: 'Đổi video', withText: true, tooltip: true });
 btn.on('execute', () => {
 window.dispatchEvent(new CustomEvent('mindNovaVideoReplaceFile'));
 });
 return btn;
 });

 editor.ui.componentFactory.add('mindNovaVideoReplaceLink', (locale: any) => {
 const BtnClass = getButtonViewClass();
 if (!BtnClass) return null;
 const btn = new BtnClass(locale);
 btn.set({ label: 'Đổi liên kết', withText: true, tooltip: true });
 btn.on('execute', () => {
 window.dispatchEvent(new CustomEvent('mindNovaVideoReplaceLink'));
 });
 return btn;
 });

 editor.ui.componentFactory.add('mindNovaVideoDelete', (locale: any) => {
 const BtnClass = getButtonViewClass();
 if (!BtnClass) return null;
 const btn = new BtnClass(locale);
 btn.set({ label: 'Xóa video', withText: true, tooltip: true });
 btn.on('execute', () => {
 editor.model.change((writer: any) => {
 const selection = editor.model.document.selection;
 const el = selection.getSelectedElement();
 if (el && el.is('element', 'media')) {
 writer.remove(el);
 }
 });
 });
 return btn;
 });
 }

 // Return a wrapper component
 function CKEditorWrapper({
 value,
 onChange,
 placeholder,
 onEditorReady,
 onImageUpload,
 }: {
 value: string;
 onChange: (v: string) => void;
 placeholder?: string;
 onEditorReady?: (editor: any) => void;
 onImageUpload?: (file: File) => Promise<string>;
 }) {
 function CustomUploadAdapterPlugin(editor: any) {
 if (!onImageUpload) return;
 editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
 return {
 upload: () => {
 return loader.file.then((file: File) => 
 onImageUpload(file).then(url => ({ default: url }))
 );
 },
 abort: () => {}
 };
 };
 }

 return (
 <div className="prose prose-sm max-w-none ckeditor-wrapper relative">
 <CKEditor
 editor={ClassicEditor as any}
 data={value}
 onReady={(editor: any) => {
 if (onEditorReady) onEditorReady(editor);
 }}
 onChange={(_event: unknown, editor: { getData: () => string }) => {
 onChange(editor.getData());
 }}
 config={{
 extraPlugins: [MindNovaVideoPlugin, CustomUploadAdapterPlugin],
 placeholder: placeholder || "Nhập nội dung...",
 heading: {
    options: [
      { model: 'paragraph', title: 'Đoạn văn', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Tiêu đề 1 (H1)', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Tiêu đề 2 (H2)', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Tiêu đề 3 (H3)', class: 'ck-heading_heading3' }
    ]
  },
 toolbar: [
 "heading",
 "|",
 "bold",
 "italic",
 "link",
 "bulletedList",
 "numberedList",
 "|",
 "outdent",
 "indent",
 "|",
 "imageUpload",
 "blockQuote",
 "insertTable",
 "undo",
 "redo",
 ],
 mediaEmbed: {
 previewsInData: true,
 toolbar: ['mindNovaVideoReplaceFile', 'mindNovaVideoReplaceLink', 'mindNovaVideoDelete'],
 extraProviders: [
 {
 name: 'blobVideo',
 url: /^blob:.*?/,
 html: (match: RegExpMatchArray) => renderVideoPreview(match[0])
 },
 {
 name: 'hostedVideo',
 url: /^https?:\/\/.+?\.(mp4|mov|avi|webm)(?:\?.*)?$/i,
 html: (match: RegExpMatchArray) => renderVideoPreview(match[0])
 }
 ]
 }
 }}
 />
 </div>
 );
 }
 return CKEditorWrapper;
 }),
 {
 ssr: false,
 loading: () => (
 <div className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded animate-pulse" />
 ),
 },
);

interface RichTextEditorProps {
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
 onVideoUpload?: (file: File, onProgress: (progress: number) => void) => Promise<{ url: string, media_id: number }>;
 onImageUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({
 value,
 onChange,
 placeholder,
 onVideoUpload,
 onImageUpload,
}: RichTextEditorProps) {
 const [mounted, setMounted] = useState(false);
 const [editorInstance, setEditorInstance] = useState<any>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Custom UI states
 const [showMenu, setShowMenu] = useState(false);
 const [showLinkDialog, setShowLinkDialog] = useState(false);
 const [linkInput, setLinkInput] = useState("");
 // Track if we are replacing an existing video or adding a new one
 const [isReplacing, setIsReplacing] = useState(false);
 const [isUploading, setIsUploading] = useState(false);
 const [uploadProgress, setUploadProgress] = useState(0);

 useEffect(() => {
 setMounted(true);

 const handleAction = () => {
 setIsReplacing(false);
 setShowMenu(true);
 };

 const handleReplaceFile = () => {
 setIsReplacing(true);
 fileInputRef.current?.click();
 };

 const handleReplaceLink = () => {
 setIsReplacing(true);
 setLinkInput("");
 setShowLinkDialog(true);
 };

 window.addEventListener('mindNovaVideoAction', handleAction);
 window.addEventListener('mindNovaVideoReplaceFile', handleReplaceFile);
 window.addEventListener('mindNovaVideoReplaceLink', handleReplaceLink);

 return () => {
 window.removeEventListener('mindNovaVideoAction', handleAction);
 window.removeEventListener('mindNovaVideoReplaceFile', handleReplaceFile);
 window.removeEventListener('mindNovaVideoReplaceLink', handleReplaceLink);
 };
 }, []);

 const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file || !onVideoUpload || !editorInstance) return;

 // Reset input immediately so user can select same file again if needed
 if (fileInputRef.current) fileInputRef.current.value = '';
 setShowMenu(false);

 // Validations
 const validMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/x-matroska'];
 const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB

 if (!validMimeTypes.includes(file.type)) {
 alert("Định dạng video không được hỗ trợ. Vui lòng chọn file MP4, MOV, AVI, WEBM, hoặc MKV.");
 return;
 }

 if (file.size > maxFileSize) {
 alert("Dung lượng video vượt quá giới hạn 2GB.");
 return;
 }

 try {
 setIsUploading(true);
 setUploadProgress(0);

 const result = await onVideoUpload(file, (progress) => {
 setUploadProgress(progress);
 });

 // Insert Cloudflare URL directly
 const videoUrl = result.url;

 videoMetadataCache.set(videoUrl, { name: file.name, size: formatBytes(file.size) });

 if (isReplacing) {
 editorInstance.model.change((writer: any) => {
 const selection = editorInstance.model.document.selection;
 const el = selection.getSelectedElement();
 if (el && el.is('element', 'media')) {
 writer.setAttribute('url', videoUrl, el);
 // Store media_id in a custom attribute if needed, but CKEditor mediaEmbed doesn't easily support extra attributes.
 // We'll extract temp_media_ids from the raw HTML content later.
 }
 });
 } else {
 editorInstance.execute('mediaEmbed', videoUrl);
 }
 } catch (error: any) {
 console.error("Video upload failed:", error);
 const serverError = error.response?.data?.message || error.response?.data?.error || error.message || "Unknown error";
 alert(`Tải video lên thất bại.\nChi tiết: ${serverError}\nVui lòng kiểm tra Console.`);
 } finally {
 setIsUploading(false);
 setIsReplacing(false);
 }
 };

 const handleLinkSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!linkInput.trim() || !editorInstance) return;

 if (isReplacing) {
 editorInstance.model.change((writer: any) => {
 const selection = editorInstance.model.document.selection;
 const el = selection.getSelectedElement();
 if (el && el.is('element', 'media')) {
 writer.setAttribute('url', linkInput.trim(), el);
 }
 });
 } else {
 editorInstance.execute('mediaEmbed', linkInput.trim());
 }

 setShowLinkDialog(false);
 setLinkInput("");
 setIsReplacing(false);
 };

 if (!mounted) {
 return (
 <div className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded animate-pulse" />
 );
 }

 return (
 <div className="flex flex-col gap-2 relative z-0">
 <input
 type="file"
 accept="video/*"
 ref={fileInputRef}
 onChange={handleVideoUpload}
 className="hidden"
 />

 {showMenu && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
 <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 w-56 bg-white rounded-xl shadow-lg border border-[#E8E2D9] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
 <div className="p-1.5 flex flex-col">
 <button
 type="button"
 disabled={isUploading}
 onClick={() => {
 setShowMenu(false);
 fileInputRef.current?.click();
 }}
 className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#2C3039] hover:bg-[#E8E2D9] hover:text-[#C0392B] rounded-lg transition-colors w-full text-left disabled:opacity-50"
 >
 <></>
 Tải video từ máy
 </button>
 <button
 type="button"
 onClick={() => {
 setShowMenu(false);
 setShowLinkDialog(true);
 }}
 className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#2C3039] hover:bg-[#E8E2D9] hover:text-[#C0392B] rounded-lg transition-colors w-full text-left"
 >
 <></>
 Gắn liên kết video
 </button>
 </div>
 </div>
 </>
 )}

 {showLinkDialog && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowLinkDialog(false)} />
 <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
 <div className="px-6 py-5 border-b border-[#F0F0F8]">
 <h2 className="text-lg font-bold text-[#2C3039]">Gắn liên kết Video</h2>
 </div>
 <form onSubmit={handleLinkSubmit}>
 <div className="p-6">
 <label className="block text-sm font-semibold text-[#2C3039] mb-2">Đường dẫn Video (URL)</label>
 <input
 autoFocus
 type="url"
 placeholder="https://..."
 value={linkInput}
 onChange={(e) => setLinkInput(e.target.value)}
 className="w-full px-4 py-2.5 rounded-xl text-sm border border-[#E8E2D9] focus:border-[#E8E2D9] focus:ring-2 focus:ring-[#C0392B]/20 outline-none transition-all"
 required
 />
 </div>
 <div className="px-6 py-4 bg-[#FAFAFE] border-t border-[#F0F0F8] flex justify-end gap-3">
 <button
 type="button"
 onClick={() => setShowLinkDialog(false)}
 className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#8A8478] hover:bg-[#EAEAF4] transition-colors"
 >
 Hủy
 </button>
 <button
 type="submit"
 className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#C0392B] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
 >
 Thêm
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 <CKEditorComponent
 value={value}
 onChange={onChange}
 placeholder={placeholder}
 onEditorReady={setEditorInstance}
 onImageUpload={onImageUpload}
 />

 {isUploading && (
 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg border border-[#E8E2D9]">
 <Loader size="lg" className="mb-4" />
 <div className="text-[#2C3039] font-medium mb-1">Đang tải video lên...</div>
 <div className="text-[#8A8478] text-sm">{Math.round(uploadProgress)}%</div>
 <div className="w-48 h-1.5 bg-[#E8E2D9] rounded-full mt-3 overflow-hidden">
 <div
 className="h-full bg-[#C0392B] transition-all duration-300"
 style={{ width: `${uploadProgress}%` }}
 ></div>
 </div>
 </div>
 )}
 </div>
 );
}