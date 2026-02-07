import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const regulations = [
    {
        title: "Peraturan Gubernur Sumatera Utara No. 1 Tahun 2024",
        description: "Tentang Penyelenggaraan Perizinan Berusaha Berbasis Resiko.",
        date: "12 Jan 2024",
        size: "2.4 MB",
        link: "#",
    },
    {
        title: "Peraturan Daerah Provinsi Sumatera Utara No. 3 Tahun 2023",
        description: "Tentang Rencana Umum Penanaman Modal Provinsi Sumatera Utara.",
        date: "15 Nov 2023",
        size: "1.8 MB",
        link: "#",
    },
    {
        title: "Peraturan Gubernur Sumatera Utara No. 56 Tahun 2022",
        description: "Pendelegasian Kewenangan Penyelenggaraan Perizinan Berusaha Kepada Kepala Dinas Penanaman Modal.",
        date: "20 Okt 2022",
        size: "1.2 MB",
        link: "#",
    },
    {
        title: "Undang-Undang No. 6 Tahun 2023",
        description: "Tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 Tentang Cipta Kerja Menjadi Undang-Undang.",
        date: "31 Mar 2023",
        size: "5.6 MB",
        link: "#",
    },
]

export function Regulations() {
    return (
        <section className="py-12 bg-gray-50/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-950">
                        Regulasi & Kebijakan
                    </h2>
                    <p className="max-w-[700px] text-gray-600 md:text-lg">
                        Unduh dokumen resmi terkait peraturan dan kebijakan investasi di Provinsi Sumatera Utara.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
                    {regulations.map((item, index) => (
                        <div
                            key={index}
                            className="group flex flex-col p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                    aria-label={`Download ${item.title}`}
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                            <div className="space-y-2 mb-auto">
                                <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100 text-xs font-medium text-gray-400">
                                <span>{item.date}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{item.size}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">PDF</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
