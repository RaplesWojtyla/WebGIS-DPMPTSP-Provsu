import requireRole from "@/lib/auth/role-guard"
import { redirect } from "next/navigation"


export default async function UserLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const { role } = await requireRole(['user', 'admin', 'operator'])

    if (role === 'admin') {
        return redirect('/admin/dashboard')
    }

    if (role === 'operator') {
        return redirect('/operator/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    )
}