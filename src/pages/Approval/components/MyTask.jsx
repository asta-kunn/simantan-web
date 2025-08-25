import React, { useState } from "react";
import { Tabs, Table } from "@/components/Dexain";
import { motion } from "framer-motion";

const MyTask = () => {
  const data = [
    {
      id: 1,
      taskName: "Review Project Proposal",
      requestedBy: "John Smith",
      status: "Pending",
      priority: "High",
      dueDate: "2024-02-15",
      type: "Document Review"
    },
    {
      id: 2,
      taskName: "Approve Budget Request",
      requestedBy: "Sarah Johnson",
      status: "In Progress",
      priority: "Medium",
      dueDate: "2024-02-16",
      type: "Financial"
    },
    {
      id: 3,
      taskName: "Sign Contract",
      requestedBy: "Mike Wilson",
      status: "Pending",
      priority: "High",
      dueDate: "2024-02-14",
      type: "Legal"
    },
    {
      id: 4,
      taskName: "Review Leave Request",
      requestedBy: "Emily Davis",
      status: "In Progress",
      priority: "Low",
      dueDate: "2024-02-17",
      type: "HR"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Tabs
        variant="normal"
        tabs={[
          {
            label: "All Tasks",
            value: "all",
            content: (
              <Table
                columns={[
                  {
                    accessorKey: "id",
                    header: "ID",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "taskName",
                    header: "Task Name",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "requestedBy",
                    header: "Requested By",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "status",
                    header: "Status",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "priority",
                    header: "Priority",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "dueDate",
                    header: "Due Date",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "type",
                    header: "Type",
                    enableSorting: true,
                  }
                ]}
                data={data}
                pagination={true}
                pageSize={10}
                searchable={true}
                onRowClick={(row) => console.log("Clicked row:", row)}
                actions={[
                  { label: "Approve", onClick: (data) => console.log("Approve clicked", data) },
                  { label: "Reject", onClick: (data) => console.log("Reject clicked", data) },
                  { label: "View Details", onClick: (data) => console.log("View clicked", data) }
                ]}
              />
            ),
          },
          {
            label: "Pending",
            value: "pending",
            content: (
              <Table
                columns={[
                  {
                    accessorKey: "id",
                    header: "ID",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "taskName",
                    header: "Task Name",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "requestedBy",
                    header: "Requested By",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "priority",
                    header: "Priority",
                    enableSorting: true,
                  },
                  {
                    accessorKey: "dueDate",
                    header: "Due Date",
                    enableSorting: true,
                  }
                ]}
                data={data.filter(task => task.status === "Pending")}
                pagination={true}
                pageSize={10}
                searchable={true}
                onRowClick={(row) => console.log("Clicked row:", row)}
                actions={[
                  { label: "Approve", onClick: (data) => console.log("Approve clicked", data) },
                  { label: "Reject", onClick: (data) => console.log("Reject clicked", data) }
                ]}
              />
            ),
          }
        ]}
      />
    </motion.div>
  );
};

export default MyTask;
