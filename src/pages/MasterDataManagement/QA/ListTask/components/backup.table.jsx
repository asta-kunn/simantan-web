import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";


const data = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",    
        company: "Company A",
        city: "New York",
        country: "USA"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "0987654321",
        company: "Company B",
        city: "Los Angeles",
        country: "USA"
    },
]   

const QATableList = () => {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
    <ScrollArea className="w-full overflow-auto">
      <div className="relative min-w-[1000px]">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="sticky left-0 bg-gray-100 z-20 border-r shadow-md">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="sticky right-0 bg-gray-100 z-20 border-l shadow-md">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="sticky left-0 bg-white z-10 border-r shadow-md">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.city}</TableCell>
                  <TableCell>{item.country}</TableCell>
                  <TableCell className="sticky right-0 bg-white z-10 border-l shadow-md">
                    <button className="text-primary-normal-500 hover:underline">Delete</button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <AlertCircle className="w-6 h-6" />
                    <p className="text-sm font-medium">No data found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  </div>
  );
};

export default QATableList;
