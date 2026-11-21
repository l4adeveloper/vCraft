import { createContext, useContext, useId, useRef, useState } from 'react'
import { useHydrated, useRouter } from '@tanstack/react-router'
import {
  MAX_IMAGE_URL_LENGTH,
  MAX_UNIT_PRICE,
  MAX_WORKSHOP_PHOTOS,
  PRODUCTION_STAGES,
} from '#/lib/artisan'
import { isoDate } from '#/lib/quote'
import {
  validateWorkspaceForm,
  workshopPhotoUrls,
} from './workspace-validation'
import type { WorkspaceErrors } from './workspace-validation'
import type {
  ArtisanProduct,
  ArtisanQuote,
  WorkshopProfile,
} from '#/lib/artisan'
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react'

type Action = 'profile' | 'product' | 'quote'
type FormProps = {
  action: Action
  label: string
  read: (fields: FormData) => Record<string, unknown>
  onSaved?: (form: HTMLFormElement) => void
  children: ReactNode
}

const FieldErrors = createContext<WorkspaceErrors>({})

type FieldProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'defaultValue'
  | 'required'
  | 'type'
  | 'min'
  | 'max'
  | 'step'
  | 'minLength'
  | 'maxLength'
> & {
  name: string
  label: ReactNode
  hint?: ReactNode
  rows?: number
}

function WorkspaceField({
  name,
  label,
  hint,
  rows,
  type,
  min,
  max,
  step,
  ...input
}: FieldProps) {
  const id = useId()
  const error = useContext(FieldErrors)[name]
  const description = [hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean)
    .join(' ')
  const control = {
    ...input,
    id,
    name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': description || undefined,
  }

  return (
    <div className={error ? 'field is-invalid' : 'field'}>
      <label htmlFor={id}>
        {label}
        {input.required && (
          <span className="field__mark" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {rows === undefined ? (
        <input {...control} type={type} min={min} max={max} step={step} />
      ) : (
        <textarea {...control} rows={rows} />
      )}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="field__error">
          {error}
        </small>
      )}
    </div>
  )
}

function WorkspaceForm({ action, label, read, onSaved, children }: FormProps) {
  const hydrated = useHydrated()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const [errors, setErrors] = useState<WorkspaceErrors>({})

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    const form = event.currentTarget
    setMessage('')
    setFailed(false)
    const validation = validateWorkspaceForm(form)
    setErrors(validation.errors)
    if (validation.firstInvalid) {
      const field = validation.firstInvalid
      requestAnimationFrame(() => field.focus())
      return
    }
    const data = read(new FormData(form))
    setSaving(true)
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
    <form
      className="artisan-form"
      method="post"
      noValidate
      onSubmit={submit}
      onChange={(event) => {
        if (Object.keys(errors).length) {
          setErrors(validateWorkspaceForm(event.currentTarget).errors)
        }
      }}
    >
      <fieldset disabled={!hydrated || saving}>
        <FieldErrors.Provider value={errors}>{children}</FieldErrors.Provider>
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
        photoUrls: workshopPhotoUrls(String(fields.get('photos') ?? '')),
        certificates: fields.get('certificates'),
      })}
    >
      <WorkspaceField
        name="name"
        label="Tên xưởng hoặc hộ gia đình"
        defaultValue={profile?.name}
        required
        minLength={2}
        maxLength={120}
      />
      <WorkspaceField
        name="history"
        label="Lịch sử gia đình và nghề"
        rows={5}
        defaultValue={profile?.history}
        required
        maxLength={2000}
      />
      <WorkspaceField
        name="photos"
        label="Hình ảnh xưởng"
        rows={3}
        defaultValue={profile?.photoUrls.join('\n')}
        maxLength={(MAX_IMAGE_URL_LENGTH + 1) * MAX_WORKSHOP_PHOTOS}
        hint={`Không bắt buộc. Tối đa ${MAX_WORKSHOP_PHOTOS} đường dẫn ảnh HTTPS, mỗi đường dẫn một dòng.`}
      />
      <WorkspaceField
        name="certificates"
        label="Chứng nhận chất lượng"
        rows={3}
        defaultValue={profile?.certificates}
        maxLength={1200}
        hint="Ghi tên chứng nhận, đơn vị cấp, số hiệu và ngày cấp nếu có."
      />
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
        <WorkspaceField
          name="name"
          label="Tên sản phẩm"
          defaultValue={product?.name}
          required
          minLength={2}
          maxLength={120}
        />
        <WorkspaceField
          name="price"
          label="Giá bán mỗi sản phẩm (₫)"
          type="number"
          defaultValue={product?.price}
          required
          min={1}
          max={MAX_UNIT_PRICE}
          step={1}
        />
      </div>
      <WorkspaceField
        name="photoUrl"
        label="Đường dẫn ảnh sản phẩm (HTTPS)"
        type="url"
        defaultValue={product?.photoUrl}
        required
        maxLength={MAX_IMAGE_URL_LENGTH}
      />
      <WorkspaceField
        name="description"
        label="Mô tả sản phẩm"
        rows={3}
        defaultValue={product?.description}
        required
        maxLength={1200}
      />
      <fieldset className="artisan-journal-fields">
        <legend>Nhật ký sản xuất</legend>
        <p>
          Nhập ngày thực hiện theo thứ tự. Các công đoạn có thể diễn ra cùng
          ngày.
        </p>
        {PRODUCTION_STAGES.map((stage, index) => (
          <div className="artisan-stagerow" key={stage}>
            <WorkspaceField
              name={`date-${index}`}
              label={stage}
              type="date"
              required
              min="0001-01-01"
              max={isoDate(0)}
              defaultValue={product?.journal[index]?.date}
            />
            <WorkspaceField
              name={`note-${index}`}
              label={
                <>
                  Ghi chú công đoạn <span className="sr-only">{stage}</span>
                </>
              }
              maxLength={400}
              defaultValue={product?.journal[index]?.note}
            />
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
      <WorkspaceField
        name="message"
        label="Nội dung phản hồi"
        rows={3}
        defaultValue={quote.reply?.message}
        required
        maxLength={1200}
      />
      <WorkspaceField
        name="price"
        label="Đơn giá chào (₫/sản phẩm, không bắt buộc)"
        type="number"
        min={1}
        max={MAX_UNIT_PRICE}
        step={1}
        defaultValue={quote.reply?.unitPrice ?? undefined}
      />
    </WorkspaceForm>
  )
}
