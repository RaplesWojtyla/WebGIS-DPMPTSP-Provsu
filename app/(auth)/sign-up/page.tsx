"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignUpFormData, signUpSchema } from "@/lib/zod/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";

import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter()

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        mode: 'onBlur'
    })

    const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData) => {
        const response = await signUpWithEmail(data)

        if (response.success) {
            toast.success("Akun berhasil dibuat!", {
                description: "Email konfirmasi telah dikirim ke " + data.email,
                duration: 5000
            })
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
        } else {
            toast.error("Gagal membuat akun", {
                description: response.message || "Periksa kembali data yang anda masukkan",
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
                        setError(field as keyof SignUpFormData, {
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
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-bold">Buat Akun</CardTitle>
                            <CardDescription>
                                Masukkan detail Anda di bawah ini untuk membuat akun
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <InputField
                                    name="name"
                                    label="Nama Lengkap"
                                    placeholder="John Doe"
                                    register={register}
                                    error={errors.name}
                                />

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
                                    label="Kata Sandi"
                                    type="password"
                                    placeholder="Masukkan kata sandi Anda"
                                    register={register}
                                    error={errors.password}
                                />

                                <InputField
                                    name={'confirmPassword'}
                                    label="Konfirmasi Kata Sandi"
                                    type="password"
                                    placeholder="Konfirmasi kata sandi Anda"
                                    register={register}
                                    error={errors.confirmPassword}
                                />

                                <Button
                                    type="submit"
                                    variant="default"
                                    className="w-full h-12 text-base bg-blue-900 hover:bg-blue-800 text-white transition duration-300 cursor-pointer"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Mendaftar..." : "Buat Akun"}
                                </Button>
                            </form>

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
                        </CardContent>
                        <CardFooter className="justify-center">
                            <div className="text-sm text-muted-foreground">
                                Sudah punya akun?{" "}
                                <Link href="/sign-in" className="text-primary underline-offset-4 font-bold hover:underline hover:text-blue-800 hover:font-bold">
                                    Masuk
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
