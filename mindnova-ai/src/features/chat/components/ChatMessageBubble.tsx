import React, { useState } from 'react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
    onRecall?: (messageId: number) => void;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, isOwn, onRecall, isFirstInGroup = true, isLastInGroup = true }) => {
    // Relax frontend time check to 24h to avoid clock skew issues; backend strictly enforces 1h
    const isRecallable = isOwn && !message.is_recalled && (Math.abs(Date.now() - new Date(message.created_at).getTime()) < 24 * 60 * 60 * 1000);

    if (message.is_recalled) {
        return (
            <div className={`flex w-full mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                {!isOwn && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex-shrink-0 mt-auto mb-1">
                        {message.sender?.avatar_url ? (
                            <img src={message.sender.avatar_url} alt={message.sender.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                                {message.sender?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                )}
                <div className={`max-w-[70%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    {!isOwn && isFirstInGroup && (
                        <span className="text-xs text-gray-500 mb-1 ml-1">
                            {message.sender?.name}
                        </span>
                    )}
                    <div className="px-4 py-2 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 italic text-sm text-center">
                        Tin nhắn đã bị thu hồi
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`flex w-full ${isLastInGroup ? 'mb-4' : 'mb-1'} ${isOwn ? 'justify-end' : 'justify-start'} relative group`}
        >
            {!isOwn && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-auto mb-1">
                    {isFirstInGroup ? (
                        message.sender?.avatar_url ? (
                            <img src={message.sender.avatar_url} alt={message.sender.name} className="w-full h-full object-cover bg-gray-200" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold bg-gray-200">
                                {message.sender?.name?.charAt(0) || 'U'}
                            </div>
                        )
                    ) : null}
                </div>
            )}
            
            {isOwn && isRecallable && onRecall && (
                <button
                    onClick={() => {
                        if (confirm("Bạn có chắc chắn muốn thu hồi tin nhắn này?")) {
                            onRecall(message.id);
                        }
                    }}
                    className="hidden group-hover:flex mr-2 mt-auto mb-1 text-gray-400 hover:text-red-500 items-center justify-center p-1 rounded-full bg-white shadow-sm border border-gray-100"
                    title="Thu hồi tin nhắn"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                </button>
            )}

            <div className={`max-w-[70%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                {!isOwn && isFirstInGroup && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">
                        {message.sender?.name}
                    </span>
                )}
                
                <div 
                    className={`relative px-4 py-2 rounded-2xl ${
                        isOwn 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                    }`}
                >
                    {message.content && (
                        <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                    )}
                    
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {message.attachments.map(attachment => (
                                attachment.mime_type?.startsWith('image/') ? (
                                    <a key={attachment.id} href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                                        <img 
                                            src={attachment.file_url} 
                                            alt={attachment.file_name} 
                                            className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </a>
                                ) : (
                                    <a 
                                        key={attachment.id} 
                                        href={attachment.file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 p-2 rounded-lg text-sm ${isOwn ? 'bg-blue-700/50 hover:bg-blue-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                        <span className="truncate">{attachment.file_name}</span>
                                    </a>
                                )
                            ))}
                        </div>
                    )}

                    {isLastInGroup && (
                        <div className={`text-[10px] flex items-center justify-end mt-1 gap-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                            <span>
                                {new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            {isOwn && message.status === 'sending' && (
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isOwn && message.status === 'sent' && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {isOwn && message.status === 'failed' && (
                                <span className="text-red-300 font-bold">!</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
