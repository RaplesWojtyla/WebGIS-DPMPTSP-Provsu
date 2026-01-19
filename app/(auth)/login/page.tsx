"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Simple logic for demonstration purposes
        // In a real app, you would validate with a backend
        if (email.toLowerCase().includes("admin")) {
            router.push("/dashboard/admin");
        } else {
            router.push("/dashboard/user");
        }
    };

    return (
        <div className="grid gap-6">
            <Card className="border-0 shadow-none">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Remember me
                        </Label>
                    </div>
                    <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
