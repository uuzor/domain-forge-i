import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Share2, Heart, TrendingUp, Clock, Globe, Shield, Users, Zap } from 'lucide-react'
import { trackDomainView, trackDomainOffer, trackMessageSent } from '../components/Analytics'
import SEOHead, { DomainSEO } from '../components/SEOHead'

export default function DomainDetails() {
  const { domainName } = useParams()
  const [domain, setDomain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [message, setMessage] = useState('')
  const [offerAmount, setOfferAmount] = useState('')
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  useEffect(() => {
    fetchDomainDetails()
  }, [domainName])

  const fetchDomainDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/doma/domains/1`) // Mock endpoint
      const data = await response.json()
      
      if (data.success) {
        setDomain(data.data)
        trackDomainView(data.data.name, data.data.price)
      }
    } catch (error) {
      console.error('Error fetching domain details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    try {
      const response = await fetch('/api/xmtp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: 'new',
          sender: '0x1234...5678',
          content: message,
          domain_context: domainName
        })
      })

      if (response.ok) {
        trackMessageSent(domainName)
        setShowMessageModal(false)
        setMessage('')
        alert('Message sent successfully!')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleMakeOffer = async () => {
    try {
      const response = await fetch('/api/doma/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domainName,
          type: 'buy',
          price: parseFloat(offerAmount),
          quantity: 1
        })
      })

      if (response.ok) {
        trackDomainOffer(domainName, parseFloat(offerAmount))
        setShowOfferModal(false)
        setOfferAmount('')
        alert('Offer submitted successfully!')
      }
    } catch (error) {
      console.error('Error making offer:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Domain Not Found</h1>
          <p className="text-muted-foreground">The domain you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DomainSEO 
        domain={domain.name}
        price={domain.price}
        category={domain.category}
        description={domain.metadata.description}
      />
      
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">{domain.name}</h1>
                <p className="text-muted-foreground">{domain.category} Domain</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={`p-2 rounded-lg transition-colors ${
                  isWatchlisted ? 'bg-red-500 text-white' : 'hover:bg-accent'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWatchlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price and Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold">${domain.price.toLocaleString()}</div>
                  <div className={`flex items-center space-x-2 mt-2 ${
                    domain.change_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className="h-4 w-4" />
                    <span>{domain.change_24h >= 0 ? '+' : ''}{domain.change_24h}% (24h)</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Make Offer
                  </button>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message Owner</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-2xl font-bold">${domain.volume_24h.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-2xl font-bold">#{Math.floor(Math.random() * 100) + 1}</div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 10}</div>
                  <div className="text-sm text-muted-foreground">Watchers</div>
                </div>
                <div className="text-center p-4 bg-accent/50 rounded-lg">
                  <div className="text-2xl font-bold">{Math.floor(Math.random() * 20) + 5}</div>
                  <div className="text-sm text-muted-foreground">Offers</div>
                </div>
              </div>
            </div>

            {/* Domain Information */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Domain Information</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <span>Domain Name</span>
                  </div>
                  <span className="font-medium">{domain.name}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span>Tokenized</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    domain.tokenized ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {domain.tokenized ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>Owner</span>
                  </div>
                  <span className="font-mono text-sm">{domain.owner}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Last Sale</span>
                  </div>
                  <span>{new Date(domain.last_sale).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                    <span>Category</span>
                  </div>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {domain.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {domain.metadata.description}
              </p>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {domain.metadata.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { type: 'offer', amount: '$120,000', time: '2h ago', user: '0xabc...123' },
                  { type: 'view', time: '4h ago', user: '0xdef...456' },
                  { type: 'offer', amount: '$115,000', time: '1d ago', user: '0x789...abc' },
                  { type: 'message', time: '2d ago', user: '0x456...def' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'offer' ? 'bg-green-500' :
                        activity.type === 'view' ? 'bg-blue-500' :
                        activity.type === 'message' ? 'bg-purple-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium">
                          {activity.type === 'offer' && `Offer: ${activity.amount}`}
                          {activity.type === 'view' && 'Domain viewed'}
                          {activity.type === 'message' && 'Message sent'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.user} • {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Domains */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Similar Domains</h3>
              <div className="space-y-3">
                {[
                  { name: 'blockchain.org', price: '$95,000', change: '+3.2%' },
                  { name: 'web3.com', price: '$180,000', change: '-1.5%' },
                  { name: 'defi.net', price: '$75,000', change: '+8.7%' }
                ].map((similar, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                    <div>
                      <div className="font-medium">{similar.name}</div>
                      <div className="text-sm text-muted-foreground">{similar.price}</div>
                    </div>
                    <div className={`text-sm font-medium ${
                      similar.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {similar.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Send Message to Owner</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleSendMessage}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 border border-border py-2 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Make an Offer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Offer Amount (USD)</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter your offer..."
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Current asking price: ${domain.price.toLocaleString()}
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleMakeOffer}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Submit Offer
              </button>
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 border border-border py-2 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

