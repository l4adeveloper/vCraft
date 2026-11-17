import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import type * as LeafletModule from 'leaflet'
import type { Map as LeafletMap, Marker } from 'leaflet'
import { ArrowUpRight, Close } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import { Reveal } from '#/components/ui/Reveal'
import { SectionTitle } from '#/components/ui/SectionTitle'
import { WheelMark } from '#/components/ui/WheelMark'
import { getArtisan, visitStatusLabel, workshops } from '#/data'
import { cx, pad2 } from '#/lib/format'
import { DUR, EASE_OUT } from '#/lib/motion'
import { useExplore } from '#/state/explore'

type Leaflet = typeof LeafletModule
type LoadState = 'idle' | 'loading' | 'ready' | 'error'

const CENTER: [number, number] = [20.9758, 105.9122]
const numberOf = (id: string) =>
  workshops.findIndex((workshop) => workshop.id === id) + 1

export function VillageMap() {
  const { selectedWorkshopId, selectWorkshop, open } = useExplore()
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [onlyExperience, setOnlyExperience] = useState(false)
  const [state, setState] = useState<LoadState>('idle')
  const [attempt, setAttempt] = useState(0)
  const [tilesFailed, setTilesFailed] = useState(false)

  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const leaflet = useRef<Leaflet | null>(null)
  const map = useRef<LeafletMap | null>(null)
  const markers = useRef(new Map<string, Marker>())
  const near = useInView(section, { once: true, margin: '600px 0px' })

  const visible = useMemo(
    () =>
      workshops.filter(
        (workshop) =>
          (!onlyOpen || workshop.visitStatus === 'open') &&
          (!onlyExperience || workshop.hasExperience),
      ),
    [onlyOpen, onlyExperience],
  )
  const selected =
    visible.find((workshop) => workshop.id === selectedWorkshopId) ?? null
  const selectedId = selected?.id ?? null

  // Xưởng được chọn từ nơi khác (hồ sơ nghệ nhân, tác phẩm) mà đang bị bộ lọc
  // che thì bỏ lọc để nó hiện ra.
  useEffect(() => {
    if (selectedWorkshopId && !selectedId) {
      setOnlyOpen(false)
      setOnlyExperience(false)
    }
  }, [selectedWorkshopId, selectedId])

  // Tải Leaflet khi phần bản đồ sắp vào màn hình.
  useEffect(() => {
    if (!near || map.current) return
    let cancelled = false
    setState('loading')
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
      .then(([L]) => {
        if (cancelled || !canvas.current || map.current) return
        const instance = L.map(canvas.current, {
          center: CENTER,
          zoom: 16,
          // Giữ thao tác cuộn trang tự nhiên: thu phóng bằng nút hoặc chụm tay.
          scrollWheelZoom: false,
        })
        const tiles = L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        )
        tiles.on('tileerror', () => setTilesFailed(true))
        tiles.addTo(instance)
        instance.attributionControl.setPrefix(false)
        leaflet.current = L
        map.current = instance
        setState('ready')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [near, attempt])

  useEffect(
    () => () => {
      map.current?.remove()
      map.current = null
    },
    [],
  )

  // Đồng bộ pin với danh sách đang lọc.
  useEffect(() => {
    const L = leaflet.current
    const instance = map.current
    if (state !== 'ready' || !L || !instance) return
    const current = markers.current
    current.forEach((marker) => marker.remove())
    current.clear()
    visible.forEach((workshop) => {
      const marker = L.marker(workshop.position, {
        icon: L.divIcon({
          className: 'pin',
          html: `<span><b>${numberOf(workshop.id)}</b></span>`,
          iconSize: [40, 48],
          iconAnchor: [20, 48],
        }),
        title: workshop.name,
        alt: `Xưởng ${workshop.name}`,
        keyboard: true,
      })
      marker.on('click', () => selectWorkshop(workshop.id))
      marker.addTo(instance)
      current.set(workshop.id, marker)
    })
  }, [state, visible, selectWorkshop])

  // Đồng bộ lựa chọn: nhấn mạnh pin và đưa xưởng vào giữa bản đồ.
  useEffect(() => {
    const instance = map.current
    if (state !== 'ready' || !instance) return
    markers.current.forEach((marker, id) => {
      marker.getElement()?.classList.toggle('is-selected', id === selectedId)
      marker.setZIndexOffset(id === selectedId ? 1000 : 0)
    })
    const target = workshops.find((workshop) => workshop.id === selectedId)
    if (target) {
      instance.panTo(target.position, { animate: true, duration: 0.6 })
    }
  }, [state, selectedId, visible])

  const toggle = (which: 'open' | 'experience') => {
    const nextOpen = which === 'open' ? !onlyOpen : onlyOpen
    const nextExperience =
      which === 'experience' ? !onlyExperience : onlyExperience
    setOnlyOpen(nextOpen)
    setOnlyExperience(nextExperience)
    const stillVisible = workshops.some(
      (workshop) =>
        workshop.id === selectedWorkshopId &&
        (!nextOpen || workshop.visitStatus === 'open') &&
        (!nextExperience || workshop.hasExperience),
    )
    if (!stillVisible) selectWorkshop(null)
  }

  const selectedArtisan = selected ? getArtisan(selected.artisanId) : undefined

  return (
    <section
      className="village"
      id="ban-do"
      ref={section}
      aria-labelledby="village-title"
    >
      <div className="shell">
        <header className="village__head">
          <SectionTitle
            id="village-title"
            eyebrow="Bản đồ làng nghề"
            lines={[
              <>Ghé một xưởng</>,
              <>
                <em>đang đỏ lửa.</em>
              </>,
            ]}
          />
          <Reveal delay={0.1} className="village__tools">
            <div className="toggles" role="group" aria-label="Lọc xưởng">
              <button
                type="button"
                className={cx('toggle', onlyOpen && 'is-on')}
                aria-pressed={onlyOpen}
                onClick={() => toggle('open')}
              >
                <i aria-hidden="true" />
                Đang đón khách
              </button>
              <button
                type="button"
                className={cx('toggle', onlyExperience && 'is-on')}
                aria-pressed={onlyExperience}
                onClick={() => toggle('experience')}
              >
                <i aria-hidden="true" />
                Có trải nghiệm làm gốm
              </button>
            </div>
            <p className="village__note">
              Vị trí, giờ mở cửa và trạng thái là dữ liệu minh họa quanh khu vực
              Bát Tràng, không phải địa chỉ thật của xưởng.
            </p>
          </Reveal>
        </header>

        <div className="village__grid">
          <div className="village__map">
            <div
              className="village__canvas"
              ref={canvas}
              role="application"
              aria-label="Bản đồ các xưởng gốm quanh Bát Tràng"
            />
            {state === 'idle' || state === 'loading' ? (
              <div className="village__state" role="status">
                <WheelMark spin />
                <p>Đang tải bản đồ…</p>
              </div>
            ) : null}
            {state === 'error' ? (
              <div className="village__state" role="alert">
                <p>
                  Không tải được bản đồ. Danh sách xưởng bên cạnh vẫn dùng được.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Thử lại
                </button>
              </div>
            ) : null}
            {state === 'ready' && tilesFailed ? (
              <p className="village__tiles" role="status">
                Một số ô nền bản đồ chưa tải được. Vị trí các xưởng vẫn hiển
                thị.
              </p>
            ) : null}

            <AnimatePresence>
              {selected ? (
                <motion.article
                  key={selected.id}
                  className="place-card"
                  aria-label={`Thông tin ${selected.name}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: DUR.swap, ease: EASE_OUT }}
                >
                  <div className="place-card__photo">
                    <Photo image={selected.image} />
                  </div>
                  <div className="place-card__body">
                    <p
                      className={cx(
                        'status',
                        `status--${selected.visitStatus}`,
                      )}
                    >
                      {visitStatusLabel[selected.visitStatus]}
                    </p>
                    <h3>{selected.name}</h3>
                    <p className="place-card__hours">{selected.hours}</p>
                    <ul>
                      {selected.experiences.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {selectedArtisan ? (
                      <button
                        type="button"
                        className="link-arrow"
                        onClick={() =>
                          open({ type: 'artisan', id: selectedArtisan.id })
                        }
                      >
                        Hồ sơ {selectedArtisan.name}
                        <ArrowUpRight size={16} />
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="icon-button place-card__close"
                    aria-label="Đóng thông tin xưởng"
                    onClick={() => selectWorkshop(null)}
                  >
                    <Close size={18} />
                  </button>
                </motion.article>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="village__list">
            <p className="village__count" role="status">
              {visible.length} / {workshops.length} xưởng
            </p>
            {visible.length === 0 ? (
              <div className="empty">
                <p>Không có xưởng nào khớp với bộ lọc đang chọn.</p>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setOnlyOpen(false)
                    setOnlyExperience(false)
                  }}
                >
                  Bỏ bộ lọc
                </button>
              </div>
            ) : (
              <ul>
                <AnimatePresence initial={false} mode="popLayout">
                  {visible.map((workshop) => {
                    const active = workshop.id === selectedId
                    return (
                      <motion.li
                        key={workshop.id}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DUR.swap, ease: EASE_OUT }}
                      >
                        <button
                          type="button"
                          className={cx('place', active && 'is-selected')}
                          aria-pressed={active}
                          onClick={() =>
                            selectWorkshop(active ? null : workshop.id)
                          }
                        >
                          <span className="place__no">
                            {pad2(numberOf(workshop.id))}
                          </span>
                          <span className="place__main">
                            <span className="place__name">{workshop.name}</span>
                            <span className="place__line">
                              {workshop.tagline}
                            </span>
                            <span className="place__line">
                              {workshop.hours}
                            </span>
                          </span>
                          <span className="place__tags">
                            <span
                              className={cx(
                                'status',
                                `status--${workshop.visitStatus}`,
                              )}
                            >
                              {visitStatusLabel[workshop.visitStatus]}
                            </span>
                            {workshop.hasExperience ? (
                              <span className="tag">Trải nghiệm làm gốm</span>
                            ) : null}
                          </span>
                        </button>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
