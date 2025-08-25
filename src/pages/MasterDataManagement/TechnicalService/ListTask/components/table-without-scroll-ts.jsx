import React, { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, ChevronUp, ChevronDown, Filter, Search } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import techServiceStore from "@/stores/techServiceStore";
import { EDITABLE_ENUM } from "@/constants/technical-service.constant";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/use-debounce";
import ACTION_PLAN_ENUM from "../constants/action-plan-enum";
import { STATUS_TASK_AVL_DATA } from "@/constants/status-task-avl";
import { TablePagination } from "@/components/fields/Table/components/TablePagination";


const PopoverFilter = ({ dataList, filterValue, setFilterValue, name }) => {
    const [filteredData, setFilteredData] = useState(dataList);
    const [search, setSearch] = useState("");
    const tempData = useRef(dataList);

    useEffect(() => {
        if (tempData.current.value && tempData.current.value.length > 0) {
            setFilteredData(tempData.filter(item => item.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search]);

    return (
        <Popover >
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
                            setSearch(e.target.value)
                            setFilterValue({ ...filterValue, [name]: e.target.value })
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function TableTechnicalServiceTiWithoutScroll({
    data, navigate, filterValue,
    setFilterValue, manufactureList,
    actionPlanList, pagination,
    nextPage, previousPage, handleFirstPage, handleLastPage
}) {
    const [sorting, setSorting] = React.useState([]);
    const [dataTable, setDataTable] = useState(data)
    const [filterChild, setFilterChild] = useState({ ...filterValue });

    //custom hook
    const debouncedFilterValue = useDebounce(filterChild, 1000);

    //store
    const setDetailType = techServiceStore(state => state.setDetailType);
    const setDetailId = techServiceStore(state => state.setDetailId);
    const setDetailActionPlan = techServiceStore(state => state.setDetailActionPlan);
    const setDetailItemA = techServiceStore(state => state.setDetailItemA);


    //state
    useEffect(() => {
        setFilterValue(filterChild);
    }, [debouncedFilterValue]);

    useEffect(() => {
        setDataTable(data)
    }, [data])

    useEffect(() => {
        console.log(filterValue, 'FILTER VALUE')
        setFilterChild({ ...filterValue })
    }, [filterValue])

    //initial column
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
                        setFilterValue={(value) => {
                            setFilterValue(value)
                        }}
                        name="finished_product"
                    ></PopoverSearch>
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
            accessorKey: 'RECIPE_VERSION',
            header: 'Recipe Version',
        },
        {
            accessorKey: 'FORMULA_VERSION',
            header: 'Formula Version',
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
            accessorKey: 'view',
            header: 'View',
            enableSorting: false,
        },
    ], [filterValue, manufactureList, filterChild]);


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
                <div className="rounded-md ">
                    <div className="overflow-hidden rounded-lg">
                        <Table >
                            <TableHeader className="bg-[#E9EEF5]">
                                <TableRow>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        headerGroup.headers.map((header) => (
                                            <TableCell
                                                key={header.id}
                                                className={`select-none
                                                        ${header.column.id === 'index' ? 'w-16 min-w-16' : ''}
                                                        ${header.column.id === 'FINISHED_PRODUCT' ? 'w-36 min-w-36' : ''}
                                                        ${header.column.id === 'MANUFACTURING_SITE' ? 'w-28 min-w-28' : ''}
                                                        ${header.column.id === 'RECEIVED_DATE' ? 'w-28 min-w-28' : ''}
                                                        ${header.column.id === 'RECIPE_VERSION' ? 'w-28 min-w-28' : ''}
                                                        ${header.column.id === 'FORMULA_VERSION' ? 'w-28 min-w-28' : ''}
                                                        ${header.column.id === 'ACTION_PLAN' ? 'w-28 min-w-28' : ''}
                                                        ${header.column.id === 'STATUS' ? 'w-24 min-w-24' : ''}
                                                        ${header.column.id === 'view' ? 'w-24 min-w-24' : ''}
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

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(dataTable && dataTable.length > 0) ? (
                                    table.getRowModel().rows.map((row, index) => (
                                        <TableRow key={`${row.original.FORMULA_ID}${index}`}>
                                            <TableCell className="w-16 min-w-16">
                                                {(index + 1) + (10 * (pagination.page - 1))}
                                            </TableCell>
                                            <TableCell className="w-36 min-w-36">
                                                {row.original.FINISHED_PRODUCT}
                                            </TableCell>
                                            <TableCell className="w-28 min-w-28">{row.original.MANUFACTURING_SITE}</TableCell>
                                            <TableCell className="w-28 min-w-28">{formatTime(row.original.RECEIVED_DATE)}</TableCell>
                                            <TableCell className="w-28 min-w-28">V.{row.original.RECIPE_VERSION}</TableCell>
                                            <TableCell className="w-28 min-w-28">V.{row.original.FORMULA_VERSION}</TableCell>
                                            <TableCell className="w-28 min-w-28">{row.original.ACTION_PLAN}</TableCell>
                                            <TableCell className="w-24 min-w-24">{row.original.STATUS}</TableCell>
                                            <TableCell className="w-24 min-w-24">
                                                <button
                                                    className="p-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                    onClick={() => {
                                                        let editable_data = EDITABLE_ENUM.Editable

                                                        if (row.original.ACTION_PLAN === ACTION_PLAN_ENUM.WAITING_FOR_NIE) {
                                                            editable_data = EDITABLE_ENUM.NonEditable
                                                        }
                                                        setDetailItemA(row.original.FINISHED_PRODUCT.substring(0, 10))
                                                        setDetailActionPlan(row.original.ACTION_PLAN)
                                                        setDetailType(editable_data)
                                                        setDetailId(row.original.FORMULA_ID)
                                                        navigate(`/master-data-management/approve-vendor-list/detail`)
                                                    }}
                                                >
                                                    <Eye color={"#B32017"} size={15} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-6">
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
        </div >
    );
}