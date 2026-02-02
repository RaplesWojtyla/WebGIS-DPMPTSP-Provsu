import ProtectedSidebar from "@/components/dashboard/ProtectedSidebar"
import requireRole from "@/lib/auth/role-guard"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { role, user } = await requireRole(['admin', 'operator', 'user'])

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row bg-muted/20">
            {/* Sidebar */}
            <ProtectedSidebar role={role} user={user} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
