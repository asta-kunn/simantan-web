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
import { useFormContext } from "react-hook-form";
import { useGetMenu, usePostMenu, usePutMenu, useDeleteMenu } from "../hooks/useMenu";

// --- Form Content for Creating a Menu ---
const CreateFormContent = ({ menus }) => {
  const { watch } = useFormContext();
  const iconValue = watch("ICON", "icon");

  return (
    <>
      <Input name="NAME" label="Name" required />
      <Input name="URL" label="URL" required />
      <Input 
        name="ICON" 
        label="Icon" 
        required
        prefix={<i className={iconValue} />}
      />
      <Input name="MODULE" label="Module" />
      <Input name="SUBMODULE" label="Submodule" />
      <Select
        name="PARENT_ID"
        label="Parent Module"
        options={menus.filter(menu => menu.IS_DETAIL === 'N').map(menu => ({
          value: menu.MENU_ID,
          label: menu.NAME
        }))}
      />
      <Select 
        name="IS_DETAIL"
        label="Is Detail"
        options={[
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" }
        ]}
      />
    </>
  );
};

// --- Form Content for Editing a Menu ---
const EditFormContent = ({ parentOptions }) => {
  const { watch } = useFormContext();
  const iconValue = watch("ICON");

  return (
    <>
      <Input name="NAME" label="Name" required />
      <Input name="URL" label="URL" required />
      <Input 
        name="ICON" 
        label="Icon" 
        required
        prefix={<i className={iconValue} />}
      />
      <Input name="MODULE" label="Module" />
      <Input name="SUBMODULE" label="Submodule" />
      <Select
        name="PARENT_ID"
        label="Parent Module"
        options={parentOptions}
      />
      <Select 
        name="IS_DETAIL"
        label="Is Detail"
        options={[
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" }
        ]}
      />
    </>
  );
};

const Menu = () => {
  const { addStack, clearStacks } = useUIStore();
  const [selectedMenu, setSelectedMenu] = useState(null);

  const { data: menus, isLoading, error, refetch } = useGetMenu();
  const { postMenu, isLoadingPostMenu } = usePostMenu();
  const { putMenu, isLoadingPutMenu } = usePutMenu();
  const { deleteMenu, isLoadingDeleteMenu, refetchDeleteMenu } = useDeleteMenu(selectedMenu?.MENU_ID);

  const onEdit = (menu) => {
    handleEdit(menu);
  };

  const onDelete = (menu) => {
    setSelectedMenu(menu);
    addStack({
      title: "Delete Menu",
      description: "Are you sure you want to delete this menu?",
      variant: "warning",
      content: (
        <div className="max-h-[30vh] overflow-y-auto space-y-4">
          <div className="bg-tertiary-soft p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Name</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {menu.NAME}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">URL</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {menu.URL}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-400 mb-2">Module</span>
                <div className="font-semibold text-gray-900 text-lg">
                  {menu.MODULE}
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
          await deleteMenu();
          refetch();
          clearStacks();
          
          addStack({
            title: "Successfully Deleted",
            description: "The menu has been deleted successfully.",
            variant: "success",
            onConfirm: clearStacks
          });
        } catch (error) {
          console.error("Failed to delete menu:", error);
          refetchDeleteMenu();
        }
      }
    });
  };

  const columns = useMemo(() => [
    { id: "url", header: "URL", accessorKey: "URL" },
    { 
      id: "submodule", header: "Submodule", 
      accessorKey: "SUBMODULE",
      cell: ({ row }) => row.original.SUBMODULE || '-'
    },
    {
      id: "parent_id",
      header: "Parent Module",
      accessorFn: (row) => {
        const parentMenu = menus?.find(menu => menu.MENU_ID === row.PARENT_ID);
        return parentMenu ? parentMenu.NAME : '-';
      }
    },
    { id: "name", header: "Name", accessorKey: "NAME" },
    { id: "module", header: "Module", accessorKey: "MODULE" },
    { 
      id: "is_detail", 
      header: "Is Detail", 
      accessorKey: "IS_DETAIL", 
      size: "10px",
      cell: ({ row }) => row.original.IS_DETAIL === 'Y' ? 'Yes' : 'No'
    },
    {
      id: "icon",
      header: "Icon",
      accessorKey: "ICON", 
      size: "8px",
      cell: ({ row }) => row.original.ICON ? <i className={`${row.original.ICON}`} /> : '-'
    }
  ], [menus]);

  const actions = useMemo(() => [
    { label: "Edit", onClick: onEdit, buttonVariant: "outline" },
    { label: "Delete", onClick: onDelete, buttonVariant: "destructive" },
  ], [onEdit]);

  const handleCreate = () => {
    addStack({
      title: "Add New Menu",
      description: "Please fill in the form below to add a new menu.",
      content: (
        <Form
          validation={z.object({
            NAME: z.string().min(1, { message: "Name is required" }),
            URL: z.string().min(1, { message: "URL is required" }),
            ICON: z.string().min(1, { message: "Icon is required" }),
            PARENT_ID: z.any().optional(),
            IS_DETAIL: z.any().optional()
          })}
          defaultValues={{
            NAME: "",
            URL: "",
            ICON: "",
            MODULE: "",
            SUBMODULE: "",
            PARENT_ID: "",
            IS_DETAIL: ""
          }}
          onSubmit={async (values) => {
            try {
              await postMenu(values);
              refetch();
              clearStacks();
              
              addStack({
                title: "Successfully Created",
                description: "New menu has been created successfully.",
                variant: "success",
                onConfirm: clearStacks
              });
            } catch (error) {
              console.error("Failed to create menu:", error);
              refetch();
            }
          }}
        >
          <CreateFormContent menus={menus || []} />

          <div className="border-t border-gray-200 py-4 flex justify-between bg-white">
            <Button type="button" variant="outline" onClick={clearStacks}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoadingPostMenu}>Create</Button>
          </div>
        </Form>
      )
    });
  };

  const handleEdit = (menu) => {
    const parentOptions = menus
        ?.filter(m => m.IS_DETAIL === 'N' && m.MENU_ID !== menu.MENU_ID)
        .map(m => ({
            value: m.MENU_ID,
            label: m.NAME
        })) || [];

    addStack({
      title: "Edit Menu",
      description: "Please fill in the form below to edit the menu.",
      content: (
        <Form
          validation={z.object({
            NAME: z.string().min(1, { message: "Name is required" }),
            URL: z.string().min(1, { message: "URL is required" }),
            ICON: z.string().min(1, { message: "Icon is required" }),
            PARENT_ID: z.any().optional(),
            IS_DETAIL: z.any().optional()
          })}
          defaultValues={{
            NAME: menu.NAME,
            URL: menu.URL,
            ICON: menu.ICON,
            MODULE: menu.MODULE,
            SUBMODULE: menu.SUBMODULE,
            PARENT_ID: menu.PARENT_ID,
            IS_DETAIL: menu.IS_DETAIL
          }}
          onSubmit={async (values) => {
            try {
              await putMenu({ ID: menu.MENU_ID, ...values });
              refetch();
              clearStacks();
              
              addStack({
                title: "Successfully Updated",
                description: "The menu has been updated successfully.",
                variant: "success",
                onConfirm: clearStacks
              });
            } catch (error) {
              console.error("Failed to update menu:", error);
              // refetch
              refetch();
            }
          }}
        >
          <EditFormContent parentOptions={parentOptions} />

          <div className="border-t border-gray-200 py-4 flex justify-between bg-white">
            <Button type="button" variant="outline" onClick={clearStacks}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoadingPutMenu}>Save Changes</Button>
          </div>
        </Form>
      ),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Info
          label="Menu Management"
          labelClassName="font-bold text-black text-xl"
          value={
            <p className="text-muted-foreground font-medium text-sm">
              Manage the menu structure for the application.
            </p>
          }
        />
        <Button onClick={handleCreate}>Add New Menu</Button>
      </div>

      <Table
        columns={columns}
        data={menus || []}
        isLoading={isLoading}
        actions={actions}
        actionType="dots"
      />
    </div>
  );
};

export default Menu;