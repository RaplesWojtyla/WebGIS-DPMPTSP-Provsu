'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {
    regencySchema,
    districtSchema,
    villageSchema,
    type RegencyFormData,
    type DistrictFormData,
    type VillageFormData
} from "@/lib/zod/wilayah-schema"

const REVALIDATE_PATH = '/admin/dashboard/wilayah'


export async function getProvinces() {
    try {
        const provinces = await prisma.province.findMany({
            orderBy: { code: 'asc' }
        })
        return { success: true, data: provinces }
    } catch (error) {
        console.error('Failed to get provinces:', error)
        return { success: false, error: 'Gagal mengambil data provinsi' }
    }
}


export async function getRegencies() {
    try {
        const regencies = await prisma.regency.findMany({
            include: { province: true },
            orderBy: { code: 'asc' }
        })
        return { success: true, data: regencies }
    } catch (error) {
        console.error('Failed to get regencies:', error)
        return { success: false, error: 'Gagal mengambil data kabupaten' }
    }
}

export async function createRegency(data: RegencyFormData) {
    const validation = regencySchema.safeParse(data)

    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const regency = await prisma.regency.create({
            data: {
                code: validation.data.code,
                name: validation.data.name,
                provinceId: validation.data.provinceId,
            }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true, data: regency }
    } catch (error) {
        console.error('Failed to create regency:', error)
        return { success: false, error: 'Gagal menambahkan kabupaten' }
    }
}

export async function updateRegency(id: string, data: RegencyFormData) {
    if (!id) {
        return { success: false, error: 'ID kabupaten tidak valid' }
    }

    const validation = regencySchema.safeParse(data)

    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const regency = await prisma.regency.update({
            where: { id },
            data: {
                code: validation.data.code,
                name: validation.data.name,
                provinceId: validation.data.provinceId,
            }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true, data: regency }
    } catch (error) {
        console.error('Failed to update regency:', error)
        return { success: false, error: 'Gagal mengubah kabupaten' }
    }
}

export async function deleteRegency(id: string) {
    if (!id) {
        return { success: false, error: 'ID kabupaten tidak valid' }
    }

    try {
        await prisma.regency.delete({
            where: { id }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to delete regency:', error)
        return { success: false, error: 'Gagal menghapus kabupaten' }
    }
}

export async function getDistricts(regencyId?: string) {
    try {
        const districts = await prisma.district.findMany({
            where: regencyId ? { regencyId } : undefined,
            include: { regency: true },
            orderBy: { code: 'asc' }
        })
        return { success: true, data: districts }
    } catch (error) {
        console.error('Failed to get districts:', error)
        return { success: false, error: 'Gagal mengambil data kecamatan' }
    }
}

export async function createDistrict(data: DistrictFormData) {
    const validation = districtSchema.safeParse(data)

    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const district = await prisma.district.create({
            data: {
                code: validation.data.code,
                name: validation.data.name,
                regencyId: validation.data.regencyId,
            }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true, data: district }
    } catch (error) {
        console.error('Failed to create district:', error)
        return { success: false, error: 'Gagal menambahkan kecamatan' }
    }
}

export async function updateDistrict(id: string, data: DistrictFormData) {
    if (!id) {
        return { success: false, error: 'ID kecamatan tidak valid' }
    }

    const validation = districtSchema.safeParse(data)

    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const district = await prisma.district.update({
            where: { id },
            data: {
                code: validation.data.code,
                name: validation.data.name,
                regencyId: validation.data.regencyId,
            }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true, data: district }
    } catch (error) {
        console.error('Failed to update district:', error)
        return { success: false, error: 'Gagal mengubah kecamatan' }
    }
}

export async function deleteDistrict(id: string) {
    if (!id) {
        return { success: false, error: 'ID kecamatan tidak valid' }
    }

    try {
        await prisma.district.delete({
            where: { id }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to delete district:', error)
        return { success: false, error: 'Gagal menghapus kecamatan' }
    }
}
export async function getVillages(districtId?: string) {
    try {
        const villages = await prisma.village.findMany({
            where: districtId ? { districtId } : undefined,
            include: {
                district: {
                    include: { regency: true }
                }
            },
            orderBy: { code: 'asc' }
        })
        return { success: true, data: villages }
    } catch (error) {
        console.error('Failed to get villages:', error)
        return { success: false, error: 'Gagal mengambil data desa' }
    }
}

export async function createVillage(data: VillageFormData) {
    const validation = villageSchema.safeParse(data)

    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const village = await prisma.village.create({
            data: {
                code: validation.data.code,
                name: validation.data.name,
                districtId: validation.data.districtId,
            }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true, data: village }
    } catch (error) {
        console.error('Failed to create village:', error)
        return { success: false, error: 'Gagal menambahkan desa' }
    }
}

export async function updateVillage(id: string, data: VillageFormData) {
    if (!id) {
        return { success: false, error: 'ID desa tidak valid' }
    }

    const validation = villageSchema.safeParse(data)

    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const village = await prisma.village.update({
            where: { id },
            data: {
                code: validation.data.code,
                name: validation.data.name,
                districtId: validation.data.districtId,
            }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true, data: village }
    } catch (error) {
        console.error('Failed to update village:', error)
        return { success: false, error: 'Gagal mengubah desa' }
    }
}

export async function deleteVillage(id: string) {
    if (!id) {
        return { success: false, error: 'ID desa tidak valid' }
    }

    try {
        await prisma.village.delete({
            where: { id }
        })

        revalidatePath(REVALIDATE_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to delete village:', error)
        return { success: false, error: 'Gagal menghapus desa' }
    }
}
