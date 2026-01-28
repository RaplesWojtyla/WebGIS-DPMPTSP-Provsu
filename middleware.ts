import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"


export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAuthRoute =
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname.startsWith("/verify-email")

    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/invest") ||
        pathname.startsWith("/maps") ||
        pathname.startsWith("/api/auth")

    const isAdminRoute = pathname.startsWith("/admin")
    const isOperatorRoute = pathname.startsWith("/operator")
    const isDashboardRoute = pathname.startsWith("/dashboard")
    const isProtectedApiRoute = pathname.startsWith("/api/predict")

    if (isPublicRoute) {
        return NextResponse.next()
    }

    const session = getSessionCookie(req)

    if (!session) {
        if (isProtectedApiRoute) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (isAuthRoute) {
            return NextResponse.next()
        }

        if (isDashboardRoute || isAdminRoute || isOperatorRoute) {
            const signInUrl = new URL('/sign-in', req.url)
            signInUrl.searchParams.set("callbackUrl", req.url)

            return NextResponse.redirect(signInUrl)
        }

        return NextResponse.next()
    }

    if (isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}