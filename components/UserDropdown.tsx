"use client"

import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogOutIcon, ChevronDown, User, Settings, LayoutDashboardIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth.actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export const UserDropdown = ({ user, isTransparent = false, trigger }: { user: any | null, isTransparent?: boolean, trigger?: React.ReactNode }) => {
    const router = useRouter()

    const handleSignOut = async () => {
        const response = await signOut()

        if (response.success) {
            router.push('/sign-in')
        } else {
            toast.error("Logout Gagal", {
                description: response?.error || "Gagal keluar dari akun"
            })
        }
    }

    if (!user) return null

    return (
        <DropdownMenu modal={false}>
            {trigger ? (
                <DropdownMenuTrigger asChild className="outline-none">
                    {trigger}
                </DropdownMenuTrigger>
            ) : (
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={'ghost'}
                        className={cn(
                            "group flex items-center gap-2 rounded-full pl-2 pr-4 py-2 h-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 data-[state=open]:scale-[1.02] data-[state=open]:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
                            isTransparent
                                ? "border border-white/30 bg-black/10 backdrop-blur-md hover:bg-white hover:text-black hover:border-white data-[state=open]:bg-white data-[state=open]:text-black data-[state=open]:border-white"
                                : "hover:bg-blue-50 hover:text-blue-700 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700"
                        )}
                    >
                        <Avatar className={cn(
                            "size-8 border-2 transition-all duration-300 group-hover:scale-105",
                            isTransparent
                                ? "border-white/20 group-hover:border-gray-200 group-data-[state=open]:border-gray-200"
                                : "border-gray-200 group-hover:border-blue-200 group-data-[state=open]:border-blue-200"
                        )}>
                            <AvatarImage src={user?.image || ""} />
                            <AvatarFallback className={cn(
                                "bg-primary/20 text-blue-100 group-hover:text-primary group-data-[state=open]:text-primary",
                                isTransparent
                                    ? "group-hover:bg-blue-100 group-data-[state=open]:bg-blue-100"
                                    : "text-primary/80 group-hover:bg-blue-100 group-data-[state=open]:bg-blue-100"
                            )}>
                                {user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start gap-0.5">
                            <span className={cn(
                                "text-sm font-semibold leading-none transition-colors",
                                isTransparent
                                    ? "text-white/90 group-hover:text-black group-data-[state=open]:text-black"
                                    : "text-gray-700 group-hover:text-blue-700 group-data-[state=open]:text-blue-700"
                            )}>
                                {user?.name?.split(" ")[0]}
                            </span>
                        </div>
                        <ChevronDown className={cn(
                            "size-4 ml-1 transition-all duration-300 group-data-[state=open]:rotate-180",
                            isTransparent
                                ? "text-white/60 group-hover:text-black group-data-[state=open]:text-black"
                                : "text-gray-500 group-hover:text-blue-700 group-data-[state=open]:text-blue-700"
                        )} />
                    </Button>
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-xl border-white/20 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl mt-2 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <Link href="/dashboard/" className="flex items-center gap-4 p-4 mb-2 rounded-lg bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100/50 dark:border-blue-800/30">
                        <Avatar className="size-12 border border-white/50 shadow-sm transition-transform hover:scale-105">
                            <AvatarImage src={user?.image || ''} />
                            <AvatarFallback className="bg-blue-600 text-lg text-white">
                                {user?.name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-bold truncate text-foreground">
                                {user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate font-medium">
                                {user?.email}
                            </span>
                        </div>
                    </Link>
                </DropdownMenuLabel>

                <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5 transition-all duration-200 focus:translate-x-1 focus:bg-blue-50 dark:focus:bg-blue-900/20 text-muted-foreground focus:text-blue-600 dark:focus:text-blue-400">
                    <Link href="/dashboard">
                        <LayoutDashboardIcon className="size-4 mr-2" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5 transition-all duration-200 focus:translate-x-1 focus:bg-blue-50 dark:focus:bg-blue-900/20 text-muted-foreground focus:text-blue-600 dark:focus:text-blue-400">
                    <Link href="/profile">
                        <User className="size-4 mr-2" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg py-2.5 transition-all duration-200 focus:translate-x-1 focus:bg-blue-50 dark:focus:bg-blue-900/20 text-muted-foreground focus:text-blue-600 dark:focus:text-blue-400">
                    <Link href="/settings">
                        <Settings className="size-4 mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 bg-border/50" />

                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg py-2.5 transition-all duration-200 focus:translate-x-1 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300"
                >
                    <LogOutIcon className="size-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown