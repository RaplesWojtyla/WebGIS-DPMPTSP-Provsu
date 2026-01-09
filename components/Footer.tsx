import Link from "next/link"
import { Facebook, Instagram, MapPin, Phone } from "lucide-react"

export function Footer() {
    return (
        <footer className="w-full border-t bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white">
            <div className="container px-4 md:px-6 py-4 md:py-16">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">DPMPTSP Sumut</h4>
                        <p className="text-sm text-blue-100">
                            Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Provinsi Sumatera Utara.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">Contact</h4>
                        <div className="space-y-2 text-sm text-blue-100">
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>
                                    Jl. K.H. Wahid Hasyim No.8, Babura, Kec. Medan Baru, Kota Medan, Sumatera Utara 20154
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>(061) 12345678</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">Follow Us</h4>
                        <div className="flex gap-4">
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-100 hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-100 hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li>
                                <Link href="/" className="hover:text-white hover:underline transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white hover:underline transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-white hover:underline transition-colors">
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t border-slate-500 pt-6 text-center text-xs text-blue-200">
                    <p>© {new Date().getFullYear()} DPMPTSP Provinsi Sumatera Utara. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
