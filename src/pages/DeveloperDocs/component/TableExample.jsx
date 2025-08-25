import React, { useState } from 'react';
import { Table } from '@/components/Dexain';
import { ComponentExample } from './ComponentExample';
import dayjs from "dayjs";
import { Pencil, Trash, Eye } from 'lucide-react';

const TableExample = () => {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filter, setFilter] = useState("");

  // Sample data
  const [data] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2023-01-15T08:30:00' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Inactive', joinDate: '2023-02-20T10:15:00' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Active', joinDate: '2023-03-10T14:45:00' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Admin', status: 'Active', joinDate: '2023-04-05T09:20:00' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Editor', status: 'Pending', joinDate: '2023-05-12T11:30:00' },
  ]);

  // Define columns
  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'role', accessorKey: 'role', header: 'Role' },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let bgColor = '';
        switch (status) {
          case 'Active':
            bgColor = 'bg-green-100 text-green-800';
            break;
          case 'Inactive':
            bgColor = 'bg-gray-100 text-gray-800';
            break;
          case 'Pending':
            bgColor = 'bg-yellow-100 text-yellow-800';
            break;
          default:
            bgColor = 'bg-blue-100 text-blue-800';
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'joinDate',
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: ({ row }) => dayjs(row.original.joinDate).format('DD MMMM YYYY')
    },
  ];

  // Define filterable columns
  const filterableColumns = [
    { id: 'name', type: 'text' },
    { id: 'email', type: 'checkbox', options: ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com', 'charlie@example.com'] },
    { id: 'role', type: 'select', options: ['Admin', 'Editor', 'Viewer'] },
    { id: 'status', type: 'select', options: ['Active', 'Inactive', 'Pending'] },
    { id: 'joinDate', type: 'date' }
  ];

  // Define row actions
  const actions = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (rowData) => console.log('View', rowData)
    },
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (rowData) => console.log('Edit', rowData)
    },
    {
      label: 'Delete',
      icon: <Trash className="h-4 w-4" />,
      onClick: (rowData) => console.log('Delete', rowData)
    }
  ];

  // Handle row selection
  const handleRowCheck = (rows) => {
    console.log('Selected rows:', rows);
  };

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Function to filter data
  const filteredData = data.filter(item =>
    Object.values(item).some(
      value => typeof value === 'string' && value.toLowerCase().includes(filter.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  const basicTableCode = `import { Table } from '@/components/Dexain';

// Basic table with data and columns
const BasicTable = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // More data rows...
  ];

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
  ];

  return <Table columns={columns} data={data} />;
};`;

  const advancedTableCode = `import { Table } from '@/components/Dexain';
import dayjs from 'dayjs';
import { Pencil, Trash, Eye } from 'lucide-react';

const AdvancedTable = () => {
  const data = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'Admin', 
      status: 'Active', 
      joinDate: '2023-01-15T08:30:00' 
    },
    // More data rows...
  ];

  // Define columns with custom cell rendering
  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'email', accessorKey: 'email', header: 'Email' },
    { id: 'role', accessorKey: 'role', header: 'Role' },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let bgColor = '';
        switch (status) {
          case 'Active':
            bgColor = 'bg-green-100 text-green-800';
            break;
          case 'Inactive':
            bgColor = 'bg-gray-100 text-gray-800';
            break;
          case 'Pending':
            bgColor = 'bg-yellow-100 text-yellow-800';
            break;
          default:
            bgColor = 'bg-blue-100 text-blue-800';
        }
        return (
          <span className={\`px-2 py-1 rounded-full text-xs font-medium \${bgColor}\`}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'joinDate',
      accessorKey: 'joinDate',
      header: 'Join Date',
      cell: ({ row }) => dayjs(row.original.joinDate).format('DD MMMM YYYY')
    },
  ];

  // Define filterable columns
  const filterableColumns = [
    { id: 'name', type: 'text' },
    { id: 'email', type: 'checkbox', options: ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com', 'charlie@example.com'] },
    { id: 'role', type: 'select', options: ['Admin', 'Editor', 'Viewer'] },
    { id: 'status', type: 'select', options: ['Active', 'Inactive', 'Pending'] },
    { id: 'joinDate', type: 'date' }
  ];

  // Define row actions
  const actions = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (rowData) => console.log('View', rowData)
    },
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (rowData) => console.log('Edit', rowData)
    },
    {
      label: 'Delete',
      icon: <Trash className="h-4 w-4" />,
      onClick: (rowData) => console.log('Delete', rowData)
    }
  ];

  // Handle row selection
  const handleRowCheck = (rows) => {
    console.log('Selected rows:', rows);
  };

  return (
    <Table 
      columns={columns} 
      data={data}
      filterableColumns={filterableColumns}
      actions={actions}
      searchable={true}
      pagination={true}
      pageSize={10}
      onRowCheck={handleRowCheck}
      actionType="dots"
      actionHeader="Actions"
    />
  );
};`;

  return (
    <>
      <div className="space-y-2 mb-2">
        <h2 className="text-2xl font-bold mb-0">Table</h2>
        <i className="text-gray-400 text-lg">
          A powerful data table component with sorting, filtering, pagination, and row actions.
        </i>
      </div>

      <div className="space-y-4">
        {/* Basic Table */}
        <ComponentExample
          title="Basic Table"
          description="Simple table with minimal configuration"
          code={basicTableCode}
        >
          <div className="w-full overflow-auto">
            <Table
              columns={columns.slice(0, 2)}
              data={data}
              searchable={false}
              pagination={false}
            />
          </div>
        </ComponentExample>

        {/* Advanced Table */}
        <ComponentExample
          title="Advanced Table"
          description="Full-featured table with filtering, sorting, pagination, and row actions"
          code={advancedTableCode}
        >
          <div className="w-full overflow-auto">
            <Table
              columns={columns}
              data={data}
              filterableColumns={filterableColumns}
              actions={actions}
              searchable={true}
              pagination={true}
              pageSize={5}
              onRowCheck={handleRowCheck}
              actionType="dots"
              actionHeader="Actions"
            />
          </div>
        </ComponentExample>

        {/* Table Props */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Table Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">columns</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">array</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Column configuration with accessorKey, header, and cell renderer</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">data</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">array</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Array of data objects to display in the table</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">filterableColumns</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">array</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Columns that can be filtered, with type (text, select, checkbox, date, datetime)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">actions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">array</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">[]</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Row actions with label, icon, and onClick handler</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">searchable</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">true</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether to show the global search input</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">pagination</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">boolean</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">true</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Whether to enable pagination</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">pageSize</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Number of rows per page</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onRowClick</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Callback when a row is clicked</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">onRowCheck</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Callback when rows are selected, enables row checkboxes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">actionType</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"dots" | "button" | "none"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"dots"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Type of action display (dots menu, button, or none)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">actionHeader</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Actions"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Header text for the actions column</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">actionVariant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"button" | "icon"</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"button"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Variant of action display when actionType is "button"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">headerSize</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"md"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Size of the table header text</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">bodySize</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"md"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Size of the table body text</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">bodyAlign</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"left"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Alignment of the table body text</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">bodyVariant</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"default"</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Variant of the table body text</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">getCaption</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">function</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">undefined</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Function to get custom caption for the table</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Sorting</h4>
              <p className="text-sm text-gray-600">Enable column sorting by clicking on column headers. Supports ascending and descending order.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Filtering</h4>
              <p className="text-sm text-gray-600">Filter data by column with support for text, select, checkbox, date, and datetime filters.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Pagination</h4>
              <p className="text-sm text-gray-600">Navigate through large datasets with customizable page size and navigation controls.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Row Actions</h4>
              <p className="text-sm text-gray-600">Add custom actions to each row with support for dots menu or button display.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Row Selection</h4>
              <p className="text-sm text-gray-600">Enable row selection with checkboxes and handle selected rows with callbacks.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Search</h4>
              <p className="text-sm text-gray-600">Search across all columns with a search input.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableExample; 