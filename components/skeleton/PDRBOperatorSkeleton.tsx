import { Skeleton } from "@/components/ui/skeleton"

export default function PDRBOperatorSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-4 w-full">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <Skeleton key={i} className="h-6 w-20" />
                        ))}
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div key={i} className="flex justify-between gap-4">
                            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                                <Skeleton key={j} className="h-6 w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
