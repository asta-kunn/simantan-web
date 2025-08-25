
import { useQuery } from '@tanstack/react-query';
import { EDITABLE_ENUM } from '@/constants/technical-service.constant';
import { findDetailItemBService, findViewItemBService } from '@/services/master-data-management/item-b.service';

const useGetDetailItemB = ({
    detailType,
    detailId,
    setRawmatList,
    setTitle,
    setDataVersion,
    formatChildrenView,
    formatChildren,
    title
}) => {
    const { isPending, data: detailItemB } = useQuery({
        queryKey: ['detailItemB'],
        queryFn: async () => {
            try {
                let response = null;
                const accordionList = new Array();

                if (detailType === EDITABLE_ENUM.NonEditable) {
                    response = await findViewItemBService(detailId)
                    if (!response) return [];
                    console.log(response.data, 'RESPONSE')
                    const keys = Object.keys(response.data?.RAWMAT_LIST).map((key) => key);

                    for (const key of keys) {
                        console.log(response.data['RAWMAT_LIST'][key], 'RESPONSE KEY')
                        const map_object = {
                            id: key,
                            title: key.replace("_", " "),
                            children: formatChildrenView({ data: response.data['RAWMAT_LIST'][key] })
                        }
                        accordionList.push(map_object);
                    }
                    setRawmatList([...accordionList]);
                } else {
                    response = await findDetailItemBService(detailId);
                    if (!response) return [];
                    const keys = Object.keys(response.data?.RAWMAT_LIST).map((key) => key);
                    for (const key of keys) {
                        const map_object = {
                            id: key,
                            title: key.replace("_", " "),
                            children: formatChildren({ data: response.data['RAWMAT_LIST'][key], setRejectedActive: () => { } })
                        }
                        accordionList.push(map_object);
                    }
                    setRawmatList([...accordionList]);
                }


                setTitle({
                    ...title,
                    registration_type: response.data?.REGISTRATION_TYPE ?? '',
                    infotehna_document_number: response.data?.INFORMATION_TECHNICAL_DOCUMENT_NUMBER ?? '',
                    registration_number: response.data?.REGISTRATION_NUMBER ?? '',
                    segment: response.data?.SEGMENT ?? '',
                })

                setDataVersion([
                    { id: 1, title: "Recipe Version", value: `V.${response.data?.ORA_RECIPE_VERSION}` },
                    { id: 2, title: "Formula Version", value: `V.${response.data?.ORA_FORMULA_VERSION}` },
                    { id: 3, title: "AVL Version", value: `V.${response.data?.AVL_FORMULA_VERSION}` },
                    { id: 4, title: "MA Number And Version", value: (`${response.data?.REGISTRATION_NUMBER} - V.${response.data?.NIE_VERSION}`).includes("null") ? "N/A" : (`${response.data?.REGISTRATION_NUMBER} - V.${response.data?.NIE_VERSION}`) },
                    { id: 5, title: "Infotehna Document No.", value: response.data?.INFOTEHNA_DOCUMENT_NUMBER ?? "N/A" },
                ])

                return response.data
            } catch (error) {
                console.log(error, 'error')
            }
        },
    })

    return { isPending, detailItemB }
}

export default useGetDetailItemB
