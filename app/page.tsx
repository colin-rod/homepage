import Navigation from '@/components/layouts/Navigation'
import Footer from '@/components/layouts/Footer'
import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import PageTransition from '@/components/animations/PageTransition'

export default function Home() {
  return (
    <>
      <Navigation />
      <PageTransition>
        <main>
          <Hero />
          <FeaturedProjects />
        </main>
      </PageTransition>
      <Footer />
    </>
  )
}
