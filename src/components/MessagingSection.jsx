import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { MessageCircle, Send, Users, Shield, Zap } from 'lucide-react'

export default function MessagingSection() {
  const mockMessages = [
    {
      user: '0x1234...5678',
      message: 'Interested in crypto.com - can we negotiate?',
      time: '2m ago',
      domain: 'crypto.com',
      type: 'inquiry'
    },
    {
      user: '0x9876...4321',
      message: 'Accepting offers for nft.io starting at $80k',
      time: '5m ago',
      domain: 'nft.io',
      type: 'offer'
    },
    {
      user: '0x5555...7777',
      message: 'Looking for premium .com domains in DeFi space',
      time: '8m ago',
      domain: 'general',
      type: 'request'
    }
  ]

  return (
    <section id="messaging" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Decentralized Messaging</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, wallet-to-wallet communication powered by XMTP protocol for seamless domain negotiations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Chat Demo */}
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Domain Chat
                </span>
                <Badge variant="outline" className="animate-pulse">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {mockMessages.map((msg, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{msg.user}</span>
                        <Badge variant="outline" size="sm">
                          {msg.domain}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Shield className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">End-to-End Encrypted</h3>
                    <p className="text-sm text-muted-foreground">
                      All messages are encrypted and secured by XMTP protocol
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Group Negotiations</h3>
                    <p className="text-sm text-muted-foreground">
                      Support for community deals and fractionalized ownership
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Zap className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time alerts for offers, messages, and market updates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            Start Messaging Now
          </Button>
        </div>
      </div>
    </section>
  )
}

