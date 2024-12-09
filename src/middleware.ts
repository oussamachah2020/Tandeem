import {withAuth} from "next-auth/middleware";
import {SECTIONS} from "@/common/security/Sections";
import {NextResponse} from "next/server";
import {ACTIONS} from "@/common/security/Actions";
import {Role} from "@prisma/client";

export default withAuth(async (req) => {
    const user = req.nextauth.token
    if (
        req.nextUrl.pathname === '/login' ||
        req.nextUrl.pathname === '/forgot-password' ||
        req.nextUrl.pathname === '/reset-password'
    ) {
        if (user) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        } else {
            return NextResponse.next()
        }
    }
    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/api')) {
        const [qualifier, action] = req.nextUrl.pathname.split('/').slice(2)
        if (qualifier === 'files') {
            return NextResponse.next()
        }
        if (qualifier === 'mobile') {
            if (user?.role === Role.EMPLOYEE) {
                return NextResponse.next()
            }
            return NextResponse.json('', {status: 403})
        }
        const authorizedRoles = ACTIONS[qualifier][action]
        if (authorizedRoles.includes(user?.role as Role)) {
            return NextResponse.next()
        }
    } else {
        const section = SECTIONS.find(({href}) => req.nextUrl.pathname.startsWith(href))
        if (section && section.authorizedRoles.includes(user?.role as Role)) {
            return NextResponse.next();
        }
    }
    return NextResponse.redirect(new URL('/404', req.url))
}, {
    pages: {
        signIn: '/login',
        signOut: '/logout'
    }
})

export const config = {
    matcher: '/((?!_next|static|favicon.ico|404|403|500|login|logout|img|files|api/files|api/auth|api/mobile|api/validation|forgot-password|api/security/forgot-password|reset-password|api/security/reset-password).*)'
};