import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Activity, DollarSign, Globe } from 'lucide-react'

export default function AnalyticsSection() {
  const volumeData = [
    { name: 'Jan', volume: 1200000 },
    { name: 'Feb', volume: 1800000 },
    { name: 'Mar', volume: 2100000 },
    { name: 'Apr', volume: 1900000 },
    { name: 'May', volume: 2500000 },
    { name: 'Jun', volume: 2800000 },
  ]

  const priceData = [
    { name: 'Week 1', price: 45000 },
    { name: 'Week 2', price: 52000 },
    { name: 'Week 3', price: 48000 },
    { name: 'Week 4', price: 58000 },
  ]

  const categoryData = [
    { name: 'DeFi', value: 35, color: '#3b82f6' },
    { name: 'NFT', value: 25, color: '#10b981' },
    { name: 'Gaming', value: 20, color: '#f59e0b' },
    { name: 'AI/Tech', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ]

  return (
    <section id="analytics" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Market Analytics</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive insights and data-driven analytics for informed domain trading decisions
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">$2.8M</p>
                  <Badge variant="default" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </Badge>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Domains</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <Badge variant="default" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.3%
                  </Badge>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="text-2xl font-bold">$58K</p>
                  <Badge variant="default" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.2%
                  </Badge>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold">15.2K</p>
                  <Badge variant="default" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +22.1%
                  </Badge>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Volume']} />
                  <Bar dataKey="volume" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Price Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Average Price Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, 'Price']} />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Domain Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-bold">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

