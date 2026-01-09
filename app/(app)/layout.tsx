import { NavigationMenuDemo as Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
export default function AppLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div>
            <Navbar />
            <main className="flex min-h-screen flex-col">
                {children}
            </main>
            <Footer />
        </div>
    )
}