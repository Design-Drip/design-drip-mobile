import usePrivateAxios from "@/hooks/usePrivateAxios";
import { useQuery } from "@tanstack/react-query";

export function useGetDesign() {
  const axiosPrivate = usePrivateAxios();
  return useQuery({
    queryKey: ["design"],
    queryFn: async () => {
      const response = await axiosPrivate.get("/design");
      if (response.status !== 200) {
        throw new Error("Failed to fetch design");
      }
      return response.data;
    },
  });
}
