"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormInput from "./FormInput";
import FormButton from "./FormButton";
import { motion } from "framer-motion";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Simple logic for demonstration purposes
        if (email.toLowerCase().includes("admin")) {
            router.push("/dashboard/admin");
        } else {
            router.push("/dashboard/user");
        }
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google Login logic
        console.log("Login with Google");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
        >
            <Card className="border-0 shadow-none w-full h-full flex flex-col justify-center">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
                    <CardDescription>
                        Masukkan email dan kata sandi untuk mengakses akun Anda
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 p-4">
                    <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <FormInput
                        id="password"
                        label="Kata Sandi"
                        type="password"
                        required
                        placeholder="Masukkan kata sandi Anda"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        extraLabel={
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                Lupa kata sandi?
                            </Link>
                        }
                    />
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Ingat saya
                        </Label>
                    </div>
                    <FormButton onClick={handleLogin}>Masuk</FormButton>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Atau lanjutkan dengan
                            </span>
                        </div>
                    </div>

                    <FormButton variant="outline" onClick={handleGoogleLogin}>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21-1.19-2.63z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Masuk dengan Google
                    </FormButton>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary underline-offset-4 font-semibold hover:underline hover:text-blue-900 hover:font-bold">
                            Daftar
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </motion.div >
    );
}
