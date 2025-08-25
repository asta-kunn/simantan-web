import { create } from "zustand";

const detailIdKey = "DETAIL_ID_TS";
const detailTypeKey = "DETAIL_TYPE_TS";
const detailActionPlanKey = "DETAIL_ACTION_PLAN_TS";
const detailItemAKey = "DETAIL_ITEM_A_TS";
const detailSubstitutionItemKey = "DETAIL_SUBSTITUTION_ITEM_TS";
const detailTaskKey = "DETAIL_TASK_INACTIVE_MANUFACTURER";

const techServiceStore = create((set) => ({
    detailId: sessionStorage.getItem(detailIdKey) || null,
    setDetailId: (newId) => {
        sessionStorage.setItem(detailIdKey, newId)
        set(() => ({ detailId: newId }));
    },
    detailType: sessionStorage.getItem(detailTypeKey) || null,
    setDetailType: (newType) => {
        sessionStorage.setItem(detailTypeKey, newType)
        set(() => ({ detailType: newType }));
    },
    detailActionPlan: sessionStorage.getItem(detailActionPlanKey) || null,
    setDetailActionPlan: (newType) => {
        sessionStorage.setItem(detailActionPlanKey, newType)
        set(() => ({ detailActionPlan: newType }));
    },
    detailItemA: sessionStorage.getItem(detailItemAKey) || null,
    setDetailItemA: (newType) => {
        sessionStorage.setItem(detailItemAKey, newType)
        set(() => ({ detailItemA: newType }));
    },
    detailSubstitutionItem: sessionStorage.getItem(detailSubstitutionItemKey) || null,
    setDetailSubstitutionItem: (newType) => {
        sessionStorage.setItem(detailSubstitutionItemKey, newType)
        set(() => ({ detailSubstitutionItem: newType }));
    },
    detailTask: sessionStorage.getItem(detailTaskKey) || null,
    setDetailTask: (newType) => {
        sessionStorage.setItem(detailTaskKey, newType)
        set(() => ({ detailTask: newType }));
    },
}));


export default techServiceStore;
