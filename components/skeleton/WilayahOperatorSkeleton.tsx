import { Skeleton } from "@/components/ui/skeleton"

export default function WilayahOperatorSkeleton() {
    return (
        <div className="space-y-8 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                {/* Top Row: Search */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Skeleton className="h-10 w-full sm:w-96 rounded-lg" />
                </div>

                {/* Bottom Row: Filters & Exports */}
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto flex-1">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="flex gap-2 w-full xl:w-auto shrink-0">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-24 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50">
                    <div className="flex justify-between gap-4 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 flex justify-between gap-4">
                            <Skeleton className="h-6 w-8" /> {/* No */}
                            <Skeleton className="h-6 w-32" /> {/* Kabupaten */}
                            <Skeleton className="h-6 w-16" /> {/* Kode */}
                            <Skeleton className="h-6 w-32" /> {/* Kecamatan */}
                            <Skeleton className="h-6 w-16" /> {/* Kode */}
                            <Skeleton className="h-6 w-32" /> {/* Desa */}
                            <Skeleton className="h-6 w-16" /> {/* Kode */}
                            <Skeleton className="h-6 w-16" /> {/* Aksi */}
                        </div>
                    ))}
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-4 w-24 mx-2" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
