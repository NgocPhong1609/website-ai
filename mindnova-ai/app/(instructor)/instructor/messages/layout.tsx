import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Tin nhắn",
 description: "Trao đổi tin nhắn với học viên.",
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
 return children;
}
