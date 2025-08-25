import { useMutation } from "@tanstack/react-query";
import { approveInactiveManufacture, rejectInactiveManufacture } from "../services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { submitOracleApi } from "../services/index";

const useMutationApproval = () => {
    const navigate = useNavigate();

    const { mutate: approveInactive } = useMutation({
        mutationFn: (payload) => approveInactiveManufacture(payload),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success("Successfully approved manufacturer inactivation");
                let timeout = setTimeout(() => {
                    navigate(-1);
                }, 2000);
                return () => clearTimeout(timeout);
            } else {
                toast.error(response?.message || "Failed to approve manufacturer inactivation");
            }
        },
        onError: (error) => {
            toast.error("An error occurred while approving manufacturer inactivation");
            console.error(error);
        }
    });

    const { mutate: rejectInactive } = useMutation({
        mutationFn: (payload) => rejectInactiveManufacture(payload),
        onSuccess: (response) => {
            if (response?.success) {
                toast.success("Successfully rejected manufacturer inactivation");
                let timeout = setTimeout(() => {
                    navigate(-1);
                }, 2000);
                return () => clearTimeout(timeout);
            } else {
                toast.error(response?.message || "Failed to reject manufacturer inactivation");
            }
        },
        onError: (error) => {
            toast.error("An error occurred while rejecting manufacturer inactivation");
            console.error(error);
        }
    });

    const { mutate: submitOracle } = useMutation({
        mutationFn: submitOracleApi,
        onError: (error) => {
            toast.error("An error occurred while rejecting manufacturer inactivation");
            console.error(error);
        }
    });

    return {
        approveInactive,
        rejectInactive,
        submitOracle
    }
}

export default useMutationApproval
