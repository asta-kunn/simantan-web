import { useState, useEffect, useCallback, useMemo } from "react";

export function useMutation(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // useEffect(() => {
  //   if (loading) {
  //     console.log("Loading...");
  //   }
  //   console.log("loading : ", loading);
  //   console.log("error : ", error);
  //   console.log("response : ", response);
  // }, [loading, error, response]);

  const mutate = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await apiFn(data);
      setResponse(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200)
    }
  }, [apiFn]);

  const result = useMemo(() => ({
    mutate,
    loading,
    error,
    response
  }), [mutate, loading, error, response]);

  return result;
}
