import { DiscussionReplyContainer } from "@/src/features/instructor/discussion";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Thảo luận & Hỏi đáp",
 description: "Giải đáp thắc mắc và hỗ trợ học viên.",
};

export default function DiscussionsPage() {
 return <DiscussionReplyContainer />;
}
