import { useRef, useState } from 'react'
import { useHydrated, useRouter } from '@tanstack/react-router'
import { MAX_UNIT_PRICE, PRODUCTION_STAGES } from '#/lib/artisan'
import { isoDate } from '#/lib/quote'
import type {
  ArtisanProduct,
  ArtisanQuote,
  WorkshopProfile,
} from '#/lib/artisan'
import type { FormEvent, ReactNode } from 'react'

type Action = 'profile' | 'product' | 'quote'
type FormProps = {
  action: Action
  label: string
  read: (fields: FormData) => Record<string, unknown>
  onSaved?: (form: HTMLFormElement) => void
  children: ReactNode
}

function WorkspaceForm({ action, label, read, onSaved, children }: FormProps) {
  const hydrated = useHydrated()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const form = event.currentTarget
    const data = read(new FormData(form))
    setSaving(true)
    setMessage('')
    setFailed(false)
    try {
      const response = await fetch('/api/artisan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      })
      if (response.status === 401) {
        window.location.replace('/login')
        return
      }
      if (response.ok) {
        onSaved?.(form)
        setMessage('Đã lưu.')
        await router.invalidate()
      } else {
        setFailed(true)
        if (response.status === 409 || response.status === 404) {
          setMessage(
            'Yêu cầu đã hoàn tất hoặc không còn được phân bổ cho xưởng. Hãy tải lại trang.',
          )
        } else if (response.status === 400) {
          setMessage('Kiểm tra thông tin đã nhập và thử lại.')
        } else {
          setMessage('Chưa lưu được thay đổi. Vui lòng thử lại.')
        }
      }
    } catch {
      setFailed(true)
      setMessage('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="artisan-form" method="post" onSubmit={submit}>
      <fieldset disabled={!hydrated || saving}>
        {children}
        <div className="artisan-form__actions">
          <button className="btn btn--primary btn--small" type="submit">
            {saving ? 'Đang lưu…' : label}
          </button>
          {message && (
            <p
              className={failed ? 'form-alert' : 'artisan-saved'}
              role={failed ? 'alert' : 'status'}
            >
              {message}
            </p>
          )}
        </div>
      </fieldset>
    </form>
  )
}

export function ProfileForm({ profile }: { profile: WorkshopProfile | null }) {
  return (
    <WorkspaceForm
      action="profile"
      label="Lưu hồ sơ xưởng"
      read={(fields) => ({
        name: fields.get('name'),
        history: fields.get('history'),
        photoUrls: String(fields.get('photos') ?? '')
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean),
        certificates: fields.get('certificates'),
      })}
    >
      <label className="field">
        Tên xưởng hoặc hộ gia đình
        <input
          name="name"
          defaultValue={profile?.name}
          required
          minLength={2}
          maxLength={120}
        />
      </label>
      <label className="field">
        Lịch sử gia đình và nghề
        <textarea
          name="history"
          rows={5}
          defaultValue={profile?.history}
          required
          maxLength={2000}
        />
      </label>
      <label className="field">
        Hình ảnh xưởng
        <textarea
          name="photos"
          rows={3}
          defaultValue={profile?.photoUrls.join('\n')}
          maxLength={4100}
          aria-describedby="workshop-photo-hint"
        />
        <small id="workshop-photo-hint">
          Tối đa 4 đường dẫn ảnh HTTPS, mỗi đường dẫn một dòng.
        </small>
      </label>
      <label className="field">
        Chứng nhận chất lượng
        <textarea
          name="certificates"
          rows={3}
          defaultValue={profile?.certificates}
          maxLength={1200}
        />
        <small>
          Ghi tên chứng nhận, đơn vị cấp, số hiệu và ngày cấp nếu có.
        </small>
      </label>
    </WorkspaceForm>
  )
}

export function ProductForm({ product }: { product?: ArtisanProduct }) {
  const pendingId = useRef<string | null>(null)

  return (
    <WorkspaceForm
      action="product"
      label={product ? 'Lưu thay đổi' : 'Đăng sản phẩm'}
      read={(fields) => {
        const id = product?.id ?? (pendingId.current ??= crypto.randomUUID())
        return {
          id,
          name: fields.get('name'),
          description: fields.get('description'),
          price: Number(fields.get('price')),
          photoUrl: fields.get('photoUrl'),
          journal: PRODUCTION_STAGES.map((_, index) => ({
            date: fields.get(`date-${index}`),
            note: fields.get(`note-${index}`),
          })),
        }
      }}
      onSaved={(form) => {
        if (!product) {
          pendingId.current = null
          form.reset()
        }
      }}
    >
      <div className="artisan-form__pair">
        <label className="field">
          Tên sản phẩm
          <input
            name="name"
            defaultValue={product?.name}
            required
            minLength={2}
            maxLength={120}
          />
        </label>
        <label className="field">
          Giá bán mỗi sản phẩm (₫)
          <input
            type="number"
            name="price"
            defaultValue={product?.price}
            required
            min={1}
            max={MAX_UNIT_PRICE}
            step={1}
          />
        </label>
      </div>
      <label className="field">
        Đường dẫn ảnh sản phẩm (HTTPS)
        <input
          type="url"
          name="photoUrl"
          defaultValue={product?.photoUrl}
          required
          maxLength={1024}
        />
      </label>
      <label className="field">
        Mô tả sản phẩm
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description}
          required
          maxLength={1200}
        />
      </label>
      <fieldset className="artisan-journal-fields">
        <legend>Nhật ký sản xuất</legend>
        <p>
          Nhập ngày thực hiện theo thứ tự. Các công đoạn có thể diễn ra cùng
          ngày.
        </p>
        {PRODUCTION_STAGES.map((stage, index) => (
          <div className="artisan-stagerow" key={stage}>
            <label className="field">
              {stage}
              <input
                type="date"
                name={`date-${index}`}
                required
                min="0001-01-01"
                max={isoDate(0)}
                defaultValue={product?.journal[index]?.date}
              />
            </label>
            <label className="field">
              Ghi chú công đoạn <span className="sr-only">{stage}</span>
              <input
                name={`note-${index}`}
                maxLength={400}
                defaultValue={product?.journal[index]?.note}
              />
            </label>
          </div>
        ))}
      </fieldset>
    </WorkspaceForm>
  )
}

export function ReplyForm({ quote }: { quote: ArtisanQuote }) {
  return (
    <WorkspaceForm
      action="quote"
      label={quote.reply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}
      read={(fields) => ({
        id: quote.id,
        message: fields.get('message'),
        unitPrice: fields.get('price') ? Number(fields.get('price')) : null,
      })}
    >
      <label className="field">
        Nội dung phản hồi
        <textarea
          rows={3}
          name="message"
          defaultValue={quote.reply?.message}
          required
          maxLength={1200}
        />
      </label>
      <label className="field">
        Đơn giá chào (₫/sản phẩm, không bắt buộc)
        <input
          type="number"
          name="price"
          min={1}
          max={MAX_UNIT_PRICE}
          step={1}
          defaultValue={quote.reply?.unitPrice ?? undefined}
        />
      </label>
    </WorkspaceForm>
  )
}
