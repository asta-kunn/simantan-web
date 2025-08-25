import {
  Accordion,
  Button,
  Form,
  Info,
  Input,
  Select,
  Separator,
} from "@/components/Dexain";
import { getFinishedProducts } from "@/services/master-data.service";
import dayjs from "dayjs";
import { Plus, SendHorizontal, Trash2 } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { newTaskDefaultValues, newTaskSchema } from "../schema";

const FinishedProductsField = ({ handlers, actions }) => {
  const { control, setValue, trigger } = useFormContext();
  const fieldMethod = useFieldArray({
    control,
    name: "FINISHED_PRODUCTS",
  });

  const [selectedProducts, setSelectedProducts] = useState([]);

  const renderFinishedProducts = () => {
    return fieldMethod?.fields?.map((field, index) => (
      <Accordion
        key={field.id}
        openItemClassName="border-primary-normal rounded-md"
        openHeaderClassName="bg-primary-soft rounded-t-md"
        separator
        title={
          <Select
            className="mb-0"
            name={`FINISHED_PRODUCTS.${index}.FINISHED_PRODUCT`}
            onSearch={handlers?.onSearchFinishedProduct}
            onChange={(_, { data }) => {
              const newSelectedProducts = [...selectedProducts];
              newSelectedProducts[index] = data;
              setSelectedProducts(newSelectedProducts);
              setValue(
                `FINISHED_PRODUCTS.${index}.ITEM_MASTER_ID`,
                Number(data?.ITEM_MASTER_ID)
              );
              setValue(
                `FINISHED_PRODUCTS.${index}.MARKETING_AUTHORIZATION_HOLDER_NAME`,
                data?.MARKETING_AUTHORIZATION_HOLDER_NAME
              );
              setValue(`FINISHED_PRODUCTS.${index}.COUNTRY`, data?.COUNTRY);
              setValue(
                `FINISHED_PRODUCTS.${index}.ACTIVE_INGREDIENTS`,
                data?.ACTIVE_INGREDIENTS
              );
              setValue(`FINISHED_PRODUCTS.${index}.MANUFACTURING_SITE`, "");
            }}
            searchable
            placeholder="Select Finished Product"
            required
          />
        }
        rightHeaderItems={[
          <Button
            key={`remove-finished-product-${index}`}
            disabled={fieldMethod.fields.length === 1}
            variant="soft"
            size="sm"
            icon={<Trash2 className="size-4" />}
            onClick={() => {
              actions?.openRemoveConfirmation(() => {
                fieldMethod.remove(index);
                const newSelectedProducts = selectedProducts.filter(
                  (_, i) => i !== index
                );
                setSelectedProducts(newSelectedProducts);
              });
            }}
          />,
        ]}
      >
        <div className="bg-gray-100 mx-4 mb-4 mt-2 rounded-md p-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              name={`FINISHED_PRODUCTS.${index}.MARKETING_AUTHORIZATION_HOLDER_NAME`}
              label="Marketing Authorization Holder"
              placeholder="Autofilled"
              disabled
            />
            <Select
              name={`FINISHED_PRODUCTS.${index}.MANUFACTURING_SITE`}
              label="Manufacturing Site"
              placeholder="Select Manufacturing Site"
              options={
                selectedProducts[index]?.MANUFACTURING_SITES?.map((item) => ({
                  label: item,
                  value: item,
                })) || []
              }
              onChange={() => {
                trigger([
                  `FINISHED_PRODUCTS.${index}.ITEM_MASTER_ID`,
                  `FINISHED_PRODUCTS.${index}.FINISHED_PRODUCT`,
                  `FINISHED_PRODUCTS.${index}.MANUFACTURING_SITE`,
                ]);
              }}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name={`FINISHED_PRODUCTS.${index}.COUNTRY`}
              label="Country"
              placeholder="Autofilled"
              disabled
            />
          </div>
          <Separator className="my-4" />
          <label className="text-base font-medium mb-1.5">
            Active Ingredients
          </label>
          {selectedProducts[index]?.ACTIVE_INGREDIENTS?.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {selectedProducts[index]?.ACTIVE_INGREDIENTS?.map(
                (item, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active ingredients
            </p>
          )}
        </div>
      </Accordion>
    ));
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        <label className="text-base mb-1.5">Finished Product(s)</label>
        <span className="text-primary-normal self-start">*</span>
      </div>
      {renderFinishedProducts()}
      <Button
        className="mt-4"
        type="button"
        size="sm"
        variant="soft"
        color="tertiary"
        icon={<Plus className="size-4 text-primary-normal" />}
        onClick={() =>
          fieldMethod?.append({
            FINISHED_PRODUCT: "",
            MARKETING_AUTHORIZATION_HOLDER_NAME: "",
            MANUFACTURING_SITE: "",
            COUNTRY: "",
            ACTIVE_INGREDIENTS: "",
          })
        }
      >
        Add More
      </Button>
    </div>
  );
};

const AddNewTaskForm = ({
  stackMethods,
  isLoading,
  onSubmitNewTask,
  onRefetch,
}) => {
  const { addStack, closeStack, clearStacks } = stackMethods;

  const FormComponents = {
    PCFNo: ({ ...props }) => (
      <Input
        name="PCF_NO"
        label="PCF No"
        placeholder="Input PCF No"
        required
        {...props}
      />
    ),
    AdditionalFinishedProductsField: ({ ...props }) => (
      <FinishedProductsField {...props} />
    ),
  };

  const handleOnSearchFinishedProduct = useCallback(async (query) => {
    try {
      const result = await getFinishedProducts(query, 'N');
      if (result) {
        return result.map((item, index) => ({
          id: index,
          value: item.ITEM_MASTER_DESCRIPTION,
          label: item.ITEM_MASTER_DESCRIPTION,
          data: item,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }, []);

  const formActions = {
    openRemoveConfirmation: (callback) =>
      addStack({
        title: "Remove Finished Product?",
        description:
          "Please review again because this action cannot be undone.",
        variant: "warning",
        confirmText: "Confirm",
        onCancel: () => closeStack(),
        onConfirm: () => {
          callback();
          closeStack();
        },
      }),
  };

  const generatePreviewTable = (data, type = "preview") => {
    return (
      <div className="bg-gray-100 p-4 rounded-md flex flex-col gap-2">
        <Info label="PCF No" value={data.PCF_NO} />
        <Info
          label="Finished Product(s)"
          value={
            <>
              <div className="grid grid-cols-5 gap-0 bg-white text-left text-sm text-muted-foreground rounded-sm border-l border-r border-t border-gray-300 overflow-hidden font-normal">
                <div className="col-span-5 grid grid-cols-5 bg-gray-50 font-bold">
                  <div className="col-span-2 border-b border-r border-gray-300 py-1 px-2 justify-center items-center text-center">
                    Finished Product
                  </div>
                  <div className="border-b border-r border-gray-300 py-1 px-2 justify-center items-center text-center">
                    Manufacturing Site
                  </div>
                  <div className="border-b border-r border-gray-300 py-1 px-2 justify-center items-center text-center">
                    MA Holder
                  </div>
                  <div className="border-b border-gray-300 py-1 px-2 justify-center items-center text-center">
                    Country
                  </div>
                </div>
                {data.FINISHED_PRODUCTS.map((item, index) => (
                  <Fragment key={index}>
                    <div className="col-span-2 border-r border-b border-gray-300 py-1 px-2 flex items-center text-left ">
                      {item.FINISHED_PRODUCT}
                    </div>
                    <div className="border-r border-b border-gray-300 py-1 px-2 flex justify-center items-center text-center">
                      {item.MANUFACTURING_SITE}
                    </div>
                    <div className="border-r border-b border-gray-300 py-1 px-2 flex justify-center items-center text-center">
                      {item.MARKETING_AUTHORIZATION_HOLDER_NAME}
                    </div>
                    <div className="border-b border-gray-300 py-1 px-2 flex justify-center items-center text-center">
                      {item.COUNTRY}
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          }
        />
        {type === "success" && (
          <Fragment>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-2">
              <Info label="Task Source" value="Innolife PLM" />
              <Info
                label="Created Date"
                value={dayjs().format("DD MMM YYYY")}
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  };

  const handleOnSubmit = async (data) =>
    addStack({
      size: "3xl",
      title: "Save New Task?",
      description: "Please review again because this action cannot be undone.",
      variant: "warning",
      content: generatePreviewTable(data),
      confirmText: (
        <div className="flex items-center gap-2">
          Confirm
          <SendHorizontal className="size-4" />
        </div>
      ),
      onCancel: () => closeStack(),
      onConfirm: async () => {
        try {
          await onSubmitNewTask({
            PCF_NO: data.PCF_NO,
            FINISHED_PRODUCTS: data.FINISHED_PRODUCTS.map((item) => ({
              ITEM_MASTER_ID: item.ITEM_MASTER_ID,
              MANUFACTURING_SITE: item.MANUFACTURING_SITE,
            })),
          });
          onRefetch();
          clearStacks();

          addStack({
            size: "3xl",
            title: "Successfully Add New Task",
            description:
              "Well done! The MA has now been assigned to the RA PIC.",
            variant: "success",
            content: generatePreviewTable(data, "success"),
            footer: (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => closeStack()}
              >
                Back to List New Task
              </Button>
            ),
          });
        } catch (error) {
          console.log("Error submitting new task:", error.response.data);
        }
      },
    });

  return (
    <Form
      defaultValues={newTaskDefaultValues}
      validation={newTaskSchema}
      onSubmit={handleOnSubmit}
    >
      <FormComponents.PCFNo />
      <FormComponents.AdditionalFinishedProductsField
        actions={formActions}
        handlers={{
          onSearchFinishedProduct: handleOnSearchFinishedProduct,
        }}
      />
      <Separator className="my-4" />
      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          color="tertiary"
          onClick={() => closeStack()}
        >
          Cancel
        </Button>
        <Button type="submit" color="primary" disabled={isLoading}>
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default AddNewTaskForm;
