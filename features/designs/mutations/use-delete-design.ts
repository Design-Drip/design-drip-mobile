import usePrivateAxios from "@/hooks/usePrivateAxios";
import { useMutation } from "@tanstack/react-query";

export function useDeleteDesign() {
  const axiosPrivate = usePrivateAxios();
  const mutation = useMutation({
    mutationFn: async (designId: string) => {
      const response = await axiosPrivate.delete(`/design/${designId}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete design");
      }
      return response.data;
    },
  });

  return mutation;
}
