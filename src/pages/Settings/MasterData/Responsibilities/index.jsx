import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Dialog,
  Form,
  Input,
  Select,
  Table,
  ConfirmationModal,
  Info,
} from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { z } from "zod";
import { useGetResponsibilities, usePostResponsibilities, usePutResponsibilities, useDeleteResponsibilities } from "../hooks/useResponsibilities";

const Responsibilities = () => {
  const { addStack, clearStacks } = useUIStore();
  const [selectedResponsibilities, setSelectedResponsibilities] = useState(null);

  const { data: responsibilitiesData, isLoading, error, refetch } = useGetResponsibilities();
  const { postResponsibilities, isLoadingPostResponsibilities } = usePostResponsibilities();
  const { putResponsibilities, isLoadingPutResponsibilities } = usePutResponsibilities();
  const { deleteResponsibilities, isLoadingDeleteResponsibilities } = useDeleteResponsibilities(selectedResponsibilities?.id);

  // Transform data to match table structure
  const data = useMemo(() => {
    if (!responsibilitiesData) return [];
    return responsibilitiesData.map(item => ({
      id: item.ID,
      role_code: item.ROLE_CODE,
      department_codes: item.DEPARTMENT_CODES,
      menu_id: item.MENU_ID,
      ordinal: item.ORDINAL,
      created_at: item.CREATED_AT,
      created_by: item.CREATED_BY
    }));
  }, [responsibilitiesData]);

  const onEdit = (responsibility) => {
    handleEdit(responsibility);
  };

  const onDelete = (responsibility) => {
    setSelectedResponsibilities(responsibility);
    addStack({
      title: "Delete Responsibility",
      description: "Are you sure you want to delete this responsibility?",
      variant: "warning",
      content: (
        <div className="max-h-[30vh] overflow-y-auto space-y-4">
          <div className="bg-tertiary-soft p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Role Code</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {responsibility.role_code}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Department Codes</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {responsibility.department_codes}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Menu ID</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {responsibility.menu_id}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      onCancel: () => {
        clearStacks();
      },
      onConfirm: async () => {
        try {
          await deleteResponsibilities();
          clearStacks();
          refetch();
          
          addStack({
            title: "Successfully Deleted",
            description: "The responsibility has been deleted successfully.",
            variant: "success",
            onConfirm: () => {
              clearStacks();
            }
          });
        } catch (error) {
          console.error("Failed to delete responsibility:", error);
          
          addStack({
            title: "Error",
            description: "Failed to delete responsibility. Please try again.",
            variant: "error",
            onConfirm: () => {
              clearStacks(); 
            }
          });
        }
      }
    });
  };

  const columns = useMemo(() => ([
    {
      id: "role_code",
      header: "Role Code",
      accessorKey: "role_code",
    },
    {
      id: "department_codes", 
      header: "Department Codes",
      accessorKey: "department_codes",
    },
    {
      id: "menu_id",
      header: "Menu ID",
      accessorKey: "menu_id",
    },
    {
      id: "ordinal",
      header: "Ordinal",
      accessorKey: "ordinal",
    },
  ]), []);

  const actions = useMemo(() => [
    {
      label: "Edit",
      onClick: onEdit,
      buttonVariant: "outline",
    },
    {
      label: "Delete",
      onClick: onDelete,
      buttonVariant: "destructive", 
    },
  ], []);

  const handleCreate = () => {
    addStack({
      title: "Add New Responsibilities",
      description: "Please fill in the form below to add a new responsibilities.",
      content: (
        <Form
          validation={z.object({
            role_code: z.string().min(1, { message: "Role Code is required" }),
            department_codes: z.string().min(1, { message: "Department Codes is required" }), 
            menu_id: z.string().min(1, { message: "Menu ID is required" }),
            ordinal: z.string().min(1, { message: "Ordinal is required" })
          })}
          defaultValues={{
            role_code: "",
            department_codes: "",
            menu_id: "",
            ordinal: ""
          }}
          onSubmit={async (values) => {
            try {
              await postResponsibilities(values);
              clearStacks();
              refetch();
              
              addStack({
                title: "Successfully Created",
                description: "New responsibility has been created successfully.",
                variant: "success",
                onConfirm: () => {
                  clearStacks();
                }
              });
            } catch (error) {
              console.error("Failed to create responsibility:", error);
              
              addStack({
                title: "Error",
                description: "Failed to create responsibility. Please try again.",
                variant: "error",
                onConfirm: () => {
                  clearStacks();
                }
              });
            }
          }}
        >
          <Input name="role_code" label="Role Code" required />
          <Input name="department_codes" label="Department Codes" required />
          <Input name="menu_id" label="Menu ID" required />
          <Input name="ordinal" label="Ordinal" required />
          <div className="border-t border-gray-200 py-4 flex justify-between bg-white">
            <div>
              <Button type="button" variant="outline" onClick={() => clearStacks()}>
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" loading={isLoadingPostResponsibilities}>Create</Button>
            </div>
          </div>
        </Form>
      )
    });
  };

  const handleEdit = (responsibility) => {
    addStack({
      title: "Edit Responsibilities",
      description: "Please fill in the form below to edit the responsibilities.",
      content: (
        <Form
          validation={z.object({
            role_code: z.string().min(1, { message: "Role Code is required" }),
            department_codes: z.string().min(1, { message: "Department Codes is required" }),
            menu_id: z.string().min(1, { message: "Menu ID is required" }),
            ordinal: z.string().min(1, { message: "Ordinal is required" }),
          })}
          defaultValues={{
            role_code: responsibility.role_code,
            department_codes: responsibility.department_codes,
            menu_id: responsibility.menu_id,
            ordinal: responsibility.ordinal
          }}
          onSubmit={async (values) => {
            try {
              await putResponsibilities({
                id: responsibility.id,
                ...values
              });
              clearStacks();
              refetch();
              
              addStack({
                title: "Successfully Updated",
                description: "The responsibility has been updated successfully.",
                variant: "success",
                onConfirm: () => {
                  clearStacks();
                }
              });
            } catch (error) {
              console.error("Failed to update responsibility:", error);
              
              addStack({
                title: "Error",
                description: "Failed to update responsibility. Please try again.",
                variant: "error",
                onConfirm: () => {
                  clearStacks();
                }
              });
            }
          }}
        >
          <Input name="role_code" label="Role Code" required />
          <Input name="department_codes" label="Department Codes" required />
          <Input name="menu_id" label="Menu ID" required />
          <Input name="ordinal" label="Ordinal" required />
          <div className="border-t border-gray-200 py-4 flex justify-between bg-white">
            <div>
              <Button type="button" variant="outline" onClick={() => clearStacks()}>
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" loading={isLoadingPutResponsibilities}>Save Changes</Button>
            </div>
          </div>
        </Form>
      ),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Info
          label="Responsibilities Management"
          labelClassName="font-bold text-black text-xl"
          value={
            <p className="text-muted-foreground font-medium text-sm">
              Manage the responsibilities for the application.
            </p>
          }
        />
        <Button onClick={handleCreate}>Add New Responsibilities</Button>
      </div>

      <Table
        columns={columns}
        data={data}
        isLoading={isLoading}
        actions={actions}
        actionType="dots"
      />
    </div>
  );
};

export default Responsibilities;
