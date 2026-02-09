'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/better-auth/auth"
import { APIError } from "better-auth"

const PROFILE_PATH = '/admin/dashboard/profile'

export async function getCurrentUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return {
                success: false,
                error: 'Tidak ada sesi aktif'
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                role: true,
                createdAt: true,
            }
        })

        if (!user) {
            return {
                success: false,
                error: 'User tidak ditemukan'
            }
        }

        return {
            success: true,
            data: user
        }
    } catch (error) {
        console.error('Failed to get current user:', error)

        return {
            success: false,
            error: 'Gagal mengambil data user'
        }
    }
}

export async function updateProfile(name: string) {
    if (!name || name.trim().length < 2) {
        return {
            success: false,
            error: 'Nama harus minimal 2 karakter'
        }
    }

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return {
                success: false,
                error: 'Tidak ada sesi aktif'
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: name.trim() }
        })

        revalidatePath(PROFILE_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to update profile:', error)

        return {
            success: false,
            error: 'Gagal memperbarui profil'
        }
    }
}

export async function changePassword(currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
        return {
            success: false,
            error: 'Password tidak boleh kosong'
        }
    }

    if (newPassword.length < 8) {
        return {
            success: false,
            error: 'Password baru minimal 8 karakter'
        }
    }

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return {
                success: false,
                error: 'Tidak ada sesi aktif'
            }
        }

        const result = await auth.api.changePassword({
            headers: await headers(),
            body: {
                currentPassword,
                newPassword,
            }
        })

        if (!result) {
            return {
                success: false,
                error: 'Gagal mengubah password'
            }
        }

        return { success: true }
    } catch (error) {
        console.error('Failed to change password:', error)

        if (error instanceof APIError && error.body?.code === 'CREDENTIAL_ACCOUNT_NOT_FOUND') {
            return {
                success: false,
                error: 'Password saat ini salah'
            }
        }

        return {
            success: false,
            error: 'Gagal mengubah password'
        }
    }
}
