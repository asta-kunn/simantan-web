import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "@/components/fields/Button";
import { Filter, Search } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

const PopoverFilter = ({ dataList, filterValue, setFilterValue, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(dataList);
    const [search, setSearch] = useState("");
    const [tempData, setTempData] = useState(dataList);

    useEffect(() => {
        console.log("CHANGES", search)
        setFilteredData(tempData.filter(item => item.toLowerCase().includes(search.toLowerCase())))
    }, [search]);

    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button variant="ghost" onClick={(e) => { e.stopPropagation() }}>
                    <Filter className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
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


export default PopoverFilter