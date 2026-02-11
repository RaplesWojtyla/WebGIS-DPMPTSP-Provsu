import { Skeleton } from "@/components/ui/skeleton"

export default function ProposalUserSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="text-center md:text-left">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-2 border-b">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Form Selection Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="p-8 rounded-2xl border-2 border-slate-100 bg-white">
                        <Skeleton className="w-14 h-14 rounded-xl mb-4" />
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                ))}
            </div>
        </div>
    )
}
