"use client";

import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex w-full h-full justify-center p-6 md:p-10">
            <div className="w-full max-w-xl">
                <LoginForm />
            </div>
        </div>
    );
}
