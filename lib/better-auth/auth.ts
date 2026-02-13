import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "../prisma"
import { nextCookies } from "better-auth/next-js"
import { render } from "@react-email/components"
import EmailVerification from "@/components/email/EmailVerificationTemplate"
import { transporter } from "../email/mailer"
import { createAuthMiddleware, APIError } from "better-auth/api"


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
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-in/email") {
                const email = ctx.body?.email
                if (email) {
                    const user = await prisma.user.findUnique({
                        where: { email },
                        select: { suspended: true }
                    })
                    if (user?.suspended) {
                        throw new APIError("FORBIDDEN", {
                            message: "Akun Anda telah dinonaktifkan. Hubungi administrator.",
                            code: "ACCOUNT_SUSPENDED"
                        })
                    }
                }
            }
        }),
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const emailHtml = await render(EmailVerification({ user: user.name, url }))

            await transporter.sendMail({
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                subject: "DPMPTSP Provinsi Sumatera Utara - Verifikasi Email",
                html: emailHtml
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

