import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { ArrowRight, Check } from '#/components/ui/Icon'
import { getBatch, getProduct, getWorkshop } from '#/data'
import { formatDate, formatNumber } from '#/lib/format'
import {
  clearDraft,
  readDraft,
  saveQuoteRequest,
  writeDraft,
} from '#/lib/storage'
import { useExplore } from '#/state/explore'
import { BUDGETS, PRODUCT_TYPES, isoDate, validate } from '#/lib/quote'
import type { Errors, Field, Values } from '#/lib/quote'
import type { Product, QuoteReceipt } from '#/data'

type Phase = 'editing' | 'sending' | 'failed' | 'done'

const FIELD_ORDER: Array<Field> = [
  'productType',
  'quantity',
  'deadline',
  'budget',
  'customization',
  'name',
  'organization',
  'email',
  'phone',
]

const EMPTY: Values = {
  productType: '',
  quantity: '',
  deadline: '',
  budget: '',
  customization: '',
  name: '',
  organization: '',
  email: '',
  phone: '',
}

const CATEGORY_TO_TYPE: Record<Product['category'], string> = {
  'gia-dung': 'Bát đĩa',
  'trang-tri': 'Bình, lọ trang trí',
  'bo-tra': 'Bộ ấm chén',
}

function initialValues(
  product: Product | undefined,
  preset: 'example' | undefined,
): Values {
  const draft = readDraft<Values>()
  const base: Values = { ...EMPTY, ...draft }
  if (preset === 'example') {
    return {
      ...base,
      productType: 'Cốc, ly',
      quantity: '5000',
      deadline: isoDate(30),
      budget: '200 – 500 triệu đồng',
      customization:
        'In logo Trường Đại học Công nghệ lên thân cốc, một màu. Cần duyệt mẫu trước khi sản xuất hàng loạt.',
      organization: 'Trường Đại học Công nghệ',
    }
  }
  if (product) {
    const batch = getBatch(product.batchId)
    return {
      ...base,
      productType: CATEGORY_TO_TYPE[product.category],
      customization:
        base.customization ||
        `Hỏi mua: ${product.name}${batch ? ` (lô ${batch.code})` : ''}.`,
    }
  }
  return base
}

interface QuoteSheetProps {
  productId?: string
  preset?: 'example'
}

export function QuoteSheet({ productId, preset }: QuoteSheetProps) {
  const { close } = useExplore()
  const product = productId ? getProduct(productId) : undefined
  const workshop = product ? getWorkshop(product.workshopId) : undefined

  const [values, setValues] = useState<Values>(() =>
    initialValues(product, preset),
  )
  const [errors, setErrors] = useState<Errors>({})
  const [phase, setPhase] = useState<Phase>('editing')
  const [result, setResult] = useState<QuoteReceipt | null>(null)
  const submissionId = useRef<string | null>(null)
  const doneHeading = useRef<HTMLHeadingElement>(null)

  // Giữ bản nháp để lỡ đóng drawer cũng không mất nội dung đã nhập.
  useEffect(() => {
    if (phase !== 'done') writeDraft(values)
  }, [values, phase])

  useEffect(() => {
    if (phase === 'done') doneHeading.current?.focus()
  }, [phase])

  const errorCount = Object.keys(errors).length
  const sending = phase === 'sending'

  const control = (field: Field) => ({
    id: `quote-${field}`,
    name: field,
    value: values[field],
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `quote-${field}-error` : undefined,
    onChange: (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const next = event.target.value
      setValues((current) => ({ ...current, [field]: next }))
      if (errors[field]) {
        setErrors((current) => {
          const { [field]: _removed, ...rest } = current
          return rest
        })
      }
    },
  })

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    const found = validate(values)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`quote-${firstInvalid}`)?.focus()
      return
    }
    setPhase('sending')
    try {
      submissionId.current ??= crypto.randomUUID()
      const saved = await saveQuoteRequest(submissionId.current, {
        productType: values.productType,
        quantity: Number(values.quantity),
        deadline: values.deadline,
        budget: values.budget || 'Chưa xác định',
        customization: values.customization.trim(),
        name: values.name.trim(),
        organization: values.organization.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        productId: product?.id,
      })
      submissionId.current = null
      clearDraft()
      setResult(saved)
      setPhase('done')
    } catch {
      setPhase('failed')
    }
  }

  const startOver = () => {
    setValues({
      ...EMPTY,
      name: values.name,
      organization: values.organization,
      email: values.email,
      phone: values.phone,
    })
    setErrors({})
    setResult(null)
    setPhase('editing')
  }

  if (phase === 'done' && result) {
    return (
      <div className="sheet quote-done">
        <span className="quote-done__mark" aria-hidden="true">
          <Check size={28} />
        </span>
        <h2
          id="overlay-title"
          className="sheet__title"
          tabIndex={-1}
          ref={doneHeading}
        >
          Đã ghi nhận yêu cầu
        </h2>
        <p className="sheet__summary">
          Mã yêu cầu <strong className="quote-done__code">{result.code}</strong>
        </p>
        <dl className="facts">
          <div>
            <dt>Sản phẩm</dt>
            <dd>
              {formatNumber(result.quantity)} × {result.productType}
            </dd>
          </div>
          <div>
            <dt>Hạn giao</dt>
            <dd>{formatDate(result.deadline)}</dd>
          </div>
        </dl>
        <p className="notice">
          Ban quản lý làng nghề đã nhận được yêu cầu và có thể phản hồi qua
          email hoặc điện thoại bạn đã để lại.
        </p>
        <div className="quote-done__actions">
          <button type="button" className="btn btn--primary" onClick={close}>
            Quay lại triển lãm
          </button>
          <button type="button" className="btn btn--ghost" onClick={startOver}>
            Gửi yêu cầu khác
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="sheet quote" onSubmit={onSubmit} noValidate>
      <header className="sheet__head">
        <h2 id="overlay-title" className="sheet__title">
          Đặt hàng theo yêu cầu
        </h2>
        <p className="sheet__summary">
          Cho chúng tôi biết bạn cần gì. Ban quản lý làng nghề sẽ chọn những hộ
          phù hợp và gửi báo giá.
        </p>
      </header>

      {product ? (
        <p className="quote__ref">
          Đang hỏi mua: <strong>{product.name}</strong>
          {workshop ? ` · ${workshop.name}` : ''}
        </p>
      ) : null}

      {errorCount > 0 ? (
        <p className="form-alert" role="alert">
          Còn {errorCount} mục cần sửa trước khi gửi.
        </p>
      ) : null}
      {phase === 'failed' ? (
        <p className="form-alert" role="alert">
          Chưa gửi được yêu cầu. Nội dung bạn nhập vẫn còn, hãy thử lại.
        </p>
      ) : null}

      <fieldset className="quote__group" disabled={sending}>
        <legend>Đơn hàng</legend>
        <FieldRow
          field="productType"
          label="Loại sản phẩm"
          required
          error={errors.productType}
        >
          <select {...control('productType')} required>
            <option value="">Chọn loại sản phẩm</option>
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FieldRow>
        <div className="quote__pair">
          <FieldRow
            field="quantity"
            label="Số lượng"
            required
            error={errors.quantity}
          >
            <input
              {...control('quantity')}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="Ví dụ 5000"
              required
            />
          </FieldRow>
          <FieldRow
            field="deadline"
            label="Hạn giao"
            required
            error={errors.deadline}
          >
            <input
              {...control('deadline')}
              type="date"
              min={isoDate(1)}
              required
            />
          </FieldRow>
        </div>
        <FieldRow
          field="budget"
          label="Ngân sách dự kiến"
          error={errors.budget}
        >
          <select {...control('budget')}>
            <option value="">Chưa xác định</option>
            {BUDGETS.slice(0, 4).map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </FieldRow>
        <FieldRow
          field="customization"
          label="Yêu cầu tùy chỉnh"
          hint="Logo, màu men, dáng, cách đóng gói…"
          error={errors.customization}
        >
          <textarea {...control('customization')} rows={4} maxLength={1200} />
        </FieldRow>
      </fieldset>

      <fieldset className="quote__group" disabled={sending}>
        <legend>Thông tin liên hệ</legend>
        <FieldRow field="name" label="Họ và tên" required error={errors.name}>
          <input
            {...control('name')}
            type="text"
            autoComplete="name"
            required
          />
        </FieldRow>
        <FieldRow
          field="organization"
          label="Đơn vị, tổ chức"
          error={errors.organization}
        >
          <input
            {...control('organization')}
            type="text"
            autoComplete="organization"
          />
        </FieldRow>
        <div className="quote__pair">
          <FieldRow field="email" label="Email" required error={errors.email}>
            <input
              {...control('email')}
              type="email"
              autoComplete="email"
              required
            />
          </FieldRow>
          <FieldRow
            field="phone"
            label="Số điện thoại"
            required
            error={errors.phone}
          >
            <input
              {...control('phone')}
              type="tel"
              autoComplete="tel"
              required
            />
          </FieldRow>
        </div>
      </fieldset>

      <p className="demo-note">
        Bản demo: yêu cầu chỉ được lưu trên trình duyệt này, chưa gửi đi đâu.
      </p>

      <div className="sheet__actions">
        <button
          type="submit"
          className="btn btn--primary btn--block"
          aria-disabled={sending}
        >
          {sending ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu báo giá'}
          {sending ? null : <ArrowRight />}
        </button>
      </div>
    </form>
  )
}

interface FieldRowProps {
  field: Field
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

function FieldRow({
  field,
  label,
  required,
  hint,
  error,
  children,
}: FieldRowProps) {
  return (
    <div className={error ? 'field is-invalid' : 'field'}>
      <label htmlFor={`quote-${field}`}>
        {label}
        {required ? (
          <span className="field__mark" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="field__optional"> (không bắt buộc)</span>
        )}
      </label>
      {children}
      {hint && !error ? <p className="field__hint">{hint}</p> : null}
      {error ? (
        <p className="field__error" id={`quote-${field}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
