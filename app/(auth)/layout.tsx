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
        <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/bg_login.png"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
                </div>

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Image
                        src="/DPMPTSP_Provsu.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="mr-2 h-10 w-auto object-contain"
                    />
                    WebGIS DPMPTSP
                </div>

                {/* Centered Content on the left side */}
                <div className="relative z-20 m-auto flex flex-col items-center text-center max-w-lg">
                    <h1 className="text-4xl font-bold tracking-tight mb-6 drop-shadow-xl">
                        Selamat Datang di Portal Investasi
                    </h1>
                    <p className="text-xl text-blue-50 leading-relaxed drop-shadow-md">
                        Jelajahi potensi investasi Sumatera Utara melalui Sistem Informasi Geografis yang interaktif dan komprehensif.
                    </p>
                </div>

                <div className="relative z-20 mt-auto flex items-center space-x-2 text-sm text-blue-100">
                    <div className="h-1 w-12 bg-blue-400 rounded-full" />
                    <span>Dinas Penanaman Modal dan Pelayanan Perizinan Terpadu Satu Pintu Provinsi Sumatera Utara</span>
                </div>
            </div>
            <div className="flex flex-col h-full bg-slate-50/50">
                {children}
            </div>
        </div>
    );
}
