export interface Values {
  productType: string
  quantity: string
  deadline: string
  budget: string
  customization: string
  name: string
  organization: string
  email: string
  phone: string
}

export type Field = keyof Values
export type Errors = Partial<Record<Field, string>>
export const PRODUCT_TYPES = [
  'Cốc, ly',
  'Bộ ấm chén',
  'Bát đĩa',
  'Bình, lọ trang trí',
  'Bộ quà tặng',
  'Loại khác',
]

export const BUDGETS = [
  'Dưới 50 triệu đồng',
  '50 – 200 triệu đồng',
  '200 – 500 triệu đồng',
  'Trên 500 triệu đồng',
  'Chưa xác định',
]

const vietnamDate = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function vietnamCalendarDate(time: Date | number): string {
  return vietnamDate.format(time)
}

export function isoDate(offsetDays: number): string {
  return vietnamCalendarDate(Date.now() + offsetDays * 86_400_000)
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value)
}

export function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.productType) errors.productType = 'Chọn loại sản phẩm bạn cần.'

  const quantity = Number(values.quantity)
  if (!values.quantity.trim()) {
    errors.quantity = 'Nhập số lượng cần đặt.'
  } else if (!Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = 'Số lượng phải là số nguyên từ 1 trở lên.'
  } else if (quantity > 1_000_000) {
    errors.quantity = 'Số lượng tối đa cho một yêu cầu là 1.000.000.'
  }

  if (!values.deadline) {
    errors.deadline = 'Chọn ngày bạn cần nhận hàng.'
  } else if (!isValidDate(values.deadline)) {
    errors.deadline = 'Ngày giao chưa đúng định dạng.'
  } else if (values.deadline <= isoDate(0)) {
    errors.deadline = 'Hạn giao phải sau ngày hôm nay.'
  }

  if (values.customization.length > 1000) {
    errors.customization = 'Mô tả tối đa 1.000 ký tự.'
  }
  if (values.name.trim().length < 2 || values.name.trim().length > 120) {
    errors.name = 'Nhập họ tên người liên hệ.'
  }
  if (values.organization.trim().length > 160) {
    errors.organization = 'Tên đơn vị tối đa 160 ký tự.'
  }
  if (!values.email.trim()) {
    errors.email = 'Nhập email để nhận báo giá.'
  } else if (
    values.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())
  ) {
    errors.email = 'Email chưa đúng định dạng, ví dụ ten@congty.vn.'
  }
  const phone = values.phone.replace(/[\s.-]/g, '')
  if (!phone) {
    errors.phone = 'Nhập số điện thoại liên hệ.'
  } else if (
    values.phone.trim().length > 32 ||
    !/^(?:\+84|0)\d{9}$/.test(phone)
  ) {
    errors.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0 hoặc +84.'
  }
  return errors
}
