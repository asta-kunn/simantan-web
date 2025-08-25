import {
  Badge,
  Button,
  Form,
  Input,
  RadioButton,
  Select,
  Skeleton,
  TextEditor
} from "@/components/Dexain";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/** Stores */
import { useUIStore } from "@/stores/uiStore";

/** Icons */
import { SendHorizontal } from "lucide-react";

/** Hooks */
import {
  useGetMilis,
  useGetRegistrationEmailTemplate,
  useGetUsers,
} from "@/hooks/master-data/useMasterData";
import { usePutSubmissionEmailNotification } from "../../hooks/useEmailNotification";

const ModalEditEmailNotification = ({
  SUBMISSION_ID,
  EMAIL_NOTIFICATION,
  refetch,
}) => {
  const {
    addStack,
    closeStack,
  } = useUIStore();

  /** Define Form */
  const methods = useForm({
    defaultValues: {
      EMAIL_TO: [],
      EMAIL_SUBJECT: "",
      EMAIL_BODY: "",
    },
    resolver: zodResolver(
      z.object({
        EMAIL_TO: z
          .array(z.string())
          .min(1, "At least one recipient is required"),
        EMAIL_SUBJECT: z.string().min(1, "Email Subject is required"),
        EMAIL_BODY: z
          .string()
          .refine((value) => value.replace(/<[^>]*>/g, "").length > 0, {
            message: "Email body is required",
          }),
      })
    ),
  });

  const { setValue } = methods;

  /** Queries */
  const { milis, isLoadingMilis } = useGetMilis();
  const { users, isLoadingUsers } = useGetUsers();
  const { registrationEmailTemplate, isLoadingRegistrationEmailTemplate } =
    useGetRegistrationEmailTemplate({ SUBMODULE: "RegVarNotif" });

  /** Mutations */
  const {
    mutateAsync: putSubmissionEmailNotification,
    isPending: isPendingPutEmailNotification,
  } = usePutSubmissionEmailNotification();

  /** States */
  const [emailBody, setEmailBody] = useState("");

  /** Effects Functions */
  useEffect(() => {
    if (EMAIL_NOTIFICATION && registrationEmailTemplate && milis && users) {
      const { EMAIL_TO, EMAIL_SUBJECT, EMAIL_BODY } = EMAIL_NOTIFICATION;

      /** Process EMAIL_TO from the stored notification data */
      if (EMAIL_TO && Array.isArray(EMAIL_TO)) {
        const formattedEmailTo = EMAIL_TO.flatMap((item) => {
          const { TYPE, VALUES } = item;

          /** Map each value to the format expected by the form */
          return VALUES.map((value) => {
            if (TYPE === "MILIS") {
              return JSON.stringify({ TYPE, MILIS_DESCRIPTION: value });
            } else if (TYPE === "USER") {
              return JSON.stringify({ TYPE, USER_EMAIL: value });
            }
            return null;
          }).filter(Boolean);
        });

        setValue("EMAIL_TO", formattedEmailTo);
      }

      setValue("EMAIL_SUBJECT", EMAIL_SUBJECT ? EMAIL_SUBJECT : "");
      setValue("EMAIL_BODY", EMAIL_BODY ? EMAIL_BODY : "");
    }
  }, [EMAIL_NOTIFICATION, registrationEmailTemplate, milis, users]);

  /** Handlers Functions */
  const handleSubmit = async (data) => {
    try {
      /** Process EMAIL_TO format JSON for efficiency */
      const emailTo = data.EMAIL_TO.reduce((acc, item) => {
        const { TYPE, MILIS_DESCRIPTION, USER_EMAIL } = JSON.parse(item);

        // Find existing entry with the same TYPE or create a new one
        const existingEntry = acc.find((entry) => entry.TYPE === TYPE);

        if (existingEntry) {
          // Add to existing entry
          if (TYPE === "MILIS") {
            existingEntry.VALUES.push(MILIS_DESCRIPTION);
          } else if (TYPE === "USER") {
            existingEntry.VALUES.push(USER_EMAIL);
          }
        } else {
          // Create new entry
          if (TYPE === "MILIS") {
            acc.push({ TYPE, VALUES: [MILIS_DESCRIPTION] });
          } else if (TYPE === "USER") {
            acc.push({ TYPE, VALUES: [USER_EMAIL] });
          }
        }

        return acc;
      }, []);

      const payload = {
        SUBMISSION_ID,
        EMAIL_TO: emailTo,
        EMAIL_SUBJECT: data.EMAIL_SUBJECT,
        EMAIL_BODY: data.EMAIL_BODY,
      };

      await putSubmissionEmailNotification(payload);
      await refetch();
      addStack({
        title: "Successfully Added Email Notification",
        description: "Well done! Please submit review to the next step.",
        variant: "success",
        isConfirm: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Skeleton
      isLoading={
        isLoadingRegistrationEmailTemplate && isLoadingMilis && isLoadingUsers
      }
      className="w-full h-full"
    >
      <Form
        methods={methods}
        validation={z.object({
          EMAIL_TO: z
            .array(z.string())
            .min(1, "At least one recipient is required"),
          EMAIL_SUBJECT: z.string().min(1, "Email Subject is required"),
          EMAIL_BODY: z
            .string()
            .refine((value) => value.replace(/<[^>]*>/g, "").length > 0, {
              message: "Email body is required",
            }),
        })}
        onSubmit={(values) => {
          addStack({
            title: "Confirmation",
            description:
              "Are you sure you want to submit the email notification?",
            variant: "warning",
            isLoading: isPendingPutEmailNotification,
            onCancel: () => {
              closeStack();
            },
            onConfirm: async () => {
              await handleSubmit(values);
            },
          });
        }}
      >
        <div className="flex flex-col">
          <Select
            name="EMAIL_TO"
            label="To"
            placeholder="Enter email notification to"
            searchable
            multiple
            options={
              isLoadingRegistrationEmailTemplate ||
              isLoadingMilis ||
              isLoadingUsers
                ? []
                : [
                    ...(milis?.map((role) => ({
                      id: role.MILIS_DESCRIPTION,
                      value: JSON.stringify({
                        TYPE: "MILIS",
                        MILIS_DESCRIPTION: role.MILIS_DESCRIPTION,
                      }),
                      label: role.MILIS_DESCRIPTION,
                      preview: (
                        <div>
                          {role.MILIS_DESCRIPTION}
                          <Badge size="sm" className="ml-1 h-[16px]">
                            Group
                          </Badge>
                        </div>
                      ),
                    })) || []),
                    ...(users?.map((user) => ({
                      id: user.USER_ID,
                      value: JSON.stringify({
                        TYPE: "USER",
                        USER_EMAIL: user.EMAIL,
                      }),
                      label: `${user.NAME} ${user.EMAIL}`,
                      preview: (
                        <div>
                          {user.NAME}
                          <span className="ml-1 text-primary-normal">
                            {user.EMAIL}
                          </span>
                        </div>
                      ),
                    })) || []),
                  ]
            }
            required
          />
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2 w-3/4">
              <Input
                name="EMAIL_SUBJECT"
                label="Subject"
                placeholder="Enter subject"
                required
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4">
              <Button
                variant="outline"
                // color="tertiary"
                className="w-full mt-6"
                onClick={() => {
                  addStack({
                    title: "Email Template List",
                    // description: "Please select the email template to use",
                    content: (
                      <>
                        <div className="flex flex-col gap-2">
                          {registrationEmailTemplate?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                            >
                              <RadioButton
                                value={item.EMAIL_TEMPLATE_HTML}
                                label={item.EMAIL_TEMPLATE_NAME}
                                onChange={(e) => {
                                  setEmailBody(e.target.value);
                                  setValue("EMAIL_BODY", e.target.value);
                                  closeStack();
                                }}
                                checked={emailBody === item.EMAIL_TEMPLATE_HTML}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    ),
                  });
                }}
              >
                Use Default Template
              </Button>
            </div>
          </div>

          <TextEditor
            name="EMAIL_BODY"
            label="Body"
            required
          />
        </div>
        <Separator className="my-4" />

        <div className="w-full flex justify-between gap-2">
          <Button
            variant="outline"
            color="tertiary"
            onClick={() => closeStack()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={<SendHorizontal className="size-4" />}
            iconPosition="right"
            disabled={isPendingPutEmailNotification}
          >
            Save
          </Button>
        </div>
      </Form>
    </Skeleton>
  );
};

export default ModalEditEmailNotification;
