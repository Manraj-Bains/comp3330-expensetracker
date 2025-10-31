import * as React from 'react'

export function AuthBar() {
const [user, setUser] = React.useState<{ email?: string; sub?: string } | null>(null)

  React.useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <div className="flex items-center gap-3 text-sm">
      {user ? (
        <>
          <span className="text-muted-foreground">{user.email ?? user.sub}</span>
          <a className="rounded px-3 py-1 bg-primary text-primary-foreground" href="/api/auth/logout">Logout</a>
        </>
      ) : (
        <a className="rounded px-3 py-1 bg-primary text-primary-foreground" href="/api/auth/login">Login</a>
      )}
    </div>
  )
}
