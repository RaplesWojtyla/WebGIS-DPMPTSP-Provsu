import { Navbar as Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"

export default async function LandingPageLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    let session = null
    let user: User | null = null

    try {
        session = await auth.api.getSession({
            headers: await headers()
        })
    } catch (error) {
        console.error("Error fetching session:", error)
    }

    if (session?.user) {
        user = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
        }
    }

    return (
        <div className="min-h-screen">
            <Navbar user={user} />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    )
}