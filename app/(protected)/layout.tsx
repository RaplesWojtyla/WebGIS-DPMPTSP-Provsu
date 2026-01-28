import ProtectedSidebar from "@/components/dashboard/ProtectedSidebar"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"


export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session  = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return redirect('/sign-in')
    }

    const userRole = session.user.role

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Sidebar */}
            <ProtectedSidebar role={userRole as Role} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
