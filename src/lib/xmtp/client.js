import { Client as XMTPClientSDK } from '@xmtp/browser-sdk'
import { useEffect, useRef, useState } from 'react'

/**
 * Wrap an ethers v6 Signer to XMTP Signer interface
 */
async function buildXMTPSigner(ethersSigner) {
  const address = await ethersSigner.getAddress()
  return {
    type: 'EOA',
    getIdentifier: () => ({
      identifier: address,
      identifierKind: 'Ethereum',
    }),
    signMessage: async (message) => {
      // ethers v6 returns a hex string signature
      const sigHex = await ethersSigner.signMessage(message)
      // Convert to Uint8Array
      const hex = sigHex.startsWith('0x') ? sigHex.slice(2) : sigHex
      const bytes = new Uint8Array(hex.length / 2)
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
      }
      return bytes
    },
  }
}

/**
 * Message shape with optional domain context metadata
 */
export function normalizeMessage(decoded) {
  try {
    const parsed = JSON.parse(decoded.content)
    return {
      id: decoded.id,
      content: parsed.content ?? decoded.content,
      sender: decoded.senderAddress,
      timestamp: decoded.sent,
      domainContext: parsed?.metadata?.domainContext,
      messageType: parsed?.metadata?.messageType,
      offerDetails: parsed?.metadata?.offerDetails,
      raw: decoded,
    }
  } catch {
    return {
      id: decoded.id,
      content: decoded.content,
      sender: decoded.senderAddress,
      timestamp: decoded.sent,
      raw: decoded,
    }
  }
}

export class XMTPClient {
  constructor(env = 'production') {
    this.env = env // 'dev' | 'production'
    this.client = null
    this.signer = null
    this.conversations = new Map()
    this.streamAbort = null
  }

  async initialize(ethersSigner) {
    try {
      this.signer = ethersSigner
      const xmtpSigner = await buildXMTPSigner(ethersSigner)
      this.client = await XMTPClientSDK.create(xmtpSigner, {
        env: this.env === 'dev' ? 'dev' : 'production',
      })
      return { success: true }
    } catch (e) {
      console.error('XMTP initialization failed:', e)
      return { success: false, error: e?.message || 'init_failed' }
    }
  }

  isConnected() {
    return !!this.client
  }

  async getCurrentAddress() {
    if (!this.signer) return null
    return await this.signer.getAddress()
  }

  async canMessage(address) {
    if (!this.client) throw new Error('Client not initialized')
    return await this.client.canMessage(address)
  }

  async startConversation({ peerAddress, domainContext, initialMessage }) {
    if (!this.client) throw new Error('Client not initialized')

    const conversation = await this.client.conversations.newConversation(peerAddress, {
      conversationId: domainContext ? `domain-${domainContext}` : undefined,
      metadata: domainContext ? { domainContext } : undefined,
    })

    this.conversations.set(conversation.topic, conversation)

    if (initialMessage) {
      await this.sendMessage(conversation.topic, initialMessage, {
        domainContext,
      })
    }

    return {
      success: true,
      conversationTopic: conversation.topic,
      conversation,
    }
  }

  async sendMessage(conversationTopic, content, metadata) {
    if (!this.client) throw new Error('Client not initialized')
    const conversation =
      this.conversations.get(conversationTopic) ||
      (await this._loadConversationByTopic(conversationTopic))

    const payload = JSON.stringify({
      content,
      metadata: {
        timestamp: Date.now(),
        ...(metadata || {}),
      },
    })

    const message = await conversation.send(payload)

    return {
      success: true,
      message: {
        id: message.id,
        content,
        sent: message.sent,
        senderAddress: message.senderAddress,
        ...(metadata || {}),
      },
    }
  }

  async sendDomainOffer({ conversationTopic, domainName, offerAmount, currency, deadline, message }) {
    const content = message || `I'd like to make an offer for ${domainName}`
    return this.sendMessage(conversationTopic, content, {
      domainContext: domainName,
      messageType: 'offer',
      offerDetails: {
        amount: offerAmount,
        currency,
        deadline,
      },
    })
  }

  async getConversations() {
    if (!this.client) throw new Error('Client not initialized')

    const list = await this.client.conversations.list()
    const self = await this.getCurrentAddress()

    const output = await Promise.all(
      list.map(async (conv) => {
        const msgs = await conv.messages({ limit: 1, direction: 'descending' })
        const last = msgs[0]
        let domainContext = 'general'
        let lastContent = last?.content || ''
        if (last) {
          try {
            const parsed = JSON.parse(last.content)
            domainContext = parsed?.metadata?.domainContext || 'general'
            lastContent = parsed?.content || last.content
          } catch {
            // ignore
          }
        }
        return {
          id: conv.topic,
          peerAddress: conv.peerAddress,
          domain_context: domainContext,
          last_message: last
            ? { content: lastContent, timestamp: last.sent, senderAddress: last.senderAddress }
            : null,
          participants: [self, conv.peerAddress].filter(Boolean),
          unread_count: 0,
        }
      })
    )

    // Cache them locally
    output.forEach((c) => {
      const found = list.find((x) => x.topic === c.id)
      if (found) this.conversations.set(c.id, found)
    })

    return { success: true, conversations: output }
  }

  async getMessages(conversationTopic) {
    if (!this.client) throw new Error('Client not initialized')

    const conv =
      this.conversations.get(conversationTopic) ||
      (await this._loadConversationByTopic(conversationTopic))

    const msgs = await conv.messages()
    return msgs.map((m) => normalizeMessage(m))
  }

  async streamMessages(onMessage) {
    if (!this.client) throw new Error('Client not initialized')
    const stream = await this.client.conversations.streamAllMessages()
    // Keep a reference so calling code can abort by page unmount if needed
    this.streamAbort = stream
    ;(async () => {
      for await (const m of stream) {
        onMessage(normalizeMessage(m))
      }
    })().catch((e) => console.error('XMTP stream error', e))
  }

  async _loadConversationByTopic(topic) {
    if (!this.client) throw new Error('Client not initialized')
    const all = await this.client.conversations.list()
    const found = all.find((c) => c.topic === topic)
    if (!found) throw new Error('Conversation not found')
    this.conversations.set(topic, found)
    return found
  }
}

// React hook
export function useXMTP() {
  const clientRef = useRef(null)
  if (!clientRef.current) {
    clientRef.current = new XMTPClient(
      import.meta.env.VITE_XMTP_ENV === 'dev' ? 'dev' : 'production'
    )
  }
  const client = clientRef.current

  const [isInitialized, setIsInitialized] = useState(false)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})

  const initialize = async (signer) => {
    const res = await client.initialize(signer)
    if (res.success) {
      setIsInitialized(true)
      const convRes = await client.getConversations()
      if (convRes.success) {
        setConversations(convRes.conversations)
      }
    }
    return res
  }

  const startConversation = async (params) => {
    const res = await client.startConversation(params)
    if (res.success) {
      const convRes = await client.getConversations()
      if (convRes.success) setConversations(convRes.conversations)
    }
    return res
  }

  const sendMessage = async (topic, content, metadata) => {
    const res = await client.sendMessage(topic, content, metadata)
    if (res.success) {
      const convMsgs = await client.getMessages(topic)
      setMessages((prev) => ({ ...prev, [topic]: convMsgs }))
    }
    return res
  }

  const loadMessages = async (topic) => {
    const convMsgs = await client.getMessages(topic)
    setMessages((prev) => ({ ...prev, [topic]: convMsgs }))
    return convMsgs
  }

  useEffect(() => {
    // Optional: start a background stream and update message buckets
    let active = true
    if (isInitialized) {
      client.streamMessages((m) => {
        if (!active) return
        setMessages((prev) => {
          const before = prev[m.raw.conversationTopic] || []
          return {
            ...prev,
            [m.raw.conversationTopic]: [...before, m],
          }
        })
      })
    }
    return () => {
      active = false
    }
  }, [isInitialized])

  return {
    client,
    isInitialized,
    conversations,
    messages,
    initialize,
    startConversation,
    sendMessage,
    loadMessages,
    canMessage: client.canMessage.bind(client),
    sendDomainOffer: client.sendDomainOffer.bind(client),
    getCurrentAddress: client.getCurrentAddress.bind(client),
    isConnected: client.isConnected.bind(client),
  }
}