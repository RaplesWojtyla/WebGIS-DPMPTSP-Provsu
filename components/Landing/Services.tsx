import { FileCheck, Coins, Activity, MessageSquare, HeadphonesIcon, BookOpen } from "lucide-react";

const services = [
    {
        icon: FileCheck,
        title: "Perizinan Usaha",
        description: "Pengajuan dan penerbitan izin usaha terintegrasi melalui sistem OSS.",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        icon: Coins,
        title: "Penanaman Modal",
        description: "Fasilitasi dan pengawasan investasi daerah untuk pertumbuhan ekonomi.",
        color: "text-slate-600",
        bg: "bg-slate-100"
    },
    {
        icon: Activity,
        title: "Tracking Izin",
        description: "Pantau status perizinan Anda secara real-time dan transparan.",
        color: "text-blue-800",
        bg: "bg-blue-50"
    },
    {
        icon: MessageSquare,
        title: "Pengaduan",
        description: "Layanan pengaduan dan konsultasi untuk masyarakat dan investor.",
        color: "text-slate-950",
        bg: "bg-slate-100"
    },
    {
        icon: HeadphonesIcon,
        title: "Konsultasi Investasi",
        description: "Konsultasi gratis mengenai peluang investasi dan persyaratan perizinan.",
        color: "text-blue-700",
        bg: "bg-blue-50"
    },
    {
        icon: BookOpen,
        title: "Informasi Regulasi",
        description: "Akses informasi lengkap mengenai peraturan dan kebijakan perizinan terkini.",
        color: "text-slate-700",
        bg: "bg-slate-100"
    }
];

export default function Services() {
    return (
        <section id="layanan" className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-950">Unggulan</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Kami menyediakan berbagai layanan perizinan dan investasi yang terintegrasi untuk kemudahan Anda
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        >
                            <div className={`w-14 h-14 rounded-xl ${service.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <service.icon className={`h-7 w-7 ${service.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
