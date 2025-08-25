
const SkeletonCreateTask = () => {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            <div className="h-8 w-1/3 bg-slate-200 rounded mb-4"></div>

            
            <div className="bg-white rounded shadow p-6 mb-4">
                <div className="h-5 w-1/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-10 w-full bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-slate-100 rounded mb-4"></div>
                <div className="flex flex-row gap-4 mt-4">
                    <div className="w-1/2">
                        <div className="h-5 w-1/4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-10 w-full bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-1/2">
                        <div className="h-5 w-1/4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-10 w-full bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Skeleton untuk ItemReplacementSegment */}
            <div className="bg-white rounded shadow p-6 mb-4">
                <div className="flex flex-row gap-4 mb-4">
                    <div className="w-1/3 h-5 bg-slate-200 rounded"></div>
                    <div className="w-1/3 h-5 bg-slate-200 rounded"></div>
                    <div className="w-1/3 h-5 bg-slate-200 rounded"></div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="w-1/3 h-10 bg-slate-200 rounded"></div>
                    <div className="w-1/3 h-10 bg-slate-200 rounded"></div>
                    <div className="w-1/3 h-10 bg-slate-200 rounded"></div>
                </div>
            </div>

            {/* Skeleton untuk tombol */}
            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="w-1/2">
                    <div className="h-10 w-32 bg-slate-200 rounded"></div>
                </div>
                <div className="w-1/2 flex flex-row gap-4 justify-end">
                    <div className="h-10 w-32 bg-slate-200 rounded"></div>
                    <div className="h-10 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export default SkeletonCreateTask
