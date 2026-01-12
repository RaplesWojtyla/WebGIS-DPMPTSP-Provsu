import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, TrendingUp, Users, Award } from "lucide-react";

export default function Hero() {
    return (
        <section id="beranda" className="relative pt-24 pb-12 md:pt-12 md:pb-24 overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium border border-green-200">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Selamat Datang di DPMPTSP Sumut
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white-900 leading-tight">
                            Mendorong Investasi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">Mempermudah Perizinan</span> di Sumatera Utara
                        </h1>

                        <p className="text-lg text-gray-600 max-w-lg">
                            Pelayanan perizinan dan penanaman modal yang cepat, transparan, dan terintegrasi berbasis digital untuk mewujudkan iklim investasi yang kondusif.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-12 px-6 text-base shadow-green-200 transition-all hover:shadow-green-300">
                                Ajukan Perizinan <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-12 px-6 text-base border-gray-300 hover:bg-white text-green-700">
                                Peta Investasi
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-white backdrop-blur-sm rounded-xl shadow-sm border border-green-100">
                                <div className="text-3xl font-bold text-gray-900">33</div>
                                <div className="text-sm text-gray-500">Kabupaten/Kota</div>
                            </div>
                            <div className="p-4 bg-white backdrop-blur-sm rounded-xl shadow-sm border border-green-100">
                                <div className="text-3xl font-bold text-gray-900">4.5M+</div>
                                <div className="text-sm text-gray-500">Penduduk (approx)</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 translate-y-8">
                                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-green-900/5 border border-green-50 hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Izin Terbit 2025</h3>
                                    <p className="text-2xl font-bold text-blue-700">12,450+</p>
                                    <p className="text-xs text-gray-500">Dokumen diterbitkan</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-green-900/5 border border-green-50 hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Nilai Investasi</h3>
                                    <p className="text-2xl font-bold text-emerald-700">Rp 45T+</p>
                                    <p className="text-xs text-gray-500">Realisasi 2025</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-green-900/5 border border-green-50 hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Investor</h3>
                                    <p className="text-2xl font-bold text-purple-700">5,000+</p>
                                    <p className="text-xs text-gray-500">Terdaftar di OSS</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-green-900/5 border border-green-50 hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                                        <Award className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Kepuasan</h3>
                                    <p className="text-2xl font-bold text-amber-700">92%</p>
                                    <p className="text-xs text-gray-500">Indeks Kepuasan Masyarakat</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative blobs */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-100/40 via-green-50/40 to-teal-100/40 blur-3xl rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
