import { NavigationMenuDemo as Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

/**
 * Page layout that renders a navbar at the top, a flexible main content area, and a footer at the bottom.
 *
 * Renders `children` inside a full-height column flex container where the main area expands to fill available space.
 *
 * @param children - The page content to be rendered inside the main flexible area
 * @returns The layout React element containing the navbar, main content, and footer
 */
export default function LandingPageLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    )
}