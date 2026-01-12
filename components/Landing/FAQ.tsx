import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Pertanyaan yang Sering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-950">Diajukan</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Temukan jawaban atas pertanyaan umum seputar perizinan dan investasi di Sumatera Utara.
                        </p>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                            <h4 className="font-bold text-green-900 mb-2">Masih punya pertanyaan?</h4>
                            <p className="text-green-700 text-sm mb-4">Tim kami siap membantu Anda melalui layanan pengaduan atau konsultasi.</p>
                            <button className="text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full shadow-md shadow-green-200">
                                Hubungi Kami
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left font-semibold text-gray-900 data-[state=open]:text-green-600 hover:text-green-600 transition-colors">
                                    Bagaimana cara mengajukan perizinan usaha?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    Anda dapat mengajukan perizinan usaha melalui sistem OSS (Online Single Submission) di website resmi oss.go.id. Sistem ini terintegrasi dengan layanan DPMPTSP untuk proses yang lebih cepat dan efisien.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left font-semibold text-gray-900 data-[state=open]:text-green-600 hover:text-green-600 transition-colors">
                                    Berapa lama waktu yang dibutuhkan untuk proses izin?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    Waktu proses bervariasi tergantung jenis perizinan. Untuk NIB (Nomor Induk Berusaha) dapat terbit secara instan, sedangkan izin operasional memerlukan waktu 3-7 hari kerja setelah dokumen lengkap.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left font-semibold text-gray-900 data-[state=open]:text-green-600 hover:text-green-600 transition-colors">
                                    Apakah ada biaya untuk pengurusan izin?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    Sebagian besar layanan perizinan di DPMPTSP tidak dipungut biaya. Namun, beberapa jenis izin tertentu mungkin dikenakan retribusi sesuai dengan peraturan daerah yang berlaku.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-left font-semibold text-gray-900 data-[state=open]:text-green-600 hover:text-green-600 transition-colors">
                                    Bagaimana cara melacak status permohonan saya?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                    Anda dapat melacak status perizinan melalui dashboard OSS menggunakan akun yang telah didaftarkan. Status akan diperbarui secara real-time sesuai progres pengurusan.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
}
