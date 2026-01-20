import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Authentication - DPMPTSP Provsu",
    description: "Login or Register to access the WebGIS platform",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 lg:p-8 relative">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/bg_login.png')" }}
            />
            <div className="absolute inset-0 z-0 bg-slate-800/70" />

            <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-2xl lg:grid lg:min-h-[600px] lg:grid-cols-2 lg:border-none">
                <div className="flex items-center justify-center py-12 md:py-24 bg-white/50 backdrop-blur-sm lg:bg-white">
                    <div className="mx-auto grid w-[350px] gap-6">
                        {children}
                    </div>
                </div>
                <div className="relative hidden bg-muted lg:block">
                    <div className="absolute inset-0 h-full w-full bg-linear-to-r from-slate-950 via-blue-950 to-blue-900 opacity-90" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center text-white">
                        <Image
                            src="/DPMPTSP_Provsu.png"
                            alt="Logo DPMPTSP Sumut"
                            className="h-32 w-auto mb-8 object-contain drop-shadow-lg"
                            width={100}
                            height={100}
                        />
                        <h1 className="text-4xl font-bold tracking-tight mb-4 drop-shadow-md">WebGIS DPMPTSP</h1>
                        <p className="text-lg text-blue-100 max-w-lg drop-shadow-sm">
                            Peta Potensi Investasi Sumatera Utara. Explore investment opportunities with our interactive geographic information system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
