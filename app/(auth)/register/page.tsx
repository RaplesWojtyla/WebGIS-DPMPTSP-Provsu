"use client";

import RegisterForm from "@/components/Auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex w-full h-full justify-center p-6 md:p-10">
            <div className="w-full max-w-xl">
                <RegisterForm />
            </div>
        </div>
    );
}
