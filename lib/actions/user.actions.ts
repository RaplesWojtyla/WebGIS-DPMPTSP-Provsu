'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const ADMIN_USERS_PATH = '/admin/dashboard/users'

type Role = 'user' | 'operator' | 'admin'


export async function getAllUsers(search?: string, role?: Role | 'all') {
    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    search ? {
                        OR: [
                            { 
                                name: { 
                                    contains: search, 
                                    mode: 'insensitive' 
                                } 
                            },
                            { 
                                email: { 
                                    contains: search, 
                                    mode: 'insensitive' 
                                } 
                            }
                        ]
                    } : {},
                    role && role !== 'all' ? { role } : {}
                ]
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                role: true,
                suspended: true,
                suspendedAt: true,
                createdAt: true,
            }
        })

        return { 
            success: true, 
            data: users 
        }
    } catch (error) {
        console.error('Failed to get users:', error)

        return { 
            success: false, 
            error: 'Gagal mengambil data pengguna' 
        }
    }
}

export async function getUserById(userId: string) {
    if (!userId) {
        return { 
            success: false, 
            error: 'User ID tidak valid' 
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                role: true,
                suspended: true,
                suspendedAt: true,
                createdAt: true,
            }
        })

        if (!user) {
            return { 
                success: false, 
                error: 'Pengguna tidak ditemukan' 
            }
        }

        return { 
            success: true, 
            data: user 
        }
    } catch (error) {
        console.error('Failed to get user:', error)

        return { 
            success: false, 
            error: 'Gagal mengambil data pengguna'
        }
    }
}

export async function updateUserRole(userId: string, role: Role) {
    if (!userId || !role) {
        return { 
            success: false, 
            error: 'Data tidak lengkap' 
        }
    }

    if (!['user', 'operator', 'admin'].includes(role)) {
        return { 
            success: false, 
            error: 'Role tidak valid' 
        }
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        revalidatePath(ADMIN_USERS_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to update user role:', error)

        return { 
            success: false, 
            error: 'Gagal mengubah role pengguna' 
        }
    }
}

export async function suspendUser(userId: string) {
    if (!userId) {
        return { 
            success: false, 
            error: 'User ID tidak valid' 
        }
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                suspended: true,
                suspendedAt: new Date()
            }
        })

        await prisma.session.deleteMany({
            where: { userId }
        })

        revalidatePath(ADMIN_USERS_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to suspend user:', error)

        return { success: false, error: 'Gagal menonaktifkan pengguna' }
    }
}

export async function unsuspendUser(userId: string) {
    if (!userId) {
        return { 
            success: false, 
            error: 'User ID tidak valid' 
        }
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                suspended: false,
                suspendedAt: null
            }
        })

        revalidatePath(ADMIN_USERS_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to unsuspend user:', error)

        return { 
            success: false, 
            error: 'Gagal mengaktifkan kembali pengguna' 
        }
    }
}

export async function deleteUser(userId: string) {
    if (!userId) {
        return { success: false, error: 'User ID tidak valid' }
    }

    try {
        await prisma.session.deleteMany({
            where: { userId }
        })

        await prisma.account.deleteMany({
            where: { userId }
        })

        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath(ADMIN_USERS_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to delete user:', error)

        return { 
            success: false, 
            error: 'Gagal menghapus pengguna' 
        }
    }
}
