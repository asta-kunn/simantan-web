import { Table } from '@/components/Dexain';

export const ManufactureHistoryTable = ({ data = [] }) => {

  const columns = [
    { id: 'ADDRESS_LINE1', accessorKey: 'ADDRESS_LINE1', header: 'Address Line 1' },
    { id: 'ADDRESS_LINE2', accessorKey: 'ADDRESS_LINE2', header: 'Address Line 2' },
    { id: 'POSTAL_CODE', accessorKey: 'POSTAL_CODE', header: 'Postal Code' },
    { id: 'COUNTRY', accessorKey: 'COUNTRY', header: 'Country' },
  ];

  return <Table columns={columns} data={data} />;
};