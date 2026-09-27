"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { LucideImage, X } from "lucide-react";

interface ThumbnailUploaderProps {
 preview: string | null;
 onChange: (file: File, preview: string) => void;
 onRemove: () => void;
}

export function ThumbnailUploader({
 preview,
 onChange,
 onRemove,
}: ThumbnailUploaderProps) {
 const inputRef = useRef<HTMLInputElement>(null);
 const [isDragging, setIsDragging] = useState(false);

 const handleFile = useCallback(
 (file: File) => {
 if (!file.type.startsWith("image/")) return;
 const url = URL.createObjectURL(file);
 onChange(file, url);
 },
 [onChange]
 );

 const handleDrop = useCallback(
 (e: React.DragEvent) => {
 e.preventDefault();
 setIsDragging(false);
 const file = e.dataTransfer.files[0];
 if (file) handleFile(file);
 },
 [handleFile]
 );

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) handleFile(file);
 };

 if (preview) {
 return (
 <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 group shadow-sm">
 <Image
 src={preview}
 alt="Ảnh bìa khóa học"
 fill
 className="object-cover"
 />
 <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
 <button
 type="button"
 onClick={onRemove}
 aria-label="Xóa ảnh bìa"
 className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
 >
 <X size={15} />
 </button>
 </div>
 </div>
 );
 }

 return (
 <button
 type="button"
 id="thumbnail-upload-area"
 aria-label="Tải ảnh bìa lên"
 onClick={() => inputRef.current?.click()}
 onDragOver={(e) => {
 e.preventDefault();
 setIsDragging(true);
 }}
 onDragLeave={() => setIsDragging(false)}
 onDrop={handleDrop}
 className={twMerge(
 "w-full aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer",
 isDragging
 ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
 : "border-slate-300 bg-slate-50/60 hover:border-blue-600 hover:bg-blue-50/20 shadow-sm"
 )}
 >
 <div
 className={twMerge(
 "w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200",
 isDragging ? "text-blue-500" : "text-slate-400"
 )}
 >
 <LucideImage size={26} />
 </div>

 <div className="flex flex-col items-center gap-0.5 text-center">
 <p className="text-xs font-bold text-blue-500">Tải ảnh bìa (4:3)</p>
 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
 JPG, PNG hoặc WEBP (Tối đa 5MB)
 </p>
 </div>

 <input
 ref={inputRef}
 type="file"
 accept="image/jpeg,image/png,image/webp"
 className="sr-only"
 onChange={handleChange}
 aria-label="Chọn ảnh bìa"
 />
 </button>
 );
}