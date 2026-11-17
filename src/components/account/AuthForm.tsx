import { useState } from 'react'
import { Link, useHydrated } from '@tanstack/react-router'
import type { FormEvent } from 'react'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const hydrated = useHydrated()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const signingUp = mode === 'signup'
  const title = signingUp ? 'Đăng ký tài khoản' : 'Đăng nhập'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    if (signingUp && password !== form.get('confirmPassword')) {
      setError('Mật khẩu nhập lại chưa khớp.')
      document.getElementById('auth-confirm-password')?.focus()
      return
    }

    setBusy(true)
    setError('')
    try {
      const response = await fetch(signingUp ? '/api/signup' : '/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password,
          name: form.get('name'),
        }),
      })
      if (response.ok) {
        const { role } = (await response.json()) as { role?: string }
        window.location.assign(
          role === 'admin' && !signingUp ? '/admin' : '/account',
        )
        return
      }

      if (response.status === 429) {
        setError('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.')
      } else if (signingUp && response.status === 400) {
        setError(
          'Kiểm tra thông tin và dùng mật khẩu từ 15 ký tự, tối đa 128 byte.',
        )
      } else if (signingUp && response.status === 409) {
        setError(
          'Không thể đăng ký với email này. Nếu đã có tài khoản, hãy đăng nhập.',
        )
      } else if (
        !signingUp &&
        (response.status === 401 || response.status === 400)
      ) {
        setError('Email hoặc mật khẩu chưa đúng.')
      } else {
        setError('Không thể tiếp tục lúc này. Vui lòng thử lại.')
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    }
    setBusy(false)
  }

  return (
    <div className="account-panel">
      <Link to="/home" className="wordmark">
        vCraft
      </Link>
      <h1>{title}</h1>
      <form
        onSubmit={submit}
        method="post"
        action={signingUp ? '/api/signup' : '/api/auth'}
      >
        <fieldset disabled={!hydrated || busy}>
          {signingUp && (
            <div className="field">
              <label htmlFor="auth-name">Họ và tên</label>
              <input
                id="auth-name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </div>
          <div className="field">
            <label htmlFor="auth-password">Mật khẩu</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={signingUp ? 'new-password' : 'current-password'}
              required
              minLength={signingUp ? 4 : undefined}
              maxLength={128}
              aria-describedby={signingUp ? 'auth-password-hint' : undefined}
            />
            {signingUp && (
              <p className="field__hint" id="auth-password-hint">
                Ít nhất 15 ký tự.
              </p>
            )}
          </div>
          {signingUp && (
            <div className="field">
              <label htmlFor="auth-confirm-password">Nhập lại mật khẩu</label>
              <input
                id="auth-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          )}
          {error && (
            <p role="alert" className="form-alert">
              {error}
            </p>
          )}
          <button className="btn btn--primary" type="submit">
            {busy ? (signingUp ? 'Đang đăng ký…' : 'Đang đăng nhập…') : title}
          </button>
        </fieldset>
      </form>
      <p>
        {signingUp ? (
          <>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </>
        ) : (
          <>
            Chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
          </>
        )}
      </p>
      <Link to="/home">Về trang triển lãm</Link>
    </div>
  )
}
