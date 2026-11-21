import {
  MAX_IMAGE_URL_LENGTH,
  MAX_UNIT_PRICE,
  MAX_WORKSHOP_PHOTOS,
  parseHttpsImageUrl,
} from '#/lib/artisan'
import { formatNumber } from '#/lib/format'
import { isValidDate } from '#/lib/quote'

export type WorkspaceErrors = Partial<Record<string, string>>

const imageUrlHelp = `Nhập đường dẫn ảnh hợp lệ bắt đầu bằng https://, tối đa ${formatNumber(MAX_IMAGE_URL_LENGTH)} ký tự.`

export function workshopPhotoUrls(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function fieldError(field: HTMLInputElement | HTMLTextAreaElement) {
  const value = field.value.trim()
  if (field.type === 'date') {
    if (field.validity.badInput || (value && !isValidDate(value)))
      return 'Chọn ngày hợp lệ trong lịch.'
    if (!value) return 'Chọn ngày thực hiện công đoạn.'
    if (field.validity.rangeUnderflow) return 'Chọn ngày từ năm 0001 trở đi.'
    if (field.validity.rangeOverflow)
      return 'Ngày thực hiện phải là hôm nay hoặc sớm hơn.'
    return
  }

  if (field.type === 'number') {
    if (!value && !field.validity.badInput) {
      return field.required ? 'Nhập giá bán mỗi sản phẩm.' : undefined
    }
    if (!field.validity.valid) {
      return `Nhập số nguyên từ 1 đến ${formatNumber(MAX_UNIT_PRICE)} đồng.`
    }
    return
  }

  if (field.name === 'photos') {
    const urls = workshopPhotoUrls(value)
    if (urls.length > MAX_WORKSHOP_PHOTOS)
      return `Chỉ nhập tối đa ${MAX_WORKSHOP_PHOTOS} đường dẫn ảnh, mỗi đường dẫn một dòng.`
    if (urls.some((url) => !parseHttpsImageUrl(url)))
      return `${imageUrlHelp} Mỗi đường dẫn một dòng.`
    return
  }

  if (field.type === 'url') {
    if (!parseHttpsImageUrl(value)) return imageUrlHelp
    return
  }

  if (field.required && !value) return 'Vui lòng điền trường bắt buộc này.'
  if (/\0|\p{Surrogate}/u.test(field.value))
    return 'Xóa ký tự không hợp lệ hoặc nhập lại nội dung.'
  if (value.length < field.minLength)
    return `Nhập ít nhất ${formatNumber(field.minLength)} ký tự.`
  if (field.maxLength >= 0 && value.length > field.maxLength)
    return `Nhập tối đa ${formatNumber(field.maxLength)} ký tự.`
}

export function validateWorkspaceForm(form: HTMLFormElement) {
  const errors: WorkspaceErrors = {}
  let firstInvalid: HTMLInputElement | HTMLTextAreaElement | undefined
  let previousDate = ''

  for (const field of form.elements) {
    if (!(
      field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
    ))
      continue
    if (!field.name || !field.willValidate) continue

    let error = fieldError(field)
    if (!error && field.type === 'date') {
      if (field.value < previousDate)
        error = 'Chọn ngày bằng hoặc sau ngày của công đoạn trước.'
      previousDate = field.value
    }
    if (error) {
      errors[field.name] = error
      firstInvalid ??= field
    }
  }

  return { errors, firstInvalid }
}
