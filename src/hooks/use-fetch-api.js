import masterDataManagementInstance from "@/api/instances/master-data-management.instance";
import { useEffect, useState } from "react";

export const useFetchAPI = ({
  url,
  param = null,
  pending = false,
  callback,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      if (param) {
        const result = await masterDataManagementInstance.get(url, {
          params: param,
        });
        setData(result.data.data);
      } else {
        const result = await masterDataManagementInstance.get(url);
        setData(result.data.data);
      }
    } catch (error) {
      setData({ data: null });
      setIsError(error.message);
    }finally{
      setLoading(false);
    }
  };

  const refetch = async () => {
    if (!loading && pending === false) {
      new Promise((resolve) => resolve(loadData()));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await masterDataManagementInstance.get(url, {
          params: param,
        });
        const final_data = result.data;
        setData(final_data.data);
      } catch (error) {
        setData({ data: null });
        setLoading(false);
        setIsError(error.message);
      }finally{
        setLoading(false);
      }
    };

    if (pending === false) {
      fetchData();
    }
  }, [url, pending]);

  useEffect(() => {
    if (callback && data.length > 0) callback(data);
  }, [data]);

  return { data, refetch: () => refetch(), loading, isError };
};
