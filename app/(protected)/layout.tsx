import ProtectedSidebar from "@/components/dashboard/ProtectedSidebar"
import requireRole from "@/lib/auth/role-guard"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { role } = await requireRole(['admin', 'operator', 'user'])

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Sidebar */}
            <ProtectedSidebar role={role} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
