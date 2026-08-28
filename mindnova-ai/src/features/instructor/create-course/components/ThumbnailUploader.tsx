"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { ImageIcon, XIcon } from "./icons";

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
 <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#E8E2D9] group shadow-2xs">
 <Image
 src={preview}
 alt="Ảnh bìa khóa học"
 fill
 className="object-cover"
 />
 <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
 <button
 type="button"
 onClick={onRemove}
 aria-label="Xóa ảnh bìa"
 className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-sm"
 >
 <XIcon size={15} />
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
 "w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer",
 isDragging
 ? "border-[#C0392B] bg-indigo-50/50 scale-[1.01]"
 : "border-gray-300 bg-[#FEFCF9]/60 hover:border-[#C0392B] hover:bg-indigo-50/20 shadow-2xs"
 )}
 >
 <div
 className={twMerge(
 "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
 isDragging ? "text-[#C0392B]" : "text-gray-400"
 )}
 >
 <ImageIcon size={26} />
 </div>

 <div className="flex flex-col items-center gap-0.5 text-center">
 <p className="text-xs font-black text-[#C0392B]">Tải ảnh bìa (4:3)</p>
 <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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