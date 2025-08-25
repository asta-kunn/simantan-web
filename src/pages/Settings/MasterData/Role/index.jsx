import { useState, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  Table,
  Info,
} from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { z } from "zod";
import { useGetRole, usePostRole, usePutRole, useDeleteRole } from "../hooks/useRole";

const Role = () => {
  const { addStack, clearStacks } = useUIStore();
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: roles, isLoading, refetch } = useGetRole();
  const { postRole, isLoadingPostRole } = usePostRole();
  const { putRole, isLoadingPutRole } = usePutRole();
  const { deleteRole, isLoadingDeleteRole } = useDeleteRole(selectedRole?.ROLE_ID);

  const onEdit = (role) => {
    handleEdit(role);
  };

  const onDelete = (role) => {
    setSelectedRole(role);
    addStack({
      title: "Delete Role",
      description: "Are you sure you want to delete this role?",
      variant: "warning",
      content: (
        <div className="max-h-[30vh] overflow-y-auto space-y-4">
          <div className="bg-tertiary-soft p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Role Code</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {role.ROLE_CODE}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Role Name</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {role.ROLE_NAME}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Description</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {role.ROLE_DESCRIPTION || '-'}
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
          await deleteRole();
          clearStacks();
          
          addStack({
            title: "Successfully Deleted",
            description: "The role has been deleted successfully.",
            variant: "success",
            onConfirm: clearStacks
          });
        } catch (error) {
          console.error("Failed to delete role:", error);
          refetch();
          clearStacks();
        }
      }
    });
  };

  const columns = useMemo(() => [
    {
      id: "role_code",
      header: "Role Code", 
      accessorKey: "ROLE_CODE",
    },
    {
      id: "role_name",
      header: "Role Name",
      accessorKey: "ROLE_NAME",
    },
    {
      id: "role_description",
      header: "Description",
      accessorKey: "ROLE_DESCRIPTION", 
      cell: ({ row }) => row.original.ROLE_DESCRIPTION || '-'
    }
  ], []);

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
      title: "Add New Role",
      description: "Please fill in the form below to add a new role.",
      content: (
        <Form
          validation={z.object({
            ROLE_CODE: z.string().min(1, { message: "Role Code is required" }),
            ROLE_NAME: z.string().min(1, { message: "Role Name is required" }),
            ROLE_DESCRIPTION: z.string().optional()
          })}
          defaultValues={{
            ROLE_CODE: "",
            ROLE_NAME: "",
            ROLE_DESCRIPTION: ""
          }}
          onSubmit={async (values) => {
            try {
              await postRole(values);
              refetch();
              clearStacks();
              
              addStack({
                title: "Successfully Created",
                description: "New role has been created successfully.",
                variant: "success",
                onConfirm: clearStacks
              });
            } catch (error) {
              console.error("Failed to create role:", error);
              refetch();
              clearStacks();
            }
          }}
        >
          <Input name="ROLE_CODE" label="Role Code" required />
          <Input name="ROLE_NAME" label="Role Name" required />
          <Input name="ROLE_DESCRIPTION" label="Description" />
          <div className="border-t border-gray-200 py-4 flex justify-between bg-white">
            <div>
              <Button type="button" variant="outline" onClick={() => clearStacks()}>
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" loading={isLoadingPostRole}>Create</Button>
            </div>
          </div>
        </Form>
      )
    });
  };

  const handleEdit = (role) => {
    addStack({
      title: "Edit Role",
      description: "Please fill in the form below to edit the role.",
      content: (
        <Form
          validation={z.object({
            ROLE_CODE: z.string().min(1, { message: "Role Code is required" }),
            ROLE_NAME: z.string().min(1, { message: "Role Name is required" }),
            ROLE_DESCRIPTION: z.string().optional()
          })}
          defaultValues={{
            ROLE_CODE: role.ROLE_CODE,
            ROLE_NAME: role.ROLE_NAME,
            ROLE_DESCRIPTION: role.ROLE_DESCRIPTION
          }}
          onSubmit={async (values) => {
            try {
              await putRole({ ID: role.ROLE_ID, ...values });
              refetch();
              clearStacks();
              
              addStack({
                title: "Successfully Updated",
                description: "The role has been updated successfully.",
                variant: "success",
                onConfirm: clearStacks
              });
            } catch (error) {
              console.error("Failed to update role:", error);
              refetch();
              clearStacks();
            }
          }}
        >
          <Input name="ROLE_CODE" label="Role Code" required />
          <Input name="ROLE_NAME" label="Role Name" required />
          <Input name="ROLE_DESCRIPTION" label="Description" />
          <div className="border-t border-gray-200 py-4 flex justify-between bg-white">
            <div>
              <Button type="button" variant="outline" onClick={() => clearStacks()}>
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" loading={isLoadingPutRole}>Save Changes</Button>
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
          label="Role Management"
          labelClassName="font-bold text-black text-xl"
          value={
            <p className="text-muted-foreground font-medium text-sm">
              Manage the roles for the application.
            </p>
          }
        />
        <Button onClick={handleCreate}>Add New Role</Button>
      </div>

      <Table
        columns={columns}
        data={roles || []}
        isLoading={isLoading}
        actions={actions}
        actionType="dots"
      />
    </div>
  );
};

export default Role;