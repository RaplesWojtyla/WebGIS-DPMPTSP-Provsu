'use server'

import { headers } from "next/headers"
import { auth } from "../better-auth/auth"
import { SignInFormData, signInSchema, SignUpFormData, signUpSchema } from "../zod/auth-schema"
import { APIError } from "better-auth"

export const signInWithGoogle = async () => {
    try {
        const response = await auth.api.signInSocial({
            body: {
                provider: 'google',
                callbackURL: '/'
            }
        })

        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.error('Sign in with Google failed', error)

        return {
            success: false,
            error: "Gagal masuk dengan akun Google"
        }
    }
}

export const signUpWithEmail = async (data: SignUpFormData) => {
    const validation = signUpSchema.safeParse(data)

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors,
            message: "Periksa kembali data yang anda masukkan"
        }
    }

    try {
        const response = await auth.api.signUpEmail({
            body: {
                email: data.email,
                name: data.name,
                password: data.password,
                role: 'user'
            }
        })

        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.error('Sign up with email failed', error)

        if (error instanceof APIError) {
            if (error.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
                return {
                    success: false,
                    message: "Email sudah terdaftar",
                    error: {
                        email: ["Email sudah terdaftar"]
                    }
                }
            }
        }

        return {
            success: false,
            message: "Gagal mendaftar dengan email"
        }
    }
}

export const signInWithEmail = async (data: SignInFormData) => {
    const validation = signInSchema.safeParse(data)

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors,
            message: "Periksa kembali data yang anda masukkan"
        }
    }

    try {
        const response = await auth.api.signInEmail({
            body: {
                email: data.email,
                password: data.password
            }
        })

        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.error('Sign in with email failed', error)

        if (error instanceof APIError) {
            console.log(error.body)
            if (error.body?.code === 'INVALID_EMAIL_OR_PASSWORD') {
                return {
                    success: false,
                    message: "Email atau kata sandi salah",
                    error: {
                        email: ["Email atau kata sandi salah"]
                    }
                }
            } else if (error.body?.code === 'EMAIL_NOT_VERIFIED') {
                return {
                    success: false,
                    errorCode: 'EMAIL_NOT_VERIFIED',
                    message: "Email belum terverifikasi",
                    error: {
                        email: ["Email belum terverifikasi"]
                    }
                }
            } else {
                return {
                    success: false,
                    message: error.body?.message || "Gagal masuk dengan email",
                }
            }
        }

        return {
            success: false,
            message: "Gagal masuk dengan email"
        }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({
            headers: await headers()
        })

        return {
            success: true,
            data: null
        }
    } catch (error) {
        console.error('Sign out failed', error)

        return {
            success: false,
            error: "Gagal keluar dari akun"
        }
    }
}

export const resendVerificationEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
        return {
            success: false,
            message: "Email tidak valid"
        }
    }

    try {
        await auth.api.sendVerificationEmail({
            body: {
                email: email,
                callbackURL: "/"
            }
        })

        return {
            success: true,
            message: "Email verifikasi telah dikirim ulang"
        }
    } catch (error) {
        console.error('Resend verification email failed', error)

        if (error instanceof APIError) {
            if (error.body?.code === 'USER_NOT_FOUND') {
                return {
                    success: false,
                    message: "Email tidak terdaftar"
                }
            } else if (error.body?.code === 'EMAIL_ALREADY_VERIFIED') {
                return {
                    success: false,
                    message: "Email sudah terverifikasi"
                }
            }
        }

        return {
            success: false,
            message: "Gagal mengirim ulang email verifikasi"
        }
    }
}
