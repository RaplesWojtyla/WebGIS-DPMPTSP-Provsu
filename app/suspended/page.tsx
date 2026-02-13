"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FiSlash, FiMail, FiArrowLeft } from "react-icons/fi"

export default function SuspendedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-white to-slate-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full text-center"
            >
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <FiSlash className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3">
                    Akun Dinonaktifkan
                </h1>

                <p className="text-slate-600 mb-8 leading-relaxed">
                    Akun Anda telah dinonaktifkan oleh administrator.
                    Anda tidak dapat mengakses layanan ini sampai akun Anda diaktifkan kembali.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
                    <h3 className="font-semibold text-amber-800 text-sm mb-2">Apa yang bisa Anda lakukan?</h3>
                    <ul className="text-sm text-amber-700 space-y-1.5">
                        <li className="flex items-start gap-2">
                            <FiMail className="mt-0.5 shrink-0" />
                            <span>Hubungi administrator di <strong>dpmptsp@sumutprov.go.id</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0">📞</span>
                            <span>Atau telepon ke <strong>(061) 456-7890</strong></span>
                        </li>
                    </ul>
                </div>

                <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <FiArrowLeft size={14} />
                    Kembali ke halaman masuk
                </Link>
            </motion.div>
        </div>
    )
}
