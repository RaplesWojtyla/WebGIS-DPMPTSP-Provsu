import { Skeleton } from "@/components/ui/skeleton"

export default function ProposalAdminSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-12" />
                    </div>
                ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-xl" />
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-lg" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
