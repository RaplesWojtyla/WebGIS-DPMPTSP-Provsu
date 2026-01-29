import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4 p-8">
                <ShieldX className="w-16 h-16 text-red-500 mx-auto" />
                <h1 className="text-2xl font-bold text-gray-900">Akses Ditolak</h1>
                <p className="text-muted-foreground max-w-md">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <Button asChild>
                    <Link href="/dashboard">Kembali ke Beranda</Link>
                </Button>
            </div>
        </div>
    )
}
