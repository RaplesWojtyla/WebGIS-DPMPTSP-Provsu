import { Skeleton } from "@/components/ui/skeleton"

export default function SektorDashboardSkeleton() {
    return (
        <div className="container mx-auto py-10 space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
            </div>

            {/* Executive Summary Section */}
            <section className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-blue-900/5 p-8 rounded-2xl flex flex-col justify-center h-[300px]">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-6" />
                    <div className="flex gap-4">
                        <Skeleton className="h-24 w-32 rounded-lg" />
                        <Skeleton className="h-24 w-32 rounded-lg" />
                    </div>
                </div>
                <div className="md:col-span-1 h-[300px]">
                    <Skeleton className="h-full w-full rounded-2xl" />
                </div>
            </section>

            {/* Sector Dashboard Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-xl" />
                    ))}
                </div>
            </section>
        </div>
    )
}
