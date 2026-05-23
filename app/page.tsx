import StarBackground from '@/components/StarBackground'
import ContentOverlay from '@/components/ContentOverlay'

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      <StarBackground />
      <ContentOverlay />
    </main>
  )
}
