import { fetchHistoryManufacture } from "@/services/master-data-management/qa.service";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const useGetHistoryManufacture = () => {
  const [historyChanges, setHistoryChanges] = useState([]);
  const { mutate: mutateHistory } = useMutation({
    mutationFn: fetchHistoryManufacture,
    onSuccess: (data) => {
      setHistoryChanges([...data.data]);
    },
  });

  return{
    mutateHistory,
    historyChanges
  }
};

export default useGetHistoryManufacture;
