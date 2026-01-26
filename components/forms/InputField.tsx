'use client'

import { useState } from "react"
import { FieldValues } from "react-hook-form"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"


const InputField = <T extends FieldValues>({
    name,
    label,
    placeholder,
    type = 'text',
    register,
    error,
    validation,
    disabled,
    value
}: FormInputProps<T>) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const isPasswordField = type === 'password'

    return (
        <div className="space-y-2">
            <Label
                htmlFor={name}
                className="text-sm font-medium text-slate-700"
            >
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={name}
                    type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={value}
                    className={cn('border-blue-900 shadow-sm shadow-blue-900/20 h-12 px-3 py-3 selection:bg-blue-200 selection:text-blue-900', {
                        'opacity-50 cursor-not-allowed': disabled
                    })}
                    {...register(name, validation)}
                />
                {isPasswordField && (
                    <Button
                        type="button"
                        variant={'ghost'}
                        size={'icon'}
                        className="absolute top-0 right-0 h-full px-4 py-2 hover:bg-transparent text-muted-foreground cursor-pointer"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                        <span className="sr-only">
                            {showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        </span>
                    </Button>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-500">{error.message}</p>
            )}
        </div>
    )
}

export default InputField