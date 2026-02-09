import { z } from "zod"

export const regencySchema = z.object({
    code: z.string().min(1, "Kode kabupaten harus diisi"),
    name: z.string().min(1, "Nama kabupaten harus diisi"),
    provinceId: z.string().min(1, "Provinsi harus dipilih"),
})

export const districtSchema = z.object({
    code: z.string().min(1, "Kode kecamatan harus diisi"),
    name: z.string().min(1, "Nama kecamatan harus diisi"),
    regencyId: z.string().min(1, "Kabupaten harus dipilih"),
})

export const villageSchema = z.object({
    code: z.string().min(1, "Kode desa harus diisi"),
    name: z.string().min(1, "Nama desa harus diisi"),
    districtId: z.string().min(1, "Kecamatan harus dipilih"),
})

export type RegencyFormData = z.infer<typeof regencySchema>
export type DistrictFormData = z.infer<typeof districtSchema>
export type VillageFormData = z.infer<typeof villageSchema>
