import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/Dexain";
import ProductInformationSegment from "./components/product-information-segment";
import ItemReplacementSegment from "./components/item-replacement-segment";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner"
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFormulaList, apiGetDraftItemSubstitusi, apiGetItemSubstitution, apiGetOriginalItem, apiProductNameList, apiSubmitItemSubstitusi, apiUomList, apiVersionList } from "@/services/master-data-management/item-substitusi.service";
import { useState } from "react";
import "./styles.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema/save-form.schema";
import { useNavigate } from "react-router-dom";
import SkeletonCreateTask from "./components/skeleton-create-task";
import NotificationSuccess from "../EditTaskItem/components/notification-success";
import { motion } from "framer-motion";
import { useUIStore } from "@/stores/uiStore";
import { statusItemSubstitution } from "../ApprovalTaskItem/Detail/constants/status-item-submission";


const CreateItemSubstitusi = () => {
    const [uomList, setUomList] = useState([]);
    const [itemProductList, setItemProductList] = useState([]);
    const [formulaList, setFormulaList] = useState([]);
    const [versionList, setVersionList] = useState([]);
    const [originalItemList, setOriginalItemList] = useState([]);
    const [itemSubstitutionList, setItemSubstitutionList] = useState([]);

    const navigate = useNavigate();
    const openConfirmationModal = useUIStore(state => state.openConfirmationModal);
    const closeConfirmationModal = useUIStore(state => state.closeConfirmationModal);

    const {
        control,
        handleSubmit,
        watch,
        getValues,
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
            status: 'Draft',
        });
    };

    const { isPending: loadingDraft, mutate: saveDraft } = useMutation({
        mutationFn: apiGetDraftItemSubstitusi,
        onSuccess: (result) => {
            if (result.success) {
                toast(<NotificationSuccess title="Successfully Saved" description="Request has been saved as a draft." />, {
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
            setVersionList(data.data.map(item => ({ label: item.ORA_FORMULA_VERSION.toString(), value: item.ORA_FORMULA_VERSION.toString() })));
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

    if (isPending || loadingItemProduct || loadingDraft || loadingSubmit) {
        return <SkeletonCreateTask />
    }

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <p className="text-2l font-bold">
                New Request Substitution Item
            </p>

            <div>
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
            </div>

            <div>
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
            </div>

            <div
                className="flex flex-row gap-4 items-center justify-between"
            >
                <div className="w-1/2">
                    <Button type="button" variant="outline" icon={<ArrowLeft />} onClick={() => {
                        navigate(-1)
                    }}>
                        Back
                    </Button>
                </div>
                <div className="w-1/2 items-center justify-end gap-4 flex flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        icon={<Save />}
                        onClick={onSaveDraft}
                    >
                        Save As Draft
                    </Button>
                    <Button type="submit" variant="primary">
                        Submit
                    </Button>
                </div>
            </div>
        </motion.form>
    );
};

export default CreateItemSubstitusi;
