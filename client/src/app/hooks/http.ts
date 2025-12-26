import { useCallback, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

axios.defaults.baseURL = "http://localhost:5256/api";

const errorText = "An error occured while processing the http request";

type HttpError = AxiosError | typeof errorText;

const useHttp = <T>() => {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<HttpError>();
  const [isLoading, setIsLoading] = useState(true);

  const sendRequest = useCallback(async (axiosParams: AxiosRequestConfig) => {
    try {
      const result = await axios.request(axiosParams);
      setResponse(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error);
      } else {
        setError(errorText);
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { response, error, isLoading, sendRequest } as const;
};

export default useHttp;
