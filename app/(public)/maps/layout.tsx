export default function MapsLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen mx-10 flex-col pt-20">
            {children}
        </div>
    )
}