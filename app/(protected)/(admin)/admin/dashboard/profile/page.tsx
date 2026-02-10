"use client"

import React, { useState, useEffect, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { User, Mail, Lock, Shield, Loader2 } from "lucide-react"

import {
    getCurrentUser,
    updateProfile,
    changePassword
} from "@/lib/actions/profile.actions"

type UserProfile = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    role: string
    createdAt: Date
}

export default function AdminProfilePage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [name, setName] = useState("")

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        setIsLoading(true)

        const result = await getCurrentUser()

        if (result.success && result.data) {
            setProfile(result.data as UserProfile)
            setName(result.data.name)
        } else {
            toast.error(result.error || "Gagal memuat profil")
        }

        setIsLoading(false)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.id]: e.target.value })
    }

    const handleSaveProfile = () => {
        if (!name.trim()) {
            toast.error("Nama tidak boleh kosong")
            return
        }

        startTransition(async () => {
            const result = await updateProfile(name)

            if (result.success) {
                toast.success("Profil berhasil diperbarui")
                loadProfile()
            } else {
                toast.error(result.error || "Gagal memperbarui profil")
            }
        })
    }

    const handleSavePassword = () => {
        if (!passwordData.currentPassword) {
            toast.error("Masukkan password saat ini")
            return
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Password baru minimal 8 karakter")
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Password baru dan konfirmasi tidak cocok")
            return
        }

        startTransition(async () => {
            const result = await changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            )

            if (result.success) {
                toast.success("Password berhasil diubah")
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            } else {
                toast.error(result.error || "Gagal mengubah password")
            }
        })
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrator'
            case 'operator': return 'Operator'
            default: return 'User'
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="text-center py-12 text-gray-500">
                Gagal memuat profil. Silakan refresh halaman.
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
                <p className="text-muted-foreground">Kelola informasi akun dan preferensi keamanan Anda.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Akun</CardTitle>
                        <CardDescription>
                            Perbarui detail profil akun Anda di sini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={profile.image || ""} alt={profile.name} />
                                <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                                    {profile.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="font-medium text-lg text-gray-900">{profile.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                                    <Shield className="h-3 w-3" />
                                    {getRoleLabel(profile.role)}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-9"
                                        placeholder="Nama Lengkap"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        className="pl-9 bg-gray-50"
                                        disabled
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t px-6 py-4 bg-gray-50/50 rounded-b-xl">
                        <Button onClick={handleSaveProfile} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Perubahan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Password Change Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Keamanan</CardTitle>
                        <CardDescription>
                            Ubah password akun Anda untuk menjaga keamanan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Password Saat Ini</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Password Baru</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t px-6 py-4 bg-gray-50/50 rounded-b-xl">
                        <Button
                            variant="outline"
                            onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                            className="mr-2"
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSavePassword} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
