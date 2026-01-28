'use client'

import { signOut } from "@/lib/actions/auth.actions"
import { NAVIGATION_CONFIG } from "@/lib/constants"
import { LogOutIcon, Map } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "../ui/button"

const ProtectedSidebar = ({ role }: ProtectedSidebarProps) => {
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

    return (
        <aside className="w-64 bg-card border-r hidden md:flex flex-col">
            <div className="p-6 h-16 flex items-center border-b">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                    <Map className="w-6 h-6 text-primary" />
                    <span>WebGIS Provsu</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                    {config.name}
                </div>
                {config.items.map(item => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleSignOut}
                >
                    <LogOutIcon className="w-4 h-4" />
                    Keluar
                </Button>
            </div>
        </aside>
    )
}

export default ProtectedSidebar