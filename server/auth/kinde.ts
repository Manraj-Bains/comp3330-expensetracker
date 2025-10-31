import 'dotenv/config'
import { Hono } from 'hono'
import { setCookie, deleteCookie, getCookie } from 'hono/cookie'
import type { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import { createKindeServerClient, GrantType } from '@kinde-oss/kinde-typescript-sdk'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Normalize + log config (debug-friendly)
const ISS = (process.env.KINDE_ISSUER_URL || '').replace(/\/$/, '')
const CID = process.env.KINDE_CLIENT_ID
const CSECRET = process.env.KINDE_CLIENT_SECRET
const REDIRECT = process.env.KINDE_REDIRECT_URI

console.log('Kinde config ->', {
  iss: ISS,
  hasId: !!CID,
  hasSecret: !!CSECRET,
  redirect: REDIRECT,
})

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: ISS,
  clientId: CID!,
  clientSecret: CSECRET!,
  redirectURL: REDIRECT!,
  logoutRedirectURL: FRONTEND_URL,
})

// Minimal cookie-backed SessionManager for Hono.
export function sessionFromHono(c: any): SessionManager {
  return {
    async getSessionItem(key: string) {
      return getCookie(c, key) ?? null           // ✅ use getCookie
    },
    async setSessionItem(key: string, value: unknown) {
      setCookie(c, key, String(value), { httpOnly: true, sameSite: 'lax', path: '/' })
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key)
    },
    async destroySession() {
      for (const k of ['access_token', 'id_token', 'refresh_token', 'session']) {
        deleteCookie(c, k)
      }
    },
  }
}

export const authRoute = new Hono()

// 1) Start login: get hosted login URL from SDK and redirect
authRoute.get('/login', async (c) => {
  try {
    const session = sessionFromHono(c)
    const url = await kindeClient.login(session)
    return c.redirect(url.toString())
  } catch (e: any) {
    console.error('Kinde login error:', e?.message || e)
    return c.text(
      'Kinde login error: ' + (e?.message || 'unknown') +
      '\nCheck KINDE_ISSUER_URL, KINDE_CLIENT_ID, KINDE_CLIENT_SECRET, and Allowed callback URL',
      500
    )
  }
})

// 2) OAuth callback: validate + store tokens, then redirect
authRoute.get('/callback', async (c) => {
  const session = sessionFromHono(c)
  await kindeClient.handleRedirectToApp(session, new URL(c.req.url))
  return c.redirect(`${FRONTEND_URL}/expenses`)
})

// 3) Logout via SDK
authRoute.get('/logout', async (c) => {
  const session = sessionFromHono(c)
  await kindeClient.logout(session)
  return c.redirect(FRONTEND_URL)
})

// 4) Current user (profile)
authRoute.get('/me', async (c) => {
  const session = sessionFromHono(c)
  try {
    const profile = await kindeClient.getUserProfile(session)
    return c.json({ user: profile })
  } catch {
    return c.json({ user: null })
  }
})
