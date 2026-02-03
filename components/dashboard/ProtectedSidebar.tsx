'use client'

import { signOut } from "@/lib/actions/auth.actions"
import { NAVIGATION_CONFIG } from "@/lib/constants"
import { LogOutIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../ui/button"

import { Drawer, DrawerContent, DrawerTrigger, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Menu } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProtectedSidebar = ({ role, user }: ProtectedSidebarProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const config = NAVIGATION_CONFIG[role]

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

    const NavLinks = () => (
        <div className="space-y-1">
            {config.items.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1"
                            }`}
                    >
                        <Icon className={`size-5 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                        <span>{item.name}</span>
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />}
                    </Link>
                )
            })}
        </div>
    )

    const UserProfile = () => (
        <Link href="/profile" className="flex items-center gap-3 p-2.5 mb-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100 transition-all duration-200 cursor-pointer w-full group">
            <Avatar className="size-10 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                <AvatarImage src={user?.image || ''} />
                <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                    {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-800 truncate leading-tight group-hover:text-blue-700 transition-colors">{user?.name}</span>
                <span className="text-xs text-slate-500 truncate font-medium capitalize group-hover:text-blue-500">{user?.role}</span>
            </div>
            <div className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.6498 10.6151 7.84212L6.86514 11.8421C6.67627 12.0436 6.35985 12.0538 6.1584 11.8649C5.95694 11.676 5.94673 11.3596 6.1356 11.1581L9.3856 7.5L6.1356 3.84188C5.94673 3.64042 5.95694 3.324 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </div>
        </Link>
    )

    const Logo = () => (
        <Image
            src="/DPMPTSP_Provsu.png"
            alt="Logo DPMPTSP"
            width={180}
            height={80}
            className="h-14 w-auto object-contain"
            priority
        />
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 bg-linear-to-b from-white via-blue-50/10 to-blue-50/30 border-r border-blue-100 hidden md:flex flex-col h-screen sticky top-0 shadow-sm z-30">
                <div className="p-2 flex items-center border-b border-blue-50/50 min-h-[80px]">
                    <Link href="/" className="group hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>
                </div>

                <div className="px-6 py-4 border-b border-blue-50/50 bg-blue-50/10">
                    <UserProfile />
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                        {config.name}
                    </div>
                    <NavLinks />
                </nav>

                <div className="p-4 mt-auto border-t border-blue-50 bg-white/50 backdrop-blur-sm">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 h-11 rounded-xl"
                        onClick={handleSignOut}
                    >
                        <LogOutIcon className="size-4" />
                        <span className="font-medium">Keluar Akun</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Drawer */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-card w-full sticky top-0 z-50">
                <Link href="/">
                    <Logo />
                </Link>

                <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[85vh] flex flex-col">
                        <DrawerHeader className="text-left border-b pb-4">
                            <DrawerTitle className="font-bold text-xl flex items-center gap-2">
                                <Logo />
                            </DrawerTitle>
                            <div className="mt-4 pl-1">
                                <UserProfile />
                            </div>
                            <DrawerDescription className="sr-only">
                                Menu Navigasi
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 flex-1 overflow-y-auto">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                                Menu Navigasi
                            </div>
                            <NavLinks />
                        </div>
                        <DrawerFooter className="p-4 border-t border-blue-50">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 h-11 rounded-xl"
                                onClick={handleSignOut}
                            >
                                <LogOutIcon className="size-4" />
                                <span className="font-medium">Keluar Akun</span>
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}

export default ProtectedSidebar