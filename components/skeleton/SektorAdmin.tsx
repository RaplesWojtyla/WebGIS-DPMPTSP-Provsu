import { Skeleton } from "@/components/ui/skeleton"

export default function SektorAdminSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-10 w-full md:w-[300px]" />
                <Skeleton className="h-10 w-40" />
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <div className="p-4 border-b bg-gray-50/50 flex gap-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-24 ml-auto" />
                </div>
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-full" />
                            <div className="flex gap-2 ml-auto">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-64" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-4 w-32 px-2" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}
