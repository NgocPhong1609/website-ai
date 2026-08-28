import { Metadata } from "next";
import { TeacherProfileContainer } from "@/src/features/instructor/profile/components/TeacherProfileContainer";

export const metadata: Metadata = {
 title: "Hồ sơ Giáo viên — MindNova AI Instructor",
 description: "Quản lý thông tin cá nhân, chuyên môn và bằng cấp xác minh của giáo viên.",
};

export default function TeacherProfilePage() {
 return <TeacherProfileContainer />;
}
