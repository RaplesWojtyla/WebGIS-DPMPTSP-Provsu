'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sectorSchema, type SectorFormData } from "@/lib/zod/sector-schema"


export async function getSectors() {
    try {
        const sectors = await prisma.sector.findMany({
            orderBy: { code: 'asc' }
        })
        return { success: true, data: sectors }
    } catch (error) {
        console.error('Failed to get sectors:', error)
        return { success: false, error: 'Gagal mengambil data sektor' }
    }
}


export async function createSector(data: SectorFormData) {
    const validation = sectorSchema.safeParse(data)
    
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const sector = await prisma.sector.create({
            data: {
                code: validation.data.code,
                name: validation.data.name,
                nameEn: validation.data.nameEn,
                description: validation.data.description,
            }
        })

        revalidatePath('/admin/dashboard/sektor')

        return { success: true, data: sector }
    } catch (error) {
        console.error('Failed to create sector:', error)
        return { success: false, error: 'Gagal menambahkan sektor' }
    }
}


export async function updateSector(id: string, data: SectorFormData) {
    if (!id) {
        return { success: false, error: 'ID sektor tidak valid' }
    }

    const validation = sectorSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0]?.message || 'Data tidak valid' }
    }

    try {
        const sector = await prisma.sector.update({
            where: { id },
            data: {
                code: validation.data.code,
                name: validation.data.name,
                nameEn: validation.data.nameEn,
                description: validation.data.description,
            }
        })

        revalidatePath('/admin/dashboard/sektor')
9
        return { success: true, data: sector }
    } catch (error) {
        console.error('Failed to update sector:', error)
        return { success: false, error: 'Gagal mengubah sektor' }
    }
}


export async function deleteSector(id: string) {
    if (!id) {
        return { success: false, error: 'ID sektor tidak valid' }
    }

    try {
        await prisma.sector.delete({
            where: { id }
        })

        revalidatePath('/admin/dashboard/sektor')

        return { success: true }
    } catch (error) {
        console.error('Failed to delete sector:', error)
        return { success: false, error: 'Gagal menghapus sektor' }
    }
}
