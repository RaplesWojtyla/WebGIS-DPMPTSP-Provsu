import { Button } from "@/components/ui/button";
import React from "react";

type ButtonProps = React.ComponentProps<typeof Button>;

interface FormButtonProps extends ButtonProps {
    children: React.ReactNode;
}

export default function FormButton({ children, className = "", variant = "default", ...props }: FormButtonProps) {
    // Base styles for all form buttons
    const baseStyles = "w-full h-12 text-base";

    // specific overrides
    const variantStyles = variant === "default"
        ? "bg-blue-900 hover:bg-blue-800 text-white"
        : "";

    return (
        <Button
            className={`${baseStyles} ${variantStyles} ${className}`}
            variant={variant}
            {...props}
        >
            {children}
        </Button>
    );
}
