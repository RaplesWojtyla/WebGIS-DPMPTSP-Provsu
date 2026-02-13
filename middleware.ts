import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"


export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-url', pathname)

    const isAuthRoute =
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname.startsWith("/verify-email")

    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/invest") ||
        pathname.startsWith("/maps") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/suspended")

    const isAdminRoute = pathname.startsWith("/admin")
    const isOperatorRoute = pathname.startsWith("/operator")
    const isDashboardRoute = pathname.startsWith("/dashboard")
    const isProtectedApiRoute = pathname.startsWith("/api/predict")

    if (isPublicRoute) {
        return NextResponse.next({
            request: { headers: requestHeaders }
        })
    }

    const sessionCookie = getSessionCookie(req)

    if (!sessionCookie) {
        if (isProtectedApiRoute) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        if (isAuthRoute) {
            return NextResponse.next({
                request: { headers: requestHeaders }
            })
        }

        if (isDashboardRoute || isAdminRoute || isOperatorRoute) {
            const signInUrl = new URL('/sign-in', req.url)
            signInUrl.searchParams.set("callbackUrl", req.url)

            return NextResponse.redirect(signInUrl)
        }

        return NextResponse.next({
            request: { headers: requestHeaders }
        })
    }

    // Cookie exists — validate session against DB before redirecting
    if (isAuthRoute) {
        try {
            const sessionRes = await fetch(new URL('/api/auth/get-session', req.url), {
                headers: {
                    cookie: req.headers.get('cookie') || ''
                }
            })

            if (sessionRes.ok) {
                const session = await sessionRes.json()
                if (session?.user) {
                    return NextResponse.redirect(new URL('/dashboard', req.url))
                }
            }
        } catch {
            // Session validation failed — allow auth page access
        }

        // Session invalid/expired — clear stale cookie and let user access auth page
        const response = NextResponse.next({
            request: { headers: requestHeaders }
        })
        response.cookies.delete('better-auth.session_token')
        return response
    }

    return NextResponse.next({
        request: { headers: requestHeaders }
    })
}


export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}