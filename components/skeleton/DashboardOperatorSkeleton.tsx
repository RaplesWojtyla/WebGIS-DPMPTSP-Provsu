import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardOperatorSkeleton() {
    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                {/* Tabs Skeleton */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-32 rounded-lg" />
                    ))}
                </div>

                {/* Content Area Skeleton - Mimicking AnalysisStatus */}
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-24 rounded-xl" />
                        ))}
                    </div>

                    {/* Table Skeleton */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-4 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-10 w-48" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-24" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
