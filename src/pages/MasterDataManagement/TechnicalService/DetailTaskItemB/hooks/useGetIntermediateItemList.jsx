import { useQuery } from "@tanstack/react-query";
import { findItemIntermediateListService } from "@/services/master-data-management/item-b.service";
import { useState } from "react";
import { formatChildren } from "../helpers/generate-helper";

const useGetIntermediateItemList = (fgNumber) => {
  const [intermediateItemList, setIntermediateItemList] = useState([]);
  const [intermediateDataHeader, setIntermediateDataHeader] = useState({});
  const { data: detailIntermediateItem, isLoading, error, refetch } = useQuery({
    queryKey: ['intermediateItemList', fgNumber],
    queryFn: async () => {
      try {
        const accordionList = [];
        const response = await findItemIntermediateListService(fgNumber);

        if (!response) return null;

        const keys = Object.keys(response.data?.RAWMAT_LIST || {});

        for (const key of keys) {
          const map_object = {
            id: key,
            title: key.replace("_", " "),
            children: formatChildren(response.data['RAWMAT_LIST'][key])
          }
          accordionList.push(map_object);
        }

        setIntermediateItemList([...accordionList]);
        setIntermediateDataHeader({
          ITEM_NUMBER: response.data['ITEM_FG_NUMBER'],
          ITEM_DESCRIPTION: response.data['ITEM_FG_DESC']
        });
        return response.data;
      } catch (error) {
        console.log(error, 'error');
        throw error;
      }
    },
    enabled: !!fgNumber
  });

  return {
    detailIntermediateItem,
    isLoading,
    error,
    refetch,
    intermediateItemList,
    setIntermediateItemList,
    intermediateDataHeader
  };
};

export default useGetIntermediateItemList;
