import { generateInvestmentPrediction } from "@/lib/actions/investment-analysis.actions"
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export const maxDuration = 60

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            )
        }

        const { lat, lng, address } = await req.json()

        if (!lat || !lng || !address) {
            return NextResponse.json(
                { error: "Missing required fields: lat, lng, or address" }, 
                { status: 400 }
            )
        }

        const result = await generateInvestmentPrediction({ lat, lng, address })

        return result.toTextStreamResponse()
    } catch (error) {
        console.error("Prediction error:", error)
        return NextResponse.json(
            { error: "Failed to generate prediction" }, 
            { status: 500 }
        )
    }
}
