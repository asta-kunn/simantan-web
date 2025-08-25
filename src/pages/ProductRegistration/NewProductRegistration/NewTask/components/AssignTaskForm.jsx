import { Button, Form, Info, Select, Separator } from "@/components/Dexain";
import { SendHorizontal } from "lucide-react";
import { assignTaskDefaultValues, assignTaskSchema } from "../schema";

const AssignTaskForm = ({ 
  data, 
  picRaOpsUsers, 
  onSubmit,
  disabled,
  stackMethods,
  selectedPicRaOpsUserRef,
}) => {
  const { closeStack } = stackMethods;

  return (
    <div className="space-y-4">
      <Info label="PCF No" value={data.PCF_NO || "-"} />
      <Info label="Finished Product Description" value={data.FINISHED_PRODUCT_DESCRIPTION || "-"} />
      <div className="grid grid-cols-3 gap-4">
        <Info label="NIE/MA Holder" value={data.NIE_MA_HOLDER || "-"} />
        <Info label="Manufacturing Site" value={data.MANUFACTURING_SITE || "-"} />
        <Info label="Country" value={data.COUNTRY || "-"} />
      </div>
      <Separator />
      <Form
        defaultValues={assignTaskDefaultValues}
        validation={assignTaskSchema}
        onSubmit={onSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <Select
            name="PIC_RA_USER_ID"
            label="PIC"
            searchable
            placeholder="Select PIC RA Officer"
            options={picRaOpsUsers?.map((user) => ({
              value: user.USER_ID,
              label: user.NAME,
              data: user,
              preview: (
                <div className="flex flex-col gap-1">
                  {user.NAME}
                  <div className="text-sm text-primary-normal font-bold">
                    {user.EMAIL}
                  </div>
                </div>
              ),
            }))}
            onChange={(_, { data }) => {
              selectedPicRaOpsUserRef.current = { NAME: data.NAME, EMAIL: data.EMAIL };
            }}
            required
            disabled={disabled}
          />
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeStack()}
          >
            Cancel
          </Button>
          <Button
            icon={<SendHorizontal className="size-4" />}
            iconPosition="right"
            type="submit"
          >
            Send Assignment
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AssignTaskForm;