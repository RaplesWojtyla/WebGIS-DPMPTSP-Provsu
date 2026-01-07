
export default function AppLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div>
            <h1>Letak Navbar</h1>

            <main className="flex min-h-screen flex-col">
                { children }
            </main>

            <h1>Letak  Footer</h1>
        </div>
    )
}