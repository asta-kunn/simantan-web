import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, Filter, Search, ArrowDownAZ, ArrowUpZA, ArrowDownUp } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { TablePagination } from "@/components/fields/Table/components/TablePagination";

const PopoverFilter = ({ dataList, filterValue, setFilterValue, name }) => {
    const [filteredData, setFilteredData] = useState(dataList);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setFilteredData(dataList.filter(item =>
            item.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search]);

    const handleCheckboxChange = (checked, item) => {
        if (checked === false) {
            filterValue[name] = filterValue[name].filter(manufacture => manufacture !== item);
        } else {
            filterValue[name].push(item);
        }
        setFilterValue(filterValue);
    };

    const handleClear = () => {
        setFilterValue({ ...filterValue, [name]: [] });
        filteredData.forEach(item => {
            if (filterValue[name].includes(item)) {
                filterValue[name] = filterValue[name].filter(manufacture => manufacture !== item);
            }
        });
        setFilterValue(filterValue);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <Filter className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <Search className="w-3 h-3" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search"
                        className="w-full outline-none text-base"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    {filteredData.map((item, index) => (
                        <div className="p-2 flex items-center gap-2" key={index}>
                            <Checkbox
                                checked={filterValue[name].includes(item)}
                                className="data-[state=checked]:bg-[#B32017]"
                                onCheckedChange={(checked) => handleCheckboxChange(checked, item)}
                            />
                            <span className="text-sm font-semibold">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="p-2">
                    <Button
                        variant="outline"
                        className="w-full h-8"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const PopoverSearch = ({ filterValue, setFilterValue, name }) => {
    const [search, setSearch] = useState("");

    const handleSearch = () => {
        setFilterValue({ ...filterValue, [name]: search });
    };

    const handleClear = () => {
        setSearch("");
        setFilterValue({ ...filterValue, [name]: "" });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <Filter className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2 border-stone-100 border border-slate-100 p-2 rounded-md">
                    <Search className="w-3 h-3" />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search"
                        className="w-full outline-none text-base"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 flex-row justify-between">
                    <Button className="w-full h-8" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button variant="outline" className="w-full h-8" onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export function TableContainer({
    data,
    onView,
    filterValue,
    setFilterValue =  () => {},
    handleLastPage,
    handleFirstPage,
    pagination,
    previousPage,
    nextPage,
    loading = false
}) {
    const [sorting, setSorting] = React.useState([]);
    const [dataTable, setDataTable] = useState(data);
    const [filterChild] = useState({ ...filterValue });
    const debouncedFilterValue = useDebounce(filterChild, 1000);

    useEffect(() => {
        setFilterValue({ ...filterChild });
    }, [debouncedFilterValue]);

    useEffect(() => {
        setDataTable(data);
    }, [data]);

    const columns = React.useMemo(() => [
        {
            id: 'index',
            header: '#',
        },
        {
            accessorKey: 'MANUFACTURE_CODE',
            header: 'Manufacturer'
        },
        {
            accessorKey: 'FINISHED_PRODUCT',
            header: 'Finished Product'
        },
        {
            accessorKey: 'AVL_FORMULA_VERSION',
            header: 'AVL Version',
        },
        {
            accessorKey: 'MANUFACTURING_SITE',
            header: 'Manufacturing Site'
        },
        {
            accessorKey: 'MATERIAL_ITEM',
            header: 'Material Item',
        },
        {
            accessorKey: 'TYPE',
            header: 'Type',
        },
        {
            accessorKey: 'REQUESTOR',
            header: 'Requestor',
        },
        {
            accessorKey: 'EFFECTIVE_DATE',
            header: 'Effective Date',
            cell: ({ getValue }) => formatDate(getValue()),
        },
        {
            accessorKey: 'STATUS',
            header: 'Status',
        },
    ], []);

    const table = useReactTable({
        data: dataTable || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getCanSort: (column) => column.sortable
    });

    const conditionStatus = (status) => {
        const statusStyles = {
            'Draft': 'text-gray-500',
            'Waiting Approval Manager': 'text-[#f1c40f]',
            'Waiting Approval QA Officer': 'text-[#00b894]',
            'Waiting Approval QA Manager': 'text-[#2ecc71]',
            'Approved': 'text-[#2ecc71]',
            'Rejected': 'text-[#d63031]'
        };

        return (
            <span className={`text-sm font-medium ${statusStyles[status] || ''}`}>
                {status}
            </span>
        );
    };

    const renderTableHeader = () => (
        <TableHeader className="bg-[#E9EEF5]">
            <TableRow>
                {table.getHeaderGroups().map((headerGroup) => (
                    headerGroup.headers.map((header, childIndex) => (
                        <TableCell
                            key={childIndex}
                            className={`select-none
                                ${header.column.id === 'index' ? 'sticky left-0 bg-[#E9EEF5] z-10 w-16 min-w-16' : ''}
                                ${header.column.id === 'MANUFACTURE_CODE' ? 'sticky left-16 bg-[#E9EEF5] z-10 w-48 min-w-48' : ''}
                            `}
                        >
                            <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {header.column.getCanSort() && header.column.columnDef.sortable !== false && (
                                    <>
                                        {header.column.getIsSorted() === 'asc' && (
                                            <ArrowDownAZ className="ml-1 h-3 w-3 text-primary-normal-600" />
                                        )}
                                        {header.column.getIsSorted() === 'desc' && (
                                            <ArrowUpZA className="ml-1 h-3 w-3 text-primary-normal-600" />
                                        )}
                                        {header.column.getIsSorted() === false && (
                                            <ArrowDownUp className="ml-1 h-3 w-3 text-gray-400" />
                                        )}
                                    </>
                                )}
                            </div>
                        </TableCell>
                    ))
                ))}
                {data && data.length > 0 && (
                    <TableCell className="sticky right-0 bg-[#E9EEF5] z-10 w-[100px] min-w-[50px]">
                        View
                    </TableCell>
                )}
            </TableRow>
        </TableHeader>
    );

    const renderTableBody = () => (
        <TableBody>
            {loading ? (
                <TableRow key="loading" >
                    <TableCell colSpan={12}>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full h-8 bg-slate-100 animate-pulse rounded" />
                            ))}
                        </div>
                    </TableCell>
                </TableRow>
            ) : (
                (data && data.length > 0) ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="sticky left-0 bg-white z-10 w-10 min-w-10">
                                {row.index + 1}
                            </TableCell>
                            <TableCell className="sticky left-16 bg-white z-8 w-32 min-w-32">
                                <p className="text-sm font-semibold">{row.original.MANUFACTURE_CODE}</p>
                                <p className="text-xs font-normal text-stone-500">{row.original.MANUFACTURE_NAME}</p>
                            </TableCell>
                            <TableCell className="w-[16vw] min-w-[16vw]">
                                <p className="text-sm font-semibold">{row.original.ITEM_FG_NUMBER}</p>
                                <p className="text-xs font-normal text-stone-500">{row.original.ITEM_FG_DESCRIPTION}</p>
                            </TableCell>
                            <TableCell className="w-[8vw] min-w-[8vw]">
                                V.{row.original.AVL_VERSION}
                            </TableCell>
                            <TableCell className="w-[200px] min-w-[200px]">
                                {row.original.MANUFACTURING_SITE}
                            </TableCell>
                            <TableCell className="w-[150px] min-w-[150px]">
                                <p className="text-sm font-semibold">{row.original.ITEM_RM_NUMBER}</p>
                                <p className="text-xs font-normal text-stone-500">{row.original.ITEM_RM_DESCRIPTION}</p>
                            </TableCell>
                            <TableCell className="w-[150px] min-w-[150px]">
                                {row.original.ACTION_TYPE}
                            </TableCell>
                            <TableCell className="w-[150px] min-w-[160px]">
                                {row.original.REQUESTOR}
                            </TableCell>
                            <TableCell className="w-[150px] min-w-[160px]">
                                {formatTime(row.original.EFFECTIVE_DATE)}
                            </TableCell>
                            <TableCell className="w-[150px] min-w-[160px]">
                                {conditionStatus(row.original.STATUS)}
                            </TableCell>
                            <TableCell className="sticky right-0 bg-white z-10 w-[50px] min-w-[50px]">
                                <button
                                    className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                    onClick={() => {
                                        onView(row.original.INACTIVE_ID)
                                    }}
                                >
                                    <Eye color="#B32017" size={15} />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                            <div className="flex flex-col items-center justify-center gap-2 text-gray-500 sticky">
                                <p className="text-sm font-medium">No data found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
        </TableBody>
    );


    return (
        <div className="bg-white rounded-lg min-h-40">
            <div className="relative w-full">
                <div className="rounded-md border">
                    <div className="overflow-x-auto">
                        <Table className="overflow-x-auto">
                            {renderTableHeader()}
                            {renderTableBody()}
                        </Table>
                    </div>
                </div>
            </div>
            <TablePagination
                currentPage={pagination.page}
                totalPages={pagination.total_page}
                startIndex={(Number(pagination.page) - 1) * 10}
                endIndex={10}
                filteredData={data}
                handleFirstPage={handleFirstPage}
                handlePreviousPage={previousPage}
                handleNextPage={nextPage}
                handleLastPage={handleLastPage}
            />
        </div>
    );
}