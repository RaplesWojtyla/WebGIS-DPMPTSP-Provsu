import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
    return (
        <section id="kontak" className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100">
                    <div className="p-8 md:p-12 space-y-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-bl-full z-0 opacity-10"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-600 rounded-tr-full z-0 opacity-10"></div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Hubungi Kami</h2>
                                <p className="text-gray-400">Silakan hubungi kami untuk informasi lebih lanjut atau konsultasi.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-lg">Alamat Kantor</h4>
                                        <p className="text-gray-400 leading-relaxed">
                                            Jl. K.H. Wahid Hasyim No.8A, Merdeka,<br />
                                            Kec. Medan Baru, Kota Medan,<br />
                                            Sumatera Utara 20154
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-lg">Telepon</h4>
                                        <p className="text-gray-400">
                                            (061) 451-4614 — (061) 457-2953
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-lg">Email</h4>
                                        <p className="text-gray-400">
                                            dpmptsp@sumutprov.go.id
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-lg">Jam Operasional</h4>
                                        <p className="text-gray-400">
                                            Senin - Jumat: 09.00 - 15.00 WIB<br />
                                            <span className="text-sm text-gray-500">(Kecuali hari libur nasional)</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 bg-white">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <Input placeholder="John Doe" className="focus-visible:ring-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <Input type="email" placeholder="john@example.com" className="focus-visible:ring-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Subjek</label>
                                <Input placeholder="Perihal pesan Anda" className="focus-visible:ring-green-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Pesan</label>
                                <Textarea placeholder="Tuliskan pesan Anda di sini..." className="min-h-[150px] focus-visible:ring-green-500" />
                            </div>
                            <Button className="w-full bg-linear-to-r from-blue-700 to-blue-850 hover:from-blue-850 hover:to-blue-950 text-white shadow-lg shadow-blue-100">
                                Kirim Pesan
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-12 w-full h-[100vh] bg-gray-200 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 font-medium">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.058729154579!2d98.65581707486227!3d3.5739699964002156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312fd63f5fe24d%3A0x84645c5d9a30054a!2sDinas%20Penanaman%20Modal%20dan%20PTSP%20Prov.%20Sumatera%20Utara!5e0!3m2!1sen!2sid!4v1768184771231!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
