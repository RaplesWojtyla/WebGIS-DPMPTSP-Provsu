import { FieldError, FieldValues, RegisterOptions, UseFormRegister, Path } from "react-hook-form"

declare global {
    interface RegionData {
        id: string
        name: string // Eg. Kota Medan

        economy: {
            pdrb_growth: string // Eg. 6.5% (Tinggi)
            top_sectors: string[] // Eg. ["Pertanian", "Industri Manufaktur", "Bandara & Logistik", "Konstruksi"]
            umk: string // Eg. "Rp 3.500.000" ATAU "Rp 2.800.000 (Rata-rata)"
        }

        demography: {
            population: string // Eg. "2.1 Juta Jiwa"
            labor_availability: "Melimpah" | "Sedang" | "Terbatas"
        }

        infrastructure: {
            nearest_toll_gate_km: number // Eg. 10
            nearest_port_name: string // Eg. Pelabuhan Belawan (25km)
            internet_quality: "High Speed Fiber" | "4G Standard" | "Low Coverage"
            power_supply: "Stabil" | "Sering Pemadaman"
        }

        risk_profile: {
            disaster_risk: string // Eg. Banjir/Longsor di area tertentu
            social_conflict: string // Eg. Konflik antar masyarakat
        }
    }

    type PredictionInput = {
        lat: string
        lng: string
        address: string
    }

    type User = {
        id: string
        name: string
        email: string
        role: string
        image?: string | null
    }

    type FormInputProps<T extends FieldValues> = {
        name: Path<T>
        label: string
        placeholder?: string
        type?: string
        register: UseFormRegister<T>
        error?: FieldError
        validation?: RegisterOptions<T, Path<T>>
        disabled?: boolean
        value?: string
    }

    interface ProtectedSidebarProps {
        role: 'user' | 'operator' | 'admin'
        user: User
    }

    type Role = 'user' | 'operator' | 'admin'

    interface AnalysisResult {
        text: string
        reasoning?: string
        sources?: Array<{ title?: string, url?: string }>
    }

    interface InvestmentRecord {
        id: string
        region: string
        sector: string
        value: number // Investment value (e.g., in IDR or USD)
        year: number
    }

    interface LQResult {
        region: string
        sector: string
        lq: number
        isReliable: boolean // True if LQ > 1
    }

    type SectorData = {
        code: string
        name: string
        nameEn?: string
        description?: string
    }

    type Sector = {
        id: string
        code: string
        name: string
        nameEn: string | null
        description: string | null
    }

    type Province = {
        id: string
        code: string
        name: string
    }

    type Regency = {
        id: string
        code: string
        name: string
        provinceId: string
        province: Province
    }

    type District = {
        id: string
        code: string
        name: string
        regencyId: string
        regency: Regency
    }

    type Village = {
        id: string
        code: string
        name: string
        districtId: string
        district: District & { regency: Regency }
    }

    type PdrbStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

    type PdrbData = {
        id: string
        value: number
        year: number
        status: PdrbStatus
        submittedAt: Date | null
        approvedAt: Date | null
        approvedBy: string | null
        notes: string | null
        regencyId: string
        sectorId: string
        regency: {
            id: string
            name: string
            code: string
            province: { name: string }
        }
        sector: {
            id: string
            name: string
            code: string
        }
    }

    type GroupedPdrb = {
        regencyId: string
        regencyName: string
        regencyCode: string
        year: number
        totalValue: number
        sectorCount: number
        status: PdrbStatus
        submittedAt: Date | null
    }

    type UserData = {
        id: string
        name: string
        email: string
        emailVerified: boolean
        image: string | null
        role: 'user' | 'operator' | 'admin'
        suspended: boolean
        suspendedAt: Date | null
        createdAt: Date
    }

    interface PdrbSubmission {
        regencyId: string
        regencyName: string
        regencyCode: string
        year: number
        status: string
        submittedAt: Date
        approvedAt: Date | null
        notes: string | null
        sectorCount: number
    }

    interface AnalysisResultLQ {
        lq: string
        status: "Basis" | "Non-Basis"
        description: string
    }

    interface AnalysisResultSSA {
        nij: string
        mij: string
        cij: string
        dij: string
    }

    interface AnalysisResultKlassen {
        quadrant: "Prima" | "Berkembang" | "Potensial" | "Terbelakang"
        growthRate: string
        share: string
    }

    interface AnalysisResultDLQ {
        dlq: string
        status: "Potensial" | "Belum Potensial"
        description: string
    }

    interface Region {
        id: string
        code: string
        name: string
    }

    interface Sector {
        id: string
        code: string
        name: string
    }
}
