import { useCallback, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { ArrowRight } from '#/components/ui/Icon'
import { accountPage } from '#/lib/account'
import { cx } from '#/lib/format'
import { useDialogBehavior } from '#/lib/hooks'
import { DUR, EASE_IN_OUT, EASE_OUT, STAGGER } from '#/lib/motion'
import { useExplore } from '#/state/explore'
import { useSessionRole } from '#/state/session'

export const NAV_ITEMS = [
  { label: 'Triển lãm', hash: 'trien-lam' },
  { label: 'Nghệ nhân', hash: 'nghe-nhan' },
  { label: 'Bản đồ làng', hash: 'ban-do' },
]

export function SiteHeader() {
  const { open } = useExplore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const role = useSessionRole()
  const header = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24))

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useDialogBehavior(menuOpen, header, closeMenu, { autoFocus: false })

  const requestQuote = () => {
    setMenuOpen(false)
    open({ type: 'quote' })
  }

  return (
    <header
      ref={header}
      className={cx(
        'site-header',
        scrolled && 'is-scrolled',
        menuOpen && 'is-menu-open',
      )}
    >
      <div className="site-header__bar shell">
        <Link
          className="wordmark"
          to="/home"
          onClick={closeMenu}
          aria-label="vCraft — Trang chủ"
        >
          vCraft
        </Link>
        <nav className="site-nav" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => (
            <Link key={item.hash} to="/home" hash={item.hash}>
              {item.label}
            </Link>
          ))}
        </nav>
        {role === 'customer' && (
          <button
            type="button"
            className="btn btn--primary btn--small site-header__cta"
            onClick={requestQuote}
          >
            Đặt hàng theo yêu cầu
          </button>
        )}
        <nav className="site-header__account" aria-label="Tài khoản">
          {role ? (
            <Link to={accountPage(role)} preload={false} onClick={closeMenu}>
              {role === 'artisan'
                ? 'Xưởng của tôi'
                : role === 'admin'
                  ? 'Quản trị'
                  : 'Tài khoản'}
            </Link>
          ) : (
            <>
              <Link to="/login" preload={false} onClick={closeMenu}>
                Đăng nhập
              </Link>
              <Link to="/signup" preload={false} onClick={closeMenu}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span>{menuOpen ? 'Đóng' : 'Menu'}</span>
          <span className="menu-toggle__bars" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="site-menu"
            className="menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: DUR.overlay, ease: EASE_IN_OUT }}
          >
            <nav
              className="menu__nav shell"
              aria-label="Điều hướng trên di động"
            >
              <ul>
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.hash}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: DUR.section,
                      ease: EASE_OUT,
                      delay: 0.2 + index * STAGGER,
                    }}
                  >
                    <Link to="/home" hash={item.hash} onClick={closeMenu}>
                      <span className="menu__no">0{index + 1}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="menu__foot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.section, delay: 0.55 }}
              >
                {role === 'customer' && (
                  <button
                    type="button"
                    className="btn btn--paper"
                    onClick={requestQuote}
                  >
                    Đặt hàng theo yêu cầu
                    <ArrowRight />
                  </button>
                )}
                <p>Triển lãm số làng gốm Bát Tràng</p>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
