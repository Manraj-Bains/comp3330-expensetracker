// server/routes/secure.ts
import { Hono } from 'hono'
import type { Context } from 'hono'
import { requireAuth } from '../auth/requireAuth'

type Ctx = Context<{ Variables: { user: any } }>

export const secureRoute = new Hono<{ Variables: { user: any } }>()

secureRoute.get('/profile', async (c: Ctx) => {
  const err = await requireAuth(c)
  if (err) return err
  const user = c.get('user') 
  return c.json({ user })
})
