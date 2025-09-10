import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, Plus, Settings, Eye, MessageSquare, Share2, MoreHorizontal } from 'lucide-react'
import { trackEvent } from '../components/Analytics'
import SEOHead from '../components/SEOHead'

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('owned')
  const [sortBy, setSortBy] = useState('value')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)
      // Mock portfolio data - in production, this would fetch user's actual portfolio
      const mockData = {
        totalValue: 2450000,
        totalChange: 12.5,
        ownedDomains: [
          {
            id: '1',
            name: 'crypto.com',
            category: 'DeFi',
            purchasePrice: 100000,
            currentValue: 125000,
            change: 25.0,
            tokenized: true,
            fractionalized: false,
            lastActivity: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            name: 'nft.marketplace',
            category: 'NFT',
            purchasePrice: 75000,
            currentValue: 89000,
            change: 18.7,
            tokenized: true,
            fractionalized: true,
            fractions: { owned: 0.6, total: 1.0 },
            lastActivity: '2024-01-14T15:45:00Z'
          },
          {
            id: '3',
            name: 'gaming.world',
            category: 'Gaming',
            purchasePrice: 45000,
            currentValue: 52000,
            change: 15.6,
            tokenized: false,
            fractionalized: false,
            lastActivity: '2024-01-13T09:20:00Z'
          }
        ],
        fractionalShares: [
          {
            id: '4',
            name: 'defi.protocol',
            category: 'DeFi',
            totalValue: 200000,
            ownedFraction: 0.15,
            ownedValue: 30000,
            change: -5.2,
            totalFractions: 20,
            ownedFractions: 3
          },
          {
            id: '5',
            name: 'web3.social',
            category: 'Social',
            totalValue: 150000,
            ownedFraction: 0.25,
            ownedValue: 37500,
            change: 8.9,
            totalFractions: 10,
            ownedFractions: 2.5
          }
        ],
        watchlist: [
          {
            id: '6',
            name: 'ai.tech',
            category: 'AI/Tech',
            currentValue: 95000,
            change: -2.1,
            alerts: ['price_drop', 'new_offer']
          },
          {
            id: '7',
            name: 'metaverse.land',
            category: 'Gaming',
            currentValue: 180000,
            change: 8.3,
            alerts: ['price_target']
          }
        ],
        recentActivity: [
          { type: 'purchase', domain: 'crypto.com', amount: 125000, date: '2024-01-15' },
          { type: 'offer_received', domain: 'nft.marketplace', amount: 95000, date: '2024-01-14' },
          { type: 'fraction_bought', domain: 'defi.protocol', amount: 15000, date: '2024-01-13' },
          { type: 'message', domain: 'gaming.world', date: '2024-01-12' }
        ]
      }
      
      setPortfolioData(mockData)
      trackEvent('view_portfolio', 'Portfolio', 'dashboard')
    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenize = (domainId) => {
    trackEvent('tokenize_domain', 'Portfolio', domainId)
    // Navigate to tokenization wizard
    window.location.href = `/tokenize/${domainId}`
  }

  const handleFractionalize = (domainId) => {
    trackEvent('fractionalize_domain', 'Portfolio', domainId)
    // Navigate to fractionalization interface
    window.location.href = `/fractionalize/${domainId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const filteredDomains = portfolioData?.ownedDomains.filter(domain => 
    filterCategory === 'all' || domain.category.toLowerCase() === filterCategory.toLowerCase()
  ).sort((a, b) => {
    switch (sortBy) {
      case 'value': return b.currentValue - a.currentValue
      case 'change': return b.change - a.change
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Portfolio Dashboard - Domain Forge"
        description="Manage your domain portfolio, track performance, and monitor fractional ownership shares on Domain Forge."
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground mt-2">Manage your domain investments and track performance</p>
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Domain</span>
          </button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Total Value</span>
              </div>
            </div>
            <div className="text-3xl font-bold">${portfolioData?.totalValue.toLocaleString()}</div>
            <div className={`flex items-center space-x-2 mt-2 ${
              portfolioData?.totalChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {portfolioData?.totalChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{portfolioData?.totalChange >= 0 ? '+' : ''}{portfolioData?.totalChange}%</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Owned Domains</span>
            </div>
            <div className="text-3xl font-bold">{portfolioData?.ownedDomains.length}</div>
            <div className="text-sm text-muted-foreground mt-2">
              {portfolioData?.ownedDomains.filter(d => d.tokenized).length} tokenized
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Fractional Shares</span>
            </div>
            <div className="text-3xl font-bold">{portfolioData?.fractionalShares.length}</div>
            <div className="text-sm text-muted-foreground mt-2">
              ${portfolioData?.fractionalShares.reduce((sum, share) => sum + share.ownedValue, 0).toLocaleString()} value
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-accent/50 p-1 rounded-lg w-fit">
          {[
            { id: 'owned', label: 'Owned Domains' },
            { id: 'fractions', label: 'Fractional Shares' },
            { id: 'watchlist', label: 'Watchlist' },
            { id: 'activity', label: 'Activity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting */}
        {(activeTab === 'owned' || activeTab === 'fractions') && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="defi">DeFi</option>
                <option value="nft">NFT</option>
                <option value="gaming">Gaming</option>
                <option value="ai/tech">AI/Tech</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="value">Sort by Value</option>
                <option value="change">Sort by Change</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'owned' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDomains?.map((domain) => (
              <div key={domain.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{domain.name}</h3>
                    <span className="text-sm text-muted-foreground">{domain.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Value</span>
                    <span className="font-bold">${domain.currentValue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Purchase Price</span>
                    <span>${domain.purchasePrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Change</span>
                    <span className={`font-medium ${domain.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {domain.change >= 0 ? '+' : ''}{domain.change}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      domain.tokenized ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {domain.tokenized ? 'Tokenized' : 'Not Tokenized'}
                    </span>
                    {domain.fractionalized && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
                        Fractionalized
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  {!domain.tokenized && (
                    <button
                      onClick={() => handleTokenize(domain.id)}
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Tokenize
                    </button>
                  )}
                  {domain.tokenized && !domain.fractionalized && (
                    <button
                      onClick={() => handleFractionalize(domain.id)}
                      className="flex-1 border border-border py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Fractionalize
                    </button>
                  )}
                  <button className="flex-1 border border-border py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'fractions' && (
          <div className="space-y-4">
            {portfolioData?.fractionalShares.map((share) => (
              <div key={share.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-bold text-lg">{share.name}</h3>
                      <span className="text-sm text-muted-foreground">{share.category}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold">${share.ownedValue.toLocaleString()}</div>
                    <div className={`text-sm ${share.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {share.change >= 0 ? '+' : ''}{share.change}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Owned Fraction</div>
                    <div className="font-medium">{(share.ownedFraction * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                    <div className="font-medium">${share.totalValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fractions Owned</div>
                    <div className="font-medium">{share.ownedFractions} / {share.totalFractions}</div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Buy More
                  </button>
                  <button className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    Sell Fractions
                  </button>
                  <button className="border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {portfolioData?.watchlist.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${item.currentValue.toLocaleString()}</div>
                    <div className={`text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.alerts.map((alert, index) => (
                    <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium">
                      {alert.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Make Offer
                  </button>
                  <button className="flex-1 border border-border py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {portfolioData?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'purchase' ? 'bg-green-500' :
                      activity.type === 'offer_received' ? 'bg-blue-500' :
                      activity.type === 'fraction_bought' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium">
                        {activity.type === 'purchase' && `Purchased ${activity.domain}`}
                        {activity.type === 'offer_received' && `Received offer for ${activity.domain}`}
                        {activity.type === 'fraction_bought' && `Bought fractions of ${activity.domain}`}
                        {activity.type === 'message' && `New message about ${activity.domain}`}
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.date}</div>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="font-bold">${activity.amount.toLocaleString()}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

