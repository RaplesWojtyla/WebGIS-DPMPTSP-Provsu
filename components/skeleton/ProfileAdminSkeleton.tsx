import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileAdminSkeleton() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-5 w-96" />
            </div>

            <div className="grid gap-8">
                {/* Profile Information Card Skeleton */}
                <div className="border rounded-xl bg-white shadow-sm">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Password Change Card Skeleton */}
                <div className="border rounded-xl bg-white shadow-sm">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50/50 rounded-b-xl border-t flex justify-end gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        </div>
    )
}
