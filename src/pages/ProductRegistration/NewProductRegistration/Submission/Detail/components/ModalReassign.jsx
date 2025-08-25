import { Badge, Button, Info, Select, Separator } from "@/components/Dexain";
import { useGetUsers } from "@/hooks/master-data/useMasterData";
import { positionCodes } from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";
import { useUIStore } from "@/stores/uiStore";
import dayjs from "dayjs";
import { SendHorizontal } from "lucide-react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatchReassignSubmission } from "../../../hooks/useNewRegSubmission";
import ConfirmationReassign from "./ConfirmationReassign";

const ModalReassign = ({ submission, refetch }) => {
  const navigate = useNavigate();
  const { addStack, closeStack, clearStacks } = useUIStore();

  const { users: picRaOpsUsers, isLoading: isLoadingPicRaOpsUsers } =
    useGetUsers({ ROLE_CODE: positionCodes.RA_OPS });
  const { reassignSubmission, isLoadingReassignSubmission } =
    usePatchReassignSubmission();

  const [selectedPIC, setSelectedPIC] = useState(null);

  const handleOpenConfirmation = () => {
    if (!selectedPIC) {
      return;
    }

    const newAssignedPIC = picRaOpsUsers.find(
      (user) => user.USER_ID === selectedPIC
    );

    addStack({
      type: "modal",
      size: "lg",
      title: "Reassign Product Registration Submission?",
      description: "Please review again because this action will reassign the submission to new PIC and cannot be undone",
      variant: "warning",
      isForm: true,
      isLoading: isLoadingReassignSubmission,
      content: (
        <ConfirmationReassign
          submission={submission}
          newAssignedPIC={newAssignedPIC}
        />
      ),
      onCancel: () => {
        closeStack();
      },
      confirmText: (
        <div className="flex items-center gap-2">
          <span>Confirm</span>
          <SendHorizontal className="size-4" />
        </div>
      ),
      onConfirm: async () => {
        await reassignSubmission({
          SUBMISSION_ID: submission.SUBMISSION_ID,
          PIC_RA_USER_ID: selectedPIC,
        });

        clearStacks();
        refetch();

        addStack({
          type: "modal",
          variant: "success",
          title: "Reassign Submission",
          description:
            "Well done! Registration submission Reassigned to New PIC",
          content: (
            <div className="bg-[#e9eef5] p-4 rounded-lg">
              <Info
                label="Assigned PIC"
                value={
                  <Fragment>
                    <div className="font-medium text-md">
                      {newAssignedPIC?.NAME}
                    </div>
                    <div className="text-sm text-primary-normal">
                      {newAssignedPIC?.EMAIL}
                    </div>
                  </Fragment>
                }
              />
            </div>
          ),
          footerSeparator: false,
          footer: (
            <>
              <div className="flex flex-col mb-2">
                <Button
                  onClick={() => {
                    closeStack();
                    navigate("/product-registration/variation-notification");
                  }}
                >
                  Back to My Task
                </Button>
              </div>
              <div className="flex flex-col">
                <Button
                  variant="outline"
                  onClick={() => closeStack()}
                >
                  View Task Detail
                </Button>
              </div>
            </>
          ),
        });
      },
    });
  };

  return (
    <Fragment>
      <div className="flex items-center px-4 py-1 border-b bg-[#e9eef5] gap-2">
        <span className="text-md font-medium">Submission ID</span>
        <Badge color="white" variant="filled" size="sm">
          {submission?.SUBMISSION_NO}
        </Badge>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-500">PCF No</div>
          <div className="font-medium text-md">
            {submission?.PCF_NO}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Finished Product</div>
          <div className="font-medium text-md">
            {submission?.FINISHED_PRODUCT_DESCRIPTION}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">MA Holder</div>
            <div className="font-medium text-md">
              {submission?.NIE_MA_HOLDER}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Manufacturing Site</div>
            <div className="font-medium text-md">
              {submission?.MANUFACTURING_SITE}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Country</div>
            <div className="font-medium text-md">{submission?.COUNTRY}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Assigned PIC</div>
            <div className="font-medium text-md">
              {submission?.PIC_RA?.NAME}
            </div>
            <div className="text-sm text-primary-normal">
              {submission?.PIC_RA?.EMAIL}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Assign Date</div>
            <div className="font-medium text-md">
              {dayjs(submission?.ASSIGNED_AT).format("DD MMM YYYY")}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex w-1/2">
          <Select
            name="PIC_RA_ID"
            label="Reassign To"
            value={selectedPIC}
            onChange={(value) => {
              console.log(value);
              setSelectedPIC(value);
            }}
            options={
              isLoadingPicRaOpsUsers
                ? []
                : picRaOpsUsers
                    ?.filter(
                      (user) => user.USER_ID !== submission?.PIC_RA?.USER_ID
                    )
                    ?.map((user) => ({
                      label: user.NAME,
                      value: user.USER_ID,
                      preview: (
                        <div key={user.ID || user._id || user.EMAIL}>
                          <div className="font-semibold text-md">
                            {user.NAME}
                          </div>
                          <div className="text-sm text-primary-normal">
                            {user.EMAIL}
                          </div>
                        </div>
                      ),
                    })) || []
            }
            searchable
            required
          />
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => closeStack()}>
            Cancel
          </Button>
          <Button onClick={() => handleOpenConfirmation()}>
            Send Assignment <SendHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default ModalReassign;