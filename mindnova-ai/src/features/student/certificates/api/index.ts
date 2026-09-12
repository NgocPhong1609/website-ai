import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/src/shared/lib/axios";

export type IssuedCertificate = {
  id: number;
  course_id: number;
  course_title: string;
  student_name: string;
  certificate_url: string | null;
  issued_at: string | null;
};

export type ClaimableCertificate = {
  course_id: number;
  course_title: string;
  progress_percentage: number;
};

export type CertificatesPayload = {
  issued: IssuedCertificate[];
  claimable: ClaimableCertificate[];
  stats: {
    total_certificates: number;
    completed_courses: number;
  };
};

export function useGetCertificates() {
  return useQuery({
    queryKey: ["student", "certificates"],
    queryFn: async (): Promise<CertificatesPayload> => {
      const { data } = await axiosClient.get("/api/student/certificates");
      return data.data;
    },
  });
}

export function useClaimCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: number) => {
      const { data } = await axiosClient.post("/api/student/certificates/claim", { course_id: courseId });
      return data.data as IssuedCertificate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "certificates"] });
    },
  });
}
