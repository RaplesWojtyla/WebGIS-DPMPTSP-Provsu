import { Map, Layers, Search, MousePointerClick, Info as InfoIcon } from "lucide-react"

const guideSteps = [
    {
        icon: Layers,
        title: "Eksplorasi Layer Peta",
        description: "Gunakan menu panel kiri untuk mengaktifkan/menonaktifkan berbagai layer data seperti batas administrasi, kawasan industri, dan infrastruktur.",
    },
    {
        icon: Search,
        title: "Pencarian Lokasi",
        description: "Gunakan fitur pencarian di pojok kiri atas peta untuk menemukan lokasi spesifik, kecamatan, atau koordinat tertentu dengan cepat.",
    },
    {
        icon: MousePointerClick,
        title: "Interaksi Objek",
        description: "Klik pada objek peta (poligon wilayah atau titik lokasi) untuk melihat informasi detail (popup) terkait potensi investasi dan data demografi.",
    },
    {
        icon: InfoIcon,
        title: "Informasi Detail",
        description: "Menu 'Analisis' memberikan insight mendalam tentang kesesuaian lahan dan potensi sektor unggulan di area yang dipilih.",
    },
]

export function UserGuide() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-2">
                                <Map className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-950">
                                Panduan WebGIS
                            </h2>
                            <p className="text-gray-600 md:text-lg">
                                Optimalkan penggunaan peta interaktif untuk mengeksplorasi potensi investasi di Sumatera Utara.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {guideSteps.map((step, index) => (
                                <div key={index} className="flex flex-col space-y-2">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-blue-600">
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed pl-6">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <a
                                href="/maps"
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                <Map className="w-4 h-4 mr-2" />
                                Buka Peta Interaktif
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Abstract decorative elements */}
                        <div className="absolute -inset-4 bg-linear-to-r from-blue-100 to-green-50 rounded-full blur-3xl opacity-50 -z-10" />

                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-gray-900 max-w-md mx-auto lg:max-w-full rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Mockup UI representation */}
                            <div className="absolute top-0 w-full h-8 bg-gray-800 flex items-center px-3 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="p-1 pt-9 bg-gray-100 aspect-video flex items-center justify-center text-gray-400">
                                {/* Here we would normally use an Image, but using a placeholder for the component creation */}
                                <div className="text-center">
                                    <Map className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                                    <span className="text-xs">Preview WebGIS Interface</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
