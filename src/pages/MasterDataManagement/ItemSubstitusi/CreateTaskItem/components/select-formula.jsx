import { Select } from '@/components/Dexain'

const SelectFormulaSubstitusi = ({ searchable = true, dataSource = [], ...props }) => {
    return (
        <Select
            searchable={searchable}
            options={dataSource}
            {...props}
        />
    )
}

export default SelectFormulaSubstitusi
