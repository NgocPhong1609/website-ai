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
        <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-end gap-2 max-w-full">
                {/* Optional Toolbar/Attachments area can be placed here if needed in the future */}
                
                <div className="flex-1 bg-gray-100 rounded-2xl flex items-end border border-transparent focus-within:border-gray-300 transition-colors">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn... (Shift + Enter để xuống dòng)"
                        className="w-full bg-transparent resize-none outline-none py-[10px] pl-4 pr-2 text-gray-700 text-sm overflow-y-auto"
                        rows={1}
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                        disabled={isLoading}
                    />
                    
                    <div className="flex items-center pb-1 pr-2">
                        {/* Placeholder for Emoji button */}
                        <button type="button" className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full transition-colors flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        {/* Send Action */}
                        <div className="ml-1 flex-shrink-0">
                            {hasContent ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="px-4 py-1.5 bg-blue-600 text-white font-medium text-sm rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center h-8"
                                >
                                    {isLoading ? '...' : 'Gửi'}
                                </button>
                            ) : (
                                <button
                                    disabled={true} // Disabled when empty as per requirements, or just show icon
                                    className="w-8 h-8 flex items-center justify-center text-blue-600 rounded-full transition-colors opacity-50 cursor-not-allowed"
                                >
                                    {/* Using a thumbs-up or paper-plane icon. Design requirement: "Ở bên phải sử dụng icon gửi hiện tại" (Paper plane) */}
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
