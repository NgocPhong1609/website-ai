"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// CKEditor accesses `window` at module level — must be loaded client-only
const CKEditorComponent = dynamic(
  () =>
    Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic"),
    ]).then(([{ CKEditor }, { default: ClassicEditor }]) => {
      // Return a wrapper component
      function CKEditorWrapper({
        value,
        onChange,
        placeholder,
      }: {
        value: string;
        onChange: (v: string) => void;
        placeholder?: string;
      }) {
        return (
          <div className="prose prose-sm max-w-none ckeditor-wrapper">
            <CKEditor
              editor={ClassicEditor}
              data={value}
              onChange={(_event: unknown, editor: { getData: () => string }) => {
                onChange(editor.getData());
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
  onVideoUpload?: (file: File) => Promise<string>;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
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

  return (
    <CKEditorComponent
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

