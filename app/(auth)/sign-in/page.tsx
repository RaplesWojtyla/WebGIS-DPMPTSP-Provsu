"use client"

import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormData, signInSchema } from "@/lib/zod/auth-schema";
import { resendVerificationEmail, signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";

export default function SignInPage() {
    const router = useRouter()

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        mode: 'onSubmit'
    })

    const onSubmit: SubmitHandler<SignInFormData> = async (data: SignInFormData) => {
        const response = await signInWithEmail(data)

        if (response.success) {
            router.push('/')
        } else {
            if (response.errorCode === 'EMAIL_NOT_VERIFIED') {
                toast.info("Email Belum Terverifikasi", {
                    description: "Mengirim ulang email verifikasi...",
                    duration: 3000,
                })

                try {
                    await resendVerificationEmail(data.email)
                } catch (error) {
                    console.error("Resend verification email failed", error)
                    toast.error("Gagal mengirim email verifikasi", {
                        description: "Silakan coba lagi beberapa saat.",
                        duration: 5000,
                    })

                    return
                }

                toast.success("Email Verifikasi Terkirim!", {
                    description: "Silakan cek inbox atau folder spam Anda",
                    duration: 5000,
                    className: '!border-red-600 !bg-red-300',
                    classNames: {
                        title: '!text-red-800 !font-bold !text-base',
                        description: '!text-red-900',
                        icon: '!text-red-900 size-4'
                    }
                })

                router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
                return
            }

            toast.error("Gagal Masuk", {
                description: response.message || "Kredensial yang Anda masukkan tidak valid.",
                duration: 5000,
                className: '!border-red-600 !bg-red-300',
                classNames: {
                    title: '!text-red-800 !font-bold !text-base',
                    description: '!text-red-900',
                    icon: '!text-red-900 size-4'
                }
            })

            if (typeof response.error === 'object') {
                Object.entries(response.error).forEach(([field, messages]) => {
                    if (messages && messages.length > 0) {
                        setError(field as keyof SignInFormData, {
                            type: 'server',
                            message: messages[0]
                        })
                    }
                })
            }
        }
    }

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
                        <CardHeader className="text-center space-y-1">
                            <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
                            <CardDescription>
                                Masukkan email dan kata sandi untuk mengakses akun Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 p-2">
                            <form
                                className="space-y-5"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <InputField
                                    name={'email'}
                                    label="Email"
                                    type="email"
                                    placeholder="Masukkan alamat email anda"
                                    register={register}
                                    error={errors.email}
                                />

                                <InputField
                                    name={'password'}
                                    label="Password"
                                    type="password"
                                    placeholder="Masukkan kata sandi anda"
                                    register={register}
                                    error={errors.password}
                                />

                                <Button
                                    type="submit"
                                    variant="default"
                                    className="w-full h-12 text-base bg-blue-900 hover:bg-blue-800 text-white transition duration-300 cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Masuk...' : 'Masuk'}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Atau lanjutkan dengan
                                        </span>
                                    </div>
                                </div>

                                <GoogleAuthButton />
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-center gap-2">
                            <div className="text-sm text-muted-foreground">
                                Belum punya akun?{" "}
                                <Link href="/sign-up" className="text-primary underline-offset-4 font-bold hover:underline hover:text-blue-800 hover:font-bold">
                                    Daftar
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
