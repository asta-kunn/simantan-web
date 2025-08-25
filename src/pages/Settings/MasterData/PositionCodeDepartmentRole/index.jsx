import { useState, useEffect, useMemo } from "react";
import { Button, Form, Select, Table, Info } from "@/components/Dexain";
import { useUIStore } from "@/stores/uiStore";
import { z } from "zod";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PositionCodeDepartmentRole = () => {
  const navigate = useNavigate();

  const { addStack } = useUIStore();

  const handleCreate = () => {
    addStack({
      size: "3xl",
      title: "Add New Mapping Position Code",
      description:
        "Please fill in the form below to add a new mapping position code.",
      content: (
        <Form
          validation={z.object({
            name: z.string().min(1, { message: "Name is required" }),
            path: z.string().min(1, { message: "Path is required" }),
            icon: z.string().min(1, { message: "Icon is required" }),
          })}
          defaultValues={{
            name: "",
            path: "",
            icon: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <div className="flex item-center justify-between space-x-2">
            <div className="flex flex-col w-full">
              <Select
                name="POSITION_CODE"
                label="Position Title"
                options={[
                  {
                    label: "Junior Software Engineer",
                    value: "Junior Software Engineer",
                    preview: (
                      <div key="Junior Software Engineer">
                        <div className="font-semibold text-md">
                          Junior Software Engineer
                        </div>
                        <div className="text-sm text-primary-normal">
                          Christian Joy Samuel Tanadi
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Software Engineer Level 1",
                    value: "Software Engineer Level 1",
                  },
                  {
                    label: "Software Engineer Level 2",
                    value: "Software Engineer Level 2",
                  },
                  {
                    label: "Senior Software Engineer",
                    value: "Senior Software Engineer",
                  },
                ]}
              />
            </div>
            <div className="flex flex-col w-full">
              <Select name="DEPARTMENT_CODE" label="Department" options={[]} />
            </div>
          </div>

          <Select
            name="DEPARTMENT_CODE_INNOLIFE"
            label="Department Code (Innolife)"
            options={[]}
          />
          <Select name="ROLE_CODE" label="Role Name" options={[]} />
          <Button className="mt-4 w-full" type="submit">
            Submit
          </Button>
        </Form>
      ),
    });
  };

  const handleEdit = (menu) => {
    setFormMode("edit");
    setSelectedMenu(menu);
    setIsDialogOpen(true);
  };

  const handleDelete = (menu) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Replace with actual API call
      console.log(`Deleting menu with ID: ${selectedMenu.id}`);
      // After successful deletion, refresh the list
      setMenus(menus.filter((menu) => menu.id !== selectedMenu.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  const columns = [
    {
      id: "DEPARTMENT_CODE",
      header: "Department Code (Kappabel)",
      accessorKey: "DEPARTMENT_CODE",
    },
    {
      id: "POSITION_CODE",
      header: "Position Code (Kappabel)",
      accessorKey: "POSITION_CODE",
    },
    {
      id: "DEPARTMENT_CODE",
      header: "Department Innolife",
      accessorKey: "DEPARTMENT_CODE",
    },
    {
      id: "ROLE_NAME",
      header: "Role Name",
      accessorKey: "ROLE_NAME",
    },
  ];

  const actions = useMemo(() => [
    {
      label: "Edit",
      onClick: handleEdit,
      buttonVariant: "outline",
    },
    {
      label: "Delete",
      onClick: handleDelete,
      buttonVariant: "destructive",
    },
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-3">
          <Button
            className="px-2"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Info
            label="Position Code to Department and Roles"
            labelClassName="font-bold text-black text-xl"
            value={
              <p className="text-muted-foreground font-medium text-sm">
                Mapping position code from Kappabel to Role and Department, so
                user that have position code can have role and department on
                login to the system
              </p>
            }
          />
        </div>
        <Button onClick={handleCreate}>Add New Position Code</Button>
      </div>

      <Table columns={columns} data={[]} actions={actions} actionType="dots" />
    </div>
  );
};

export default PositionCodeDepartmentRole;
