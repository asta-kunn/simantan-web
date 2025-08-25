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
import { statusItemSubstitution } from "../ApprovalTaskItem/Detail/constants/status-item-submission";

const PopoverFilter = ({ dataList, filterValue, setFilterValue, name }) => {
    const [filteredData, setFilteredData] = useState(dataList);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setFilteredData(dataList.filter(item => item.toLowerCase().includes(search.toLowerCase())))
    }, [search]);

    return (
        <Popover  >
            <PopoverTrigger asChild>
                <Button variant="ghost" onClick={(e) => { e.stopPropagation() }}>
                    <Filter className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" onClick={(e) => { e.stopPropagation() }}>
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <Search onClick={(e) => { e.stopPropagation() }} className="w-3 h-3" />
                    <input type="text" value={search} placeholder="Search" onClick={(e) => { e.stopPropagation() }} className="w-full outline-none text-base " onChange={(e) => { setSearch(e.target.value) }} />
                </div>
                <div className="flex flex-col">
                    {filteredData.map((item, index) => (
                        <div className="p-2 flex items-center gap-2" key={index}>
                            <Checkbox
                                checked={filterValue[name].includes(item)}
                                onClick={(e) => { e.stopPropagation() }}
                                className="data-[state=checked]:bg-[#B32017]"
                                onCheckedChange={(checked) => {
                                    if (checked === false) {
                                        filterValue[name] = filterValue[name].filter(manufacture => manufacture !== item);
                                        setFilterValue(filterValue);
                                    } else {
                                        filterValue[name].push(item);
                                        setFilterValue(filterValue);
                                    }
                                }}
                            />
                            <span className="text-sm font-semibold">{item}</span>
                        </div>
                    ))}
                </div>
                <div className="p-2">
                    <Button variant="outline" className="w-full h-8" onClick={() => {
                        setFilterValue({ ...filterValue, [name]: [] });
                        filteredData.forEach(item => {
                            if (filterValue[name].includes(item)) {
                                filterValue[name] = filterValue[name].filter(manufacture => manufacture !== item);
                            }
                        });
                        setFilterValue(filterValue);
                    }}>Clear</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const PopoverSearch = ({ filterValue, setFilterValue, name }) => {
    const [search, setSearch] = useState("");

    const searchHandler = () => {
        setFilterValue({ ...filterValue, [name]: search })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" onClick={(e) => { e.stopPropagation() }}>
                    <Filter className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4" onClick={(e) => { e.stopPropagation() }}>
                <div className="flex items-center gap-2 border-stone-100 border border-slate-100 p-2 rounded-md">
                    <Search onClick={(e) => { e.stopPropagation() }} className="w-3 h-3" />
                    <input type="text" value={search} placeholder="Search" onClick={(e) => { e.stopPropagation() }} className="w-full outline-none text-base "
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 flex-row justify-between">
                    <Button className="w-full h-8" onClick={searchHandler}>Search</Button>
                    <Button variant="outline" className="w-full h-8" onClick={() => {
                        setSearch("")
                        setFilterValue({ ...filterValue, [name]: "" });
                    }}>Clear</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function TableItemSubstitusi({
    data, onView, filterValue, setFilterValue, manufactureList, handleLastPage, handleFirstPage, pagination, previousPage, nextPage}) {
    const [sorting, setSorting] = React.useState([]);
    const [dataTable, setDataTable] = useState(data)
    const [filterChild] = useState({ ...filterValue });
    const debouncedFilterValue = useDebounce(filterChild, 1000);

    useEffect(() => {
        setFilterValue({...filterChild});
    }, [debouncedFilterValue]);


    const columns = React.useMemo(() => [
        {
            id: 'index',
            header: '#',
        },
        {
            accessorKey: 'REQUEST_ID',
            header: () => (
                <div className="flex items-center gap-1">
                    Request ID
                    {/* <PopoverSearch
                        filterValue={filterValue}
                        setFilterValue={(value => {
                            setFilterValue(value)
                        })}
                        name="request_id"
                    /> */}
                </div>
            ),
        },
        {
            accessorKey: 'PRODUCT_NAME',
            header: () => (
                <div className="flex items-center gap-1 relative">
                    Product Name
                </div>
            ),
        },
        {
            accessorKey: 'VERSION',
            header: 'Version',
        },
        {
            accessorKey: 'MANUFACTURING_SITE',
            header: () => (
                <div className="flex items-center gap-1">
                    Manufacturing Site
                </div>
            ),
        },
        {
            accessorKey: 'REQUESTOR',
            header: 'Requestor',
        },
        {
            accessorKey: 'CREATION_DATE',
            header: 'Request Date',
            cell: ({ getValue }) => formatDate(getValue()),
        },
        {
            accessorKey: 'STATUS',
            header: 'Status',
        },
    ], [filterValue, manufactureList]);

    useEffect(() => {
        setDataTable(data)
    }, [data])

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
        if (status === statusItemSubstitution.DRAFT) {
            return <span className="text-sm font-medium text-gray-500">{status}</span>
        } else if (status === statusItemSubstitution.WAITING_FOR_MANAGER) {
            return <span className="text-sm font-medium text-[#f1c40f]">{status}</span>
        }else if(status === statusItemSubstitution.WAITING_FOR_QA_OFFICER){
            return <span className="text-sm font-medium text-[#00b894]">{status}</span>
        }else if(status === statusItemSubstitution.WAITING_FOR_QA_MANAGER){
            return <span className="text-sm font-medium text-[#2ecc71]">{status}</span>
        }else if(status === statusItemSubstitution.APPROVED){
            return <span className="text-sm font-medium text-[#2ecc71]">{status}</span>
        }else if(status === statusItemSubstitution.REJECTED){
            return <span className="text-sm font-medium text-[#d63031]">{status}</span>
        }
    }


    return (
        <div className="bg-white rounded-lg min-h-40">
            <div className="relative w-full ">
                <div className="rounded-md border ">
                    <div className="overflow-x-auto">
                        <Table className="overflow-x-auto">
                            <TableHeader className="bg-[#E9EEF5]">
                                <TableRow>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        headerGroup.headers.map((header, childIndex) => (
                                            <TableCell
                                                key={childIndex}
                                                className={`select-none
                                                        ${header.column.id === 'index' ? 'sticky left-0 bg-[#E9EEF5] z-10 w-16 min-w-16' : ''}
                                                        ${header.column.id === 'REQUEST_ID' ? 'sticky left-16 bg-[#E9EEF5] z-10 w-32 min-w-32' : ''}
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
                                                                <ArrowDownAZ
                                                                    className="ml-1 h-3 w-3 text-primary-normal-600"
                                                                />
                                                            )}
                                                            {header.column.getIsSorted() === 'desc' && (
                                                                <ArrowUpZA
                                                                    className="ml-1 h-3 w-3 text-primary-normal-600"
                                                                />
                                                            )}
                                                            {header.column.getIsSorted() === false && (
                                                                <div className="flex flex-col">
                                                                    <ArrowDownUp className="ml-1 h-3 w-3 text-gray-400" />
                                                                </div>
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
                            <TableBody>
                                {(data && data.length > 0) ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="sticky left-0 bg-white z-10 w-10 min-w-10">
                                                {/* Gunakan row.index dari react-table, bukan index dari map */}
                                                {row.index + 1}
                                            </TableCell>
                                            <TableCell className="sticky left-16 bg-white z-8 w-32 min-w-32">
                                                {row.original.REQUEST_ID}
                                            </TableCell>
                                            <TableCell className="w-[250px] min-w-[250px]">{row.original.PRODUCT_NAME} - {row.original.PRODUCT_DESCRIPTION}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{row.original.VERSION}</TableCell>
                                            <TableCell className="w-[200px] min-w-[200px]">{row.original.MANUFACTURING_SITE}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{row.original.REQUESTOR}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{formatTime(row.original.CREATION_DATE)}</TableCell>
                                            <TableCell className="w-[150px] min-w-[160px]">{conditionStatus(row.original.STATUS)}</TableCell>
                                            <TableCell className="sticky right-0 bg-white z-10 w-[50px] min-w-[50px]">
                                                <button
                                                    className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                    onClick={() => onView(row.original.REQUEST_ID)}
                                                >
                                                    <Eye color={"#B32017"} size={15} />
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
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <TablePagination
                currentPage={pagination.page}
                totalPages={pagination.total_page}
                startIndex={(pagination.page - 1) * 10}
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