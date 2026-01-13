export interface MacroData {
    name: string;
    economy: {
        umk: string;
        grdp_growth: string;
        main_sectors: string[];
    };
    risk_profile: {
        disaster_risk: string;
        social_conflict: string;
    };
    infrastructure: {
        road_status: string;
        power_supply: string;
    };
}

export const getRegionData = (address: string): MacroData => {
    // Default data if no specific match found
    const defaultData: MacroData = {
        name: address || "Wilayah Tidak Teridentifikasi",
        economy: {
            umk: "Rp 2.800.000",
            grdp_growth: "4.5%",
            main_sectors: ["Pertanian", "Perdagangan"]
        },
        risk_profile: {
            disaster_risk: "Sedang (Banjir Musiman)",
            social_conflict: "Rendah"
        },
        infrastructure: {
            road_status: "Baik (Lintas Provinsi)",
            power_supply: "Stabil (PLN Grid)"
        }
    };

    const lowerAddress = (address || "").toLowerCase();

    if (lowerAddress.includes("medan")) {
        return {
            name: "Kota Medan",
            economy: {
                umk: "Rp 3.769.082",
                grdp_growth: "5.8%",
                main_sectors: ["Perdagangan", "Jasa", "Industri Pengolahan"]
            },
            risk_profile: {
                disaster_risk: "Tinggi (Banjir Rob)",
                social_conflict: "Sedang"
            },
            infrastructure: {
                road_status: "Sangat Baik",
                power_supply: "Sangat Stabil"
            }
        };
    }

    if (lowerAddress.includes("deli serdang")) {
        return {
            name: "Kabupaten Deli Serdang",
            economy: {
                umk: "Rp 3.505.076",
                grdp_growth: "5.2%",
                main_sectors: ["Industri", "Pertanian", "Pariwisata"]
            },
            risk_profile: {
                disaster_risk: "Sedang",
                social_conflict: "Rendah"
            },
            infrastructure: {
                road_status: "Baik",
                power_supply: "Stabil"
            }
        };
    }

    if (lowerAddress.includes("karo")) {
        return {
            name: "Kabupaten Karo",
            economy: {
                umk: "Rp 3.300.000",
                grdp_growth: "4.8%",
                main_sectors: ["Pertanian Holtikultura", "Pariwisata"]
            },
            risk_profile: {
                disaster_risk: "Tinggi (Erupsi Sinabung)",
                social_conflict: "Rendah"
            },
            infrastructure: {
                road_status: "Cukup (Perlu Perbaikan di area wisata)",
                power_supply: "Stabil"
            }
        };
    }

    if (lowerAddress.includes("simalungun")) {
        return {
            name: "Kabupaten Simalungun",
            economy: {
                umk: "Rp 2.900.000",
                grdp_growth: "4.6%",
                main_sectors: ["Perkebunan Sawit & Teh", "Pariwisata (Danau Toba)"]
            },
            risk_profile: {
                disaster_risk: "Sedang (Longsor)",
                social_conflict: "Rendah"
            },
            infrastructure: {
                road_status: "Baik",
                power_supply: "Stabil"
            }
        };
    }

    return defaultData;
};
