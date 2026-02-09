'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { pdrbBulkSchema, type PdrbBulkFormData } from "@/lib/zod/pdrb-schema"

const OPERATOR_PATH = '/operator/pdrb'
const ADMIN_PATH = '/admin/dashboard/pdrb'

// ==================== SHARED ====================

export async function getRegenciesWithProvince() {
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

// ==================== OPERATOR ACTIONS ====================

export async function getPdrbByRegencyYear(regencyId: string, year: number) {
    try {
        const pdrbValues = await prisma.pdrbValue.findMany({
            where: { regencyId, year },
            include: { sector: true },
            orderBy: { sector: { code: 'asc' } }
        })

        return { success: true, data: pdrbValues }
    } catch (error) {
        console.error('Failed to get PDRB values:', error)

        return { success: false, error: 'Gagal mengambil data PDRB' }
    }
}

export async function upsertPdrbValues(data: PdrbBulkFormData) {
    const validation = pdrbBulkSchema.safeParse(data)

    if (!validation.success) {
        return { 
            success: false, 
            error: validation.error.issues[0]?.message || 'Data tidak valid' 
        }
    }

    const { regencyId, year, values } = validation.data

    try {
        await prisma.$transaction(
            values.map(v =>
                prisma.pdrbValue.upsert({
                    where: {
                        regencyId_sectorId_year: {
                            regencyId,
                            sectorId: v.sectorId,
                            year
                        }
                    },
                    update: {
                        value: v.value,
                        status: 'PENDING',
                        submittedAt: null,
                        approvedAt: null,
                        approvedBy: null,
                        notes: null
                    },
                    create: {
                        regencyId,
                        sectorId: v.sectorId,
                        year,
                        value: v.value,
                        status: 'PENDING'
                    }
                })
            )
        )

        revalidatePath(OPERATOR_PATH)
        revalidatePath(ADMIN_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to upsert PDRB values:', error)
        return { success: false, error: 'Gagal menyimpan data PDRB' }
    }
}

export async function submitPdrbForApproval(regencyId: string, year: number) {
    if (!regencyId || !year) {
        return { 
            success: false, 
            error: 'Data tidak lengkap' 
        }
    }

    try {
        await prisma.pdrbValue.updateMany({
            where: { regencyId, year },
            data: {
                status: 'PENDING',
                submittedAt: new Date()
            }
        })

        revalidatePath(OPERATOR_PATH)
        revalidatePath(ADMIN_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to submit PDRB:', error)

        return { success: false, error: 'Gagal mengajukan data untuk review' }
    }
}

// ==================== ADMIN ACTIONS ====================

export async function getAllPdrbForReview(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    try {
        const pdrbValues = await prisma.pdrbValue.findMany({
            where: status ? { status } : undefined,
            include: {
                regency: { include: { province: true } },
                sector: true
            },
            orderBy: [{ year: 'desc' }, { regency: { code: 'asc' } }]
        })

        return { success: true, data: pdrbValues }
    } catch (error) {
        console.error('Failed to get PDRB for review:', error)

        return { success: false, error: 'Gagal mengambil data PDRB' }
    }
}

export async function approvePdrb(regencyId: string, year: number, userId: string) {
    if (!regencyId || !year || !userId) {
        return { 
            success: false, 
            error: 'Data tidak lengkap' 
        }
    }

    try {
        await prisma.pdrbValue.updateMany({
            where: { regencyId, year },
            data: {
                status: 'APPROVED',
                approvedAt: new Date(),
                approvedBy: userId,
                notes: null
            }
        })

        revalidatePath(OPERATOR_PATH)
        revalidatePath(ADMIN_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to approve PDRB:', error)

        return { success: false, error: 'Gagal menyetujui data' }
    }
}

export async function rejectPdrb(regencyId: string, year: number, userId: string, notes: string) {
    if (!regencyId || !year || !userId) {
        return { 
            success: false, 
            error: 'Data tidak lengkap' 
        }
    }

    try {
        await prisma.pdrbValue.updateMany({
            where: { regencyId, year },
            data: {
                status: 'REJECTED',
                approvedAt: new Date(),
                approvedBy: userId,
                notes: notes || 'Tidak ada catatan'
            }
        })

        revalidatePath(OPERATOR_PATH)
        revalidatePath(ADMIN_PATH)

        return { success: true }
    } catch (error) {
        console.error('Failed to reject PDRB:', error)

        return { success: false, error: 'Gagal menolak data' }
    }
}

// ==================== SUMMARY QUERIES ====================

export async function getPdrbSummaryByRegency(year: number) {
    try {
        const result = await prisma.pdrbValue.groupBy({
            by: ['regencyId', 'status'],
            where: { year },
            _sum: { value: true },
            _count: true
        })

        const regencies = await prisma.regency.findMany({
            include: { province: true }
        })

        const regencyMap = new Map(regencies.map(r => [r.id, r]))

        const summary = result.map(r => ({
            regencyId: r.regencyId,
            regency: regencyMap.get(r.regencyId),
            status: r.status,
            totalValue: r._sum.value || 0,
            sectorCount: r._count
        }))

        return { success: true, data: summary }
    } catch (error) {
        console.error('Failed to get PDRB summary:', error)
        
        return { success: false, error: 'Gagal mengambil ringkasan PDRB' }
    }
}
