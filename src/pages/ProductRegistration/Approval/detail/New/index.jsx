// React imports
import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Third-party libraries
import {
  ArrowLeft,
  Check,
  FileText,
  ListChecks,
  Mail,
  Pencil,
  SendHorizontal,
  X
} from "lucide-react";

// Components
import {
  Accordion,
  Badge,
  Button,
  Separator,
  Skeleton,
  Stepper,
  Tabs,
} from "@/components/Dexain";

// Custom components
import LetterCard from "@/pages/ProductRegistration/NewProductRegistration/Submission/Detail/components/LetterCard";
import SubmissionDetailHeader from "@/pages/ProductRegistration/NewProductRegistration/Submission/Detail/components/SubmissionDetailHeader";

// Stores
import authStore from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";

// Constants and schemas
import { userRole } from "@/constants/role.constant";
import {
  positionCodes,
  projectTaskCode,
  submissionStatus
} from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";

/** Modal Component */
import ModalEditEmailNotification from "./components/modals/ModalEditEmailNotification";
import ModalEditMarketingAuthorization from "./components/modals/ModalEditMarketingAuthorization";

/** Confirmation Component */
import ConfirmationApproveSubmission from "./components/confirmations/ConfirmationApproveSubmission";
import ConfirmationRejectSubmission from "./components/confirmations/ConfirmationRejectSubmission";

/** Hooks */
import { useFile } from "@/hooks/file/useFile";
import { useApprovalDetail, usePatchSubmissionReview } from "@/pages/ProductRegistration/Approval/detail/New/hooks/useApproval";
import { requestStatusVariantMap, taskStatus } from "@/pages/ProductRegistration/NewProductRegistration/constants/general";
import ProjectTaskDetails from "@/pages/ProductRegistration/NewProductRegistration/Submission/Detail/components/ProjectTaskDetails";

const NewApprovalDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = authStore();
  const { addStack, closeStack, clearStacks } = useUIStore();

  /** State */
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false);

  /** Use Query */
  const { submission, isLoading, refetch } = useApprovalDetail(
    location.state.submissionId
  );
  const { previewFile } = useFile();

  /** Start Use Mutation */
  const {
    mutateAsync: patchSubmissionReviewAsync,
    isPending: isPendingPatchSubmissionReview,
  } = usePatchSubmissionReview();
  /** End of Use Mutation */

  useEffect(() => {
    if (
      submission?.SUBMISSION_STATUS === submissionStatus.WAITING_FOR_APPROVAL &&
      [positionCodes.RA_MGR_INA, positionCodes.RA_MGR_OVERSEAS].includes(
        user?.ROLE_CODE
      ) &&
      submission?.RA_MANAGER_POSITION_CODE === user?.POSITION_CODE
    ) {
      setIsAuthorizedUser(true);
    } else if (
      submission?.SUBMISSION_STATUS === submissionStatus.WAITING_FOR_REVIEW ||
      (submission?.SUBMISSION_STATUS ===
        submissionStatus.REJECTED_BY_RA_MANAGER &&
        [positionCodes.RA_SS].includes(user?.ROLE_CODE))
    ) {
      setIsAuthorizedUser(true);
    } else {
      setIsAuthorizedUser(false);
    }
  }, [submission?.SUBMISSION_STATUS, user?.ROLE_CODE, user?.POSITION_CODE, submission?.RA_MANAGER_POSITION_CODE]);

  const actions = {
    openEditMarketingAuthorization: () =>
      addStack({
        size: "3xl",
        title: "Edit Marketing Authorization (NIE) Submission Result",
        content: (
          <ModalEditMarketingAuthorization
            submission={submission}
            refetch={refetch}
            onOpenFile={previewFile}
          />
        ),
      }),
    openEditEmailNotification: () =>
      addStack({
        size: "5xl",
        title: "Edit Email Notification",
        content: (
          <ModalEditEmailNotification
            SUBMISSION_ID={submission?.SUBMISSION_ID}
            EMAIL_NOTIFICATION={submission?.EMAIL_NOTIFICATION}
            refetch={refetch}
          />
        ),
      }),
    submitMarketingAuthorizationNieEditReview: () =>
      addStack({
        title: "Submit Review Product Registration Submission?",
        description:
          "Please review again because this action cannot be undone.",
        variant: "warning",
        confirmText: (
          <div className="flex items-center gap-2">
            Confirm & Submit
            <SendHorizontal className="size-4" />
          </div>
        ),
        isLoading: isPendingPatchSubmissionReview,
        onCancel: () => closeStack(),
        onConfirm: async () => {
          await patchSubmissionReviewAsync(submission?.SUBMISSION_ID);
          await refetch();
          addStack({
            title: "Successfully Submitted Product Registration Submission",
            description:
              "Well done! The form will continue to the approval step.",
            variant: "success",
            footerSeparator: false,
            footer: (
              <>
                <div className="flex flex-col my-2">
                  <Button
                    onClick={() => {
                      navigate("/product-registration/approval", {
                        state: { mainTab: location?.state?.mainTab, secondaryTab: location?.state?.secondaryTab },
                      });
                      clearStacks();
                    }}
                  >
                    Back to My Task
                  </Button>
                </div>
                <div className="flex flex-col">
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearStacks();
                      refetch();
                    }}
                  >
                    View Task Detail
                  </Button>
                </div>
              </>
            ),
          });
        },
      }),
    approveSubmission: () =>
      addStack({
        title: "Approve Marketing Authorization (NIE) Document?",
        description:
          "Please review again because this action cannot be undone.",
        variant: "warning",
        content: (
          <ConfirmationApproveSubmission
            submissionId={submission?.SUBMISSION_ID}
            refetch={refetch}
          />
        ),
      }),
    rejectSubmission: () =>
      addStack({
        title: "Reject Marketing Authorization (NIE) Document?",
        description:
          "Please review again because this action cannot be undone.",
        variant: "warning",
        content: (
          <ConfirmationRejectSubmission
            submissionId={submission?.SUBMISSION_ID}
            refetch={refetch}
          />
        ),
      }),
  };

  const validateIsMonitoring = (arg) => {
    return (
      arg?.SUBMISSION_STATUS !== submissionStatus.WAITING_FOR_REVIEW &&
      [positionCodes.RA_MGR_INA, positionCodes.RA_MGR_OVERSEAS].includes(
        user?.ROLE_CODE
      )
    );
  };

  const isReview =
    submission?.SUBMISSION_STATUS === submissionStatus.WAITING_FOR_REVIEW ||
    (submission?.SUBMISSION_STATUS ===
      submissionStatus.REJECTED_BY_RA_MANAGER &&
      userRole.RA_SUPPORT_SYSTEM === user?.ROLE_CODE);

  const isAvailableEmailNotification =
    submission?.EMAIL_NOTIFICATION?.EMAIL_TO?.length > 0 &&
    submission?.EMAIL_NOTIFICATION?.EMAIL_SUBJECT?.length > 0 &&
    submission?.EMAIL_NOTIFICATION?.EMAIL_BODY?.length > 0;

  return (
    <>
      {submission?.length === 0 || isLoading ? (
        <div className="p-4">
          <Skeleton className="w-full h-[40vh]" />
          <Skeleton className="w-full h-[50vh] mt-2" />
        </div>
      ) : (
        <div className="p-4">
          <SubmissionDetailHeader
            submission={submission}
            isMonitoring={validateIsMonitoring(submission)}
            onRefresh={refetch}
          />
          <Tabs
            style="sticky"
            tabs={[
              {
                value: "pi1",
                label: "Document Approval",
                content: (
                  <Accordion
                    defaultOpen
                    title="Receive NIE"
                    icon={<FileText className="size-4 text-primary-normal" />}
                    rightHeaderItems={[
                      isReview && submission?.ONGOING_MARKETING_AUTHORIZATION
                        ? [
                          <Button
                            key="edit"
                            icon={<Pencil className="size-4" />}
                            variant="outline"
                            size="sm"
                            disabled={!submission || !isAuthorizedUser}
                            onClick={actions?.openEditMarketingAuthorization}
                          >
                            Edit
                          </Button>,
                        ]
                        : [],
                    ]}
                    className="mb-4"
                  >
                    {submission?.ONGOING_MARKETING_AUTHORIZATION ? (
                      <LetterCard
                        taskCode={projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT}
                        data={submission?.ONGOING_MARKETING_AUTHORIZATION}
                        actions={{ onOpenFile: previewFile }}
                        className="mx-auto mb-5"
                      />
                    ) : (
                      <div className="py-12 bg-gray-100 rounded-lg border max-w-3xl mx-auto mb-5">
                        <p className="text-center text-muted-foreground">
                          Marketing Authorization (NIE) has been rejected
                        </p>
                      </div>
                    )}
                  </Accordion>
                ),
              },
              {
                value: "email-notification",
                label: "Email Notification",
                content: (
                  <>
                    <Accordion
                      defaultOpen
                      title="Email Notification"
                      icon={<FileText className="size-4 text-primary-normal" />}
                      rightHeaderItems={[
                        isReview && isAvailableEmailNotification ? (
                          <Button
                            key="edit"
                            icon={<Pencil className="size-4" />}
                            variant="outline"
                            size="sm"
                            disabled={!submission || !isAuthorizedUser}
                            onClick={actions?.openEditEmailNotification}
                          >
                            Edit
                          </Button>
                        ) : null,
                      ]}
                      className="mb-4"
                    >
                      {isAvailableEmailNotification ? (
                        <div className="px-4">
                          <p className="text-xl font-bold mb-2">
                            {submission?.EMAIL_NOTIFICATION?.EMAIL_SUBJECT}
                          </p>
                          <p className="text-sm font-medium">
                            To :{" "}
                            {submission?.EMAIL_NOTIFICATION?.EMAIL_TO?.length >
                              0
                              ? submission.EMAIL_NOTIFICATION.EMAIL_TO.map(
                                (item) => item.VALUES || ""
                              )
                                .join(",")
                                .split(",")
                                .filter((email) => email.trim())
                                .map((email) => (
                                  <Badge
                                    key={email.trim()}
                                    size="sm"
                                    variant="soft"
                                    className="mr-1 mb-1"
                                  >
                                    {email.trim()}
                                  </Badge>
                                ))
                              : null}
                          </p>
                          <Separator className="my-2" />
                          <div
                            className="text-sm font-medium py-2"
                            dangerouslySetInnerHTML={{
                              __html:
                                submission?.EMAIL_NOTIFICATION?.EMAIL_BODY?.replace(
                                  /\n/g,
                                  "<br />"
                                ),
                            }}
                          />
                        </div>
                      ) : (
                        <div className="px-4 bg-gray-100 rounded-lg">
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="mb-1">
                              <Mail className="size-10 text-primary-normal" />
                            </div>

                            {isReview ? (
                              <div className="flex flex-col items-center justify-center">
                                <p className="text-md text-center text-neutral-gray">
                                  Please create the Email Notification
                                </p>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="mt-2"
                                  onClick={actions?.openEditEmailNotification}
                                >
                                  Create Email Notification
                                </Button>
                              </div>
                            ) : (
                              <p className="text-md text-center text-neutral-gray">
                                No Draft Email Notification
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </Accordion>
                  </>
                ),
              },
              {
                value: "pi2",
                label: "Product Registration Detail",
                content: (
                  <Fragment>
                    <Accordion
                      defaultOpen
                      title="Project Task"
                      icon={<ListChecks className="size-4 text-primary-normal" />}
                    >
                      <div className="p-4">
                        {submission?.PROJECT_TASKS?.map(
                          ([key, value], index) => (
                            <div key={key} className="mb-4">
                              <h4 className="text-lg font-semibold mb-4">
                                {key}
                              </h4>
                              <Stepper
                                orientation="vertical"
                                tail={
                                  index !== submission?.PROJECT_TASKS.length - 1
                                }
                                stepItem={value.map((item) => ({
                                  badgeIndex: item.SEQUENCE,
                                  state:
                                    requestStatusVariantMap[
                                    item.TASK_STATUS.toLowerCase()
                                    ],
                                  title: item.TASK_NAME,
                                  rightContent: (
                                    <Badge
                                      color={
                                        requestStatusVariantMap[
                                        item.TASK_STATUS.toLowerCase()
                                        ]
                                      }
                                      variant="soft"
                                    >
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
                                        onRefresh={refetch}
                                      />
                                    </div>
                                  ) : null,
                                }))}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </Accordion>
                  </Fragment>
                ),
              },
            ]}
          />

          <div className="flex justify-between mt-4 ">
            <Button
              variant="outline"
              color="tertiary"
              icon={<ArrowLeft className="text-primary-normal size-4" />}
              onClick={() => navigate("/product-registration/approval", {
                state: { mainTab: location?.state?.mainTab, secondaryTab: location?.state?.secondaryTab },
              })}
            >
              Back
            </Button>
            {[
              submissionStatus.WAITING_FOR_REVIEW,
              submissionStatus.REJECTED_BY_RA_MANAGER,
            ].includes(submission?.SUBMISSION_STATUS) &&
              [positionCodes.RA_REVIEWER, positionCodes.RA_SS].includes(
                user?.ROLE_CODE
              ) && (
                <Button
                  icon={<SendHorizontal className="size-4" />}
                  iconPosition="right"
                  onClick={actions?.submitMarketingAuthorizationNieEditReview}
                >
                  Submit
                </Button>
              )}
            {submission?.SUBMISSION_STATUS ===
              submissionStatus.WAITING_FOR_APPROVAL &&
              [
                positionCodes.RA_MGR_INA,
                positionCodes.RA_MGR_OVERSEAS,
              ].includes(user?.ROLE_CODE) && (
                <div className="flex gap-2">
                  <Button
                    icon={<Check className="size-4" />}
                    onClick={actions?.approveSubmission}
                    disabled={!submission}
                  >
                    Approve
                  </Button>
                  <Button
                    icon={<X className="size-4" />}
                    variant="outline"
                    color="danger"
                    onClick={actions?.rejectSubmission}
                    disabled={!submission}
                  >
                    Reject
                  </Button>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewApprovalDetail;
