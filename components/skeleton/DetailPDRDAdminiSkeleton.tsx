import { Skeleton } from "@/components/ui/skeleton"

export default function DetailPDRDAdminiSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </div>
                <Skeleton className="h-8 w-32 rounded-full" />
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-1">
                    {/* Table Header */}
                    <div className="bg-gray-50/50 p-4 flex gap-4 border-b">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-full max-w-md" />
                        <Skeleton className="h-6 w-48 ml-auto" />
                    </div>
                    {/* Table Rows */}
                    <div className="p-4 space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-full max-w-md" />
                                <Skeleton className="h-6 w-48 ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-lg border border-blue-100 w-full md:w-auto">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-8 w-48" />
                        </div>
                        <Skeleton className="h-10 w-full md:w-32" />
                    </div>
                </div>
            </div>
        </div>
    )
}
