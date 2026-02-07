import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({ adapter })

const sectors = [
    { code: 'A', name: 'Pertanian, Kehutanan dan Perikanan', nameEn: 'Agriculture, Forestry and Fishing' },
    { code: 'B', name: 'Pertambangan dan Penggalian', nameEn: 'Mining and Quarrying' },
    { code: 'C', name: 'Industri Pengolahan', nameEn: 'Manufacturing' },
    { code: 'D', name: 'Pengadaan Listrik dan Gas', nameEn: 'Electricity and Gas Supply' },
    { code: 'E', name: 'Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang', nameEn: 'Water Supply, Sewerage, Waste Management' },
    { code: 'F', name: 'Konstruksi', nameEn: 'Construction' },
    { code: 'G', name: 'Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor', nameEn: 'Wholesale and Retail Trade; Repair of Motor Vehicles' },
    { code: 'H', name: 'Transportasi dan Pergudangan', nameEn: 'Transportation and Storage' },
    { code: 'I', name: 'Penyediaan Akomodasi dan Makan Minum', nameEn: 'Accommodation and Food Service' },
    { code: 'J', name: 'Informasi dan Komunikasi', nameEn: 'Information and Communication' },
    { code: 'K', name: 'Jasa Keuangan dan Asuransi', nameEn: 'Financial and Insurance Services' },
    { code: 'L', name: 'Real Estat', nameEn: 'Real Estate' },
    { code: 'M,N', name: 'Jasa Perusahaan', nameEn: 'Business Services' },
    { code: 'O', name: 'Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib', nameEn: 'Public Administration, Defence, Social Security' },
    { code: 'P', name: 'Jasa Pendidikan', nameEn: 'Education Services' },
    { code: 'Q', name: 'Jasa Kesehatan dan Kegiatan Sosial', nameEn: 'Human Health and Social Work' },
    { code: 'R,S,T,U', name: 'Jasa Lainnya', nameEn: 'Other Services' },
]

async function main() {
    console.log('🌱 Seeding sectors...')

    for (const sector of sectors) {
        await prisma.sector.upsert({
            where: { code: sector.code },
            update: {},
            create: sector,
        })
        console.log(`  ✓ ${sector.code}: ${sector.name}`)
    }

    console.log('✅ Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
