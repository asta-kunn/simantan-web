import { useQuery } from "@tanstack/react-query";
import { findDetailItemBService } from "@/services/master-data-management/item-b.service";
import { useState } from "react";
import { formatChildren } from "../helpers/generate-helper";

const useGetItemDetail = (detailId) => {
  const [title, setTitle] = useState({
    registration_type: '',
    infotehna_document_number: '',
    registration_number: '',
    segment: ''
  });
  const [dataVersion, setDataVersion] = useState([
    { id: 1, title: "Recipe Version", value: "" },
    { id: 2, title: "Formula Version", value: "" },
    { id: 3, title: "AVL Version", value: "" },
    { id: 4, title: "MA Number And Version", value: "" },
    { id: 5, title: "Infotechna Document No.", value: "" },
  ]);
  const [rawmatList, setRawmatList] = useState([]);

  const { data: detailItemB, isLoading, error, refetch } = useQuery({
    queryKey: ['detailItemB', detailId],
    queryFn: async () => {
      try {
        const accordionList = [];
        const response = await findDetailItemBService(detailId);

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

        setTitle({
          registration_type: response.data?.REGISTRATION_TYPE ?? '',
          infotehna_document_number: response.data?.INFORMATION_TECHNICAL_DOCUMENT_NUMBER ?? '',
          registration_number: response.data?.REGISTRATION_NUMBER ?? '',
          segment: response.data?.SEGMENT ?? ''
        });

        setDataVersion([
          { id: 1, title: "Recipe Version", value: `V.${response.data?.ORA_RECIPE_VERSION}` },
          { id: 2, title: "Formula Version", value: `V.${response.data?.ORA_FORMULA_VERSION}` },
          { id: 3, title: "AVL Version", value: `V.${response.data?.AVL_FORMULA_VERSION}` },
          { id: 4, title: "MA Number And Version", value: (`${response.data?.REGISTRATION_NUMBER} - V.${response.data?.NIE_VERSION}`).includes("null") ? "N/A" : (`${response.data?.REGISTRATION_NUMBER} - V.${response.data?.NIE_VERSION}`) },
          { id: 5, title: "Infotechna Document No.", value: response.data?.INFOTEHNA_DOCUMENT_NUMBER ?? "N/A" },
        ]);

        setRawmatList([...accordionList]);
        return response.data;
      } catch (error) {
        console.log(error, 'error');
        throw error;
      }
    },
    enabled: !!detailId
  });

  return {
    detailItemB,
    isLoading,
    error,
    title,
    dataVersion,
    rawmatList,
    setRawmatList,
    setTitle,
    setDataVersion,
    refetch
  };
};

export default useGetItemDetail;
