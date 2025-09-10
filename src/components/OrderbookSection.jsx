import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react'

export default function OrderbookSection() {
  const mockOrders = [
    { domain: 'crypto.com', price: 125000, type: 'buy', time: '2m ago', trend: 'up' },
    { domain: 'nft.io', price: 89000, type: 'sell', time: '5m ago', trend: 'down' },
    { domain: 'defi.org', price: 67500, type: 'buy', time: '8m ago', trend: 'up' },
    { domain: 'web3.app', price: 45000, type: 'sell', time: '12m ago', trend: 'up' },
    { domain: 'dao.xyz', price: 32000, type: 'buy', time: '15m ago', trend: 'down' },
  ]

  const featuredDomains = [
    { name: 'blockchain.com', price: 250000, change: '+12.5%', volume: '1.2M' },
    { name: 'metaverse.io', price: 180000, change: '+8.3%', volume: '890K' },
    { name: 'ai.tech', price: 95000, change: '-2.1%', volume: '650K' },
  ]

  return (
    <section id="marketplace" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Live Domain Orderbook</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time domain trading with transparent pricing and instant execution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Domains */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Featured Domains
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredDomains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-semibold">{domain.name}</div>
                      <div className="text-sm text-muted-foreground">Vol: ${domain.volume}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${domain.price.toLocaleString()}</div>
                      <Badge variant={domain.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                        {domain.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Live Orderbook */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                    Live Orders
                  </span>
                  <Badge variant="outline" className="animate-pulse">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Badge variant={order.type === 'buy' ? 'default' : 'secondary'}>
                          {order.type.toUpperCase()}
                        </Badge>
                        <div>
                          <div className="font-semibold">{order.domain}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {order.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-bold text-lg">${order.price.toLocaleString()}</div>
                          <div className="flex items-center text-sm">
                            {order.trend === 'up' ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={order.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                              {order.trend === 'up' ? '+5.2%' : '-2.8%'}
                            </span>
                          </div>
                        </div>
                        
                        <Button size="sm" variant={order.type === 'buy' ? 'default' : 'outline'}>
                          {order.type === 'buy' ? 'Sell' : 'Buy'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" size="lg">
                    View Full Orderbook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

