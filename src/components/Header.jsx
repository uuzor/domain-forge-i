import { Button } from '@/components/ui/button.jsx'
import { MessageCircle, Search, Wallet } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DF</span>
          </div>
          <span className="text-xl font-bold">Domain Forge</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
            Marketplace
          </a>
          <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors">
            Analytics
          </a>
          <a href="#messaging" className="text-muted-foreground hover:text-foreground transition-colors">
            Messaging
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  )
}

