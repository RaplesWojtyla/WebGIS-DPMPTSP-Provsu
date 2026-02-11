import { Skeleton } from "@/components/ui/skeleton"

export default function WilayahAdminSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            <div className="space-y-6">
                {/* Tabs List & Toolbar Container */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Tabs List Skeleton */}
                    <div className="grid w-full sm:w-auto grid-cols-4 gap-1 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
                        <Skeleton className="h-10 w-20 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-20 rounded-lg" />
                    </div>

                    {/* Toolbar Skeleton */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Skeleton className="h-10 w-full sm:w-72" />
                        <Skeleton className="h-10 w-24" />
                        <div className="flex gap-1">
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                </div>

                {/* Table Area Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                    {/* Table Header */}
                    <div className="p-4 border-b">
                        <div className="flex gap-4">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32 ml-auto" />
                        </div>
                    </div>
                    {/* Table Body */}
                    <div className="p-4 space-y-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-24 ml-auto" />
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4 border-t bg-gray-50/30">
                        <Skeleton className="h-4 w-48" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
