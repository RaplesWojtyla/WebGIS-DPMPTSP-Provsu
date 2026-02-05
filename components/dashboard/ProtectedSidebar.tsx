'use client'

import { signOut } from "@/lib/actions/auth.actions"
import { NAVIGATION_CONFIG } from "@/lib/constants"
import { LogOutIcon, HomeIcon, BriefcaseIcon, MapIcon, InfoIcon, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../ui/button"

import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
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

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-hide">
                    {/* Dashboard Menu */}
                    <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            {config.name}
                        </div>
                        <NavLinks />
                    </div>

                    {/* Public Menu */}
                    <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Menu Utama
                        </div>
                        <div className="space-y-1">
                            <Link href="/" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1 transition-all duration-200">
                                <HomeIcon className="size-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                <span>Beranda</span>
                            </Link>
                            <Link href="/invest" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1 transition-all duration-200">
                                <BriefcaseIcon className="size-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                <span>Sektor Unggulan</span>
                            </Link>
                            <Link href="/maps" className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1 transition-all duration-200">
                                <MapIcon className="size-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                <span>Peta Daerah</span>
                            </Link>
                        </div>
                    </div>
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

                <Drawer direction="left">
                    <DrawerTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-full w-[85%] max-w-sm rounded-r-2xl border-r-0 outline-none flex flex-col">
                        <DrawerHeader className="border-b pb-6 pt-6 px-6">
                            <DrawerTitle className="sr-only">Navigasi Mobile</DrawerTitle>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/DPMPTSP_Provsu.png"
                                        alt="Logo"
                                        className="h-10 w-auto"
                                        width={100}
                                        height={40}
                                    />
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-bold text-blue-950 leading-tight">DPMPTSP</span>
                                        <span className="text-xs font-medium text-blue-600/80">Sumatera Utara</span>
                                    </div>
                                </div>
                                <DrawerClose asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-gray-900">
                                        <ChevronRight className="rotate-180 size-6" />
                                    </Button>
                                </DrawerClose>
                            </div>

                            {/* User Profile Header (Custom for Mobile) */}
                            <Link href="/profile" className="flex items-center gap-4 pt-2 pb-2 hover:bg-blue-50/50 rounded-xl px-2 -mx-2 transition-colors group">
                                <Avatar className="size-12 border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
                                    <AvatarImage src={user?.image || ''} />
                                    <AvatarFallback className="bg-blue-600 text-white font-medium text-lg">{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-bold text-base text-gray-900 truncate group-hover:text-blue-700 transition-colors">{user?.name}</span>
                                    <span className="text-sm text-gray-500 truncate font-medium group-hover:text-blue-500/80 transition-colors">{user?.email}</span>
                                </div>
                            </Link>
                        </DrawerHeader>

                        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                            <nav className="flex flex-col space-y-8">
                                {/* Dashboard Menu (AKUN SAYA) */}
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        AKUN SAYA
                                    </div>
                                    <div className="space-y-1">
                                        {config.items.map(item => {
                                            const Icon = item.icon
                                            const isActive = pathname === item.href
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center gap-3 px-0 py-2 text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                                                >
                                                    <Icon className={`size-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                    <span>{item.name}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Public Menu (MENU UTAMA) */}
                                <div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        MENU UTAMA
                                    </div>
                                    <div className="space-y-1">
                                        <Link href="/" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                            <HomeIcon className="size-5 text-gray-400" /> <span>Beranda</span>
                                        </Link>
                                        <Link href="/invest" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                            <BriefcaseIcon className="size-5 text-gray-400" /> <span>Sektor Unggulan</span>
                                        </Link>
                                        <Link href="/maps" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                            <MapIcon className="size-5 text-gray-400" /> <span>Peta Daerah</span>
                                        </Link>
                                        <Link href="#" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                            <InfoIcon className="size-5 text-gray-400" /> <span>Informasi</span>
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </div>

                        <DrawerFooter className="border-t pb-6 pt-4 px-6 bg-white">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center justify-center gap-2 w-full h-11 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                            >
                                <LogOutIcon className="size-4" /> Keluar Akun
                            </button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}

export default ProtectedSidebar