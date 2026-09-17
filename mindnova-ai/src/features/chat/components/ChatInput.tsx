import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
 onSendMessage: (content: string, file?: File | null) => void;
 isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
 const [content, setContent] = useState('');
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 const adjustHeight = () => {
 if (textareaRef.current) {
 // Reset height to auto to correctly measure scrollHeight when deleting text
 textareaRef.current.style.height = 'auto';
 // Max height for ~5 lines (approx 20px per line + padding)
 const maxHeight = 120;
 const scrollHeight = textareaRef.current.scrollHeight;
 textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
 }
 };

 useEffect(() => {
 adjustHeight();
 }, [content]);

 const handleSubmit = () => {
 if (!content.trim()) return;
 onSendMessage(content, null);
 setContent('');
 // Height will be reset by useEffect because content changes to ''
 };

 const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSubmit();
 }
 };

 const hasContent = content.trim().length > 0;

 return (
 <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 relative z-10">
 <div className="flex items-end gap-3 max-w-full">
 {/* Optional Toolbar/Attachments area can be placed here if needed in the future */}
 
 <div className="flex-1 bg-slate-100/80 rounded-3xl flex items-end border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
 {/* Attachment button */}
 <button type="button" className="p-2.5 ml-1 text-slate-400 hover:text-blue-500 rounded-full transition-colors flex-shrink-0">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
 </svg>
 </button>
 <textarea
 ref={textareaRef}
 value={content}
 onChange={(e) => setContent(e.target.value)}
 onKeyDown={handleKeyDown}
 placeholder="Nhập tin nhắn... (Shift + Enter để xuống dòng)"
 className="w-full bg-transparent resize-none outline-none py-3 pl-2 pr-2 text-slate-700 text-[15px] overflow-y-auto"
 rows={1}
 style={{ minHeight: '44px', maxHeight: '120px' }}
 disabled={isLoading}
 />
 
 <div className="flex items-center pb-1.5 pr-1.5">
 {/* Send Action */}
 <div className="flex-shrink-0">
 {hasContent ? (
 <button
 onClick={handleSubmit}
 disabled={isLoading}
 className="w-9 h-9 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/30 transition-all disabled:bg-blue-600/50 flex items-center justify-center cursor-pointer"
 >
 {isLoading ? (
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
 </svg>
 ) : (
 <svg className="w-4 h-4 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
 </svg>
 )}
 </button>
 ) : (
 <button
 disabled={true}
 className="w-9 h-9 flex items-center justify-center bg-slate-200 text-slate-400 rounded-full transition-colors cursor-not-allowed"
 >
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
 </svg>
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};
