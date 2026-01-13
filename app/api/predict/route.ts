import { generateInvestmentPrediction } from "@/lib/actions/investment-analysis.actions"


export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const response = await req.json()
        const { lat, lng, address } = response

        if (!lat || !lng || !address) {
            return new Response(JSON.stringify({ error: "Missing required fields: lat, lng, or address" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            })
        }

        const result = await generateInvestmentPrediction({ lat, lng, address })

        return result.toTextStreamResponse()
    } catch (error) {
        console.error("Prediction error:", error)
        return new Response(JSON.stringify({ error: "Failed to generate prediction" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}