import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, Filter, Search, Download, FileDown, ArrowDownAZ, ArrowUpZA, ArrowDownUp } from "lucide-react";
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
import { REGISTRATION_TYPE_DATA, STATUS_TASK_AVL_DATA } from "@/constants/status-task-avl";

const PopoverFilter = ({ dataList, filterValue, setFilterValue, name }) => {
    const [filteredData, setFilteredData] = useState(dataList);
    const [search, setSearch] = useState("");
    const [tempData] = useState(dataList);
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = () => {
        setFilterValue({ ...filterValue, [name]: [] });
        filteredData.forEach(item => {
            if (filterValue[name].includes(item)) {
                filterValue[name] = filterValue[name].filter(manufacture => manufacture !== item);
            }
        });
        setFilterValue(filterValue);
        setIsOpen(false);
    }

    useEffect(() => {
        setFilteredData(tempData.filter(item => item.toLowerCase().includes(search.toLowerCase())))
    }, [search, tempData]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0" onClick={(e) => { e.stopPropagation() }}>
                    <Filter size={15} className="text-stone-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" onClick={(e) => { e.stopPropagation() }}>
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <Search onClick={(e) => { e.stopPropagation() }} className="w-3 h-3" />
                    <input type="text" value={search} placeholder="Search" onClick={(e) => { e.stopPropagation() }} className="w-full outline-none text-base " onChange={(e) => { setSearch(e.target.value) }} />
                </div>
                <div className="flex flex-col">
                    {filteredData.map((item) => (
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
                    <Button variant="outline" className="w-full" onClick={handleClear}>Clear</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const PopoverSearch = ({ filterValue, setFilterValue, name }) => {
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)

    const handleSearch = () => {
        setFilterValue({ ...filterValue, [name]: search })
        setOpen(false) // Close popover after search
    }

    const handleClear = () => {
        setFilterValue({ ...filterValue, [name]: "" })
        setSearch("") // Clear the search input as well
        setOpen(false) // Close popover after clear
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className="p-0"
                >
                    <Search size={15} className="text-stone-500" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-64 px-2 py-2"
                style={{ minWidth: 180, maxWidth: 320 }}
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <div className="flex items-center gap-1 border-stone-100 mb-4 border p-2">
                    <Search
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        size={15}
                    />
                    <input
                        type="text"
                        value={search}
                        placeholder="Search"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        className="w-full outline-none text-base px-1 py-1"
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch()
                            }
                        }}
                        style={{ minWidth: 0 }}
                    />
                </div>
                <div className="flex flex-row gap-2 items-center justify-between">
                    <Button className="w-24" onClick={handleSearch}>
                        Search
                    </Button>
                    <Button variant="outline" className="w-24 bg-transparent" onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function TableScrollable({
    data, navigate, filterValue, setFilterValue,  handleLastPage, handleFirstPage,
    actionPlanList, pagination, previousPage, nextPage, downloadFile, downloadFilePdf, loading = false }) {
    const [sorting, setSorting] = React.useState([]);
    const [dataTable, setDataTable] = useState(data)
    const [filterChild] = useState({ ...filterValue });
    
    const debouncedFilterValue = useDebounce(filterChild, 500);

    useEffect(() => {setFilterValue(filterChild);}, [debouncedFilterValue]);

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
                </div>
            ),
            enableSorting: false,
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
                    />
                </div>
            ),
        },
        {
            accessorKey: 'RECIPE_NO',
            header: 'Recipe No',
        },
        {
            accessorKey: 'FORMULA_NO',
            header: 'Formula No',
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
                            setFilterValue(value)
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
            header: () => {
                console.log(filterValue, 'FILTER VALUE')
                return (
                    <div className="flex items-center gap-1">
                        Action Plan
                        {actionPlanList && (
                            <PopoverFilter
                                dataList={actionPlanList}
                                filterValue={filterValue}
                                setFilterValue={(value) => {
                                    setFilterValue(value)
                                }}
                                name="action_plan"
                            ></PopoverFilter>
                        )}
                    </div>
                )
            },
        },
    ], [filterChild, actionPlanList]);

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


    return (
        <div className="bg-white rounded-lg min-h-40">
            <div className="relative w-full ">
                <div className="rounded-md border ">
                    <div className="overflow-x-auto">
                        <Table className="overflow-x-auto">
                            <TableHeader className="bg-[#E9EEF5] ">
                                <TableRow>
                                    {table.getHeaderGroups().map((headerGroup) =>
                                        headerGroup.headers.map((header) => (
                                            <TableCell
                                                key={header.id}
                                                className={`select-none
                                                        ${header.column.id === 'index' ? 'sticky left-0 bg-[#E9EEF5] z-10 w-16 min-w-16' : ''}
                                                        ${header.column.id === 'FINISHED_PRODUCT' ? 'sticky left-16 bg-[#E9EEF5] z-10 w-48 min-w-48' : ''}
                                                    `}
                                            >
                                                {header.column.getCanSort() ? (
                                                    <div
                                                        className="flex items-center cursor-pointer gap-1"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        <>
                                                            {header.column.getIsSorted() === 'asc' && (
                                                                <ArrowDownAZ
                                                                    size={15} className="text-stone-800"
                                                                />
                                                            )}
                                                            {header.column.getIsSorted() === 'desc' && (
                                                                <ArrowUpZA
                                                                    size={15} className="text-stone-800"
                                                                />
                                                            )}
                                                            {header.column.getIsSorted() === false && (
                                                                <div className="flex flex-col">
                                                                    <ArrowDownUp size={15} className="text-stone-500" />
                                                                </div>
                                                            )}
                                                        </>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                        ))
                                    )}
                                    {data && data.length > 0 && (
                                        <TableCell className="sticky right-0 bg-[#E9EEF5] z-10 w-max text-center">
                                            View
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHeader>
                            {
                                loading ? (
                                    <TableBody>
                                        <TableRow key="loading" >
                                            <TableCell colSpan={12}>
                                                <div className="space-y-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className="w-full h-8 bg-slate-100 animate-pulse rounded" />
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        {(data && data.length > 0) ? (
                                            table.getRowModel().rows.map((row, index) => (
                                                <TableRow key={row.original.FORMULA_ID || row.original.formula_id || index}>
                                                    <TableCell className="sticky left-0 bg-white z-10 w-10 min-w-10">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="sticky left-16 bg-white z-8 w-48 min-w-48">
                                                        {row.original.FINISHED_PRODUCT}
                                                    </TableCell>
                                                    <TableCell className="min-w-[150px]">{row.original.MANUFACTURING_SITE}</TableCell>
                                                    <TableCell className="min-w-[150px]">{formatTime(row.original.RECEIVED_DATE)}</TableCell>
                                                    <TableCell className="min-w-[150px]">{row.original.REGISTRATION_TYPE}</TableCell>
                                                    <TableCell className="min-w-[120px]">{row.original.RECIPE_NO}</TableCell>
                                                    <TableCell className="min-w-[120px]">{row.original.FORMULA_NO}</TableCell>
                                                    <TableCell className="min-w-[120px]">V.{row.original.RECIPE_VERSION}</TableCell>
                                                    <TableCell className="min-w-[120px]">V.{row.original.FORMULA_VERSION}</TableCell>
                                                    <TableCell className="min-w-[120px]">V.{row.original.AVL_VERSION}</TableCell>
                                                    <TableCell className="min-w-[200px]">{row.original.MA_DOCUMENT}</TableCell>
                                                    <TableCell className="min-w-[150px]">{row.original.STATUS}</TableCell>
                                                    <TableCell className="min-w-[150px]">{row.original.ACTION_PLAN}</TableCell>
                                                    <TableCell className="sticky right-0 bg-white z-10 w-max flex flex-row items-center gap-1">
                                                        <button
                                                            className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                            onClick={() => {
                                                                navigate(row.original)
                                                            }}
                                                        >
                                                            <Eye color={"#B32017"} size={15} />
                                                        </button>
                                                        {downloadFile && (<button
                                                            className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                            onClick={() => {
                                                                downloadFile(row.original.FORMULA_ID)
                                                            }}
                                                        >
                                                            <Download color={"#B32017"} size={15} />
                                                        </button>)}
                                                        {downloadFilePdf && (<button
                                                            className="p-1 mx-1 border border-stone-100 rounded-md delay-50 transition hover:bg-stone-100"
                                                            onClick={() => {
                                                                downloadFilePdf(row.original.FORMULA_ID)
                                                            }}
                                                        >
                                                            <FileDown color={"#B32017"} size={15} />
                                                        </button>)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow key="no-data">
                                                <TableCell colSpan={8} className="text-center py-6">
                                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 sticky">
                                                        <p className="text-sm font-medium">No data found</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell colSpan={2} className="text-center py-6">
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                )
                            }
                        </Table>
                    </div>
                </div>
            </div>
            <TablePagination
                currentPage={pagination.page}
                totalPages={pagination.total_page}
                startIndex={data.length - 1}
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