import { Button, Input } from "@/components/Dexain";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Search } from "lucide-react";
import { newRegTaskFilter } from "../../constants/general";

const NewTaskFilter = ({
  openFilter,
  onOpenFilter,
  selectedFilter = "PCF No",
  onFilterChange,
  searchInput = "",
  onSearchInput,
  onSearch,
}) => {
  return (
    <div className="flex items-center border bg-system-input border-system-divider rounded-md overflow-hidden">
      <div className="bg-info-soft text-info-normal text-sm font-semibold px-3 py-4 border-r border-gray-300 whitespace-nowrap">
        Filter by :
      </div>
      <Popover open={openFilter} onOpenChange={onOpenFilter}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 focus:outline-none min-w-[200px] justify-between border-r border-gray-300"
            type="button"
          >
            {selectedFilter}
            <ChevronDown className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[200px]">
          <div className="flex flex-col">
            {newRegTaskFilter.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onFilterChange(item)}
                className={`text-sm text-left px-4 py-2 hover:bg-gray-100 transition-all duration-300 ${selectedFilter === item ? "text-primary-normal font-semibold" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={`Search ${selectedFilter}...`}
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="border-0 rounded-none shadow-none focus:border-none bg-transparent"
        />
      </div>
      <Button
        className="mr-1"
        size="icon"
        icon={<Search className="size-4" />}
        onClick={onSearch}
      />
    </div>
  );
};

export default NewTaskFilter;