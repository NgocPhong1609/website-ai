import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import { readStoredUser, writeStoredUser } from "../../../../shared/lib/userStorage";
import type { UserProfile } from "../types";

// Lấy thông tin user từ backend và map sang UserProfile
export function useGetProfile() {
 return useQuery({
 queryKey: ["student", "profile"],
 queryFn: async (): Promise<UserProfile> => {
 const { data } = await axiosClient.get("/api/profile");
 const user = data.data;

 const normalizedUser = {
 id: user.id,
 name: user.name || "Học viên",
 email: user.email || "",
 avatar_url: user.avatar_url || user.avatar || null,
 avatar: user.avatar_url || user.avatar || null,
 roles: user.roles || [],
 };

 writeStoredUser(normalizedUser);

 const firstName = user.name ? user.name.split(" ").pop() : "";
 const avatarInitials = firstName ? firstName[0].toUpperCase() : "U";

 return {
 fullName: user.name || "Học viên",
 email: user.email || "",
 bio: user.profile?.bio || "Chưa có thông tin giới thiệu.",
 major: user.profile?.major || "Chuyên ngành chưa cập nhật",
 avatarInitials,
 avatarUrl: user.avatar_url || user.avatar || null,
 completionPercent: user.profile ? 100 : 50,
 };
 },
 staleTime: 0,
 });
}

// Cập nhật profile
export function useUpdateProfile() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async (payload: Partial<UserProfile>) => {
 const requestData = {
 name: payload.fullName,
 email: payload.email,
 bio: payload.bio,
 };

 const { data } = await axiosClient.post("/api/profile/update", requestData);

 const user = data.data ?? {};
 const storedUser = readStoredUser() ?? {};

 const updatedUser = {
 ...storedUser,
 id: user.id ?? storedUser.id,
 name: user.name || storedUser.name,
 email: user.email || storedUser.email,
 avatar_url: user.avatar_url || storedUser.avatar_url || storedUser.avatar || null,
 avatar: user.avatar_url || storedUser.avatar || storedUser.avatar_url || null,
 roles: user.roles || storedUser.roles || [],
 };

 writeStoredUser(updatedUser);

 return data.data;
 },
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
 queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
 },
 });
}

// Upload avatar
export function useUploadAvatar() {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: async (file: File) => {
 const formData = new FormData();
 formData.append("avatar", file);

 const { data } = await axiosClient.post("/api/profile/avatar", formData, {
 headers: {
 "Content-Type": "multipart/form-data",
 },
 });

 return data;
 },
 onSuccess: (data) => {
 const avatarUrl = data?.data?.avatar_url || data?.avatar_url;
 if (avatarUrl) {
 writeStoredUser({ avatar_url: avatarUrl, avatar: avatarUrl });

 queryClient.setQueryData(["student", "profile"], (oldData: UserProfile | undefined) => {
 if (!oldData) return oldData;
 return {
 ...oldData,
 avatarUrl,
 };
 });
 }
 queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
 queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
 },
 });
}
