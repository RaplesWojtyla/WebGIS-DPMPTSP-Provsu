import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "../prisma"
import { nextCookies } from "better-auth/next-js"

let authInstance: ReturnType<typeof betterAuth> | null = null

export const getAuth = async () => {
    if (authInstance) {
        return authInstance
    }


    if (!process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL) {
        throw new Error("BETTER_AUTH_SECRET and BETTER_AUTH_URL must be provided.")
    }

    authInstance = betterAuth({
        database: prismaAdapter(prisma, {
            provider: 'postgresql'
        }),
        secret: process.env.BETTER_AUTH_SECRET!,
        baseURL: process.env.BETTER_AUTH_URL!,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true
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

    return authInstance
}