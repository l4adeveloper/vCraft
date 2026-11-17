import { useSyncExternalStore } from 'react'

/**
 * Công tắc chuyển động của cả trang là class `motion` trên <html>, do đoạn
 * script trong <head> gắn trước khi vẽ (xem `routes/__root.tsx`):
 *   - người dùng không bật "giảm chuyển động" → có class;
 *   - thêm `?motion=on` vào URL → luôn có class (để kiểm thử);
 *   - không có JavaScript → không có class, trang đứng yên và đọc được.
 * CSS dùng `html.motion …` / `html:not(.motion) …`; component dùng hook này.
 */
export const MOTION_BOOT_SCRIPT =
  "(function(){try{var d=document.documentElement;if(/[?&]motion=on/.test(location.search)||!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion')}catch(e){}})()"

const noop = () => () => {}

/** `true` khi nên bỏ chuyển động. Khi render phía máy chủ luôn là `false`. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    noop,
    () => !document.documentElement.classList.contains('motion'),
    () => false,
  )
}
