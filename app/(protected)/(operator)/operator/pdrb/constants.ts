export const YEARS = ["2020", "2021", "2022", "2023", "2024"];

export const SECTORS = [
    "Pertanian, Kehutanan dan Perikanan/Agriculture, Forestry, and Fishing",
    "Pertambangan dan Penggalian/Mining and Quarrying",
    "Industri Pengolahan/ Manufacturing",
    "Pengadaan Listrik dan Gas/Electricity, Gas, Steam and Air Conditioning Supply",
    "Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang/ Water Supply,Sewerage, Waste Management and Remediation Activities",
    "Konstruksi/Construction",
    "Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor/Wholesale and RetailTrade; Repair of Motor Vehicles and Motorcycles",
    "Transportasi dan Pergudangan/Transportation and Storage",
    "Penyediaan Akomodasi dan Makan Minum/ Accommodation and Food Service Activities",
    "Informasi dan Komunikasi/Information and Communication",
    "Jasa Keuangan dan Asuransi/Financial and Insurance Activities",
    "Real Estat/Real Estate Activities",
    "Jasa Perusahaan/Business Activities",
    "Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib/Public Administration and Defence, Compulsory Social Security",
    "Jasa Pendidikan/Education",
    "Jasa Kesehatan dan Kegiatan Sosial/Human Health and Social Work Activities",
    "Jasa Lainnya/Other Service Activities"
];

export const REGIONS = [
    { id: "12", name: "PROVINSI SUMATERA UTARA", type: "Provinsi" },
    { id: "1201", name: "KAB. NIAS", type: "Kabupaten" },
    { id: "1202", name: "KAB. MANDAILING NATAL", type: "Kabupaten" },
    { id: "1203", name: "KAB. TAPANULI SELATAN", type: "Kabupaten" },
    { id: "1204", name: "KAB. TAPANULI TENGAH", type: "Kabupaten" },
    { id: "1205", name: "KAB. TAPANULI UTARA", type: "Kabupaten" },
    { id: "1206", name: "KAB. TOBA SAMOSIR", type: "Kabupaten" },
    { id: "1207", name: "KAB. LABUHAN BATU", type: "Kabupaten" },
    { id: "1208", name: "KAB. ASAHAN", type: "Kabupaten" },
    { id: "1209", name: "KAB. SIMALUNGUN", type: "Kabupaten" },
    { id: "1210", name: "KAB. DAIRI", type: "Kabupaten" },
    { id: "1211", name: "KAB. KARO", type: "Kabupaten" },
    { id: "1212", name: "KAB. DELI SERDANG", type: "Kabupaten" },
    { id: "1213", name: "KAB. LANGKAT", type: "Kabupaten" },
    { id: "1214", name: "KAB. NIAS SELATAN", type: "Kabupaten" },
    { id: "1215", name: "KAB. HUMBANG HASUNDUTAN", type: "Kabupaten" },
    { id: "1216", name: "KAB. PAKPAK BHARAT", type: "Kabupaten" },
    { id: "1217", name: "KAB. SAMOSIR", type: "Kabupaten" },
    { id: "1218", name: "KAB. SERDANG BEDAGAI", type: "Kabupaten" },
    { id: "1219", name: "KAB. BATU BARA", type: "Kabupaten" },
    { id: "1220", name: "KAB. PADANG LAWAS UTARA", type: "Kabupaten" },
    { id: "1221", name: "KAB. PADANG LAWAS", type: "Kabupaten" },
    { id: "1222", name: "KAB. LABUHAN BATU SELATAN", type: "Kabupaten" },
    { id: "1223", name: "KAB. LABUHAN BATU UTARA", type: "Kabupaten" },
    { id: "1224", name: "KAB. NIAS UTARA", type: "Kabupaten" },
    { id: "1225", name: "KAB. NIAS BARAT", type: "Kabupaten" },
    { id: "1271", name: "KOTA SIBOLGA", type: "Kota" },
    { id: "1272", name: "KOTA TANJUNG BALAI", type: "Kota" },
    { id: "1273", name: "KOTA PEMATANG SIANTAR", type: "Kota" },
    { id: "1274", name: "KOTA TEBING TINGGI", type: "Kota" },
    { id: "1275", name: "KOTA MEDAN", type: "Kota" },
    { id: "1276", name: "KOTA BINJAI", type: "Kota" },
    { id: "1277", name: "KOTA PADANGSIDIMPUAN", type: "Kota" },
    { id: "1278", name: "KOTA GUNUNGSITOLI", type: "Kota" },
];

export type PdrbValue = {
    sectorIndex: number; // 0-16
    value: number;
};

export type RegionPdrbData = {
    year: string;
    regionId: string;
    values: PdrbValue[]
};

export const STORAGE_KEY_PREFIX = "pdrb-data-";
