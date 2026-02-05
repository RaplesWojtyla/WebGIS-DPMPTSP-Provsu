"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Lock, Shield } from "lucide-react";

export default function AdminProfilePage() {
    // Dummy initial state - in real app, fetch from auth session
    const [profile, setProfile] = useState({
        name: "Administrator",
        email: "admin@provsu.go.id",
        role: "Administrator",
        avatarUrl: "", // Optional
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.id]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
    };

    const handleSaveProfile = () => {
        // Logic to update profile
        toast.success("Profil berhasil diperbarui");
    };

    const handleSavePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Password baru dan konfirmasi tidak cocok");
            return;
        }
        if (!passwordData.currentPassword) {
            toast.error("Masukkan password saat ini");
            return;
        }
        // Logic to change password
        toast.success("Password berhasil diubah");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

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
                                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                                <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                                    {profile.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="font-medium text-lg text-gray-900">{profile.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                                    <Shield className="h-3 w-3" />
                                    {profile.role}
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
                                        value={profile.name}
                                        onChange={handleProfileChange}
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
                                        onChange={handleProfileChange}
                                        className="pl-9"
                                        placeholder="Email"
                                        type="email"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t px-6 py-4 bg-gray-50/50 rounded-b-xl">
                        <Button onClick={handleSaveProfile}>Simpan Perubahan</Button>
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
                        <Button variant="outline" onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })} className="mr-2">Batal</Button>
                        <Button onClick={handleSavePassword}>Update Password</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
