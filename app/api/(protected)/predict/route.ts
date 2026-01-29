import { generateInvestmentPrediction } from "@/lib/actions/investment-analysis.actions"
import requireRole from "@/lib/auth/role-guard"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"

export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            })
        }

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
