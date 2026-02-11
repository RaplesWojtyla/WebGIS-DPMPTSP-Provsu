"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FiUser, FiCheckCircle, FiAlertCircle, FiFileText } from "react-icons/fi";
import { getUserInvestorProfile } from "@/lib/actions/profile.actions";
import DashboardUserSkeleton from "@/components/skeleton/DashboardUserSkeleton";

interface ProfileStatus {
    name: string;
    isComplete: boolean;
}

export default function UserOverviewPage() {
    const [profile, setProfile] = useState<ProfileStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        loadProfile();
    }, []);

    const loadProfile = async () => {
        setIsLoading(true);
        const result = await getUserInvestorProfile();
        if (result.success && result.data) {
            setProfile({
                name: result.data.fullName || "Investor",
                isComplete: result.data.isComplete,
            });
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <DashboardUserSkeleton />
    }

    const isComplete = profile?.isComplete;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, {profile?.name || "Investor"}</h1>
                <p className="text-slate-500">Pantau aktivitas investasi dan simulasi Anda di sini.</p>
            </div>

            {/* Profile Status Card */}
            <div className={`p-6 rounded-2xl border ${isComplete ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`p-3 rounded-xl ${isComplete ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                            {isComplete ? <FiCheckCircle size={24} /> : <FiAlertCircle size={24} />}
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${isComplete ? 'text-green-800' : 'text-amber-800'}`}>
                                {isComplete ? "Profil Lengkap" : "Profil Belum Lengkap"}
                            </h3>
                            <p className={`${isComplete ? 'text-green-700' : 'text-amber-700'}`}>
                                {isComplete ? "Anda memiliki akses penuh ke alat investasi." : "Harap lengkapi detail profil Anda untuk membuka kunci alat investasi."}
                            </p>
                        </div>
                    </div>
                    {!isComplete && (
                        <Link href="/dashboard/profile" className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold text-sm hover:bg-amber-700">
                            Lengkapi Sekarang
                        </Link>
                    )}
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/profile" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-all group-hover:border-blue-200">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FiUser size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Profil Saya</h3>
                        <p className="text-slate-500 text-sm">Kelola informasi pribadi dan data perusahaan Anda.</p>
                    </div>
                </Link>

                {/* <Link href="/dashboard/simulation" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-all group-hover:border-blue-200">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FiActivity size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Simulasi Investasi</h3>
                        <p className="text-slate-500 text-sm">Jalankan analisis ekonomi (LQ, SSA, DLQ) untuk menemukan peluang.</p>
                        {!isComplete && <div className="mt-4 text-xs bg-slate-100 text-slate-500 py-1 px-2 rounded w-fit">Terkunci 🔒</div>}
                    </div>
                </Link> */}

                <Link href="/dashboard/proposal" className="block group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full hover:shadow-md transition-all group-hover:border-blue-200">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <FiFileText size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Proposal Saya</h3>
                        <p className="text-slate-500 text-sm">Ajukan dan pantau status permohonan investasi Anda.</p>
                        {!isComplete && <div className="mt-4 text-xs bg-slate-100 text-slate-500 py-1 px-2 rounded w-fit">Terkunci 🔒</div>}
                    </div>
                </Link>
            </div>
        </div>
    );
}
