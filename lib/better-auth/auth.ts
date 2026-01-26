import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "../prisma"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"
import EmailVerification from "@/components/email/EmailVerificationTemplate"

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
    user: {
        additionalFields: {
            role: {
                type: "string"
            }
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await resend.emails.send({
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                subject: "DPMPTSP Provinsi Sumatera Utara - Verifikasi Email",
                react: EmailVerification({ user: user.name, url })
            }).catch((error) => {
                console.error('Failed to send verification email', error)

                throw new Error('Failed to send verification email')
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            prompt: 'select_account'
        }
    },
    plugins: [nextCookies()]
})
