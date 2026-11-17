/**
 * Hệ thống chuyển động của vCraft. Các giá trị này có bản sao dạng biến CSS
 * trong `src/styles.css` (--dur-*, --ease-*); sửa một nơi thì sửa cả hai.
 */
type Bezier = [number, number, number, number]

/** Mềm lúc đầu, dứt khoát lúc kết thúc: dùng cho nội dung đi vào. */
export const EASE_OUT: Bezier = [0.22, 1, 0.36, 1]
/** Dùng cho mask, drawer, menu: những mặt phẳng lớn trượt qua màn hình. */
export const EASE_IN_OUT: Bezier = [0.65, 0, 0.35, 1]

export const DUR = {
  /** Chuyển cảnh lớn: mask ảnh, hero. */
  scene: 0.9,
  /** Nội dung đi vào theo cuộn. */
  section: 0.7,
  /** Drawer, menu. */
  overlay: 0.55,
  /** Đổi ảnh, đổi nội dung tại chỗ. */
  swap: 0.4,
  /** Phản hồi nút, tab, hover. */
  ui: 0.2,
} as const

export const STAGGER = 0.08

/** Ngưỡng kích hoạt khi cuộn: phần tử vào sâu 12% màn hình mới xuất hiện. */
export const IN_VIEW = { once: true, margin: '0px 0px -12% 0px' } as const
