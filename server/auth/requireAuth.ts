// server/auth/requireAuth.ts
import type { Context } from 'hono'
import { kindeClient, sessionFromHono } from '../auth/kinde'

type Ctx = Context<{ Variables: { user: any } }>

export async function requireAuth(c: Ctx) {
  const authed = await kindeClient.isAuthenticated(sessionFromHono(c))
  if (!authed) return c.json({ error: 'Unauthorized' }, 401)
  const user = await kindeClient.getUserProfile(sessionFromHono(c))
  c.set('user', user) 
  return null
}
