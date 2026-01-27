import * as React from 'react'
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Tailwind,
} from '@react-email/components'

interface VerifyEmailProps {
    user: string
    url: string
}

const EmailVerification = ({ user, url }: VerifyEmailProps) => {
    return (
        <Html lang="id" dir="ltr">
            <Tailwind>
                <Head />
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] p-[32px] max-w-[600px] mx-auto">
                        <Section>
                            <Text className="text-[24px] font-bold text-gray-900 mb-[16px] mt-0">
                                Verifikasi Alamat Email Anda
                            </Text>

                            <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
                                Yth. {user},
                            </Text>

                            <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
                                Terima kasih telah mendaftar pada layanan DPMPTSP Provinsi Sumatera Utara.
                                Untuk menyelesaikan proses pendaftaran dan mengamankan akun Anda,
                                silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini.
                            </Text>

                            <Section className="text-center mb-[32px]">
                                <Button
                                    href={url}
                                    className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border"
                                >
                                    Verifikasi Email
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-600 mb-[24px] mt-0 leading-[20px]">
                                Apabila tombol di atas tidak berfungsi, Anda dapat menyalin dan menempelkan tautan berikut ke browser Anda:
                            </Text>

                            <Text className="text-[14px] text-blue-600 mb-[32px] mt-0 break-all">
                                {url}
                            </Text>

                            <Hr className="border-gray-200 mb-[24px]" />

                            <Text className="text-[12px] font-bold text-gray-500 mb-[8px] mt-0">
                                Tautan verifikasi ini akan kedaluwarsa dalam 1 jam demi keamanan.
                            </Text>

                            <Text className="text-[12px] text-gray-500 mt-0 mb-[24px]">
                                Apabila Anda tidak merasa mendaftar akun, Anda dapat mengabaikan email ini.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 mb-[24px]" />

                        <Section>
                            <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                                © 2026 Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Provinsi Sumatera Utara.
                            </Text>
                            <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                                Jl. K.H. Wahid Hasyim No.8A, Merdeka, Kec. Medan Baru, Kota Medan, Sumatera Utara 20154, Indonesia
                            </Text>
                            <Text className="text-[12px] text-gray-500 m-0">
                                <a href="#" className="text-gray-500 no-underline">Berhenti Berlangganan</a>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default EmailVerification