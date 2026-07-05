import { Metadata } from "next";
import { CertificatesContent } from "@/src/features/student/certificates/components/CertificatesContent";

export const metadata: Metadata = {
  title: "My Certificates & Achievements",
  description: "View and share your verified AI-powered certifications.",
};

export default function CertificatesPage() {
  return <CertificatesContent />;
}
