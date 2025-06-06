import { useLayoutEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { customAxios } from "@/config/axios";

const usePrivateAxios = () => {
  const { getToken } = useAuth();

  useLayoutEffect(() => {
    const requestIntercept = customAxios.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        console.log("Token:", token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      customAxios.interceptors.request.eject(requestIntercept);
    };
  }, []);

  return customAxios;
};

export default usePrivateAxios;
