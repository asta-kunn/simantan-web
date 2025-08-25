import React, { useRef, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, ChevronUp, ChevronDown, Filter, Search, Download, FileDown } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import NoData from "@/components/ui/no-data";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import techServiceStore from "@/stores/techServiceStore";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import { useTimeoutAsync } from "@/hooks/use-timeout";
import { useDebounce } from "@/hooks/use-debounce";
import { REGISTRATION_TYPE_DATA, STATUS_TASK_AVL_DATA } from "@/constants/status-task-avl";
import { TablePagination } from "@/components/fields/Table/components/TablePagination";



const PopoverFilter = ({ dataList, filterValue, setFilterValue, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(dataList);
    const [search, setSearch] = useState("");
    const [tempData, setTempData] = useState(dataList);

    useEffect(() => {
        setFilteredData(tempData && tempData.length > 0 && tempData.filter(item => item.toLowerCase().includes(search.toLowerCase())))
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
                    {filteredData && filteredData.length > 0 && filteredData.map((item) => (
                        <div className="p-2 flex items-center gap-2" key={item}>
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
                    <Button variant="outline" className="w-full h-6" onClick={() => {
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
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button variant="ghost" onClick={(e) => { e.stopPropagation() }}>
                    <Filter className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" onClick={(e) => { e.stopPropagation() }}>
                <div className="flex items-center gap-2 border-stone-100 ">
                    <Search onClick={(e) => { e.stopPropagation() }} className="w-3 h-3" />
                    <input type="text" value={search} placeholder="Search" onClick={(e) => { e.stopPropagation() }} className="w-full outline-none text-base "
                        onChange={(e) => {
                            console.log(filterValue[name], 'VALUE')
                            setSearch(e.target.value)
                            setFilterValue({ ...filterValue, [name]: e.target.value })
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}


export function QATableList({
    data, navigate, filterValue, setFilterValue, manufactureList, tab,
    actionPlanList, pagination, decrementPage, incrementPage, downloadFile, downloadFilePdf,
    handleFirstPage, handleLastPage, previousPage, nextPage
}) {
    const [sorting, setSorting] = React.useState([]);
    const [dataTable, setDataTable] = useState(data)

    const setDetailType = techServiceStore(state => state.setDetailType);
    const setDetailId = techServiceStore(state => state.setDetailId);
    const setDetailActionPlan = techServiceStore(state => state.setDetailActionPlan);
    const setDetailItemA = techServiceStore(state => state.setDetailItemA);
    const [filterChild, setFilterChild] = useState({ ...filterValue });

    const debouncedFilterValue = useDebounce(filterChild, 1000);


    useEffect(() => {
        setFilterValue(filterChild);
    }, [debouncedFilterValue]);


    const columns = React.useMemo(() => [
        {
            accessorFn: (_, index) => index + 1,
            id: 'index',
            header: '#',
        },
        {
            accessorKey: 'FINISHED_PRODUCT',
            header: () => (
                <div className="flex items-center gap-1">
                    Finished Product
                    <PopoverSearch
                        filterValue={filterValue}
                        setFilterValue={(value => {
                            setFilterValue(value)
                        })}
                        name="finished_product"
                    />
                </div>
            ),
        },
        {
            accessorKey: 'MANUFACTURING_SITE',
            header: () => (
                <div className="flex items-center gap-1 relative">
                    Manufacturing Site
                    <PopoverFilter
                        dataList={manufactureList}
                        filterValue={filterValue}
                        setFilterValue={(value) => {
                            setFilterValue(value)
                        }}
                        name="manufacturing_site"
                    />
                </div>
            ),
        },
        {
            accessorKey: 'RECEIVED_DATE',
            header: 'Task Received Date',
            cell: ({ getValue }) => formatDate(getValue()),
        },
        {
            accessorKey: 'REGISTRATION_TYPE',
            header: () => (
                <div className="flex items-center gap-1">
                    Registration Type
                    <PopoverFilter
                        dataList={REGISTRATION_TYPE_DATA}
                        filterValue={filterValue}
                        setFilterValue={(value) => {
                            setFilterValue(value)
                        }}
                        name="registration_type"
                    ></PopoverFilter>
                </div>
            ),
        },
        {
            accessorKey: 'RECIPE_VERSION',
            header: 'Recipe Version',
        },
        {
            accessorKey: 'FORMULA_VERSION',
            header: 'Formula Version',
        },
        {
            accessorKey: 'AVL_VERSION',
            header: 'AVL Version',
        },
        {
            accessorKey: 'MA_DOCUMENT',
            header: () => (
                <div className="flex items-center gap-1">
                    MA Document
                    <PopoverSearch
                        filterValue={filterValue}
                        setFilterValue={(value => {
                            useTimeoutAsync(() => setFilterValue(value), 500)
                        })}
                        name="ma_document"
                    />
                </div>
            ),
        },
        {
            accessorKey: 'STATUS',
            header: () => (
                <div className="flex items-center gap-1">
                    Status
                    <PopoverFilter
                        dataList={STATUS_TASK_AVL_DATA}
                        filterValue={filterValue}
                        setFilterValue={(value) => {
                            setFilterValue(value)
                        }}
                        name="status"
                    ></PopoverFilter>
                </div>
            ),
        },
        {
            accessorKey: 'ACTION_PLAN',
            header: () => (
                <div className="flex items-center gap-1">
                    Action Plan
                    <PopoverFilter
                        dataList={actionPlanList}
                        filterValue={filterValue}
                        setFilterValue={(value) => {
                            setFilterValue(value)
                        }}
                        name="action_plan"
                    ></PopoverFilter>
                </div>
            ),
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
    });

    return (
        <div className="bg-white rounded-lg min-h-40">
            <div className="relative w-full ">
                <div className="rounded-md border ">
                    <div className="overflow-x-auto">
                        <Table className="overflow-x-auto">
                            <TableHeader className="bg-[#E9EEF5]">
                                <TableRow>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        headerGroup.headers.map((header) => (
                                            <TableCell
                                                key={header.id}
                                                className={`select-none
                                                        ${header.column.id === 'index' ? 'sticky left-0 bg-[#E9EEF5] z-10 w-16 min-w-16' : ''}
                                                        ${header.column.id === 'FINISHED_PRODUCT' ? 'sticky left-16 bg-[#E9EEF5] z-10 w-48 min-w-48' : ''}
                                                        ${header.column.id === 'MANUFACTURING_SITE' ? 'w-[200px] min-w-[200px]' : ''}
                                                        ${header.column.id === 'RECEIVED_DATE' ? 'w-[200px] min-w-[200px]' : ''}
                                                        ${header.column.id === 'REGISTRATION_TYPE' ? 'w-[200px] min-w-[200px]' : ''}
                                                        ${header.column.id === 'RECIPE_VERSION' ? 'w-[200px] min-w-32' : ''}
                                                        ${header.column.id === 'FORMULA_VERSION' ? 'w-[200px] min-w-32' : ''}
                                                        ${header.column.id === 'AVL_VERSION' ? 'w-[200px] min-w-32' : ''}
                                                        ${header.column.id === 'MA_DOCUMENT' ? 'w-[200px] min-w-32' : ''}
                                                        ${header.column.id === 'STATUS' ? 'w-[200px] min-w-[200px]' : ''}
                                                        ${header.column.id === 'ACTION_PLAN' ? 'w-[200px] min-w-[200px]' : ''}
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
                                                    {header.column.getCanSort() && (
                                                        <div className='flex flex-col'>
                                                            <ChevronUp
                                                                className={`ml-1 h-3 w-3 ${header.column.getIsSorted() === 'asc' ? 'text-primary-normal-600' : ''
                                                                    }`}
                                                            />
                                                            <ChevronDown
                                                                className={`ml-1 h-3 w-3 ${header.column.getIsSorted() === 'desc' ? 'text-primary-normal-600' : ''
                                                                    }`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        ))
                                    ))}
                                    {data && data.length > 0 && (
                                        <TableCell className="sticky right-0 bg-[#E9EEF5] z-10 w-max text-center">
                                            View
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(data && data.length > 0) ? (
                                    table.getRowModel().rows.map((row, index) => (
                                        <TableRow key={row.original.FORMULA_ID}>
                                            <TableCell className="sticky left-0 bg-white z-10 w-10 min-w-10">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="sticky left-16 bg-white z-8 w-48 min-w-48">
                                                {row.original.FINISHED_PRODUCT}
                                            </TableCell>
                                            <TableCell className="w-[250px] min-w-[250px]">{row.original.MANUFACTURING_SITE}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{formatTime(row.original.RECEIVED_DATE)}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{row.original.REGISTRATION_TYPE}</TableCell>
                                            <TableCell className="w-[200px] min-w-[200px]">V.{row.original.RECIPE_VERSION}</TableCell>
                                            <TableCell className="w-[200px] min-w-[200px]">V.{row.original.FORMULA_VERSION}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">V.{row.original.AVL_VERSION}</TableCell>
                                            <TableCell className="w-[200px] min-w-[200px]">{row.original.MA_DOCUMENT}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{row.original.STATUS}</TableCell>
                                            <TableCell className="w-[150px] min-w-[150px]">{row.original.ACTION_PLAN}</TableCell>
                                            <TableCell className="sticky right-0 bg-white z-10 w-max">
                                                <div className="flex items-center gap-1 flex-row">
                                                    <button
                                                        className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                        onClick={() => {
                                                            setDetailItemA(row.original.FINISHED_PRODUCT.substring(0, 10))
                                                            setDetailType(tab === "My Task" ? EDITABLE_ENUM.Editable : EDITABLE_ENUM.NonEditable)
                                                            setDetailId(row.original.FORMULA_ID)
                                                            navigate("/master-data-management/approval-qa/detail")
                                                        }}
                                                    >
                                                        <Eye color={"#B32017"} size={15} />
                                                    </button>
                                                    {tab === "Task History" && (
                                                        <>
                                                            <button
                                                                className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                                onClick={() => {
                                                                    downloadFile(row.original.FORMULA_ID)
                                                                }}
                                                            >
                                                                <Download color={"#B32017"} size={15} />
                                                            </button>
                                                            <button
                                                                className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                                onClick={() => {
                                                                    downloadFilePdf(row.original.FORMULA_ID)
                                                                }}
                                                            >
                                                                <FileDown color={"#B32017"} size={15} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} className="text-center py-6">
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
                startIndex={data.length - 1}
                endIndex={10}
                filteredData={Array.from({ length: pagination.total_data }, (value, index) => index)}
                handleFirstPage={handleFirstPage}
                handlePreviousPage={previousPage}
                handleNextPage={nextPage}
                handleLastPage={handleLastPage}
            />
        </div>
    );
}