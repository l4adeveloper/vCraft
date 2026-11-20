import { createContext, useContext, useEffect, useState } from 'react'
import type { AccountRole } from '#/lib/account'
import type { ReactNode } from 'react'

const SessionRoleContext = createContext<AccountRole | null | undefined>(
  undefined,
)

export function SessionRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AccountRole | null>()

  useEffect(() => {
    const controller = new AbortController()
    async function readRole() {
      try {
        const response = await fetch('/api/auth', { signal: controller.signal })
        if (!response.ok) return
        const session = (await response.json()) as { role: AccountRole | null }
        setRole(session.role)
      } catch {
        // Buyer controls stay hidden when the session cannot be confirmed.
      }
    }
    void readRole()
    return () => controller.abort()
  }, [])

  return (
    <SessionRoleContext.Provider value={role}>
      {children}
    </SessionRoleContext.Provider>
  )
}

export function useSessionRole() {
  return useContext(SessionRoleContext)
}
