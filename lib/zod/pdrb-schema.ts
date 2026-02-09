import { z } from "zod"

export const pdrbValueSchema = z.object({
    sectorId: z.string().min(1, "Sektor harus dipilih"),
    value: z.number().min(0, "Nilai harus positif"),
})

export const pdrbBulkSchema = z.object({
    regencyId: z.string().min(1, "Kabupaten harus dipilih"),
    year: z.number().int().min(2000).max(2100),
    values: z.array(pdrbValueSchema),
})

export type PdrbValueFormData = z.infer<typeof pdrbValueSchema>
export type PdrbBulkFormData = z.infer<typeof pdrbBulkSchema>
