"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { resendVerificationEmail } from "@/lib/actions/auth.actions"

const COOLDOWN_SECONDS = 60

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const [isResending, setIsResending] = useState(false)
    const [cooldown, setCooldown] = useState(0)


    useEffect(() => {
        if (cooldown <= 0) return

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [cooldown])

    const handleResendEmail = async () => {
        if (!email) {
            toast.error("Email tidak ditemukan", {
                description: "Silakan daftar ulang untuk mendapatkan email verifikasi",
            })
            return
        }

        if (cooldown > 0) {
            toast.error("Mohon tunggu sebentar", {
                description: `Anda dapat mengirim ulang dalam ${cooldown} detik`,
            })
            return
        }

        setIsResending(true)
        try {
            const response = await resendVerificationEmail(email)

            if (response.success) {
                toast.success("Email verifikasi telah dikirim ulang!", {
                    description: "Silakan cek inbox atau folder spam Anda",
                    duration: 5000,
                })

                setCooldown(COOLDOWN_SECONDS)
            } else {
                toast.error("Gagal mengirim ulang email", {
                    description: response.message || "Silakan coba lagi dalam beberapa saat",
                })
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat mengirim ulang email:", error)
            
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi dalam beberapa saat",
            })
        } finally {
            setIsResending(false)
        }
    }

    const getEmailProvider = (email: string) => {
        if (email.includes("@gmail.com")) return { name: "Gmail", url: "https://mail.google.com" }
        if (email.includes("@yahoo.com")) return { name: "Yahoo Mail", url: "https://mail.yahoo.com" }
        if (email.includes("@outlook.com") || email.includes("@hotmail.com")) return { name: "Outlook", url: "https://outlook.live.com" }
        return null
    }

    const emailProvider = getEmailProvider(email)

    return (
        <div className="flex w-full h-full justify-center p-6 md:p-10">
            <div className="w-full max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                >
                    <Card className="border-0 shadow-none w-full h-full flex flex-col justify-center">
                        <CardHeader className="space-y-4 text-center">
                            <motion.div
                                className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <Mail className="w-10 h-10 text-blue-600" />
                            </motion.div>
                            <CardTitle className="text-2xl font-bold">Cek Email Anda</CardTitle>
                            <CardDescription className="text-base">
                                Kami telah mengirimkan email verifikasi ke{" "}
                                {email ? (
                                    <span className="font-semibold text-foreground">{email}</span>
                                ) : (
                                    "alamat email Anda"
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                                <p className="font-medium mb-2">📧 Tidak menerima email?</p>
                                <ul className="list-disc list-inside space-y-1 text-amber-700">
                                    <li>Cek folder spam atau junk</li>
                                    <li>Pastikan alamat email sudah benar</li>
                                    <li>Tunggu beberapa menit dan coba lagi</li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3">
                                {emailProvider && (
                                    <Button
                                        variant="default"
                                        className="w-full h-12 text-base bg-blue-900 hover:bg-blue-800 text-white transition duration-300"
                                        onClick={() => window.open(emailProvider.url, "_blank")}
                                    >
                                        <Mail className="mr-2 h-5 w-5" />
                                        Buka {emailProvider.name}
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full h-12 text-base cursor-pointer"
                                    onClick={handleResendEmail}
                                    disabled={isResending || cooldown > 0}
                                >
                                    <RefreshCw className={`mr-2 h-5 w-5 ${isResending ? "animate-spin" : ""}`} />
                                    {isResending
                                        ? "Mengirim ulang..."
                                        : cooldown > 0
                                            ? `Kirim Ulang (${cooldown}s)`
                                            : "Kirim Ulang Email"}
                                </Button>

                                <Link href="/sign-in" className="w-full">
                                    <Button
                                        variant="ghost"
                                        className="w-full h-12 text-base text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        <ArrowLeft className="mr-2 h-5 w-5" />
                                        Kembali ke Halaman Masuk
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
