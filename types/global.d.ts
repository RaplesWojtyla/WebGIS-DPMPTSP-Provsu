import { Path } from "better-auth"
import { FieldError, FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form"

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
        image?: string
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
}
