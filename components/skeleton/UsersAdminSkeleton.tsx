import { Skeleton } from "@/components/ui/skeleton"

export default function UsersAdminSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Stats Cards - Grid of 4 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-12" />
                    </div>
                ))}
            </div>

            {/* Toolbar - Filter & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Filter Select */}
                    <Skeleton className="h-10 w-full sm:w-[150px]" />
                    {/* Search Input */}
                    <div className="relative w-full sm:w-[280px]">
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Table Header */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex gap-4">
                        <Skeleton className="h-6 w-12" /> {/* No */}
                        <Skeleton className="h-6 w-48" /> {/* Pengguna */}
                        <Skeleton className="h-6 w-24 ml-auto" /> {/* Role */}
                        <Skeleton className="h-6 w-24 text-center" /> {/* Status */}
                        <Skeleton className="h-6 w-32 text-center" /> {/* Terdaftar */}
                        <Skeleton className="h-6 w-24 ml-auto" /> {/* Aksi */}
                    </div>
                </div>

                {/* Table Body */}
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                            <Skeleton className="h-4 w-12" />
                            <div className="flex gap-3 items-center w-48 flex-1">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-24 ml-auto rounded-full" />
                            <Skeleton className="h-6 w-24 ml-auto rounded-full" />
                            <Skeleton className="h-4 w-32 ml-auto" />
                            <Skeleton className="h-8 w-8 ml-auto" />
                        </div>
                    ))}
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-gray-50/50">
                    <Skeleton className="h-4 w-64" />
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
