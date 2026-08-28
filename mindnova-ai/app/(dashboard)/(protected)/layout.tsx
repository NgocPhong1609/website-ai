import { cookies } from "next/headers";
import AuthRequiredScreen from "@/src/shared/components/ui/AuthRequiredScreen";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
 const cookieStore = await cookies();
 const token = cookieStore.get("accessToken")?.value;

 if (!token) {
 // If not authenticated, render the AuthRequiredScreen instead of children
 return <AuthRequiredScreen intendedUrl="" />;
 }

 return <>{children}</>;
}
