import { customAxios } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetDetailDesign(designId: string) {
  return useQuery({
    queryKey: ["design", designId],
    queryFn: async () => {
      const response = await customAxios.get(`/design/${designId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch design details");
      }
      return response.data;
    },
    enabled: !!designId,
  });
}
