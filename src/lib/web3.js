import { ethers } from 'ethers'

/**
 * Request a browser signer via window.ethereum.
 * Returns an ethers v6 Signer or throws if not available.
 */
export async function getBrowserSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No injected wallet found. Please install MetaMask or a compatible wallet.')
  }

  // ethers v6 BrowserProvider
  const provider = new ethers.BrowserProvider(window.ethereum)
  // Request accounts access
  await provider.send('eth_requestAccounts', [])
  const signer = await provider.getSigner()
  return signer
}

/**
 * Best-effort detection of wallet type for analytics.
 */
export function detectWalletType() {
  const eth = typeof window !== 'undefined' ? window.ethereum : undefined
  if (!eth) return 'unknown'
  if (eth.isMetaMask) return 'metamask'
  if (eth.isCoinbaseWallet) return 'coinbase'
  if (eth.isBraveWallet) return 'brave'
  if (eth.isFrame) return 'frame'
  if (eth.isOKExWallet) return 'okx'
  if (eth.isPhantom) return 'phantom'
  return 'injected'
}