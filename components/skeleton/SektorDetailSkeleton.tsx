import { Skeleton } from "@/components/ui/skeleton"

export default function SektorDetailSkeleton() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-6 w-96" />
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-8 w-48 rounded-full" />
                        <Skeleton className="h-8 w-56 rounded-full" />
                    </div>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 p-6 rounded-xl border border-slate-200">
                            <Skeleton className="h-5 w-32 mb-4" />
                            <Skeleton className="h-10 w-24 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>

                {/* Detailed Analysis */}
                <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-64 rounded-xl border border-slate-200 p-6 space-y-4">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
