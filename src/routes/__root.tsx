import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { SiteFooter } from '#/components/layout/SiteFooter'
import { SiteHeader } from '#/components/layout/SiteHeader'
import { OverlayHost } from '#/components/overlays/OverlayHost'
import { MOTION_BOOT_SCRIPT, useReducedMotion } from '#/lib/motionPref'
import { ExploreProvider } from '#/state/explore'
import { SessionRoleProvider } from '#/state/session'
import './admin.css'
import stylesheet from '../styles.css?url'

/** Không có JavaScript thì nội dung chờ hiệu ứng cuộn vẫn phải đọc được. */
const NO_SCRIPT_CSS =
  '[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'vCraft — Triển lãm số làng gốm Bát Tràng' },
      {
        name: 'description',
        content:
          'Từ đất làng, thành câu chuyện. Khám phá tác phẩm gốm, người làm nghề, hành trình của từng mẻ gốm và bản đồ xưởng ở Bát Tràng.',
      },
      { name: 'theme-color', content: '#F4EFE6' },
    ],
    links: [{ rel: 'stylesheet', href: stylesheet }],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const reduced = useReducedMotion()
  const accountPage = useLocation({
    select: ({ pathname }) =>
      /^\/(account|admin|artisan|login|signup)\/?$/.test(pathname),
  })
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <SessionRoleProvider>
        <ExploreProvider>
          <a className="skip-link" href="#main-content">
            Đến nội dung chính
          </a>
          {!accountPage && <SiteHeader />}
          <main id="main-content" tabIndex={-1}>
            <Outlet />
          </main>
          {!accountPage && <SiteFooter />}
          {!accountPage && <OverlayHost />}
        </ExploreProvider>
      </SessionRoleProvider>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
        ]}
      />
    </MotionConfig>
  )
}

function NotFound() {
  return (
    <div className="not-found shell">
      <p className="eyebrow">Lỗi 404</p>
      <h1>Không tìm thấy trang</h1>
      <p>Trang bạn tìm có thể đã được chuyển hoặc không còn tồn tại.</p>
      <Link className="btn btn--primary" to="/home">
        Về trang chủ
      </Link>
    </div>
  )
}
