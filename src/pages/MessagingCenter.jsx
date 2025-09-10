import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Send, Paperclip, Smile, MoreVertical, Phone, Video, Info, Users, Shield, Zap } from 'lucide-react'
import { trackMessageSent, trackEvent } from '../components/Analytics'
import SEOHead from '../components/SEOHead'

export default function MessagingCenter() {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    checkWalletConnection()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkWalletConnection = () => {
    // Mock wallet connection check
    setWalletConnected(true)
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/xmtp/conversations')
      const data = await response.json()
      
      if (data.success) {
        setConversations(data.data)
        if (data.data.length > 0) {
          setActiveConversation(data.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/xmtp/conversations/${conversationId}/messages`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    try {
      const response = await fetch('/api/xmtp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: activeConversation.id,
          sender: '0x1234...5678',
          content: newMessage,
          domain_context: activeConversation.domain_context
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data.data])
        setNewMessage('')
        trackMessageSent(activeConversation.domain_context)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.domain_context.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatTime = (timestamp) => {
    if (timestamp.includes('ago')) return timestamp
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Connect your Web3 wallet to start secure, encrypted messaging with domain traders.
          </p>
          <button
            onClick={() => setWalletConnected(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex">
      <SEOHead 
        title="Messaging Center - Domain Forge"
        description="Secure, encrypted messaging for domain negotiations powered by XMTP protocol."
      />
      
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Messages</h1>
            <button
              onClick={() => setShowNewConversation(true)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeConversation?.id === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">
                      {conversation.domain_context === 'general' ? 'General Chat' : conversation.domain_context}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {conversation.last_message?.timestamp}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground truncate mb-2">
                    {conversation.last_message?.content}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {conversation.participants.length} participants
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* XMTP Status */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected to XMTP</span>
            <Zap className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="font-bold">
                    {activeConversation.domain_context === 'general' ? 'General Chat' : activeConversation.domain_context}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {activeConversation.participants.length} participants
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Info className="h-5 w-5" />
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === '0x1234...5678' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === '0x1234...5678'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === '0x1234...5678'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {message.message_type === 'offer' && message.offer_details && (
                      <div className="mt-2 p-2 bg-background/10 rounded border">
                        <div className="text-xs font-medium">Offer Details</div>
                        <div className="text-sm">
                          Amount: ${message.offer_details.amount.toLocaleString()} {message.offer_details.currency}
                        </div>
                        <div className="text-xs">
                          Deadline: {new Date(message.offer_details.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                  <Smile className="h-5 w-5" />
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="h-3 w-3" />
                  <span>End-to-end encrypted</span>
                </div>
                <div>Press Enter to send</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 bg-accent/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Start New Conversation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x... or ENS name"
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Domain Context (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., crypto.com"
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Initial Message</label>
                <textarea
                  placeholder="Hi, I'm interested in..."
                  className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewConversation(false)
                  trackEvent('start_conversation', 'Messaging', 'new')
                }}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Start Conversation
              </button>
              <button
                onClick={() => setShowNewConversation(false)}
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

