import { useEffect } from 'react'

export default function SEOHead({ 
  title = "Domain Forge - Premium Domain Sales & Messaging Platform",
  description = "Revolutionize domain trading with integrated orderbooks, real-time messaging, and seamless Web3 communication powered by XMTP protocol.",
  keywords = "domain sales, domain trading, Web3 domains, XMTP messaging, orderbook, domain marketplace, blockchain domains, DeFi domains, NFT domains, domain tokenization, Doma Protocol",
  image = "/og-image.jpg",
  url = "https://domainforge.com",
  type = "website"
}) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Update basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)

    // Update Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:type', type, true)

    // Update Twitter Card tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Update structured data
    const updateStructuredData = () => {
      let script = document.querySelector('script[type="application/ld+json"]')
      if (!script) {
        script = document.createElement('script')
        script.setAttribute('type', 'application/ld+json')
        document.head.appendChild(script)
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Domain Forge",
        "description": description,
        "url": url,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "category": "Domain Trading Services"
        },
        "featureList": [
          "Domain Trading",
          "Real-time Messaging", 
          "Orderbook Integration",
          "Web3 Communication",
          "XMTP Protocol",
          "Domain Analytics"
        ]
      }

      script.textContent = JSON.stringify(structuredData)
    }

    updateStructuredData()

  }, [title, description, keywords, image, url, type])

  return null
}

// Domain-specific SEO component
export function DomainSEO({ domain, price, category, description }) {
  const title = `${domain} - Premium ${category} Domain for Sale | Domain Forge`
  const metaDescription = `${domain} is available for $${price?.toLocaleString()}. ${description} Trade premium ${category} domains with transparent pricing on Domain Forge.`
  const url = `https://domainforge.com/domain/${domain}`

  return (
    <SEOHead
      title={title}
      description={metaDescription}
      keywords={`${domain}, ${category} domain, domain for sale, premium domain, Web3 domain, blockchain domain`}
      url={url}
      type="product"
    />
  )
}

// Category-specific SEO component  
export function CategorySEO({ category, domainCount, avgPrice }) {
  const title = `${category} Domains for Sale | Premium ${category} Domain Marketplace | Domain Forge`
  const description = `Discover ${domainCount}+ premium ${category} domains starting at $${avgPrice?.toLocaleString()}. Trade ${category} domains with integrated orderbooks and real-time messaging.`
  const url = `https://domainforge.com/category/${category.toLowerCase()}`

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={`${category} domains, ${category} domain marketplace, premium ${category} domains, Web3 ${category}, blockchain ${category}`}
      url={url}
    />
  )
}

