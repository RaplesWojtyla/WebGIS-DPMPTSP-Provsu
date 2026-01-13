import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getRegionData } from "./get-region-data.actions";


export const generateInvestmentPrediction = async ({ lat, lng, address }: PredictionInput) => {
    const macroData = getRegionData(address || "")

    const prompt = `
        ROLE:
        Anda adalah Senior Investment Analyst & Urban Planner. Tugas anda adalah melakukan "Site Analysis" (Analisis Tapak) untuk calon investor.

        INPUT DATA:
        1. **Titik Koordinat**: ${lat}, ${lng}
        2. **Lokasi Administratif**: ${address}
        3. **Data Makro Wilayah (Official Data)**: 
        ${JSON.stringify(macroData, null, 2)}

        TUGAS UTAMA:
        Lakukan analisis investasi mendalam yang menggabungkan KONDISI MIKRO (Koordinat) dengan DATA MAKRO (Wilayah).

        INSTRUKSI ANALISIS:
        - **Analisis Mikro**: Apa yang anda ketahui tentang area di ${lat}, ${lng}? (Hutan/Kota/Pesisir?)
        - **Cross-Validation**: Gabungkan data makro dengan fakta lapangan. 
        (Contoh: Jika data bilang "Industri" tapi lokasi di tengah sawah, beri saran pembebasan lahan).

        FORMAT LAPORAN (Markdown):
        
        # Analisis Investasi: ${macroData.name} (Site Specific)

        ## 1. Observasi Lokasi (Analisis Koordinat)
        (Jelaskan kondisi fisik lahan di titik ini).

        ## 2. Potensi & Kesesuaian Lahan
        * **Peruntukan Terbaik**: (Bisnis apa yang cocok?)
        * **Alasan**: (Dukung dengan data ${macroData.economy.umk} atau infrastruktur).

        ## 3. Analisis SWOT
        * **Strengths**: ...
        * **Weaknesses**: ...
        * **Opportunities**: ...
        * **Threats**: (Sebutkan risiko bencana: ${macroData.risk_profile.disaster_risk}).

        ## 4. Rekomendasi Strategis
        (3 Langkah konkret untuk investor).

        Gunakan bahasa bisnis profesional.
    `;

    return streamText({
        model: google('gemini-1.5-flash'),
        prompt: prompt
    })
}