"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiSend, FiUploadCloud, FiBriefcase, FiHome } from "react-icons/fi";

export default function UserProposalPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [proposalType, setProposalType] = useState<"investor" | "owner" | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (!saved || !JSON.parse(saved).isComplete) {
            alert("Anda Harus melengkapi profil terlebih dahulu!");
            router.push("/dashboard/profile");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const typeMsg = proposalType === "investor" ? "Permohonan Investasi" : "Penawaran Lokasi";
        alert(`${typeMsg} Berhasil Dikirim! Admin kami akan segera meninjau pengajuan Anda.`);
        router.push("/dashboard");
    };

    if (!isAuthorized) return <div className="p-10 text-center"><FiLock className="mx-auto w-10 h-10 text-slate-400 mb-4" /> Checking Access...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800">Pengajuan & Penawaran</h1>
                <p className="text-slate-500 mt-2 max-w-2xl">Pilih jenis pengajuan yang ingin Anda lakukan.</p>
            </div>

            {/* Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => setProposalType("investor")}
                    className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${proposalType === 'investor' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${proposalType === 'investor' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        <FiBriefcase size={28} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${proposalType === 'investor' ? 'text-blue-900' : 'text-slate-800'}`}>Saya Ingin Berinvestasi</h3>
                    <p className="text-slate-500 text-sm">Ajukan permohonan izin prinsip atau kemitraan untuk menanamkan modal di Sumatera Utara.</p>
                </button>

                <button
                    onClick={() => setProposalType("owner")}
                    className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${proposalType === 'owner' ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${proposalType === 'owner' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                        <FiHome size={28} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${proposalType === 'owner' ? 'text-emerald-900' : 'text-slate-800'}`}>Saya Menawarkan Lokasi</h3>
                    <p className="text-slate-500 text-sm">Daftarkan lahan atau aset potensial Anda agar dapat dilirik oleh investor.</p>
                </button>
            </div>

            {/* FORM: INVESTOR MODE */}
            {proposalType === "investor" && (
                <form onSubmit={handleSubmit} className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold flex items-center gap-2"><FiBriefcase /> Formulir Investor</h2>
                        <p className="opacity-90 text-sm mt-1">Isi detail investasi yang akan Anda jalankan.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Project Info */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 border-b pb-4">1. Rencana Proyek</h3>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Proyek Investasi</label>
                                <input required className="w-full p-3 border rounded-xl bg-slate-50" placeholder="e.g. Pembangunan Pabrik Kelapa Sawit" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sektor</label>
                                    <select className="w-full p-3 border rounded-xl bg-slate-50"><option>Pertanian</option><option>Industri</option></select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi Target</label>
                                    <select className="w-full p-3 border rounded-xl bg-slate-50"><option>Medan</option><option>Deli Serdang</option></select>
                                </div>
                            </div>
                        </div>

                        {/* Capacity & Finance */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 border-b pb-4">2. Kapasitas & Nilai</h3>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Rencana Nilai Investasi (Rp)</label>
                                <input required type="number" className="w-full p-3 border rounded-xl bg-slate-50" placeholder="1.000.000.000" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Kebutuhan Tenaga Kerja (Orang)</label>
                                <input required type="number" className="w-full p-3 border rounded-xl bg-slate-50" placeholder="50" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        <FiSend size={20} /> Kirim Permohonan Investasi
                    </button>
                </form>
            )}

            {/* FORM: OWNER MODE */}
            {proposalType === "owner" && (
                <form onSubmit={handleSubmit} className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-bold flex items-center gap-2"><FiHome /> Formulir Penawaran Lahan</h2>
                        <p className="opacity-90 text-sm mt-1">Daftarkan aset Anda untuk database peluang investasi daerah.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Land Info */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 border-b pb-4">1. Spesifikasi Lahan / Aset</h3>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Lahan</label>
                                <input required className="w-full p-3 border rounded-xl bg-slate-50" placeholder="e.g. Lahan Industri Siap Bangun di Binjai" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Luas Area (Ha)</label>
                                    <input type="number" step="0.01" className="w-full p-3 border rounded-xl bg-slate-50" placeholder="0.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Harga Penawaran /m²</label>
                                    <input type="number" className="w-full p-3 border rounded-xl bg-slate-50" placeholder="Rp" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Status Legalitas</label>
                                <select className="w-full p-3 border rounded-xl bg-slate-50">
                                    <option>SHM (Sertifikat Hak Milik)</option>
                                    <option>HGU (Hak Guna Usaha)</option>
                                    <option>Girik / Petok D</option>
                                    <option>Tanah Adat</option>
                                </select>
                            </div>
                        </div>

                        {/* Details & Infra */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 border-b pb-4">2. Kondisi & Infrastruktur</h3>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Akses Jalan</label>
                                <select className="w-full p-3 border rounded-xl bg-slate-50">
                                    <option>Jalan Raya Utama (Aspal)</option>
                                    <option>Jalan Desa (Beton/Aspal)</option>
                                    <option>Jalan Tanah</option>
                                    <option>Belum Ada Akses</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Jarak ke Fasilitas Publik</label>
                                <textarea className="w-full p-3 border rounded-xl bg-slate-50 h-24 placeholder:text-sm" placeholder="e.g. 5km dari Pintu Tol, 2km dari Pelabuhan..."></textarea>
                            </div>

                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50">
                                <FiUploadCloud className="mx-auto text-slate-400 mb-2" />
                                <span className="text-sm text-slate-600">Upload Foto Lokasi</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        <FiSend size={20} /> Daftarkan Lokasi Saya
                    </button>
                </form>
            )}

        </div>
    );
}
