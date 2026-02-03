import { google, GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { streamText } from "ai";
import { getRegionData } from "./get-region-data.actions";


export const generateInvestmentPrediction = async ({ lat, lng, address }: PredictionInput) => {
    const macroData = getRegionData(address || "")

    const prompt = `
        ROLE:
        Anda adalah Senior Investment Analyst & Urban Planner dengan akses ke data terkini.
        
        INPUT DATA:
        1. **Titik Koordinat**: ${lat}, ${lng}
        2. **Lokasi Administratif**: ${address}
        3. **Data Makro Wilayah (Official Data)**: 
        ${JSON.stringify(macroData, null, 2)}
        
        INSTRUKSI:
        1. Cari BERITA TERKINI tentang wilayah "${address}" atau "${macroData.name}" 
           terkait investasi, pembangunan, infrastruktur, atau ekonomi.
        2. Gabungkan data makro dengan berita terkini untuk analisis yang akurat.
        3. Berikan rekomendasi berdasarkan kondisi real-time.
        FORMAT LAPORAN (Markdown):
        
        # Analisis Investasi: ${macroData.name}
        ## 1. Kondisi Terkini (Berdasarkan Berita)
        (Rangkum berita terbaru yang relevan dengan investasi di wilayah ini)
        
        ## 2. Observasi Lokasi
        (Analisis kondisi fisik di koordinat ${lat}, ${lng})
        
        ## 3. Potensi & Kesesuaian Lahan
        * **Peruntukan Terbaik**: (Bisnis apa yang cocok?)
        * **Alasan**: (Dukung dengan data UMK ${macroData.economy.umk})
        
        ## 4. Analisis SWOT
        * **Strengths**: ...
        * **Weaknesses**: ...
        * **Opportunities**: (Berdasarkan berita terkini)
        * **Threats**: (Risiko: ${macroData.risk_profile.disaster_risk})
        
        ## 5. Rekomendasi Strategis
        (3 langkah konkret untuk investor)
        
        ## 📰 Sumber Berita
        (Cantumkan sumber berita yang digunakan)
    `

    return streamText({
        model: google('gemini-2.5-flash'),
        tools: {
            google_search: google.tools.googleSearch({
                mode: 'MODE_DYNAMIC'
            })
        },
        system: "Anda adalah Senior Investment Analyst & Urban Planner dengan akses ke data terkini. Tugas: Site Analysis untuk calon investor. Gunakan bahasa bisnis profesional.",
        prompt: prompt,
        providerOptions: {
            google: {
                thinkingConfig: {
                    thinkingBudget: 8192,
                    includeThoughts: true
                }
            } satisfies GoogleGenerativeAIProviderOptions
        }
    })

}