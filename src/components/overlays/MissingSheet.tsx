import { useExplore } from '#/state/explore'

/** Trạng thái lỗi khi ID trong liên kết không còn khớp với dữ liệu. */
export function MissingSheet({ what }: { what: string }) {
  const { close } = useExplore()
  return (
    <div className="sheet sheet--missing" role="alert">
      <h2 id="overlay-title" className="sheet__title">
        Không tìm thấy {what}
      </h2>
      <p>Nội dung này có thể đã được gỡ khỏi triển lãm.</p>
      <button type="button" className="btn btn--ghost" onClick={close}>
        Đóng
      </button>
    </div>
  )
}
