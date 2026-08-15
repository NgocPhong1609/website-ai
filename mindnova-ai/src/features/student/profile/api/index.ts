import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { UserProfile } from "../types";

// Lấy thông tin user từ backend và map sang UserProfile
export function useGetProfile() {
  return useQuery({
    queryKey: ["student", "profile"],
    queryFn: async (): Promise<UserProfile> => {
      const { data } = await axiosClient.get("/api/profile");
      const user = data.data;
      
      const firstName = user.name ? user.name.split(" ").pop() : "";
      const avatarInitials = firstName ? firstName[0].toUpperCase() : "U";

      return {
        fullName: user.name || "Học viên",
        email: user.email || "",
        bio: user.profile?.bio || "Chưa có thông tin giới thiệu.",
        major: user.profile?.major || "Chuyên ngành chưa cập nhật",
        avatarInitials,
        completionPercent: user.profile ? 100 : 50,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Cập nhật profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: Partial<UserProfile>) => {
      // Map ngược lại từ UserProfile sang cấu trúc backend yêu cầu
      const requestData = {
        name: payload.fullName,
        bio: payload.bio,
      };
      const { data } = await axiosClient.post("/api/profile/update", requestData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
    },
  });
}
