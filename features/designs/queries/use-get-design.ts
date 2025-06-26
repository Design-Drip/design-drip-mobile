import { customAxios } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetDesign() {
  return useQuery({
    queryKey: ["design"],
    queryFn: async () => {
      const response = await customAxios.get("/design");
      if (response.status !== 200) {
        throw new Error("Failed to fetch design");
      }
      return response.data;
    },
  });
}
