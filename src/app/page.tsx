import Header from '@/components/Header'
import MainLanding from '@/components/MainLanding'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <MainLanding />
      <Footer />
    </main>
  )
}
