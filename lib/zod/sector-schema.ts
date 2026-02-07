import { z } from "zod"

export const sectorSchema = z.object({
    code: z.string().min(1, "Kode sektor harus diisi"),
    name: z.string().min(1, "Nama sektor harus diisi"),
    nameEn: z.string().optional(),
    description: z.string().optional(),
})

export type SectorFormData = z.infer<typeof sectorSchema>
