import { Skeleton } from "@/components/ui/skeleton"

export default function PDRBAdminSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    <Skeleton className="h-10 w-full md:w-[120px]" />
                    <Skeleton className="h-10 w-full md:w-[160px]" />
                    <Skeleton className="h-10 w-full md:w-[280px]" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex gap-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-32 ml-auto" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <Skeleton className="h-4 w-12" />
                            <div className="space-y-1 w-48">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-32 ml-auto" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                            <div className="flex gap-2 w-32 justify-center">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-gray-50/50">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}
