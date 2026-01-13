export const DUMMY_REGIONS: Record<string, RegionData> = {
  "deli serdang": {
    id: "ds_01",
    name: "Kabupaten Deli Serdang",
    economy: {
      pdrb_growth: "5.2% (Tinggi)",
      top_sectors: ["Industri Manufaktur", "Bandara & Logistik", "Konstruksi"],
      umk: "Rp 3.500.000"
    },
    demography: {
      population: "2.1 Juta Jiwa",
      labor_availability: "Melimpah"
    },
    infrastructure: {
      nearest_toll_gate_km: 5,
      nearest_port_name: "Pelabuhan Belawan (25km)",
      internet_quality: "High Speed Fiber",
      power_supply: "Stabil"
    },
    risk_profile: {
      disaster_risk: "Rendah (Banjir insidental)",
      social_conflict: "Rendah"
    }
  },
  "karo": {
    id: "kr_01",
    name: "Kabupaten Karo",
    economy: {
      pdrb_growth: "3.8% (Sedang)",
      top_sectors: ["Pertanian Hortikultura", "Pariwisata Alam", "Energi Panas Bumi"],
      umk: "Rp 3.070.000"
    },
    demography: {
      population: "400 Ribu Jiwa",
      labor_availability: "Sedang"
    },
    infrastructure: {
      nearest_toll_gate_km: 60,
      nearest_port_name: "Pelabuhan Belawan (70km - Jalur Berbukit)",
      internet_quality: "4G Standard",
      power_supply: "Stabil"
    },
    risk_profile: {
      disaster_risk: "Erupsi Vulkanik (Sinabung)",
      social_conflict: "Rendah"
    }
  },
  // Default fallback jika daerah tidak dikenali
  "default": {
    id: "def_01",
    name: "Sumatera Utara (Umum)",
    economy: {
      pdrb_growth: "4.7%",
      top_sectors: ["Perkebunan", "Pertanian"],
      umk: "Rp 2.800.000 (Rata-rata)"
    },
    demography: {
      population: "15 Juta Jiwa (Provinsi)",
      labor_availability: "Melimpah"
    },
    infrastructure: {
      nearest_toll_gate_km: 20,
      nearest_port_name: "Belawan/Kualanamu",
      internet_quality: "4G Standard",
      power_supply: "Stabil"
    },
    risk_profile: {
      disaster_risk: "Banjir/Longsor di area tertentu",
      social_conflict: "Rendah"
    }
  }
}
