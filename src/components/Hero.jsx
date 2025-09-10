import { Button } from '@/components/ui/button.jsx'
import { ArrowRight, TrendingUp, Users, Shield } from 'lucide-react'
import heroBg from '../assets/hero-bg.png'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Premium Domain Sales & Messaging Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Revolutionize domain trading with integrated orderbooks, real-time messaging, 
            and seamless Web3 communication powered by XMTP protocol.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-lg px-8 py-6">
              Explore Marketplace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Start Messaging
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
              <div className="text-2xl font-bold">$2.5M+</div>
              <div className="text-muted-foreground">Total Volume</div>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Users className="h-8 w-8 text-blue-500 mb-3" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <Shield className="h-8 w-8 text-purple-500 mb-3" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-muted-foreground">Secure Trades</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

