import { z } from 'zod'

export const signInSchema = z.object({
    email: z.email({ error: "Format email tidak valid" })
        .min(1, { error: "Email wajib diisi" }),
    password: z.string()
        .min(1, { error: "Kata sandi wajib diisi" })
        .min(8, { error: "Kata sandi minimal 8 karakter" })
})

export const signUpSchema = z.object({
    name: z.string()
        .min(1, { error: "Nama wajib diisi" }),
    email: z.email({ error: "Format email tidak valid" })
        .min(1, { error: "Email wajib diisi" }),
    password: z.string()
        .min(1, { error: "Kata sandi wajib diisi" })
        .min(8, { error: "Kata sandi minimal 8 karakter" }),
    confirmPassword: z.string()
        .min(1, { error: "Kata sandi wajib diisi" })
        .min(8, { error: "Kata sandi minimal 8 karakter" })
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
