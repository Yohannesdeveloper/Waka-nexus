import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

export default createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

    // The root path is treated as the default locale
    localePrefix: 'never'
});

export const config = {
    // Match all pathnames except for
    // - API routes
    // - _next (static files)
    // - _vercel (Vercel specific files)
    // - static assets (e.g. favicon.ico, images, etc.)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
