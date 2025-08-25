import { Accordion, Badge, Button, Skeleton, Stepper } from "@/components/Dexain";
import { userRole } from "@/constants/role.constant";
import { cn } from "@/lib/utils";
import authStore from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { ArrowLeft, Check, History, ListChecks, Plus, SendHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { projectTaskCodeByName, projectTaskType, requestStatusVariantMap, submissionStatus, taskStatus } from "../../constants/general";
import { useGetProjectTaskHistory, useGetSubmissionById, usePatchConfirmAndSubmitSubmission } from "../../hooks/useNewRegSubmission";
import { usePatchAddProjectTaskVersion } from "../../hooks/useNewRegTask";
import ProjectTaskDetails from "./components/ProjectTaskDetails";
import SubmissionDetailHeader from "./components/SubmissionDetailHeader";

const NewProductRegistrationSubmissionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = authStore();
  const { addStack, closeStack } = useUIStore();

  const { submission, isLoadingSubmission, refetchSubmission } = useGetSubmissionById(location?.state?.submissionId);
  const { confirmAndSubmitSubmission, isLoadingConfirmAndSubmitSubmission } = usePatchConfirmAndSubmitSubmission();
  const { mutateAsync: patchAddProjectTaskVersion, isPending: isPendingPatchAddProjectTaskVersion } = usePatchAddProjectTaskVersion();
  const { projectTaskHistory, refetchProjectTaskHistory } = useGetProjectTaskHistory(location?.state?.submissionId);

  const handleAddProjectTaskVersion = async (task) => {
    addStack({
      title: "Are you sure you want to add a new version?",
      description: "Please review again because this action cannot be undone.",
      variant: "warning",
      confirmText: (
        <div className="flex items-center gap-2">
          Confirm
          <SendHorizontal className="size-4" />
        </div>
      ),
      onCancel: () => closeStack(),
      onConfirm: async () => {
        try {
          await patchAddProjectTaskVersion({
            SUBMISSION_ID: submission?.SUBMISSION_ID,
            TASK_GROUP: task?.TASK_GROUP,
          });
          refetchSubmission();
          closeStack();

          addStack({
            title: `New ${task?.TASK_NAME} Version Added`,
            description: "The new version has been added to the task. Please review the new version.",
            variant: "success",
            isConfirm: true,
          });
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleConfirmAndSubmitSubmission = async () => {
    addStack({
      title: "Submit Product Registration Submission?",
      description: "Please review again because this action cannot be undone. The form will continue to approval step.",
      variant: "warning",
      confirmText: (
        <div className="flex items-center gap-2">
          Confirm & Submit
          <SendHorizontal className="size-4" />
        </div>
      ),
      onCancel: () => closeStack(),
      onConfirm: async () => {
        try {
          await confirmAndSubmitSubmission({ SUBMISSION_ID: submission?.SUBMISSION_ID });
          refetchSubmission();
          closeStack();

          addStack({
            title: "Successfully Submitted Product Registration Form",
            description: "Well done! The form will continue to approval step.",
            variant: "success",
            footer: (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    closeStack();
                    navigate("/product-registration/new");
                  }}
                >
                  Back to My Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => closeStack()}
                >
                  View Task Details
                </Button>
              </div>
            ),
          });
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOpenVersionHistory = () => {
    addStack({
      type: "sheet",
      size: "2xl",
      title: <b className="text-xl font-semibold">Version History</b>,
      description: submission?.SUBMISSION_NO,
      content: (
        <div className="bg-gray-50 p-4 rounded-lg border">
          {Object.entries(projectTaskHistory).map(([key, value], index) => (
            <div key={key} className="pb-2 mb-8">
              <h4 className="text-lg font-semibold mb-4">{key}</h4>
              <Stepper
                orientation="vertical"
                tail={index !== Object.entries(projectTaskHistory).length - 1}
                stepItem={value.map((item) => ({
                  badgeIndex: <Check className="size-4 text-white" />,
                  state: "success",
                  title: item.TASK_NAME,
                  rightContent: <Badge color="success" variant="soft">Submitted</Badge>,
                  description: (
                    <div className="mt-1.5 space-y-2">
                      <ProjectTaskDetails
                        submission={submission}
                        task={{
                          ...item,
                          TASK_CODE: projectTaskCodeByName[item.TASK_NAME],
                          TASK_STATUS: taskStatus.SUBMITTED,
                          DATA: { ...item.DATA, showDetail: item.DATA?.type === "NOT_APPLICABLE" ? "N" : "Y" },
                        }}
                      />
                    </div>
                  ),
                }))}
              />
            </div>
          ))}
        </div>
      )
    });
  };

  const handleRefetch = () => {
    refetchSubmission();
    refetchProjectTaskHistory();
  }

  return (
    <Skeleton className="w-full h-full" isLoading={isLoadingSubmission || isPendingPatchAddProjectTaskVersion || isLoadingConfirmAndSubmitSubmission}>
      <div className="p-4">
        <SubmissionDetailHeader
          submission={submission}
          isMonitoring={submission?.SUBMISSION_STATUS !== submissionStatus.IN_PROGRESS}
          refetch={refetchSubmission}
        />
        <Accordion
          defaultOpen
          title="Project Task"
          icon={<ListChecks className="size-4 text-primary-normal" />}
          rightHeaderItems={[
            <Button
              key="show-version-history"
              className="text-base font-semibold"
              size="sm"
              variant="soft"
              color="tertiary"
              icon={<History className="text-primary-normal size-5" />}
              onClick={handleOpenVersionHistory}
            >
              Show Version History
            </Button>
          ]}
        >
          <div className="p-4">
            {submission?.PROJECT_TASKS?.map(([key, value], index) => (
              <div key={key} className={cn(index !== submission?.PROJECT_TASKS.length - 1 && "pb-2 mb-8")}>
                <div className="flex justify-between items-center gap-2 mb-4">
                  <h4 className="text-lg font-semibold">{key} {value[0].VERSION > 0 && `- V.${value[0].VERSION}`}</h4>
                  {submission?.SUBMISSION_STATUS === submissionStatus.IN_PROGRESS &&
                    submission?.PIC_RA?.USER_ID === user?.USER_ID &&
                    [userRole.RA_OFFICER].includes(user?.ROLE_CODE) &&
                    [projectTaskType.PRA_REG, projectTaskType.REGISTRATION].includes(key) && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={[taskStatus.NEED_ACTION, taskStatus.NOT_STARTED].includes(value[0].TASK_STATUS)}
                        icon={<Plus className="size-4" />}
                        onClick={() => handleAddProjectTaskVersion(value[0])}
                      >
                        New {key} Version
                      </Button>
                    )}
                </div>
                <Stepper
                  orientation="vertical"
                  tail={index !== submission?.PROJECT_TASKS.length - 1}
                  stepItem={value.map((item) => ({
                    badgeIndex: item.SEQUENCE,
                    state: requestStatusVariantMap[item.TASK_STATUS.toLowerCase()],
                    title: item.TASK_NAME,
                    rightContent: (
                      <Badge color={requestStatusVariantMap[item.TASK_STATUS.toLowerCase()]} variant="soft">
                        {item.TASK_STATUS}
                      </Badge>
                    ),
                    description: [
                      taskStatus.SUBMITTED.toLowerCase(),
                      taskStatus.NEED_ACTION.toLowerCase(),
                      taskStatus.NOT_REQUIRED.toLowerCase(),
                    ].includes(item.TASK_STATUS.toLowerCase()) ? (
                      <div className="mt-1.5 space-y-2">
                        <ProjectTaskDetails
                          submission={submission}
                          task={item}
                          onRefresh={handleRefetch}
                        />
                      </div>
                    ) : null,
                  }))}
                />
              </div>
            ))}
            {submission?.SUBMISSION_STATUS === submissionStatus.IN_PROGRESS &&
              submission?.PROJECT_TASKS?.every(([, value]) => value.every(item => [taskStatus.SUBMITTED, taskStatus.NOT_REQUIRED].includes(item.TASK_STATUS))) && (
                <div className="bg-muted border p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold">All project tasks submitted?</h4>
                    <p className="text-base text-muted-foreground">Please review again because this action cannot be undone. Product Registration Submission will continue to the approval step.</p>
                  </div>
                  <Button
                    icon={<SendHorizontal className="size-4" />}
                    iconPosition="right"
                    onClick={handleConfirmAndSubmitSubmission}
                  >
                    Confirm & Submit
                  </Button>
                </div>
              )}
          </div>
        </Accordion>

        <Button
          variant="outline"
          className="w-fit"
          onClick={() => navigate("/product-registration/new", {
            state: {
              tab: "SUBMISSION_MONITORING",
              secondaryTab: location?.state?.secondaryTab,
              submissionId: null,
            }
          })}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>
    </Skeleton>
  );
};

export default NewProductRegistrationSubmissionDetail;