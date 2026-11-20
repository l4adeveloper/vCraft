import { useRef, useState } from 'react'
import { Link, useHydrated, useRouter } from '@tanstack/react-router'
import { ARTISAN_STATUSES } from '#/lib/account'
import { NOTICE_CATEGORIES } from '#/lib/community'
import type { ArtisanRegistration } from '#/lib/account'
import type { CommunityNotice } from '#/lib/community'
import type { FormEvent, ReactNode } from 'react'

type Action = 'review-artisan' | 'save-notice'

interface AdminFormProps {
  action: Action
  read: (fields: FormData) => Record<string, unknown>
  onSaved?: (form: HTMLFormElement) => void
  children: ReactNode
}

function AdminForm({ action, read, onSaved, children }: AdminFormProps) {
  const hydrated = useHydrated()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState<{
    text: string
    error?: boolean
  } | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    const data = read(new FormData(form, submitter))
    setBusy(true)
    setFeedback(null)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      })
      if (response.ok) {
        onSaved?.(form)
        await router.invalidate()
        setFeedback({ text: 'Đã lưu.' })
      } else if (response.status === 409) {
        setFeedback({
          text: 'Dữ liệu đã thay đổi. Tải lại trang trước khi lưu.',
          error: true,
        })
      } else if (response.status === 403) {
        setFeedback({
          text: 'Phiên quản trị đã hết hạn hoặc bạn không có quyền lưu.',
          error: true,
        })
      } else {
        setFeedback({
          text: 'Chưa lưu được. Kiểm tra thông tin và thử lại.',
          error: true,
        })
      }
    } catch {
      setFeedback({ text: 'Không thể kết nối. Vui lòng thử lại.', error: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="governance-form" method="post" onSubmit={submit}>
      <fieldset disabled={!hydrated || busy}>
        {children}
        {busy && <p role="status">Đang lưu…</p>}
        {feedback && (
          <p
            role={feedback.error ? 'alert' : 'status'}
            className={feedback.error ? 'form-alert' : undefined}
          >
            {feedback.text}
          </p>
        )}
      </fieldset>
    </form>
  )
}

export function ArtisanRegistrations({
  registrations,
}: {
  registrations: Array<ArtisanRegistration>
}) {
  return (
    <section aria-labelledby="admin-artisans-heading">
      <header className="governance-heading">
        <h2 id="admin-artisans-heading">Tài khoản hộ gia đình</h2>
        <p>
          Xác minh người đăng ký là hộ làm nghề tại địa phương trước khi duyệt
          tài khoản.
        </p>
      </header>
      {registrations.length ? (
        <ul className="governance-list">
          {registrations.map((registration) => (
            <RegistrationRow
              key={registration.email}
              registration={registration}
            />
          ))}
        </ul>
      ) : (
        <p className="notice">Chưa có hộ gia đình nào đăng ký.</p>
      )}
    </section>
  )
}

function RegistrationRow({
  registration,
}: {
  registration: ArtisanRegistration
}) {
  const { email, displayName, workshopName, status } = registration
  const statusClass =
    status === 'approved'
      ? 'admin-status--completed'
      : status === 'rejected'
        ? 'admin-status--rejected'
        : ''

  return (
    <li className="registration-row">
      <div>
        <h3>{displayName ?? email}</h3>
        <p>
          {displayName ? email : null}
          {workshopName && ` · ${workshopName}`}
        </p>
      </div>
      <span className={`admin-status ${statusClass}`}>
        {ARTISAN_STATUSES[status]}
      </span>
      <AdminForm
        action="review-artisan"
        read={(fields) => ({
          email,
          previousStatus: status,
          status: fields.get('status'),
        })}
      >
        <div className="governance-actions">
          {status !== 'approved' && (
            <button
              className="btn btn--primary btn--small"
              type="submit"
              name="status"
              value="approved"
              aria-label={`Duyệt tài khoản ${displayName ?? email}`}
            >
              Duyệt tài khoản
            </button>
          )}
          {status !== 'rejected' && (
            <button
              className="btn btn--ghost btn--small"
              type="submit"
              name="status"
              value="rejected"
              aria-label={`${status === 'approved' ? 'Thu hồi quyền' : 'Từ chối'} tài khoản ${displayName ?? email}`}
            >
              {status === 'approved' ? 'Thu hồi quyền' : 'Từ chối'}
            </button>
          )}
        </div>
      </AdminForm>
    </li>
  )
}

export function ManageNotices({
  notices,
}: {
  notices: Array<CommunityNotice>
}) {
  return (
    <section aria-labelledby="admin-notices-heading">
      <header className="governance-heading">
        <h2 id="admin-notices-heading">Tin cộng đồng</h2>
        <Link to="/tin-cong-dong">Xem trang tin</Link>
      </header>
      <div className="admin-quotes">
        <details className="admin-quote" open={notices.length === 0}>
          <summary>
            <span>
              <strong>Soạn thông báo mới</strong>
            </span>
          </summary>
          <div className="admin-quote__body">
            <NoticeEditor />
          </div>
        </details>
        {notices.map((notice) => (
          <details className="admin-quote" key={notice.id}>
            <summary>
              <span>
                <strong>{notice.title}</strong>
                <span>{NOTICE_CATEGORIES[notice.category]}</span>
              </span>
              <span
                className={`admin-status ${notice.publishedAt ? 'admin-status--completed' : ''}`}
              >
                {notice.publishedAt ? 'Đã đăng' : 'Bản nháp'}
              </span>
            </summary>
            <div className="admin-quote__body">
              <NoticeEditor key={notice.version} notice={notice} />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

function NoticeEditor({ notice }: { notice?: CommunityNotice }) {
  const pendingId = useRef<string | null>(null)
  return (
    <AdminForm
      action="save-notice"
      read={(fields) => ({
        id: notice?.id ?? (pendingId.current ??= crypto.randomUUID()),
        version: notice?.version ?? null,
        title: fields.get('title'),
        category: fields.get('category'),
        body: fields.get('body'),
        published: fields.get('publication') === 'published',
      })}
      onSaved={(form) => {
        if (!notice) {
          pendingId.current = null
          form.reset()
        }
      }}
    >
      <label className="field">
        Tiêu đề
        <input
          name="title"
          defaultValue={notice?.title}
          minLength={2}
          maxLength={160}
          required
        />
      </label>
      <label className="field">
        Chuyên mục
        <select name="category" defaultValue={notice?.category}>
          {Object.entries(NOTICE_CATEGORIES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Nội dung
        <textarea
          name="body"
          defaultValue={notice?.body}
          rows={6}
          maxLength={3000}
          required
        />
      </label>
      <div className="governance-actions">
        <button
          className="btn btn--ghost btn--small"
          type="submit"
          name="publication"
          value="draft"
        >
          {notice?.publishedAt ? 'Chuyển về bản nháp' : 'Lưu bản nháp'}
        </button>
        <button
          className="btn btn--primary btn--small"
          type="submit"
          name="publication"
          value="published"
        >
          {notice?.publishedAt ? 'Cập nhật thông báo' : 'Đăng thông báo'}
        </button>
      </div>
    </AdminForm>
  )
}
