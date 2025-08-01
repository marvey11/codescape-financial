import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axios";

export const useAxios = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<T>();
  const controllerRef = useRef<AbortController | null>(null);

  const sendRequest = useCallback(async (config: AxiosRequestConfig) => {
    setLoading(true);
    setError("");
    setData(undefined);

    // Abort any previous request
    controllerRef.current?.abort();

    // Create a new controller for the new request
    controllerRef.current = new AbortController();

    try {
      const response = await axiosInstance.request<T>({
        ...config,
        signal: controllerRef.current.signal,
      });
      setData(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        // Don't set an error state for a cancelled request.
        console.info("Request was cancelled");
      } else {
        let errorMessage = "An unexpected error occurred.";
        if (error instanceof AxiosError) {
          const apiError = error.response?.data;
          // Prioritize the most specific error message from the API response.
          if (apiError && typeof apiError.message === "string") {
            errorMessage = apiError.message;
          } else if (typeof apiError === "string") {
            errorMessage = apiError;
          } else {
            errorMessage = error.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The returned function is a "cleanup" function that runs when the component unmounts.
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return { loading, error, data, sendRequest };
};
