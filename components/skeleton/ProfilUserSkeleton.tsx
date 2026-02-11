import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilUserSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 w-full">
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-7 w-64" />
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Skeleton className="h-4 w-36 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-7 w-64" />
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-2">
                                <Skeleton className="h-4 w-36 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Skeleton className="h-4 w-48 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-28 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 xl:col-span-2">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-7 w-48" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                        <div className="space-y-5">
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-28 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-20 mb-2" />
                                <Skeleton className="h-[46px] w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-end md:static md:bg-transparent md:border-none md:p-0">
                <Skeleton className="h-[56px] w-full md:w-48 rounded-xl" />
            </div>
        </div>
    )
}
