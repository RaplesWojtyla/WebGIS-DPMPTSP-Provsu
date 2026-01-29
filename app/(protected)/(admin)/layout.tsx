import requireRole from "@/lib/auth/role-guard"

export default async function AdminLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    await requireRole(['admin'])

    return (
        <div>
            {children}
        </div>
    )
}