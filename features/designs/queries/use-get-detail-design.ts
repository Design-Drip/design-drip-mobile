import usePrivateAxios from "@/hooks/usePrivateAxios";
import { useQuery } from "@tanstack/react-query";

export function useGetDetailDesign(designId: string) {
  const axiosPrivate = usePrivateAxios();
  return useQuery({
    queryKey: ["design", designId],
    queryFn: async () => {
      const response = await axiosPrivate.get(`/design/${designId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch design details");
      }
      return response.data;
    },
    enabled: !!designId,
  });
}
