import { Skeleton } from "@/components/ui/skeleton"

export default function MapsSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            {/* Header Skeleton */}
            <div className="bg-white border-b py-8">
                <div className="container mx-auto px-4 md:px-6">
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-6 py-8 space-y-12">
                {/* Map Container Skeleton */}
                <Skeleton className="w-full h-[75vh] md:h-[calc(100vh-240px)] min-h-[500px] rounded-xl" />
            </main>
        </div>
    )
}
