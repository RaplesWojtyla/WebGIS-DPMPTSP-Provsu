'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/better-auth/auth'

type ProposalTypeValue = 'INVESTMENT' | 'LAND_OFFER'
type ProposalStatusValue = 'SUBMITTED' | 'VERIFIED' | 'REVISION' | 'APPROVED' | 'REJECTED'

// ==================== PATHS ====================

const USER_PROPOSAL_PATH = '/dashboard/proposal'
const OPERATOR_PROPOSAL_PATH = '/operator/proposal'
const ADMIN_PROPOSAL_PATH = '/admin/dashboard/proposal'

// ==================== TYPES ====================

export type InvestmentProposalData = {
    title: string
    sectorId: string
    regencyId: string
    description?: string
    permitType: string
    investmentValue: number
    capitalSource: string
    workforcePlan?: number
    locationAddress?: string
    locationLat?: number
    locationLng?: number
    landArea?: number
}

export type LandOfferProposalData = {
    title: string
    sectorId?: string
    regencyId: string
    description?: string
    assetType: string
    landArea: number
    offerPrice?: number
    transactionType: string
    locationAddress?: string
    locationLat?: number
    locationLng?: number
}

// ==================== USER ACTIONS ====================

export async function createProposal(
    type: ProposalTypeValue,
    data: InvestmentProposalData | LandOfferProposalData
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        const proposal = await prisma.proposal.create({
            data: {
                type: type,
                userId: session.user.id,
                title: data.title,
                sectorId: data.sectorId || null,
                regencyId: data.regencyId,
                description: data.description || null,
                locationAddress: ('locationAddress' in data ? data.locationAddress : null) || null,
                locationLat: ('locationLat' in data ? data.locationLat : null) || null,
                locationLng: ('locationLng' in data ? data.locationLng : null) || null,
                landArea: ('landArea' in data ? data.landArea : null) || null,
                // Investment-specific
                permitType: type === 'INVESTMENT' ? (data as InvestmentProposalData).permitType : null,
                investmentValue: type === 'INVESTMENT' ? (data as InvestmentProposalData).investmentValue : null,
                capitalSource: type === 'INVESTMENT' ? (data as InvestmentProposalData).capitalSource : null,
                workforcePlan: type === 'INVESTMENT' ? (data as InvestmentProposalData).workforcePlan || null : null,
                // Land-offer-specific
                assetType: type === 'LAND_OFFER' ? (data as LandOfferProposalData).assetType : null,
                offerPrice: type === 'LAND_OFFER' ? (data as LandOfferProposalData).offerPrice || null : null,
                transactionType: type === 'LAND_OFFER' ? (data as LandOfferProposalData).transactionType : null,
            }
        })

        revalidatePath(USER_PROPOSAL_PATH)
        return { success: true, data: proposal }
    } catch (error) {
        console.error('Failed to create proposal:', error)
        return { success: false, error: 'Gagal membuat proposal' }
    }
}

export async function getUserProposals() {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        const proposals = await prisma.proposal.findMany({
            where: { userId: session.user.id },
            include: {
                sector: { select: { name: true } },
                regency: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: proposals }
    } catch (error) {
        console.error('Failed to get user proposals:', error)
        return { success: false, error: 'Gagal mengambil data proposal' }
    }
}

export async function updateProposal(
    id: string,
    type: ProposalTypeValue,
    data: InvestmentProposalData | LandOfferProposalData
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        // Verify ownership and status
        const existing = await prisma.proposal.findUnique({ where: { id } })
        if (!existing || existing.userId !== session.user.id) {
            return { success: false, error: 'Proposal tidak ditemukan' }
        }
        if (existing.status !== 'REVISION') {
            return { success: false, error: 'Proposal hanya bisa diedit saat status Revisi' }
        }

        await prisma.proposal.update({
            where: { id },
            data: {
                status: 'SUBMITTED',
                title: data.title,
                sectorId: data.sectorId || null,
                regencyId: data.regencyId,
                description: data.description || null,
                locationAddress: ('locationAddress' in data ? data.locationAddress : null) || null,
                locationLat: ('locationLat' in data ? data.locationLat : null) || null,
                locationLng: ('locationLng' in data ? data.locationLng : null) || null,
                landArea: ('landArea' in data ? data.landArea : null) || null,
                permitType: type === 'INVESTMENT' ? (data as InvestmentProposalData).permitType : null,
                investmentValue: type === 'INVESTMENT' ? (data as InvestmentProposalData).investmentValue : null,
                capitalSource: type === 'INVESTMENT' ? (data as InvestmentProposalData).capitalSource : null,
                workforcePlan: type === 'INVESTMENT' ? (data as InvestmentProposalData).workforcePlan || null : null,
                assetType: type === 'LAND_OFFER' ? (data as LandOfferProposalData).assetType : null,
                offerPrice: type === 'LAND_OFFER' ? (data as LandOfferProposalData).offerPrice || null : null,
                transactionType: type === 'LAND_OFFER' ? (data as LandOfferProposalData).transactionType : null,
                operatorNotes: null, // Clear previous notes
            }
        })

        revalidatePath(USER_PROPOSAL_PATH)
        return { success: true }
    } catch (error) {
        console.error('Failed to update proposal:', error)
        return { success: false, error: 'Gagal memperbarui proposal' }
    }
}

// ==================== OPERATOR ACTIONS ====================

export async function getAllProposals(statusFilter?: ProposalStatusValue) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        const proposals = await prisma.proposal.findMany({
            where: statusFilter ? { status: statusFilter } : undefined,
            include: {
                user: { select: { name: true, email: true } },
                sector: { select: { name: true } },
                regency: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' }
        })

        return { success: true, data: proposals }
    } catch (error) {
        console.error('Failed to get proposals:', error)
        return { success: false, error: 'Gagal mengambil data proposal' }
    }
}

export async function verifyProposal(id: string, notes?: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        await prisma.proposal.update({
            where: { id },
            data: {
                status: 'VERIFIED',
                operatorNotes: notes || null,
                verifiedAt: new Date(),
                verifiedBy: session.user.id,
            }
        })

        revalidatePath(OPERATOR_PROPOSAL_PATH)
        revalidatePath(ADMIN_PROPOSAL_PATH)
        return { success: true }
    } catch (error) {
        console.error('Failed to verify proposal:', error)
        return { success: false, error: 'Gagal memverifikasi proposal' }
    }
}

export async function requestRevision(id: string, notes: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        if (!notes.trim()) return { success: false, error: 'Catatan revisi wajib diisi' }

        await prisma.proposal.update({
            where: { id },
            data: {
                status: 'REVISION',
                operatorNotes: notes,
                verifiedBy: session.user.id,
            }
        })

        revalidatePath(OPERATOR_PROPOSAL_PATH)
        revalidatePath(USER_PROPOSAL_PATH)
        return { success: true }
    } catch (error) {
        console.error('Failed to request revision:', error)
        return { success: false, error: 'Gagal meminta revisi' }
    }
}

// ==================== ADMIN ACTIONS ====================

export async function approveProposal(id: string, notes?: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        await prisma.proposal.update({
            where: { id },
            data: {
                status: 'APPROVED',
                adminNotes: notes || null,
                approvedAt: new Date(),
                approvedBy: session.user.id,
            }
        })

        revalidatePath(ADMIN_PROPOSAL_PATH)
        return { success: true }
    } catch (error) {
        console.error('Failed to approve proposal:', error)
        return { success: false, error: 'Gagal menyetujui proposal' }
    }
}

export async function rejectProposal(id: string, notes: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user) return { success: false, error: 'Tidak ada sesi aktif' }

        if (!notes.trim()) return { success: false, error: 'Alasan penolakan wajib diisi' }

        await prisma.proposal.update({
            where: { id },
            data: {
                status: 'REJECTED',
                adminNotes: notes,
                rejectedAt: new Date(),
                rejectedBy: session.user.id,
            }
        })

        revalidatePath(ADMIN_PROPOSAL_PATH)
        return { success: true }
    } catch (error) {
        console.error('Failed to reject proposal:', error)
        return { success: false, error: 'Gagal menolak proposal' }
    }
}

export async function getProposalStats() {
    try {
        const [submitted, verified, revision, approved, rejected] = await Promise.all([
            prisma.proposal.count({ where: { status: 'SUBMITTED' } }),
            prisma.proposal.count({ where: { status: 'VERIFIED' } }),
            prisma.proposal.count({ where: { status: 'REVISION' } }),
            prisma.proposal.count({ where: { status: 'APPROVED' } }),
            prisma.proposal.count({ where: { status: 'REJECTED' } }),
        ])

        return {
            success: true,
            data: { submitted, verified, revision, approved, rejected, total: submitted + verified + revision + approved + rejected }
        }
    } catch (error) {
        console.error('Failed to get proposal stats:', error)
        return { success: false, error: 'Gagal mengambil statistik proposal' }
    }
}
