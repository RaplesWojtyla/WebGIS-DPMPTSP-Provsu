
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const sectors = [
    "Perdagangan, Hotel, dan Restoran",
    "Industri Pengolahan",
    "Jasa-jasa",
    "Tanaman Pangan, Perkebunan, dan Peternakan",
    "Perikanan",
    "Pertambangan",
    "Konstruksi",
    "Transportasi, Gudang, dan Telekomunikasi",
    "Listrik, Gas, dan Air Bersih",
    "Kehutanan",
    "Real Estate dan Jasa Perusahaan",
    "Jasa Keuangan"
];

const regions = [
    "Kota Medan", "Kabupaten Deli Serdang", "Kabupaten Karo", "Kota Binjai",
    "Kabupaten Langkat", "Kabupaten Serdang Bedagai", "Kota Tebing Tinggi",
    "Kabupaten Batubara", "Kabupaten Asahan", "Kota Tanjungbalai",
    "Kabupaten Labuhanbatu", "Kabupaten Labuhanbatu Utara", "Kabupaten Labuhanbatu Selatan",
    "Kabupaten Simalungun", "Kota Pematangsiantar", "Kabupaten Toba",
    "Kabupaten Tapanuli Utara", "Kabupaten Humbang Hasundutan", "Kabupaten Samosir",
    "Kabupaten Dairi", "Kabupaten Pakpak Bharat", "Kabupaten Tapanuli Tengah",
    "Kota Sibolga", "Kabupaten Tapanuli Selatan", "Kota Padangsidimpuan",
    "Kabupaten Mandailing Natal", "Kabupaten Padang Lawas", "Kabupaten Padang Lawas Utara",
    "Kabupaten Nias", "Kota Gunungsitoli", "Kabupaten Nias Selatan",
    "Kabupaten Nias Utara", "Kabupaten Nias Barat"
];

const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const data = [];

// Helper to generate consistent randomish data based on inputs
function seededRandom(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

sectors.forEach(sector => {
    regions.forEach(region => {
        // Base value varies by region type
        let baseValue = 3000000000; // 3 Billion default

        if (region.includes("Medan") || region.includes("Deli")) baseValue = 15000000000;
        if (region.includes("Binjai") || region.includes("Siantar")) baseValue = 8000000000;

        // Base value varies by sector
        if (sector.includes("Perdagangan")) baseValue *= 1.5;
        if (sector.includes("Industri")) baseValue *= 1.3;

        years.forEach(year => {
            // Trend component: steady growth 5-10% per year
            const yearIndex = year - 2010;
            const growthFactor = Math.pow(1.08, yearIndex);

            // Random variation +/- 20%
            const seed = `${region}-${sector}-${year}`;
            const variation = 0.8 + (seededRandom(seed) * 0.4);

            let value = baseValue * growthFactor * variation;

            // Round to hundreds of millions for cleaner look
            value = Math.round(value / 100000000) * 100000000;

            data.push({
                id: `${region}_${sector}_${year}`.replace(/[\s,]+/g, '_').toLowerCase(),
                region,
                sector,
                value,
                year
            });
        });
    });
});

// Write to file directly
const outputPath = path.join(__dirname, '../data/investment_dummy.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
console.log(`Data written to ${outputPath}`);

