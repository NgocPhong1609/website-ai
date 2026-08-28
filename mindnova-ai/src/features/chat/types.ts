export interface Conversation {
 id: number;
 course_id: number | null;
 title: string | null;
 type: 'course' | 'group' | 'direct';
 unread_count: number;
 last_message?: ChatMessage | null;
 course?: {
 id: number;
 title: string;
 thumbnail: string | null;
 } | null;
}

export interface ChatMessage {
 id: number;
 tempId?: number; // For optimistic UI
 chat_conversation_id: number;
 sender_id: number;
 content: string | null;
 type: 'text' | 'file' | 'image';
 created_at: string;
 is_recalled?: boolean;
 status?: 'sending' | 'sent' | 'failed';
 sender?: {
 id: number;
 name: string;
 avatar_url: string | null;
 };
 attachments?: ChatAttachment[];
}

export interface ChatAttachment {
 id: number;
 file_url: string;
 file_name: string;
 mime_type: string | null;
 size: number | null;
}
