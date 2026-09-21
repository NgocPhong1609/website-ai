import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/src/shared/lib/axios";
import { Conversation } from "../types";

export const CHAT_CONVERSATIONS_KEY = ["chat", "conversations"] as const;
export const CHAT_UNREAD_COUNT_KEY = ["chat", "unread-count"] as const;

export const useChatConversations = (token: string | null) => {
  return useQuery<Conversation[]>({
    queryKey: CHAT_CONVERSATIONS_KEY,
    queryFn: async () => {
      const res = await axiosClient.get("/api/chat/conversations", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return res.data?.data || [];
    },
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    refetchOnWindowFocus: false,
  });
};

export const useInvalidateChat = () => {
  const queryClient = useQueryClient();
  return {
    invalidateConversations: () => queryClient.invalidateQueries({ queryKey: CHAT_CONVERSATIONS_KEY }),
    invalidateUnreadCount: () => queryClient.invalidateQueries({ queryKey: CHAT_UNREAD_COUNT_KEY }),
    setConversationsData: (updater: (prev: Conversation[] | undefined) => Conversation[] | undefined) =>
      queryClient.setQueryData<Conversation[]>(CHAT_CONVERSATIONS_KEY, updater),
  };
};
