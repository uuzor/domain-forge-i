import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import OrderbookSection from './components/OrderbookSection.jsx'
import MessagingSection from './components/MessagingSection.jsx'
import AnalyticsSection from './components/AnalyticsSection.jsx'
import Footer from './components/Footer.jsx'
import Analytics, { trackPerformance, trackEngagement } from './components/Analytics.jsx'
import SEOHead from './components/SEOHead.jsx'

// Pages
import DomainDetails from './pages/DomainDetails.jsx'
import Portfolio from './pages/Portfolio.jsx'
import MessagingCenter from './pages/MessagingCenter.jsx'
import TokenizationWizard from './pages/TokenizationWizard.jsx'

import './App.css'

function HomePage() {
  return (
    <>
      <SEOHead />
      <Analytics />
      <Header />
      <main>
        <Hero />
        <OrderbookSection />
        <MessagingSection />
        <AnalyticsSection />
      </main>
      <Footer />
    </>
  )
}

function App() {
  useEffect(() => {
    // Initialize performance and engagement tracking
    trackPerformance()
    const cleanupEngagement = trackEngagement()

    // Cleanup function
    return () => {
      if (cleanupEngagement) {
        cleanupEngagement()
      }
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground dark">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/domain/:domainName" element={<DomainDetails />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/messages" element={<MessagingCenter />} />
          <Route path="/tokenize/:domainId" element={<TokenizationWizard />} />
          <Route path="/marketplace" element={<HomePage />} />
          <Route path="/analytics" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
