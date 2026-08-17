import type { Metadata } from "next";
import { ProfileContainer } from "@/src/features/student/profile";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Manage your MindNova AI profile, personal information, and account security.",
};

export default function ProfilePage() {
  return <ProfileContainer />;
}
