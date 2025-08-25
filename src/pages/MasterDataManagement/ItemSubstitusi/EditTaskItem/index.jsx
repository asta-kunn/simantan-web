import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/Dexain";
import ProductInformationSegment from "./components/product-information-segment";
import ItemReplacementSegment from "./components/item-replacement-segment";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner"
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFormulaList, apiGetDetailSubstitutionItem, apiGetItemSubstitution, apiGetOriginalItem, apiProductNameList, apiSubmitItemSubstitusi, apiUomList, apiUpdateItemSubstitusi, apiVersionList } from "@/services/master-data-management/item-substitusi.service";
import { useState } from "react";
import "./styles.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema/save-form.schema";
import { useNavigate } from "react-router-dom";
import techServiceStore from "@/stores/techServiceStore";
import SkeletonEditTask from "./components/skeleton-edit-task";
import { motion } from "framer-motion";
import NotificationSuccess from "./components/notification-success";
import { useUIStore } from "@/stores/uiStore";
import { statusItemSubstitution } from "../ApprovalTaskItem/Detail/constants/status-item-submission";

const EditItemSubstitusi = () => {
    const [uomList, setUomList] = useState([]);
    const [itemProductList, setItemProductList] = useState([]);
    const [formulaList, setFormulaList] = useState([]);
    const [versionList, setVersionList] = useState([]);
    const [originalItemList, setOriginalItemList] = useState([]);
    const [itemSubstitutionList, setItemSubstitutionList] = useState([]);
    const [status, setStatus] = useState(null);
    const detailSubstitutionItem = techServiceStore(state => state.detailSubstitutionItem);
    const openConfirmationModal = useUIStore(state => state.openConfirmationModal);
    const closeConfirmationModal = useUIStore(state => state.closeConfirmationModal);

    const navigate = useNavigate();

    // Kalau mau update value di luar hookform, gunakan setValue dari useForm
    const {
        control,
        handleSubmit,
        watch,
        getValues,
        setValue, // tambahkan setValue di sini
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            formula: "",
            version: "",
            serializationStatus: "",
            serializationDate: "",
            serializationNotes: "",
            validFrom: "",
            validTo: "",
            isMIChanged: "",
            referenceNo: "",
            notes: "",
            items: [
                {
                    id: "",
                    originalItem: "",
                    originalQty: "",
                    originalUom: "",
                    replacementItem: "",
                    replacementQty: "",
                    replacementUom: ""
                }
            ],
        },
    });


    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const productName = watch('productName');
    const formula = watch('formula');
    const version = watch('version');
    const isMIChanged = watch('isMIChanged');

    // Handler untuk submit (final submit)
    const onSubmit = () => {
        openConfirmationModal({
            title: "Submit Request",
            variant: "default",
            description: "Are you sure you want to submit this request?",
            footer: (
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => closeConfirmationModal()}>Cancel</Button>
                    <Button onClick={() => {
                        closeConfirmationModal()
                        submitItem({
                            ...getValues(),
                            status: statusItemSubstitution.WAITING_FOR_MANAGER,
                            submissionId: dataDetailSubstitutionItem.data['SUBMISSION_ID']
                        })
                    }}>Confirm</Button>
                </div>
            )
        });
    };

    // Handler untuk save as draft
    const onSaveDraft = () => {
        const data = getValues();
        saveDraft({
            ...data,
            status: status,
            submission_id: dataDetailSubstitutionItem.data['SUBMISSION_ID']
        });
    };

    const { isPending: loadingSubmit, mutate: submitItem } = useMutation({
        mutationFn: apiSubmitItemSubstitusi,
        onSuccess: (result) => {
            if (result.success) {
                toast(<NotificationSuccess title="Successfully Submitted" description="Request has been submitted." />, {
                    duration: 2000,
                    action: {
                        label: "Reload",
                        onClick: () => window.location.reload(),
                    },
                });
                setTimeout(() => {
                    navigate("/master-data-management/item-substitution")
                }, 2000)
            }
        }
    });

    const { data: dataDetailSubstitutionItem } = useQuery({
        queryKey: ["detail-substitution-item"],
        queryFn: () => apiGetDetailSubstitutionItem(detailSubstitutionItem),
        enabled: !!detailSubstitutionItem,
        onSuccess: (data) => {
            setValue('productName', `${data.data.PRODUCT_NAME} - ${data.data.PRODUCT_DESCRIPTION} - ${data.data.PRODUCT_ID}`);
            setValue('formula', data.data.FORMULA);
            setValue('version', String(data.data.VERSION));
            setValue('serializationStatus', data.data.IMPLEMENTATION_STATUS);
            setValue('serializationDate', data.data.SERIALIZATION_DUE_DATE ? new Date(data.data.SERIALIZATION_DUE_DATE) : null);
            setValue('serializationNotes', data.data.NOTES_DETAIL_CHANGE || '');
            setValue('validFrom', data.data.VALID_FROM ? new Date(data.data.VALID_FROM) : null);
            setValue('validTo', data.data.VALID_TO ? new Date(data.data.VALID_TO) : null);
            setValue('isMIChanged', data.data.MI_CHANGED);
            setValue('referenceNo', data.data.REFERENCE_NUMBER);
            setValue('notes', data.data.SUBMISSION_NOTES);
            setStatus(data.data.STATUS);

            if (data.data.ITEM_REPLACEMENT.length > 0) setValue('items', []);

            for (const item of data.data.ITEM_REPLACEMENT) {
                append({
                    id: item.ITEM_REPLACEMENT_ID,
                    originalItem: `${item.ORIGINAL_ITEM_NUMBER} - ${item.ORIGINAL_ITEM_DESCRIPTION} - ${item.ORIGINAL_ITEM_ID}`,
                    originalQty: item.ORIGINAL_ITEM_QUANTITY,
                    originalUom: item.ORIGINAL_ITEM_UOM,
                    replacementItem: `${item.REPLACEMENT_ITEM_NUMBER} - ${item.REPLACEMENT_ITEM_DESCRIPTION} - ${item.REPLACEMENT_ITEM_ID}`,
                    replacementQty: item.REPLACEMENT_ITEM_QUANTITY,
                    replacementUom: item.REPLACEMENT_ITEM_UOM,
                })
            }
        }
    });

    const { isPending: loadingDraft, mutate: saveDraft } = useMutation({
        mutationFn: apiUpdateItemSubstitusi,
        onSuccess: (data) => {
            if (data.success) {
                toast(
                    <NotificationSuccess title="Successfully Saved" description="Request has been saved as a draft." />,
                    {
                        duration: 2000,
                        action: {
                            label: "Reload",
                            onClick: () => window.location.reload(),
                        },
                    }
                );
            }
        }
    });

    const { isPending } = useQuery({
        queryKey: ["uom-list"],
        queryFn: apiUomList,
        onSuccess: (data) => {
            setUomList(data.data.map(item => ({ label: item.UOM_CODE, value: item.UOM_CODE })));
        }
    });

    const { isPending: loadingItemProduct } = useQuery({
        queryKey: ["item-product-list"],
        queryFn: apiProductNameList,
        onSuccess: (data) => {
            setItemProductList(data.data.map(item => ({ label: `${item.ITEM_FG_NUMBER} - ${item.ITEM_FG_DESC}`, value: `${item.ITEM_FG_NUMBER} - ${item.ITEM_FG_DESC} - ${item.ITEM_FG_ID}` })));
        }
    });

    useQuery({
        queryKey: ["item-product-list", productName],
        queryFn: () => apiFormulaList(productName),
        enabled: !!productName,
        onSuccess: (data) => {
            setFormulaList(data.data.map(item => ({ label: item.FORMULA_NO, value: item.FORMULA_NO })));
        }
    });

    useQuery({
        queryKey: ["item-product-list", formula],
        queryFn: () => apiVersionList(formula),
        enabled: !!formula,
        onSuccess: (data) => {
            setVersionList(data.data.map(item => ({ label: item.ORA_FORMULA_VERSION, value: String(item.ORA_FORMULA_VERSION) })));
        }
    });

    useQuery({
        queryKey: ["item-product-list", formula, version, productName],
        queryFn: () => apiGetOriginalItem({ formula, version, productName }),
        enabled: !!formula && !!version && !!productName,
        onSuccess: (data) => {
            setOriginalItemList(data.data.map(item => ({ label: `${item.ITEM_RM_NUMBER} - ${item.ITEM_RM_DESC}`, value: `${item.ITEM_RM_NUMBER} - ${item.ITEM_RM_DESC} - ${item.ITEM_RM_ID}` })));
        }
    });

    useQuery({
        queryKey: ["item-substitution-list", formula],
        queryFn: () => apiGetItemSubstitution(formula),
        enabled: !!formula,
        onSuccess: (data) => {
            setItemSubstitutionList(data.data.map(item => ({ label: `${item.PACKAGING_MATERIAL_CODE} - ${item.PACKAGING_MATERIAL_DESCRIPTION}`, value: `${item.PACKAGING_MATERIAL_CODE} - ${item.PACKAGING_MATERIAL_DESCRIPTION} - ${item.PACKAGING_MATERIAL_ID}` })));
        }
    });

    if (isPending || loadingItemProduct || !dataDetailSubstitutionItem || loadingDraft || loadingSubmit) {
       return <SkeletonEditTask />
    }


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <form onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log("VALUES", getValues());
                console.log(errors, 'ERRORS');
            })} className="p-4 space-y-4">
                <p className="text-2l font-bold">Edit Request Substitution Item</p>

                <ProductInformationSegment
                    errors={errors}
                    control={control}
                    fields={fields}
                    productName={productName}
                    formula={formula}
                    itemProductList={itemProductList}
                    formulaList={formulaList}
                    versionList={versionList}
                    isMIChanged={isMIChanged}
                />

                <ItemReplacementSegment
                    fields={fields}
                    control={control}
                    errors={errors}
                    append={append}
                    remove={remove}
                    uomList={uomList}
                    originalItemList={originalItemList}
                    itemSubstitutionList={itemSubstitutionList}
                />
                <div className="flex flex-row gap-4 items-center justify-between">
                    <div className="w-1/2">
                        <Button type="button" variant="outline" icon={<ArrowLeft />} onClick={() => {
                            navigate(-1)
                        }}>
                            Back
                        </Button>
                    </div>
                
                    {status === 'Draft' && (
                        <div className="w-1/2 items-center justify-end gap-4 flex flex-row">
                            <Button type="button" variant="outline" icon={<Save />} onClick={onSaveDraft}>Save As Draft</Button>
                            <Button type="submit" variant="primary">Submit</Button>
                        </div>
                    )}
                </div>
            </form>
        </motion.div>
    );
};

export default EditItemSubstitusi;
