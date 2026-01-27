import { auth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";


async function handler(req: NextRequest) {
    const handlers = toNextJsHandler(auth)

    if (req.method === 'GET') {
        return handlers.GET(req)
    } else if (req.method === 'POST') {
        return handlers.POST(req)
    }

    return new Response("Method not allowed", {
        status: 405
    })
}

export const GET = handler
export const POST = handler
