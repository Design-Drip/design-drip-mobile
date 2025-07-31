import usePrivateAxios from "@/hooks/usePrivateAxios";
import { skipToken, useQuery } from "@tanstack/react-query";

export function useGetDetailDesign(designId?: string) {
  const axiosPrivate = usePrivateAxios();
  return useQuery({
    queryKey: ["design", designId],
    queryFn: designId
      ? async () => {
          const response = await axiosPrivate.get(`/design/${designId}`);
          if (response.status !== 200) {
            throw new Error("Failed to fetch design details");
          }
          return response.data;
        }
      : skipToken,
    enabled: !!designId,
  });
}
