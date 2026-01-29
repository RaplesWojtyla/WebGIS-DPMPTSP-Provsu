import { headers } from "next/headers"
import { auth } from "../better-auth/auth"
import { redirect } from "next/navigation"


type AllowedRole = 'user' | 'admin' | 'operator'

export default async function requireRole(allowedRoles: AllowedRole[]) {
    const headersList = await headers()
    const currentPath = headersList.get('x-url') || '/dashboard'

    const session = await auth.api.getSession({
        headers: headersList
    })

    if (!session?.user) {
        const loginUrl = new URLSearchParams()
        loginUrl.set('callbackUrl', currentPath)

        redirect(`/sign-in?${loginUrl.toString()}`)
    }

    const userRole = session.user.role as AllowedRole || 'user'

    if (!allowedRoles.includes(userRole)) {
        redirect('/unauthorized')
    }

    return {
        user: session.user,
        role: userRole
    }
}