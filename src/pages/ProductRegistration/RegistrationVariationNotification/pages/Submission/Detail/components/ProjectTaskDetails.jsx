import {
  Badge,
  Button,
  DatePicker,
  Form,
  Info,
  Input,
  Select,
  Uploader
} from "@/components/Dexain";
import { Separator } from "@/components/ui/separator";
import { useFile } from "@/hooks/file/useFile";
import { cn } from "@/lib/utils";
import { MarketingAuthorizationType } from "@/pages/ProductRegistration/RegistrationVariationNotification/constants/general";
import { usePatchCancelProjectTask } from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useSubmission";
import { usePatchProjectTask } from "@/pages/ProductRegistration/RegistrationVariationNotification/hooks/useTask";
import authStore from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { FileText, Plus, Save, SendHorizontal, SquarePen, Trash2 } from "lucide-react";
import { Fragment, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ApprovableLetterForm from "../../../../components/ApprovableLetterForm";
import LetterCard, { ViewDocumentButton } from "../../../../components/LetterCard";
import { positionCodes, projectTaskCode, projectTaskNames, submissionStatus, taskStatus } from "../../../../constants/general";
import { submissionSchemas } from "../schemas/submission";

const OptionalButton = ({
  stateKey,
  componentStates,
  setComponentStates,
  action,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 w-40">
      <Button size="sm" variant="outline" onClick={action}>
        No
      </Button>
      <Button
        size="sm"
        color="primary"
        onClick={() => setComponentStates({ ...componentStates, [stateKey]: true })}
      >
        Yes
      </Button>
    </div>
  );
};

const generateDetailComponent = (
  taskData,
  schemas,
  defaultValues,
  actions,
  componentStates,
  setComponentStates,
  submitHandlers,
  formMethods,
  fieldMethods
) => {
  const isOptional = taskData?.IS_OPTIONAL === "Y";

  switch (taskData?.TASK_CODE) {
    case projectTaskCode.RA_PARTNER_SUBMISSION:
      return !componentStates.showRaPartnerSubmissionForm && isOptional ? (
        <div className="space-y-2">
          <h6 className="text-black font-medium">Need Submission to RA Partner?</h6>
          <OptionalButton
            stateKey="showRaPartnerSubmissionForm"
            componentStates={componentStates}
            setComponentStates={setComponentStates}
            action={actions.openRaPartnerSubmissionModal}
          />
        </div>
      ) : (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Form
            defaultValues={defaultValues?.raPartnerSubmission}
            validation={schemas?.raPartnerSubmission}
            onSubmit={submitHandlers?.raPartnerSubmission}
          >
            <DatePicker
              name="submissionDate"
              label="Submission Date"
              maxDate={dayjs().toDate()}
              required
            />
            <Separator className="my-4" />
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setComponentStates({
                    ...componentStates,
                    showRaPartnerSubmissionForm: false,
                  })
                }
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      );

    case projectTaskCode.PRA_REG_SUBMISSION:
      return !componentStates.showPraRegSubmissionForm && isOptional ? (
        <div className="space-y-2">
          <h6 className="text-black font-medium">Need Pra-Reg Submission?</h6>
          <OptionalButton
            stateKey="showPraRegSubmissionForm"
            componentStates={componentStates}
            setComponentStates={setComponentStates}
            action={actions.openPraRegSubmissionModal}
          />
        </div>
      ) : (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Form
            defaultValues={defaultValues?.praRegSubmission}
            validation={schemas?.praRegSubmission}
            onSubmit={submitHandlers?.praRegSubmission}
          >
            <DatePicker
              name="praRegDate"
              label="Pra-Reg Date"
              maxDate={dayjs().toDate()}
              required
            />
            <Separator className="my-4" />
            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setComponentStates({
                    ...componentStates,
                    showPraRegSubmissionForm: false,
                  })
                }
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      );

    case projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION: {
      const praRegAdditionalFormMethods =
        formMethods?.praRegAdditionalSubmission;
      const praRegAdditionalFieldMethods =
        fieldMethods?.praRegAdditionalSubmission;

      return (
        <Fragment>
          {!componentStates.showPraRegAdditionalSubmissionForm && !taskData?.DATA ? (
            <div className="space-y-2">
              <h6 className="text-black font-medium">
                Need Pra-Reg Additional Data Submission?
              </h6>
              <div className="grid grid-cols-2 gap-2 w-40">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={actions.openPraRegAdditionalSubmissionModal}
                >
                  No
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() =>
                    setComponentStates({
                      ...componentStates,
                      showPraRegAdditionalSubmissionForm: true,
                    })
                  }
                >
                  Yes
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted border p-4 rounded-lg max-w-3xl">
              <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-black">
                <h6 className="col-span-5">Subject Additional Data</h6>
                <h6 className="col-span-3">Submission Date</h6>
                <h6 className="col-span-3">Issued Date</h6>
                <h6 className="col-span-1">Action</h6>
              </div>
              <Form
                methods={praRegAdditionalFormMethods}
                defaultValues={defaultValues?.praRegAdditionalSubmission}
                validation={schemas?.praRegAdditionalSubmission}
                onSubmit={submitHandlers?.praRegAdditionalSubmission}
              >
                {praRegAdditionalFieldMethods?.fields?.map((field, index) => {
                  const isLastItem =
                    praRegAdditionalFieldMethods?.fields?.length === 1;
                  return (
                    <div key={field.id} className="grid grid-cols-12 gap-2">
                      <div className="col-span-5 m-0">
                        <Input
                          className="bg-white text-black mb-0"
                          name={`data.${index}.subject`}
                          placeholder="Enter subject"
                        />
                      </div>
                      <div className="col-span-3">
                        <DatePicker
                          className="bg-white text-black mb-0"
                          name={`data.${index}.submissionDate`}
                          placeholder="Choose a date"
                          maxDate={dayjs().toDate()}
                        />
                      </div>
                      <div className="col-span-3">
                        <DatePicker
                          className="bg-white text-black mb-0"
                          name={`data.${index}.issuedDate`}
                          placeholder="Choose a date"
                          maxDate={dayjs().toDate()}
                        />
                      </div>
                      <div className="col-span-1 m-auto ">
                        <Trash2
                          className={cn(
                            "size-5",
                            isLastItem
                              ? "cursor-not-allowed text-muted-foreground"
                              : "cursor-pointer text-danger-normal"
                          )}
                          onClick={() =>
                            !isLastItem &&
                            praRegAdditionalFieldMethods?.remove(index)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  icon={<Plus className="size-4" />}
                  onClick={() =>
                    praRegAdditionalFieldMethods?.append({
                      subject: "",
                      submissionDate: null,
                    })
                  }
                >
                  Add More
                </Button>
                <Separator className="my-4" />
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    color="tertiary"
                    type="button"
                    onClick={async () => {
                      const hasData = praRegAdditionalFormMethods?.watch('data')?.some(item => item.subject || item.submissionDate);
                      if (hasData) {
                        await actions.cancelPraRegAdditionalSubmission();
                        praRegAdditionalFormMethods?.reset();
                      }

                      setComponentStates({
                        ...componentStates,
                        showPraRegAdditionalSubmissionForm: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="soft"
                      icon={<Save className="size-4" />}
                      onClick={async () =>
                        await submitHandlers?.praRegAdditionalDraft(
                          praRegAdditionalFormMethods?.getValues()
                        )
                      }
                    >
                      Save
                    </Button>
                    <Button
                      type="submit"
                      onClick={praRegAdditionalFormMethods?.handleSubmit(
                        submitHandlers?.praRegAdditionalSubmission
                      )}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Fragment>
      );
    }

    case projectTaskCode.PRA_REG_SUBMISSION_RESULT:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Form
            defaultValues={defaultValues?.praRegSubmissionResult}
            validation={schemas?.praRegSubmissionResult}
            onSubmit={submitHandlers?.praRegSubmissionResult}
          >
            <div className="grid grid-cols-2 gap-2">
              <Select
                name="status"
                label="Status"
                options={[
                  { label: "Approved", value: "Approved" },
                  { label: "Rejected", value: "Rejected" },
                ]}
                required
              />
              <DatePicker
                className="bg-white text-black"
                name="statusUpdateDate"
                label="Status Update Date"
                maxDate={dayjs().toDate()}
                required
              />
            </div>
            <Uploader
              name="hprDocument"
              label="HPR Document"
              required
              multiple={false}
            />
            <Separator className="my-4" />
            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          </Form>
        </div>
      );

    case projectTaskCode.REGISTRATION_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Form
            defaultValues={defaultValues?.registrationSubmission}
            validation={schemas?.registrationSubmission}
            onSubmit={submitHandlers?.registrationSubmission}
          >
            <DatePicker
              name="registrationDate"
              label="Registration Date"
              maxDate={dayjs().toDate()}
              required
            />
            <Separator className="my-4" />
            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          </Form>
        </div>
      );

    case projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION: {
      const registrationAdditionalFormMethods =
        formMethods?.registrationAdditionalSubmission;
      const registrationAdditionalFieldMethods =
        fieldMethods?.registrationAdditionalSubmission;

      return (
        <Fragment>
          {!componentStates.showRegistrationAdditionalSubmissionForm && !taskData?.DATA ? (
            <div className="space-y-2">
              <h6 className="text-black font-medium">
                Need Registration Additional Data Submission?
              </h6>
              <div className="grid grid-cols-2 gap-2 w-40">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={actions.openRegistrationAdditionalSubmissionModal}
                >
                  No
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() =>
                    setComponentStates({
                      ...componentStates,
                      showRegistrationAdditionalSubmissionForm: true,
                    })
                  }
                >
                  Yes
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted border p-4 rounded-lg max-w-3xl">
              <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-black">
                <h6 className="col-span-5">Subject Additional Data</h6>
                <h6 className="col-span-3">Submission Date</h6>
                <h6 className="col-span-3">Issued Date</h6>
                <h6 className="col-span-1">Action</h6>
              </div>
              <Form
                methods={registrationAdditionalFormMethods}
                defaultValues={defaultValues?.registrationAdditionalSubmission}
                validation={schemas?.registrationAdditionalSubmission}
                onSubmit={submitHandlers?.registrationAdditionalSubmission}
              >
                {registrationAdditionalFieldMethods?.fields?.map((field, index) => {
                  const isLastItem =
                    registrationAdditionalFieldMethods?.fields?.length === 1;
                  return (
                    <div key={field.id} className="grid grid-cols-12 gap-2">
                      <div className="col-span-5 m-0">
                        <Input
                          className="bg-white text-black mb-0"
                          name={`data.${index}.subject`}
                          placeholder="Enter subject"
                        />
                      </div>
                      <div className="col-span-3">
                        <DatePicker
                          className="bg-white text-black mb-0"
                          name={`data.${index}.submissionDate`}
                          placeholder="Choose a date"
                          maxDate={dayjs().toDate()}
                        />
                      </div>
                      <div className="col-span-3">
                        <DatePicker
                          className="bg-white text-black mb-0"
                          name={`data.${index}.issuedDate`}
                          placeholder="Choose a date"
                          maxDate={dayjs().toDate()}
                        />
                      </div>
                      <div className="col-span-1 m-auto ">
                        <Trash2
                          className={cn(
                            "size-5",
                            isLastItem
                              ? "cursor-not-allowed text-muted-foreground"
                              : "cursor-pointer text-danger-normal"
                          )}
                          onClick={() =>
                            !isLastItem &&
                            registrationAdditionalFieldMethods?.remove(index)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  icon={<Plus className="size-4" />}
                  onClick={() =>
                    registrationAdditionalFieldMethods?.append({
                      subject: "",
                      submissionDate: null,
                    })
                  }
                >
                  Add More
                </Button>
                <Separator className="my-4" />
                <div className="flex justify-between gap-2">
                  <Button
                    variant="outline"
                    color="tertiary"
                    type="button"
                    onClick={async () => {
                      const hasData = registrationAdditionalFormMethods?.watch('data')?.some(item => item.subject || item.submissionDate);
                      if (hasData) {
                        await actions.cancelRegistrationAdditionalSubmission();
                        registrationAdditionalFormMethods?.reset();
                      }

                      setComponentStates({
                        ...componentStates,
                        showRegistrationAdditionalSubmissionForm: false,
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="soft"
                      icon={<Save className="size-4" />}
                      onClick={async () =>
                        await submitHandlers?.registrationAdditionalDraft(
                          registrationAdditionalFormMethods?.getValues()
                        )
                      }
                    >
                      Save
                    </Button>
                    <Button
                      type="submit"
                      onClick={registrationAdditionalFormMethods?.handleSubmit(
                        submitHandlers?.registrationAdditionalSubmission
                      )}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Fragment>
      );
    }

    case projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT:
      return !componentStates.showApprovableLetterAlForm && isOptional ? (
        <div className="space-y-2">
          <h6 className="text-black font-medium">
            Need Approvable Letter (AL) Submission Result?
          </h6>
          <OptionalButton
            stateKey="showApprovableLetterAlForm"
            componentStates={componentStates}
            setComponentStates={setComponentStates}
            action={actions.noNeedApprovableLetterAlForm}
          />
        </div>
      ) : (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl flex flex-col items-center justify-center gap-4">
          <FileText className="size-10 text-primary-normal" />
          <p className="text-lg text-center text-muted-foreground">
            Please fill out the Receive Approvable Letter (AL) Form
            <br />& Upload Document
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setComponentStates({
                  ...componentStates,
                  showApprovableLetterAlForm: false,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                actions.openApprovableLetterAlForm(
                  <ApprovableLetterForm
                    taskCode={projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT}
                    defaultValues={defaultValues?.alSubmissionResult}
                    schema={schemas?.alSubmissionResult}
                    submitHandler={submitHandlers?.alSubmissionResult}
                    actions={actions}
                  />
                )
              }
            >
              <SquarePen className="size-4" />
              Fill out the form
            </Button>
          </div>
        </div>
      );

    case projectTaskCode.AL_TO_MA_NIE_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Form
            defaultValues={defaultValues?.alToMaNieSubmission}
            validation={schemas?.alToMaNieSubmission}
            onSubmit={submitHandlers?.alToMaNieSubmission}
          >
            <DatePicker
              name="alToMaNieDate"
              label="AL to MA/NIE Date"
              maxDate={dayjs().toDate()}
              required
            />
            <Separator className="my-4" />
            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          </Form>
        </div>
      );

    case projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT: {
      const marketingAuthorizationNieFormMethods =
        formMethods?.marketingAuthorizationNieSubmission;
      const status = marketingAuthorizationNieFormMethods?.watch("status");

      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Form
            methods={marketingAuthorizationNieFormMethods}
            defaultValues={defaultValues?.marketingAuthorizationNieSubmission}
            validation={schemas?.marketingAuthorizationNieSubmission}
            onSubmit={submitHandlers?.marketingAuthorizationNieSubmission}
          >
            <Select
              name="status"
              label="Status"
              options={[
                { label: "Approved", value: "Approved" },
                { label: "Rejected", value: "Rejected" },
              ]}
              required
            />
            {status === "Approved" ? (
              <Fragment key="approved-form">
                <Separator className="my-4" />
                <div className="bg-muted rounded-lg max-w-3xl flex flex-col items-center justify-center gap-4">
                  <FileText className="size-10 text-primary-normal" />
                  <p className="text-lg text-center text-muted-foreground">
                    Please fill out the Receive NIE Form & Upload Document
                  </p>
                  <Button
                    onClick={() =>
                      actions.openMarketingAuthorizationNieSubmissionForm(
                        <ApprovableLetterForm
                          taskCode={projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT}
                          method={formMethods?.marketingAuthorizationNieSubmissionForm}
                          defaultValues={defaultValues?.marketingAuthorizationNieSubmissionForm}
                          schema={schemas?.marketingAuthorizationNieSubmissionForm}
                          submitHandler={submitHandlers?.marketingAuthorizationNieSubmissionForm}
                          actions={actions}
                        />
                      )
                    }
                  >
                    <SquarePen className="size-4" />
                    Fill out the form
                  </Button>
                </div>
              </Fragment>
            ) : (
              <Fragment key="rejected-form">
                <DatePicker
                  name="rejectionDate"
                  label="Rejection Date"
                  maxDate={dayjs().toDate()}
                  required
                />
                <Input name="remark" label="Remark" required />
                <Uploader
                  name="attachment"
                  label="Attachment"
                  multiple={false}
                />
                <Separator className="my-4" />
                <Button type="submit" className="ml-auto">
                  Submit
                </Button>
              </Fragment>
            )}
          </Form>
        </div>
      );
    }
  }
};

const generatePreviewComponent = (taskData, actions) => {
  switch (taskData?.TASK_CODE) {
    case projectTaskCode.RA_PARTNER_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Info
            label="Submission Date"
            value={dayjs(taskData?.DATA?.submissionDate).format("D MMM YYYY")}
          />
        </div>
      );

    case projectTaskCode.PRA_REG_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Info
            label="Pra-Reg Date"
            value={dayjs(taskData?.DATA?.praRegDate).format("D MMM YYYY")}
          />
        </div>
      );

    case projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION:
    case projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <div className="grid grid-cols-4 mb-2 font-semibold text-black">
            <h6 className="col-span-2">Subject Additional Data</h6>
            <h6 className="col-span-1">Submission Date</h6>
            <h6 className="col-span-1">Issued Date</h6>
          </div>
          <div className="grid grid-cols-4">
            <div className="col-span-2">
              {taskData?.DATA?.data?.map((item, index) => (
                <div
                  key={index}
                  className="text-black font-semibold p-2 bg-white border"
                >
                  <p>{item.subject}</p>
                </div>
              ))}
            </div>
            <div className="col-span-1">
              {taskData?.DATA?.data?.map((item, index) => (
                <div
                  key={index}
                  className="text-black font-semibold p-2 bg-white border"
                >
                  <p>{dayjs(item.submissionDate).format("D MMM YYYY")}</p>
                </div>
              ))}
            </div>
            <div className="col-span-1">
              {taskData?.DATA?.data?.map((item, index) => (
                <div
                  key={index}
                  className="text-black font-semibold p-2 bg-white border"
                >
                  <p>{dayjs(item.issuedDate).format("D MMM YYYY")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case projectTaskCode.PRA_REG_SUBMISSION_RESULT:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <div className="grid grid-cols-2 gap-4">
            <Info
              label="Status"
              value={
                <Badge color={taskData?.DATA?.status === "Approved" ? "success" : "danger"}>
                  {taskData?.DATA?.status}
                </Badge>
              }
            />
            <Info
              label="Status Update Date"
              value={dayjs(taskData?.DATA?.statusUpdateDate).format("D MMM YYYY")}
            />
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <Info
              containerClassName="col-span-full"
              label="HPR Document"
              value={
                <ViewDocumentButton
                  fileUrl={taskData?.DATA?.hprDocument}
                  action={actions.openFile}
                />
              }
            />
          </div>
        </div>
      );

    case projectTaskCode.REGISTRATION_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Info
            label="Registration Date"
            value={dayjs(taskData?.DATA?.registrationDate).format("D MMM YYYY")}
          />
        </div>
      );

    case projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT:
      return (
        <LetterCard
          taskCode={taskData?.TASK_CODE}
          data={taskData?.DATA}
          actions={{ onOpenFile: actions.openFile }}
        />
      );

    case projectTaskCode.AL_TO_MA_NIE_SUBMISSION:
      return (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl">
          <Info
            label="AL to MA/NIE Date"
            value={dayjs(taskData?.DATA?.alToMaNieDate).format("D MMM YYYY")}
          />
        </div>
      );

    case projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT:
      return taskData?.DATA?.status === "Approved" ? (
        <LetterCard
          taskCode={taskData?.TASK_CODE}
          data={taskData?.DATA}
          actions={{ onOpenFile: actions.openFile }}
        />
      ) : (
        <div className="bg-muted border p-4 rounded-lg max-w-3xl space-y-4">
          <Info
            label="Status"
            value={
              <Badge
                color={
                  taskData?.DATA?.status === "Approved" ? "success" : "danger"
                }
              >
                {taskData?.DATA?.status}
              </Badge>
            }
          />
          <Info
            label="Rejection Date"
            value={dayjs(taskData?.DATA?.rejectionDate).format(
              "D MMM YYYY"
            )}
          />
          <Info label="Remark" value={taskData?.DATA?.remark} />
          <Info
            containerClassName="col-span-full"
            label="Attachment"
            value={
              <ViewDocumentButton
                fileUrl={taskData?.DATA?.attachment}
                action={actions.openFile}
              />
            }
          />
        </div>
      );

    default:
      return null;
  }
};

const ProjectTaskDetails = ({ submission, task, onRefresh }) => {
  const { addStack, closeStack, clearStacks } = useUIStore();
  const { user } = authStore();
  const [openDetail, setOpenDetail] = useState(false);
  const navigate = useNavigate();

  const { previewFile, uploadFileChunk } = useFile();
  const formatDate = (date) => date ? dayjs(date).format("YYYY-MM-DD") : null;

  const {
    mutateAsync: patchProjectTask,
    isPending: isPendingPatchProjectTask,
  } = usePatchProjectTask();
  const {
    cancelProjectTask,
    isLoadingCancelProjectTask,
  } = usePatchCancelProjectTask();

  const [componentStates, setComponentStates] = useState({
    showRaPartnerSubmissionForm: false,
    showPraRegSubmissionForm: false,
    showPraRegAdditionalSubmissionForm: false,
    showPraRegSubmissionResultForm: false,
    showRegistrationSubmissionForm: false,
    showRegistrationAdditionalSubmissionForm: false,
    showAlSubmissionResultForm: false,
    showAlToMaNieSubmissionForm: false,
    showMarketingAuthorizationNieSubmissionForm: false,
    showMarketingAuthorizationNieSubmissionResultForm: false,
  });

  const LATEST_MA = submission?.LATEST_MARKETING_AUTHORIZATION;
  const ONGOING_MA = submission?.ONGOING_MARKETING_AUTHORIZATION;
  const getMAFieldValue = (field = LATEST_MA, fallback = "") =>
    ONGOING_MA?.[field] || LATEST_MA?.[field] || fallback;

  const defaultMarketingAuthFields = {
    APPROVAL_TYPE: getMAFieldValue("APPROVAL_TYPE"),
    DISTRIBUTOR: getMAFieldValue("DISTRIBUTOR"),
    RA_AGENT: getMAFieldValue("RA_AGENT"),
    MA_REFERENCE_CPP: getMAFieldValue("MA_REFERENCE_CPP"),
    FINISHED_PRODUCT_ID: getMAFieldValue("FINISHED_PRODUCT_ID"),
    FINISHED_PRODUCT_DESCRIPTION: getMAFieldValue("FINISHED_PRODUCT_DESCRIPTION"),
    REGISTRATION_PRODUCT_NAME: getMAFieldValue("REGISTRATION_PRODUCT_NAME"),
    DEVELOPMENT_CATEGORY: getMAFieldValue("DEVELOPMENT_CATEGORY"),
    MANUFACTURING_SITE: getMAFieldValue("MANUFACTURING_SITE"),
    INFOTEHNA_DOC_NO: getMAFieldValue("INFOTEHNA_DOC_NO"),
    INITIAL_REGISTRATION_DATE: getMAFieldValue("INITIAL_REGISTRATION_DATE") ? new Date(getMAFieldValue("INITIAL_REGISTRATION_DATE")) : null,
    NIE_MA_HOLDER: getMAFieldValue("NIE_MA_HOLDER"),
    NIE_MA_NO: getMAFieldValue("NIE_MA_NO"),
    PCF_NO: getMAFieldValue("PCF_NO"),
    DOSSIER_NUMBER: getMAFieldValue("DOSSIER_NUMBER"),
    REGULATORY_PRODUCT_CATEGORY: getMAFieldValue("REGULATORY_PRODUCT_CATEGORY"),
    REGULATORY_DOSAGE_FORM: getMAFieldValue("REGULATORY_DOSAGE_FORM"),
    REGULATORY_PACK_SIZE: getMAFieldValue("REGULATORY_PACK_SIZE"),
    REGULATORY_SHELF_LIFE: getMAFieldValue("REGULATORY_SHELF_LIFE"),
    MARKETING_AUTHORIZATION_FILE: null,
    REMARK: "",
    ADDITIONAL_COMMITMENTS: getMAFieldValue("ADDITIONAL_COMMITMENTS", [
      {
        COMMITMENT_TYPE: "NONE",
        DUE_DATE: null,
        STATUS: null,
      },
    ]),
  };

  const defaultValues = {
    raPartnerSubmission: { submissionDate: null },
    praRegSubmission: { praRegDate: null },
    praRegAdditionalSubmission: {
      data: task?.DATA?.data?.map((item) => ({
        subject: item.subject,
        submissionDate: item.submissionDate
          ? new Date(item.submissionDate)
          : null,
        issuedDate: item.issuedDate
          ? new Date(item.issuedDate)
          : null,
      })) || [{ subject: "", submissionDate: null, issuedDate: null }],
    },
    praRegSubmissionResult: {
      status: task?.DATA?.status || "Approved",
      statusUpdateDate: task?.DATA?.statusUpdateDate
        ? new Date(task?.DATA?.statusUpdateDate)
        : null,
      hprDocument: task?.DATA?.hprDocument || null,
    },
    registrationSubmission: { registrationDate: null },
    registrationAdditionalSubmission: {
      data: task?.DATA?.data?.map((item) => ({
        subject: item.subject,
        submissionDate: item.submissionDate
          ? new Date(item.submissionDate)
          : null,
        issuedDate: item.issuedDate
          ? new Date(item.issuedDate)
          : null,
      })) || [{ subject: "", submissionDate: null, issuedDate: null }],
    },
    alSubmissionResult: {
      ...defaultMarketingAuthFields,
      AL_APPROVAL_DATE: null,
      AL_EXPIRY_DATE: null,
    },
    alToMaNieSubmission: { alToMaNieDate: null },
    marketingAuthorizationNieSubmission: {
      status: "Approved",
      rejectionDate: null,
      remark: "",
      attachment: null,
    },
    marketingAuthorizationNieSubmissionForm: {
      ...defaultMarketingAuthFields,
      ADDITIONAL_COMMITMENTS: [
        {
          COMMITMENT_TYPE: "NONE",
          DUE_DATE: null,
          STATUS: null,
        },
      ],
      NIE_MA_APPROVAL_DATE: null,
      NIE_MA_EXPIRY_DATE: null,
    },
  };

  const formMethods = {
    praRegAdditionalSubmission: useForm({
      defaultValues: defaultValues?.praRegAdditionalSubmission,
      resolver: zodResolver(submissionSchemas?.praRegAdditionalSubmission),
    }),
    registrationAdditionalSubmission: useForm({
      defaultValues: defaultValues?.registrationAdditionalSubmission,
      resolver: zodResolver(submissionSchemas?.registrationAdditionalSubmission),
    }),
    alSubmissionResult: useForm({
      defaultValues: defaultValues?.alSubmissionResult,
      resolver: zodResolver(submissionSchemas?.alSubmissionResult),
    }),
    marketingAuthorizationNieSubmission: useForm({
      defaultValues: defaultValues?.marketingAuthorizationNieSubmission,
      resolver: zodResolver(submissionSchemas?.marketingAuthorizationNieSubmission),
    }),
    marketingAuthorizationNieSubmissionForm: useForm({
      defaultValues: defaultValues?.marketingAuthorizationNieSubmissionForm,
      resolver: zodResolver(submissionSchemas?.marketingAuthorizationNieSubmissionForm),
    }),
  };

  const fieldMethods = {
    praRegAdditionalSubmission: useFieldArray({
      control: formMethods?.praRegAdditionalSubmission?.control,
      name: "data",
    }),
    registrationAdditionalSubmission: useFieldArray({
      control: formMethods?.registrationAdditionalSubmission?.control,
      name: "data",
    }),
  };

  const handleOnDataSubmit = (data, taskCode, additionalPayload = {}) => {
    const basePayload = {
      PROJECT_TASK_ID: task?.PROJECT_TASK_ID,
      VERSION: task?.VERSION,
      TASK_CODE: task?.TASK_CODE,
      TASK_SUBGROUP: task?.TASK_SUBGROUP,
      SUBMISSION_ID: task?.SUBMISSION_ID,
      SEQUENCE: task?.SEQUENCE
    };

    if (
      [
        projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION,
        projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION,
      ].includes(taskCode)
    ) {
      if (data?.type === "NOT_APPLICABLE") {
        addStack({
          title: `${projectTaskNames[taskCode]} No Applicable?`,
          description:
            "Please review again because this action cannot be undone.",
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
              const payload = { ...basePayload, DATA: data };
              await patchProjectTask(payload);
              onRefresh();
              closeStack();
            } catch (error) {
              console.error(error);
            }
          },
        });
        return;
      } else if (data?.type === "DRAFT") {
        addStack({
          title: `Save ${projectTaskNames[taskCode]} progress?`,
          description:
            "This action will save your progress and you can continue later.",
          variant: "warning",
          confirmText: (
            <div className="flex items-center gap-2">
              Save
              <SendHorizontal className="size-4" />
            </div>
          ),
          onCancel: () => closeStack(),
          onConfirm: async () => {
            try {
              const payload = { ...basePayload, DATA: data };
              await patchProjectTask(payload);
              onRefresh();
              closeStack();
              addStack({
                title: `Successfully Saved ${projectTaskNames[taskCode]}`,
                description: "Well done! Your progress has been saved.",
                variant: "success",
                isConfirm: true,
              });
            } catch (error) {
              console.error(error);
            }
          },
        });
        return;
      }
    }

    addStack({
      title: `Submit ${projectTaskNames[taskCode]}?`,
      description: "Please review again because this action cannot be undone.",
      variant: "warning",
      confirmText: (
        <div className="flex items-center gap-2">
          Confirm & Submit
          <SendHorizontal className="size-4" />
        </div>
      ),
      isLoading: isPendingPatchProjectTask,
      onCancel: () => closeStack(),
      onConfirm: async () => {
        try {
          const docTypes = {
            [projectTaskCode.PRA_REG_SUBMISSION_RESULT]: {
              docType: "HPR",
              fileKey: "hprDocument",
            },
            [projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT]: {
              docType: "AL",
              fileKey: "MARKETING_AUTHORIZATION_FILE",
            },
            [projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT]: {
              docType: "NIE",
              fileKey: data?.status === "Approved" ? "MARKETING_AUTHORIZATION_FILE" : "attachment",
            },
          };

          const docConfig = docTypes[taskCode];
          let additionalObject = {};

          if (docConfig && data?.[docConfig?.fileKey]) {
            const { docType, fileKey } = docConfig;
            const file = data?.[fileKey];
            const fileExtension = file?.name?.split(".").pop();

            const { filePath, version } = await uploadFileChunk({
              file,
              fileName: `${docType}-${submission?.FINISHED_PRODUCT_CODE}-${submission?.SUBMISSION_NO}.${fileExtension}`,
              docType,
              versioning: "Y",
            });
            if (!filePath || !version) {
              throw new Error("Failed to upload file. Please try again.");
            }

            additionalObject = { [fileKey]: filePath, version };
          }

          const formattedData = taskCode === projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT ? {
            ...data,
            INITIAL_REGISTRATION_DATE: formatDate(data?.INITIAL_REGISTRATION_DATE),
            NIE_MA_APPROVAL_DATE: formatDate(data?.NIE_MA_APPROVAL_DATE),
            NIE_MA_EXPIRY_DATE: formatDate(data?.NIE_MA_EXPIRY_DATE),
          } : taskCode === projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT ? {
            ...data,
            INITIAL_REGISTRATION_DATE: formatDate(data?.INITIAL_REGISTRATION_DATE),
            AL_APPROVAL_DATE: formatDate(data?.AL_APPROVAL_DATE),
            AL_EXPIRY_DATE: formatDate(data?.AL_EXPIRY_DATE),
          } : data;

          const payload = {
            ...basePayload,
            DATA: {
              ...formattedData,
              ...additionalObject,
              ...additionalPayload,
              MARKETING_AUTHORIZATION_TYPE: submission.REGISTRATION_TYPE === 'Renewal' ? MarketingAuthorizationType.RENEWAL : MarketingAuthorizationType.VARIATION,
            },
          };

          await patchProjectTask(payload);
          onRefresh();
          clearStacks();

          if (
            [
              projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT,
              projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT,
            ].includes(taskCode) &&
            data?.type !== "NOT_REQUIRED"
          ) {
            let title;

            switch (taskCode) {
              case projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT:
                title = "Approvable Letter (AL)";
                break;
              case projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT:
                title = "Marketing Authorization (NIE)";
                break;
              default:
                title = "";
                break;
            }

            addStack({
              title: `Successfully Submitted ${title} Submission Result`,
              description: "Well done! The form will continue to the next step.",
              variant: "success",
              footer: (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      closeStack();
                      navigate("/product-registration/variation-notification");
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
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleOnCancelProjectTask = (taskCode) => {
    return new Promise((resolve, reject) => {
      addStack({
        title: `Cancel ${projectTaskNames[taskCode]}?`,
        description: "Please review again because this action cannot be undone.",
        variant: "warning",
        isLoading: isLoadingCancelProjectTask,
        confirmText: (
          <div className="flex items-center gap-2">
            Confirm
            <SendHorizontal className="size-4" />
          </div>
        ),
        onCancel: () => closeStack(),
        onConfirm: async () => {
          try {
            await cancelProjectTask({
              SUBMISSION_ID: submission?.SUBMISSION_ID,
              TASK_CODE: taskCode,
            });
            onRefresh();
            closeStack();
            resolve(true);
          } catch (error) {
            console.error(error);
            reject(error);
          }
        },
      });
    });
  };


  const submitHandlers = {
    raPartnerSubmission: (data) =>
      handleOnDataSubmit(data, projectTaskCode.RA_PARTNER_SUBMISSION),
    praRegSubmission: (data) =>
      handleOnDataSubmit(data, projectTaskCode.PRA_REG_SUBMISSION),
    praRegAdditionalSubmission: (data) =>
      handleOnDataSubmit(
        {
          type: "FINAL",
          data: data?.data?.map((item) => ({
            ...item,
            submissionDate: dayjs(item.submissionDate).format("YYYY-MM-DD"),
          })),
        },
        projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION
      ),
    praRegAdditionalDraft: (data) =>
      handleOnDataSubmit(
        {
          type: "DRAFT",
          data: data?.data?.map((item) => ({
            ...item,
            submissionDate: item.submissionDate
              ? dayjs(item.submissionDate).format("YYYY-MM-DD")
              : null,
          })),
        },
        projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION
      ),
    praRegSubmissionResult: (data) =>
      handleOnDataSubmit(data, projectTaskCode.PRA_REG_SUBMISSION_RESULT),
    registrationSubmission: (data) =>
      handleOnDataSubmit(data, projectTaskCode.REGISTRATION_SUBMISSION),
    registrationAdditionalSubmission: (data) =>
      handleOnDataSubmit(
        {
          type: "FINAL",
          data: data?.data?.map((item) => ({
            ...item,
            submissionDate: dayjs(item.submissionDate).format("YYYY-MM-DD"),
          })),
        },
        projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION
      ),
    registrationAdditionalDraft: (data) =>
      handleOnDataSubmit(
        {
          type: "DRAFT",
          data: data?.data?.map((item) => ({
            ...item,
            submissionDate: item.submissionDate
              ? dayjs(item.submissionDate).format("YYYY-MM-DD")
              : null,
          })),
        },
        projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION
      ),
    alSubmissionResult: (data) =>
      handleOnDataSubmit(
        data,
        projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT,
        { COUNTRY: submission?.COUNTRY }
      ),
    alToMaNieSubmission: (data) =>
      handleOnDataSubmit(data, projectTaskCode.AL_TO_MA_NIE_SUBMISSION),
    marketingAuthorizationNieSubmission: (data) =>
      handleOnDataSubmit(
        data,
        projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT,
        { COUNTRY: submission?.COUNTRY }
      ),
    marketingAuthorizationNieSubmissionForm: (data) =>
      handleOnDataSubmit(
        { ...data, status: "Approved", ADDITIONAL_COMMITMENTS: data?.ADDITIONAL_COMMITMENTS?.filter((item) => item?.COMMITMENT_TYPE !== "NONE") },
        projectTaskCode.MARKETING_AUTHORIZATION_NIE_SUBMISSION_RESULT,
        { COUNTRY: submission?.COUNTRY }
      ),
    submissionConfirmation: () =>
      handleOnDataSubmit(
        { isSubmitted: true },
        projectTaskCode.SUBMISSION_CONFIRMATION
      ),
  };

  const actions = {
    openRaPartnerSubmissionModal: () =>
      handleOnDataSubmit({ type: "NOT_REQUIRED" }, projectTaskCode.RA_PARTNER_SUBMISSION),
    openPraRegSubmissionModal: () =>
      handleOnDataSubmit(
        { type: "NOT_REQUIRED" },
        projectTaskCode.PRA_REG_SUBMISSION
      ),
    openPraRegAdditionalSubmissionModal: () =>
      handleOnDataSubmit(
        { type: "NOT_APPLICABLE" },
        projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION
      ),
    cancelPraRegAdditionalSubmission: () => {
      return handleOnCancelProjectTask(projectTaskCode.PRA_REG_ADDITIONAL_SUBMISSION);
    },
    openRegistrationAdditionalSubmissionModal: () =>
      handleOnDataSubmit(
        { type: "NOT_APPLICABLE" },
        projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION
      ),
    cancelRegistrationAdditionalSubmission: () => {
      return handleOnCancelProjectTask(projectTaskCode.REGISTRATION_ADDITIONAL_SUBMISSION);
    },
    noNeedApprovableLetterAlForm: () =>
      handleOnDataSubmit(
        { type: "NOT_REQUIRED" },
        projectTaskCode.APPROVABLE_LETTER_AL_SUBMISSION_RESULT
      ),
    openApprovableLetterAlForm: (content = null) =>
      addStack({
        size: "3xl",
        title: "Approvable Letter (AL) Submission Result",
        description:
          "Please review again because this action cannot be undone.",
        content,
        closeable: false,
      }),
    openMarketingAuthorizationNieSubmissionForm: (content = null) => {
      addStack({
        size: "3xl",
        title: "Marketing Authorization NIE Submission Result",
        description:
          "Please review again because this action cannot be undone.",
        content,
        closeable: false,
      });
    },
    openFile: (fileUrl) => previewFile(fileUrl),
    closeModalForm: () => closeStack(),
  };

  return (
    <Fragment>
      {submission?.SUBMISSION_STATUS === submissionStatus.IN_PROGRESS &&
        submission?.PIC_RA?.USER_ID === user?.USER_ID &&
        [positionCodes.RA_OPS].includes(user?.ROLE_CODE) &&
        [taskStatus.NEED_ACTION, taskStatus.NOT_STARTED].includes(task?.TASK_STATUS)
        ? generateDetailComponent(
          task,
          submissionSchemas,
          defaultValues,
          actions,
          componentStates,
          setComponentStates,
          submitHandlers,
          formMethods,
          fieldMethods
        )
        : [taskStatus.SUBMITTED, taskStatus.NOT_REQUIRED].includes(task?.TASK_STATUS) && (
          <Fragment>
            <div>
              <div className={cn("flex gap-1 text-sm")}>
                <p className="text-black font-medium">
                  {task?.ACTION_BY?.NAME}
                </p>
                <p className={cn("text-muted-foreground")}>
                  {task?.ACTION_BY?.EMAIL}
                </p>
              </div>
              <p className={cn("text-muted-foreground")}>
                {dayjs(task?.ACTION_DATE).format("D MMM YYYY, HH:mm:ss")}
              </p>
            </div>

            {openDetail && generatePreviewComponent(task, actions)}

            {task?.DATA?.showDetail === "Y" ? (
              <Button
                size="sm"
                variant="soft"
                color="primary"
                onClick={() => setOpenDetail(!openDetail)}
              >
                {openDetail ? "Close Detail" : "Show Detail"}
              </Button>
            ) : (
              task?.TASK_STATUS === taskStatus.SUBMITTED && (
                <div className="bg-muted border p-4 rounded-lg max-w-3xl">
                  <p className="text-lg text-center text-muted-foreground">
                    No Additional Data Submission
                  </p>
                </div>
              )
            )}
          </Fragment>
        )}
    </Fragment>
  );
};

export default ProjectTaskDetails;