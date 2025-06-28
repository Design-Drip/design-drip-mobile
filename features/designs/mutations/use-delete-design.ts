import { customAxios } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";

export function useDeleteDesign() {
  const mutation = useMutation({
    mutationFn: async (designId: string) => {
      const response = await customAxios.delete(`/design/${designId}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete design");
      }
      return response.data;
    },
  });

  return mutation;
}
