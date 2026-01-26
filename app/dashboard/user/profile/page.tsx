"use client";

import { useState, useEffect } from "react";
import { FiUser, FiSave, FiBriefcase, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState({
        // Personal
        fullName: "",
        nik: "",
        gender: "Laki-laki",
        placeOfBirth: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        jobTitle: "",

        // Company
        companyName: "",
        companyType: "PT", // PT, CV, UD, Firma
        nib: "", // Nomor Induk Berusaha
        npwpCompany: "",
        establishedYear: "",
        capitalSource: "PMDN", // PMDN / PMA
        annualRevenue: "",

        // Address
        address: "",
        province: "Sumatera Utara",
        regency: "",
        postalCode: "",

        isComplete: false,
    });

    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) {
            setProfile(JSON.parse(saved));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!profile.fullName || !profile.nik || !profile.companyName || !profile.nib) {
            alert("Harap lengkapi semua data wajib (bertanda *)");
            return;
        }

        const updatedProfile = { ...profile, isComplete: true };
        setProfile(updatedProfile);
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        alert("Profil berhasil disimpan! Fitur simulasi dan proposal kini terbuka.");
        router.push("/dashboard/user/simulation");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Profil Investor</h1>
                <p className="text-slate-500">Lengkapi data diri dan perusahaan Anda untuk memulai investasi.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FiUser size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-800">Data Pribadi / Penanggung Jawab</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                                <input name="fullName" value={profile.fullName} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" placeholder="Sesuai KTP" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">NIK <span className="text-red-500">*</span></label>
                                <input name="nik" value={profile.nik} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" placeholder="16 digit" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tempat Lahir</label>
                                <input name="placeOfBirth" value={profile.placeOfBirth} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Lahir</label>
                                <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Kelamin</label>
                                <select name="gender" value={profile.gender} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none">
                                    <option>Laki-laki</option>
                                    <option>Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Jabatan</label>
                                <input name="jobTitle" value={profile.jobTitle} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" placeholder="e.g. Direktur Utama" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">No. HP / WhatsApp <span className="text-red-500">*</span></label>
                                <input name="phone" value={profile.phone} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" placeholder="08..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 transition-all outline-none" placeholder="email@perusahaan.com" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FiBriefcase size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-800">Data Perusahaan (Legalitas)</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Perusahaan <span className="text-red-500">*</span></label>
                                <input name="companyName" value={profile.companyName} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bentuk Badan</label>
                                <select name="companyType" value={profile.companyType} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-100 transition-all outline-none">
                                    <option>PT</option>
                                    <option>CV</option>
                                    <option>UD</option>
                                    <option>Firma</option>
                                    <option>Koperasi</option>
                                    <option>Perorangan</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">NIB (Nomor Induk Berusaha) <span className="text-red-500">*</span></label>
                                <input name="nib" value={profile.nib} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="13 digit" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">NPWP Perusahaan</label>
                                <input name="npwpCompany" value={profile.npwpCompany} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" placeholder="15/16 digit" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tahun Berdiri</label>
                                <input type="number" name="establishedYear" value={profile.establishedYear} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-100 transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Sumber Modal</label>
                                <select name="capitalSource" value={profile.capitalSource} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-100 transition-all outline-none">
                                    <option value="PMDN">PMDN (Dalam Negeri)</option>
                                    <option value="PMA">PMA (Asing)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 xl:col-span-2">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FiMapPin size={20} /></div>
                        <h2 className="text-xl font-bold text-slate-800">Alamat Perusahaan</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap</label>
                            <textarea name="address" value={profile.address} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 transition-all outline-none h-32" placeholder="Nama Jalan, Gedung, No."></textarea>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Provinsi</label>
                                <select name="province" value={profile.province} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 transition-all outline-none">
                                    <option>Sumatera Utara</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Kabupaten/Kota</label>
                                <select name="regency" value={profile.regency} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 transition-all outline-none">
                                    <option value="">Pilih Kabupaten/Kota...</option>
                                    <option>Medan</option>
                                    <option>Deli Serdang</option>
                                    <option>Binjai</option>
                                    <option>Langkat</option>
                                    <option>Karo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Kode Pos</label>
                                <input name="postalCode" value={profile.postalCode} onChange={handleChange} className="w-full p-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 transition-all outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-end md:static md:bg-transparent md:border-none md:p-0">
                <button onClick={handleSave} className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105">
                    <FiSave size={20} /> Simpan Profil & Lanjutkan
                </button>
            </div>
        </div>
    );
}
