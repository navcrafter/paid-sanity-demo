import {Inter} from 'next/font/google'
import localFont from 'next/font/local'

// Self-hosted fonts. next/font serves them from this site (no Google/Webflow requests),
// adds font-display: swap and size-matched fallbacks to avoid layout shift.
// Each font is exposed as a CSS variable used by the tokens in src/styles/tokens.css.

/** Headings on Home / Creators / Company. Only the weights the design uses. */
export const bdoGrotesk = localFont({
  src: [
    {path: './bdo-grotesk/BDOGrotesk-DemiBold.woff2', weight: '600', style: 'normal'},
    {path: './bdo-grotesk/BDOGrotesk-Bold.woff2', weight: '700', style: 'normal'},
  ],
  variable: '--font-bdo-grotesk',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
})

/** Body text on Home / Creators / Company. */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/** Event pages and the "Log in" toggle. Not preloaded: only downloaded where used. */
export const monaSans = localFont({
  src: [
    {path: './mona-sans/Mona-Sans-Light.woff2', weight: '300', style: 'normal'},
    {path: './mona-sans/Mona-Sans-Regular.woff2', weight: '400', style: 'normal'},
    {path: './mona-sans/Mona-Sans-Medium.woff2', weight: '500', style: 'normal'},
    {path: './mona-sans/Mona-Sans-SemiBold.woff2', weight: '600', style: 'normal'},
    {path: './mona-sans/Mona-Sans-Bold.woff2', weight: '700', style: 'normal'},
    {path: './mona-sans/Mona-Sans-ExtraBold.woff2', weight: '800', style: 'normal'},
    {path: './mona-sans/Mona-Sans-Black.woff2', weight: '900', style: 'normal'},
  ],
  variable: '--font-mona-sans',
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
})

/** Wide cut of Mona Sans (the live site calls it "Mona Sans Extended"), used on event pages. */
export const monaSansWide = localFont({
  src: [
    {path: './mona-sans/Mona-Sans-LightWide.woff2', weight: '300', style: 'normal'},
    {path: './mona-sans/Mona-Sans-RegularWide.woff2', weight: '400', style: 'normal'},
    {path: './mona-sans/Mona-Sans-MediumWide.woff2', weight: '500', style: 'normal'},
    {path: './mona-sans/Mona-Sans-SemiBoldWide.woff2', weight: '600', style: 'normal'},
    {path: './mona-sans/Mona-Sans-BoldWide.woff2', weight: '700', style: 'normal'},
    {path: './mona-sans/Mona-Sans-ExtraBoldWide.woff2', weight: '800', style: 'normal'},
    {path: './mona-sans/Mona-Sans-BlackWide.woff2', weight: '900', style: 'normal'},
  ],
  variable: '--font-mona-sans-wide',
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
})

/** All font CSS variables, applied once on <html>. */
export const fontVariables = [bdoGrotesk, inter, monaSans, monaSansWide].map((f) => f.variable).join(' ')
