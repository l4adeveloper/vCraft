import { createFileRoute } from '@tanstack/react-router'
import { CustomOrder } from '#/components/home/CustomOrder'
import { Exhibition } from '#/components/home/Exhibition'
import { Hero } from '#/components/home/Hero'
import { Keepers } from '#/components/home/Keepers'
import { VillageNumbers } from '#/components/home/VillageNumbers'
import { VillageMap } from '#/components/home/VillageMap'
import { VillageStory } from '#/components/home/VillageStory'
import './styles.css'

export const Route = createFileRoute('/home/')({ component: Home })

function Home() {
  return (
    <>
      <Hero />
      <VillageNumbers />
      <VillageStory />
      <Exhibition />
      <Keepers />
      <VillageMap />
      <CustomOrder />
    </>
  )
}
