import requireRole from "@/lib/auth/role-guard"

export default async function OperatorLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    await requireRole(['operator'])

    return (
        <div>
            {children}
        </div>
    )
}