import { CountUp } from '#/components/ui/CountUp'
import { Reveal } from '#/components/ui/Reveal'
import { featuredBatchId, getBatch, products, workshops } from '#/data'
import { daysBetween } from '#/lib/format'

/** Dải số liệu ngay dưới hero; các con số lấy từ dữ liệu mẫu và đếm lên khi cuộn tới. */
export function VillageNumbers() {
  const batch = getBatch(featuredBatchId)
  const days = batch ? daysBetween(batch.startedAt, batch.finishedAt) : 0
  const items = [
    { value: workshops.length, unit: 'xưởng', label: 'mở cửa kể chuyện nghề' },
    {
      value: products.length,
      unit: 'tác phẩm',
      label: 'đang trưng bày mùa này',
    },
    { value: days, unit: 'ngày', label: 'cho một mẻ gốm, từ đất đến bình' },
    { value: 1250, unit: '°C', label: 'ở đỉnh lửa của một đêm lò' },
  ]

  return (
    <Reveal>
      <dl className="numbers shell" aria-label="Làng nghề qua vài con số">
        {items.map((item) => (
          <div key={item.unit}>
            <dt>
              <CountUp value={item.value} />
              <small>{item.unit}</small>
            </dt>
            <dd>{item.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
