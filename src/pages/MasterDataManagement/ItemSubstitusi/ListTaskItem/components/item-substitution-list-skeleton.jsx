import TableListSkeleton from './table-skeleton'

const ItemSubstitutionListSkeleton = () => {
  return (
    <div className="max-w-full mb-16 p-4">
    <div className="flex flex-row justify-between gap-2 items-center mb-4">
      <div className="flex flex-col ">
        <div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-80 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="flex flex-row gap-2">
        <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>

    <div className="pb-2">
      <div className="flex flex-row gap-4 mb-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      <div>
        <TableListSkeleton />
      </div>
    </div>
  </div>
  )
}

export default ItemSubstitutionListSkeleton
