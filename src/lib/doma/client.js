import { createDomaOrderbookClient, OrderbookType } from '@doma-protocol/orderbook-sdk'

/**
 * Read config from Vite env with safe defaults.
 * Populate your real contract addresses via .env:
 * - VITE_DOMA_API_URL
 * - VITE_DOMA_SUBGRAPH_URL
 * - VITE_DOMA_CHAIN_ID
 * - VITE_DOMA_PROXY_RECORD
 * - VITE_DOMA_OWNERSHIP_TOKEN
 */
function readConfig() {
  const network = (import.meta.env.VITE_DOMA_NETWORK || 'testnet').toLowerCase()
  const base = {
    testnet: {
      apiUrl: import.meta.env.VITE_DOMA_API_URL || 'https://api-testnet.doma.xyz',
      subgraphUrl:
        import.meta.env.VITE_DOMA_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/doma-testnet',
      chainId: import.meta.env.VITE_DOMA_CHAIN_ID || '97476', // Placeholder
      contracts: {
        proxyDomaRecord: import.meta.env.VITE_DOMA_PROXY_RECORD || '',
        ownershipToken: import.meta.env.VITE_DOMA_OWNERSHIP_TOKEN || '',
      },
    },
    mainnet: {
      apiUrl: import.meta.env.VITE_DOMA_API_URL || 'https://api.doma.xyz',
      subgraphUrl:
        import.meta.env.VITE_DOMA_SUBGRAPH_URL || 'https://api.studio.thegraph.com/query/doma-mainnet',
      chainId: import.meta.env.VITE_DOMA_CHAIN_ID || '1',
      contracts: {
        proxyDomaRecord: import.meta.env.VITE_DOMA_PROXY_RECORD || '',
        ownershipToken: import.meta.env.VITE_DOMA_OWNERSHIP_TOKEN || '',
      },
    },
  }
  return { network, config: base[network] }
}

export class DomaClient {
  constructor(network = 'testnet') {
    const { config } = readConfig()
    this.config = config
    this.orderbookClient = createDomaOrderbookClient()
  }

  getConfig() {
    return this.config
  }

  // Domain tokenization (voucher-based flow; contract call not implemented)
  async tokenizeDomain({ domainName, owner, signer }) {
    try {
      const voucher = await this.getTokenizationVoucher(domainName)
      const tx = await this.requestTokenization({
        voucher,
        signature: voucher.signature,
        signer,
      })
      return {
        success: true,
        transactionHash: tx.hash,
        tokenId: voucher.tokenId,
      }
    } catch (e) {
      console.error('Tokenization failed:', e)
      return { success: false, error: e?.message || 'tokenize_failed' }
    }
  }

  async createListing({ tokenId, price, contract, signer }) {
    try {
      const result = await this.orderbookClient.createListing({
        params: {
          items: [{ contract, tokenId, price }],
          orderbook: OrderbookType.DOMA,
        },
        signer,
        chainId: `eip155:${this.config.chainId}`,
        onProgress: (step, progress) => {
          console.log(`Creating listing: ${step} (${progress}%)`)
        },
      })
      return { success: true, orderId: result.orderId }
    } catch (e) {
      console.error('Listing creation failed:', e)
      return { success: false, error: e?.message || 'listing_failed' }
    }
  }

  async buyListing({ orderId, fulfillerAddress, signer }) {
    try {
      const result = await this.orderbookClient.buyListing({
        params: {
          orderId,
          fulfillerAddress,
        },
        signer,
        chainId: `eip155:${this.config.chainId}`,
        onProgress: (step, progress) => {
          console.log(`Buying listing: ${step} (${progress}%)`)
        },
      })
      return { success: true, transactionHash: result.transactionHash }
    } catch (e) {
      console.error('Purchase failed:', e)
      return { success: false, error: e?.message || 'purchase_failed' }
    }
  }

  async createOffer({ tokenId, contract, price, signer }) {
    try {
      const result = await this.orderbookClient.createOffer({
        params: { collection: contract, tokenId, price },
        signer,
        chainId: `eip155:${this.config.chainId}`,
      })
      return { success: true, offerId: result.offerId }
    } catch (e) {
      console.error('Offer creation failed:', e)
      return { success: false, error: e?.message || 'offer_failed' }
    }
  }

  async searchDomains(params) {
    try {
      const response = await fetch(`${this.config.apiUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      const data = await response.json()
      return { success: true, data: data.domains }
    } catch (e) {
      console.error('Search failed:', e)
      return { success: false, error: e?.message || 'search_failed' }
    }
  }

  async getDomainMetadata(tokenId) {
    try {
      const response = await fetch(`${this.config.apiUrl}/token/${tokenId}`)
      const data = await response.json()
      return { success: true, data }
    } catch (e) {
      console.error('Failed to get domain metadata:', e)
      return { success: false, error: e?.message || 'metadata_failed' }
    }
  }

  // Private
  async getTokenizationVoucher(domainName) {
    const res = await fetch(`${this.config.apiUrl}/tokenization/voucher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: domainName }),
    })
    if (!res.ok) throw new Error('voucher_request_failed')
    return res.json()
  }

  async requestTokenization(_params) {
    // This needs registrar + contract integration.
    throw new Error('Smart contract integration needed')
  }
}

// React helper
import { useState as useStateReact } from 'react'
export function useDoma(network = 'testnet') {
  const [client] = useStateReact(() => new DomaClient(network))
  return client
}