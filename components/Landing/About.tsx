import { CheckCircle2 } from "lucide-react";

export default function About() {
    return (
        <section id="profil" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative order-2 md:order-1">
                        <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 relative group">
                            {/* Placeholder for video/image */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 text-gray-400">
                                <span className="font-medium flex items-center gap-2"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">▶</div> Video Profil</span>
                            </div>
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        {/* Decoration */}
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100/50 rounded-full z-[-1] blur-md"></div>
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-50/50 rounded-full z-[-1] blur-md"></div>
                    </div>

                    <div className="order-1 md:order-2 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Tentang DPMPTSP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-950">Sumatera Utara</span>
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Provinsi Sumatera Utara bertugas menyelenggarakan pelayanan perizinan dan penanaman modal secara terintegrasi dengan prinsip koordinasi, integrasi, sinkronisasi, simplifikasi, keamanan, dan kepastian.
                        </p>

                        <p className="text-gray-600 leading-relaxed">
                            Kami berkomitmen untuk menciptakan iklim investasi yang kondusif melalui pelayanan perizinan yang efisien, transparan, dan akuntabel.
                        </p>

                        <ul className="space-y-4 pt-4">
                            {[
                                "Pelayanan Terpadu Satu Pintu",
                                "Dukungan Investasi Daerah",
                                "Digitalisasi Perizinan",
                                "Promosi dan Fasilitasi Investasi",
                                "Pengawasan dan Pengendalian Perizinan"
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6 border-t border-gray-100">
                            <blockquote className="italic text-gray-500 border-l-4 border-blue-600 pl-4 bg-blue-50/30 py-2 rounded-r-lg">
                                "Mewujudkan Pelayanan Perizinan dan Penanaman Modal yang Profesional, Transparan, dan Akuntabel"
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
