import { Skeleton } from "@/components/ui/skeleton"

export default function ReviewOperatorSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Filter Skeleton */}
            <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-xl" />
                ))}
            </div>

            {/* List Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-between">
                        <div className="space-y-3 w-full">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
