import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <FeaturedProjects />
      </main>
      <Footer />
    </>
  )
}
