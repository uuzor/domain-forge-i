import { useEffect } from 'react'

// Google Analytics tracking function
const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// Initialize Google Analytics
const initGA = (measurementId) => {
  if (typeof window === 'undefined') return

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }
  
  gtag('js', new Date())
  gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href
  })
}

// Track page views
export const trackPageView = (url, title) => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: url,
    page_title: title
  })
}

// Track custom events
export const trackEvent = (action, category, label, value) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}

// Track domain interactions
export const trackDomainView = (domainName, price) => {
  trackEvent('view_domain', 'Domain', domainName, price)
}

export const trackDomainOffer = (domainName, offerAmount) => {
  trackEvent('make_offer', 'Domain', domainName, offerAmount)
}

export const trackMessageSent = (domainContext) => {
  trackEvent('send_message', 'Messaging', domainContext)
}

export const trackWalletConnect = (walletType) => {
  trackEvent('connect_wallet', 'Web3', walletType)
}

// Analytics component
export default function Analytics({ measurementId = 'GA_MEASUREMENT_ID' }) {
  useEffect(() => {
    if (measurementId && measurementId !== 'GA_MEASUREMENT_ID') {
      initGA(measurementId)
    }
  }, [measurementId])

  return null
}

// SEO and performance monitoring
export const trackPerformance = () => {
  if (typeof window === 'undefined') return

  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        trackEvent('performance', 'LCP', 'timing', Math.round(entry.startTime))
      }
      if (entry.entryType === 'first-input') {
        trackEvent('performance', 'FID', 'timing', Math.round(entry.processingStart - entry.startTime))
      }
      if (entry.entryType === 'layout-shift') {
        trackEvent('performance', 'CLS', 'score', Math.round(entry.value * 1000))
      }
    })
  })

  // Observe performance metrics
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  } catch (e) {
    // Fallback for browsers that don't support all entry types
    console.log('Performance monitoring not fully supported')
  }
}

// Track user engagement
export const trackEngagement = () => {
  if (typeof window === 'undefined') return

  let startTime = Date.now()
  let isActive = true

  // Track time on page
  const trackTimeOnPage = () => {
    if (isActive) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      trackEvent('engagement', 'time_on_page', 'seconds', timeSpent)
    }
  }

  // Track scroll depth
  const trackScrollDepth = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    )
    
    if (scrollPercent >= 25 && !window.scrollTracked25) {
      trackEvent('engagement', 'scroll_depth', '25_percent')
      window.scrollTracked25 = true
    }
    if (scrollPercent >= 50 && !window.scrollTracked50) {
      trackEvent('engagement', 'scroll_depth', '50_percent')
      window.scrollTracked50 = true
    }
    if (scrollPercent >= 75 && !window.scrollTracked75) {
      trackEvent('engagement', 'scroll_depth', '75_percent')
      window.scrollTracked75 = true
    }
    if (scrollPercent >= 90 && !window.scrollTracked90) {
      trackEvent('engagement', 'scroll_depth', '90_percent')
      window.scrollTracked90 = true
    }
  }

  // Event listeners
  window.addEventListener('beforeunload', trackTimeOnPage)
  window.addEventListener('scroll', trackScrollDepth, { passive: true })
  
  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    isActive = !document.hidden
    if (!isActive) {
      trackTimeOnPage()
    } else {
      startTime = Date.now()
    }
  })

  return () => {
    window.removeEventListener('beforeunload', trackTimeOnPage)
    window.removeEventListener('scroll', trackScrollDepth)
  }
}

