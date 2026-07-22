"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onVideoUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  onVideoUpload,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[300px] bg-slate-50 border border-slate-200 rounded animate-pulse" />
    );
  }

  // Custom upload adapter implementation would go here if needed.
  // For R2 video uploads, we can either use CKEditor's SimpleUploadAdapter 
  // or a custom plugin that triggers our `onVideoUpload` prop.

  return (
    <div className="prose prose-sm max-w-none ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        config={{
          placeholder: placeholder || "Nhập nội dung...",
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
            "mediaEmbed",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
        }}
      />
    </div>
  );
}
