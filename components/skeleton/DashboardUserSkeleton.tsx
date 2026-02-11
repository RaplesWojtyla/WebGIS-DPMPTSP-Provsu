import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardUserSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Skeleton className="h-9 w-64 md:w-96 mb-2" /> {/* text-3xl */}
                <Skeleton className="h-5 w-80 md:w-[500px]" /> {/* text-slate-500 */}
            </div>

            {/* Profile Status Card */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 w-full">
                        <Skeleton className="w-[50px] h-[50px] rounded-xl shrink-0" />
                        <div className="space-y-2 w-full max-w-xl py-1">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-full md:w-96" />
                        </div>
                    </div>
                    {/* Action Button */}
                    <Skeleton className="h-10 w-36 rounded-lg shrink-0" />
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Profil Saya match */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                    <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                </div>

                {/* Card 2: Proposal Saya match (lock badge potential) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                    <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-36 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                    {/* Lock Badge Skeleton */}
                    <Skeleton className="h-6 w-20 mt-4 rounded" />
                </div>

                {/* Card 3: Hidden/Empty to match current 2 cards layout on page */}

            </div>
        </div>
    )
}
