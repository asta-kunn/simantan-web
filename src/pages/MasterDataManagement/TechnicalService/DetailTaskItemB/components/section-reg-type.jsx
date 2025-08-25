import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SectionRegType = ({
    onChangeRegType,
    regType,
    filterOptions
}) => {
    return (
        <div className="mb-6 flex items-center justify-center flex-row w-full gap-3">
            <label className="text-md font-medium">Registration Type :</label>
            <Select value={regType} onValueChange={onChangeRegType} placeholder="Select Registration Type">
                <SelectTrigger className="w-full md:w-1/3">
                    <SelectValue placeholder="Pilih filter" />
                </SelectTrigger>
                <SelectContent>
                    {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <p className="text-lg">{option.label}</p>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SectionRegType
