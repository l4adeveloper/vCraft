import { useState } from 'react'
import { useHydrated } from '@tanstack/react-router'

export function SignOutButton() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const hydrated = useHydrated()

  async function logout() {
    setBusy(true)
    setError(false)
    try {
      const response = await fetch('/api/auth', { method: 'DELETE' })
      if (response.ok) {
        window.location.replace('/login')
        return
      }
    } catch {
      // Allow the user to retry from the same page.
    }
    setError(true)
    setBusy(false)
  }

  return (
    <>
      <button
        type="button"
        className="btn btn--ghost btn--small"
        disabled={!hydrated || busy}
        onClick={logout}
      >
        {busy ? 'Đang đăng xuất…' : 'Đăng xuất'}
      </button>
      {error && (
        <p role="alert" className="form-alert">
          Chưa đăng xuất được. Vui lòng thử lại.
        </p>
      )}
    </>
  )
}
