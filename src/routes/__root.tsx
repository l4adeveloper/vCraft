import { useRef, useState } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { ReactNode } from 'react'
import stylesheet from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'vCraft — Một không gian dành cho gốm' },
      {
        name: 'description',
        content:
          'Khám phá những dáng gốm, câu chuyện người làm nghề và hành trình từ đất đến tác phẩm.',
      },
    ],
    links: [{ rel: 'stylesheet', href: stylesheet }],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            closeMenu()
            menuButton.current?.focus()
          }
        }}
      >
        <div className="site-header-inner page-shell">
          <Link
            className="wordmark"
            to="/home"
            onClick={closeMenu}
            aria-label="vCraft — Trang chủ"
          >
            vCraft
          </Link>
          <button
            className="menu-toggle"
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Đóng' : 'Menu'}
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="m6 6 12 12M6 18 18 6" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
          <nav
            id="site-navigation"
            className={`site-navigation${menuOpen ? ' is-open' : ''}`}
            aria-label="Điều hướng chính"
          >
            <Link to="/home" hash="collection" onClick={closeMenu}>
              Bộ sưu tập
            </Link>
            <Link to="/home" hash="story" onClick={closeMenu}>
              Câu chuyện
            </Link>
            <Link to="/home" hash="origin" onClick={closeMenu}>
              Nguồn gốc
            </Link>
          </nav>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer page-shell">
        <Link to="/home" className="footer-wordmark">
          vCraft
        </Link>
        <p>Một không gian dành cho gốm và người làm nghề.</p>
        <a href="#main-content">Về đầu trang</a>
      </footer>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
        ]}
      />
    </>
  )
}

function NotFound() {
  return (
    <div className="not-found page-shell">
      <h1>Không tìm thấy trang</h1>
      <p>Trang bạn tìm có thể đã được chuyển hoặc không còn tồn tại.</p>
      <Link className="button-primary" to="/home">
        Về trang chủ
      </Link>
    </div>
  )
}
