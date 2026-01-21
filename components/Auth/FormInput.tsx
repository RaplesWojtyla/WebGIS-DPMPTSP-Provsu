import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    extraLabel?: React.ReactNode;
}

export default function FormInput({ id, label, extraLabel, className = "", type, ...props }: FormInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={id}>{label}</Label>
                {extraLabel}
            </div>
            <div className="relative">
                <Input
                    id={id}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    className={`border-blue-900 shadow-sm shadow-blue-900/20 pr-10 h-10 ${className}`}
                    {...props}
                />
                {isPassword && (
                    <>
                        <style>{`
                            #${id}::-ms-reveal,
                            #${id}::-ms-clear {
                                display: none;
                            }
                        `}</style>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                            </span>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
