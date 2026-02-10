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

export async function getPdrbSummaryByYear(year: number) {
    try {
        const pdrbValues = await prisma.pdrbValue.findMany({
            where: { year },
            select: {
                regencyId: true,
                value: true,
                status: true,
                submittedAt: true
            }
        })

        const groupedData = pdrbValues.reduce((acc, curr) => {
            if (!acc[curr.regencyId]) {
                acc[curr.regencyId] = {
                    total: 0,
                    sectorCount: 0,
                    status: curr.status,
                    submittedAt: curr.submittedAt
                }
            }

            acc[curr.regencyId].total += curr.value
            acc[curr.regencyId].sectorCount += 1
            return acc
        }, {} as Record<string, {
            total: number;
            sectorCount: number;
            status: string;
            submittedAt: Date | null
        }>)

        return {
            success: true,
            data: groupedData
        }
    } catch (error) {
        console.error('Failed to get PDRB summary:', error)
        return {
            success: false, error: 'Gagal mengambil ringkasan PDRB'
        }
    }
}

export async function getPdrbValueForAnalysis(regencyId: string, sectorId: string, year: number) {
    try {
        const pdrbValue = await prisma.pdrbValue.findUnique({
            where: {
                regencyId_sectorId_year: { regencyId, sectorId, year }
            },
            select: { value: true }
        })

        return { success: true, data: pdrbValue?.value ?? 0 }
    } catch (error) {
        console.error('Failed to get PDRB value:', error)
        return { success: false, error: 'Gagal mengambil nilai PDRB' }
    }
}

export async function getTotalPdrbByRegencyYear(regencyId: string, year: number) {
    try {
        const result = await prisma.pdrbValue.aggregate({
            where: { regencyId, year },
            _sum: { value: true }
        })

        return { success: true, data: result._sum.value ?? 0 }
    } catch (error) {
        console.error('Failed to get total PDRB:', error)
        return { success: false, error: 'Gagal mengambil total PDRB' }
    }
}

export async function getProvincePdrbByYear(year: number, sectorId?: string) {
    try {
        const where = sectorId ? { year, sectorId } : { year }
        const result = await prisma.pdrbValue.aggregate({
            where,
            _sum: { value: true }
        })

        return { success: true, data: result._sum.value ?? 0 }
    } catch (error) {
        console.error('Failed to get province PDRB:', error)
        return { success: false, error: 'Gagal mengambil PDRB Provinsi' }
    }
}

export async function getLQAnalysisData(regencyId: string, sectorId: string, year: number) {
    try {
        const [pdrbSector, totalPdrb, pdbSector, totalPdb] = await Promise.all([
            getPdrbValueForAnalysis(regencyId, sectorId, year),
            getTotalPdrbByRegencyYear(regencyId, year),
            getProvincePdrbByYear(year, sectorId),
            getProvincePdrbByYear(year)
        ])

        return {
            success: true,
            data: {
                pdrbSector: pdrbSector.data ?? 0,
                totalPdrb: totalPdrb.data ?? 0,
                pdbSector: pdbSector.data ?? 0,
                totalPdb: totalPdb.data ?? 0
            }
        }
    } catch (error) {
        console.error('Failed to get LQ analysis data:', error)
        return { success: false, error: 'Gagal mengambil data analisis LQ' }
    }
}

export async function getTimeSeriesAnalysisData(regencyId: string, sectorId: string, startYear: number, endYear: number) {
    try {
        const [
            regionSectorStart, regionSectorEnd,
            regionTotalStart, regionTotalEnd,
            provSectorStart, provSectorEnd,
            provTotalStart, provTotalEnd
        ] = await Promise.all([
            getPdrbValueForAnalysis(regencyId, sectorId, startYear),
            getPdrbValueForAnalysis(regencyId, sectorId, endYear),
            getTotalPdrbByRegencyYear(regencyId, startYear),
            getTotalPdrbByRegencyYear(regencyId, endYear),
            getProvincePdrbByYear(startYear, sectorId),
            getProvincePdrbByYear(endYear, sectorId),
            getProvincePdrbByYear(startYear),
            getProvincePdrbByYear(endYear)
        ])

        return {
            success: true,
            data: {
                regionSectorStart: regionSectorStart.data ?? 0,
                regionSectorEnd: regionSectorEnd.data ?? 0,
                regionTotalStart: regionTotalStart.data ?? 0,
                regionTotalEnd: regionTotalEnd.data ?? 0,
                provSectorStart: provSectorStart.data ?? 0,
                provSectorEnd: provSectorEnd.data ?? 0,
                provTotalStart: provTotalStart.data ?? 0,
                provTotalEnd: provTotalEnd.data ?? 0
            }
        }
    } catch (error) {
        console.error('Failed to get time series analysis data:', error)
        return { success: false, error: 'Gagal mengambil data analisis time series' }
    }
}

export async function getOperatorPdrbSubmissions() {
    try {
        const submissions = await prisma.pdrbValue.findMany({
            where: {
                submittedAt: { not: null }
            },
            select: {
                regencyId: true,
                year: true,
                status: true,
                submittedAt: true,
                approvedAt: true,
                notes: true,
                regency: {
                    select: { name: true, code: true }
                }
            },
            orderBy: { submittedAt: 'desc' }
        })

        const groupedMap = new Map<string, {
            regencyId: string
            regencyName: string
            regencyCode: string
            year: number
            status: string
            submittedAt: Date
            approvedAt: Date | null
            notes: string | null
            sectorCount: number
        }>()

        for (const sub of submissions) {
            const key = `${sub.regencyId}-${sub.year}`
            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    regencyId: sub.regencyId,
                    regencyName: sub.regency.name,
                    regencyCode: sub.regency.code,
                    year: sub.year,
                    status: sub.status,
                    submittedAt: sub.submittedAt!,
                    approvedAt: sub.approvedAt,
                    notes: sub.notes,
                    sectorCount: 1
                })
            } else {
                const existing = groupedMap.get(key)!
                existing.sectorCount++
            }
        }

        return { success: true, data: Array.from(groupedMap.values()) }
    } catch (error) {
        console.error('Failed to get PDRB submissions:', error)
        return { success: false, error: 'Gagal mengambil data pengajuan' }
    }
}

// ==================== ADMIN ACTIONS ====================

export async function getAdminDashboardStats() {
    try {
        const [usersCount, regenciesCount, sectorsCount, pendingCount, approvedCount, rejectedCount, recentSubmissions] = await Promise.all([
            prisma.user.count(),
            prisma.regency.count(),
            prisma.sector.count(),
            prisma.pdrbValue.count({ where: { status: 'PENDING' } }),
            prisma.pdrbValue.count({ where: { status: 'APPROVED' } }),
            prisma.pdrbValue.count({ where: { status: 'REJECTED' } }),
            prisma.pdrbValue.findMany({
                select: {
                    regencyId: true,
                    year: true,
                    status: true,
                    submittedAt: true,
                    updatedAt: true,
                    notes: true,
                    regency: {
                        select: { name: true, code: true }
                    }
                },
                orderBy: { updatedAt: 'desc' },
                take: 50
            })
        ])

        const groupedMap = new Map<string, {
            regencyId: string
            regencyName: string
            regencyCode: string
            year: number
            status: string
            submittedAt: Date | null
            notes: string | null
            sectorCount: number
        }>()

        for (const sub of recentSubmissions) {
            const key = `${sub.regencyId}-${sub.year}`

            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    regencyId: sub.regencyId,
                    regencyName: sub.regency.name,
                    regencyCode: sub.regency.code,
                    year: sub.year,
                    status: sub.status,
                    submittedAt: sub.submittedAt,
                    notes: sub.notes,
                    sectorCount: 1
                })
            } else {
                groupedMap.get(key)!.sectorCount++
            }
        }

        return {
            success: true,
            data: {
                usersCount,
                regenciesCount,
                sectorsCount,
                pendingCount,
                approvedCount,
                rejectedCount,
                recentSubmissions: Array.from(groupedMap.values())
            }
        }
    } catch (error) {
        console.error('Failed to get admin dashboard stats:', error)

        return { success: false, error: 'Gagal mengambil data dashboard' }
    }
}


export async function getAllPdrbForReview(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    try {
        const pdrbValues = await prisma.pdrbValue.findMany({
            where: status ? { status } : undefined,
            include: {
                regency: { include: { province: true } },
                sector: true
            },
            orderBy: [
                { year: 'desc' },
                { regency: { code: 'asc' } }
            ]
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

// ==================== PUBLIC ====================

export async function getApprovedInvestmentRecords() {
    try {
        const pdrbValues = await prisma.pdrbValue.findMany({
            where: { status: 'APPROVED' },
            select: {
                id: true,
                value: true,
                year: true,
                regency: { select: { name: true } },
                sector: { select: { name: true } }
            },
            orderBy: [{ year: 'asc' }, { regency: { name: 'asc' } }]
        })

        const records: InvestmentRecord[] = pdrbValues.map(p => ({
            id: p.id,
            region: p.regency.name,
            sector: p.sector.name,
            value: p.value,
            year: p.year
        }))

        return { success: true, data: records }
    } catch (error) {
        console.error('Failed to get investment records:', error)

        return { success: false, error: 'Gagal mengambil data investasi' }
    }
}
