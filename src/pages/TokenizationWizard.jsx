import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, AlertCircle, Zap, Shield, Globe, Coins, ChevronRight } from 'lucide-react'
import { trackEvent } from '../components/Analytics'
import SEOHead from '../components/SEOHead'

export default function TokenizationWizard() {
  const { domainId } = useParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [domain, setDomain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tokenizationData, setTokenizationData] = useState({
    selectedChain: '',
    tokenStandard: 'ERC-721',
    enableFractionalization: false,
    initialFractions: 100,
    royaltyPercentage: 2.5,
    transferRestrictions: false,
    complianceLevel: 'standard'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')

  const steps = [
    { id: 1, title: 'Domain Verification', description: 'Verify domain ownership' },
    { id: 2, title: 'Blockchain Selection', description: 'Choose target blockchain' },
    { id: 3, title: 'Token Configuration', description: 'Configure token parameters' },
    { id: 4, title: 'Compliance Setup', description: 'Set compliance requirements' },
    { id: 5, title: 'Review & Confirm', description: 'Review and execute tokenization' },
    { id: 6, title: 'Completion', description: 'Tokenization complete' }
  ]

  const supportedChains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', fee: '$25-100', time: '2-5 min' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', fee: '$0.01-1', time: '30 sec' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', fee: '$1-5', time: '1-2 min' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', fee: '$1-5', time: '1-2 min' },
    { id: 'base', name: 'Base', symbol: 'ETH', fee: '$0.1-2', time: '30 sec' }
  ]

  useEffect(() => {
    fetchDomainDetails()
  }, [domainId])

  const fetchDomainDetails = async () => {
    try {
      setLoading(true)
      // Mock domain data - in production, fetch actual domain details
      const mockDomain = {
        id: domainId,
        name: 'crypto.com',
        owner: '0x1234567890abcdef',
        verified: true,
        registrar: 'GoDaddy',
        expiryDate: '2025-12-31',
        dnsVerified: true,
        whoisVerified: true
      }
      setDomain(mockDomain)
    } catch (error) {
      console.error('Error fetching domain details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      trackEvent('tokenization_step', 'Tokenization', `step_${currentStep + 1}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTokenize = async () => {
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/doma/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain.name,
          owner: domain.owner,
          ...tokenizationData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setTransactionHash(data.data.transaction_id)
        setCurrentStep(6)
        trackEvent('domain_tokenized', 'Tokenization', domain.name)
      }
    } catch (error) {
      console.error('Error tokenizing domain:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Tokenize Domain - Domain Forge"
        description="Transform your domain into a blockchain token with our step-by-step tokenization wizard."
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Tokenize Domain</h1>
              <p className="text-muted-foreground mt-2">Transform {domain?.name} into a blockchain asset</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">{steps[currentStep - 1]?.title}</h2>
            <p className="text-muted-foreground">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Domain Verification */}
          {currentStep === 1 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Domain Verification</h3>
                <p className="text-muted-foreground">
                  We need to verify that you own this domain before tokenization
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Domain Name</div>
                      <div className="text-sm text-muted-foreground">{domain?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">DNS Verification</div>
                      <div className="text-sm text-muted-foreground">DNS records verified</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">WHOIS Verification</div>
                      <div className="text-sm text-muted-foreground">Ownership records verified</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-500">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">All verifications passed!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your domain ownership has been successfully verified and is ready for tokenization.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Blockchain Selection */}
          {currentStep === 2 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Choose Blockchain</h3>
                <p className="text-muted-foreground">
                  Select the blockchain where your domain token will be minted
                </p>
              </div>

              <div className="space-y-3">
                {supportedChains.map((chain) => (
                  <div
                    key={chain.id}
                    onClick={() => setTokenizationData({...tokenizationData, selectedChain: chain.id})}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      tokenizationData.selectedChain === chain.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{chain.symbol}</span>
                        </div>
                        <div>
                          <div className="font-medium">{chain.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Fee: {chain.fee} • Time: {chain.time}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>

              {tokenizationData.selectedChain && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">
                    Selected: {supportedChains.find(c => c.id === tokenizationData.selectedChain)?.name}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Token Configuration */}
          {currentStep === 3 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Token Configuration</h3>
                <p className="text-muted-foreground">
                  Configure your domain token parameters
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Token Standard</label>
                  <select
                    value={tokenizationData.tokenStandard}
                    onChange={(e) => setTokenizationData({...tokenizationData, tokenStandard: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ERC-721">ERC-721 (Non-Fungible Token)</option>
                    <option value="ERC-1155">ERC-1155 (Multi-Token)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Enable Fractionalization</div>
                    <div className="text-sm text-muted-foreground">Allow splitting into smaller tradeable units</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tokenizationData.enableFractionalization}
                      onChange={(e) => setTokenizationData({...tokenizationData, enableFractionalization: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {tokenizationData.enableFractionalization && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Initial Fractions</label>
                    <input
                      type="number"
                      value={tokenizationData.initialFractions}
                      onChange={(e) => setTokenizationData({...tokenizationData, initialFractions: parseInt(e.target.value)})}
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="10"
                      max="10000"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Number of fractions to split the domain into (10-10,000)
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Royalty Percentage</label>
                  <input
                    type="number"
                    value={tokenizationData.royaltyPercentage}
                    onChange={(e) => setTokenizationData({...tokenizationData, royaltyPercentage: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Percentage of future sales you'll receive (0-10%)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Compliance Setup */}
          {currentStep === 4 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="p-4 bg-primary/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Compliance Setup</h3>
                <p className="text-muted-foreground">
                  Configure compliance and regulatory requirements
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Compliance Level</label>
                  <select
                    value={tokenizationData.complianceLevel}
                    onChange={(e) => setTokenizationData({...tokenizationData, complianceLevel: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="standard">Standard (Basic KYC)</option>
                    <option value="enhanced">Enhanced (Full KYC/AML)</option>
                    <option value="institutional">Institutional (Accredited Investors Only)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Transfer Restrictions</div>
                    <div className="text-sm text-muted-foreground">Require approval for token transfers</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tokenizationData.transferRestrictions}
                      onChange={(e) => setTokenizationData({...tokenizationData, transferRestrictions: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Important Notice</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tokenized domains remain subject to ICANN policies and domain dispute resolution procedures.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {currentStep === 5 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">Review & Confirm</h3>
                <p className="text-muted-foreground">
                  Please review your tokenization settings before proceeding
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="font-medium">Domain</span>
                  <span>{domain?.name}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="font-medium">Blockchain</span>
                  <span>{supportedChains.find(c => c.id === tokenizationData.selectedChain)?.name}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="font-medium">Token Standard</span>
                  <span>{tokenizationData.tokenStandard}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="font-medium">Fractionalization</span>
                  <span>{tokenizationData.enableFractionalization ? `${tokenizationData.initialFractions} fractions` : 'Disabled'}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="font-medium">Royalty</span>
                  <span>{tokenizationData.royaltyPercentage}%</span>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium">Compliance Level</span>
                  <span className="capitalize">{tokenizationData.complianceLevel}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="text-sm text-primary font-medium mb-2">Estimated Costs</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Gas Fee:</span>
                    <span>{supportedChains.find(c => c.id === tokenizationData.selectedChain)?.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>$10</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-primary/20 pt-1 mt-2">
                    <span>Total:</span>
                    <span>~$20-110</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Completion */}
          {currentStep === 6 && (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="p-4 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              
              <h3 className="text-lg font-bold mb-2">Tokenization Complete!</h3>
              <p className="text-muted-foreground mb-6">
                Your domain has been successfully tokenized on the blockchain
              </p>

              {transactionHash && (
                <div className="p-4 bg-accent rounded-lg mb-6">
                  <div className="text-sm font-medium mb-2">Transaction Hash</div>
                  <div className="font-mono text-xs break-all">{transactionHash}</div>
                </div>
              )}

              <div className="space-y-3">
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  View Token Details
                </button>
                <button className="w-full border border-border py-3 rounded-lg font-medium hover:bg-accent transition-colors">
                  Return to Portfolio
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {currentStep < 6 && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentStep === 5 ? (
                <button
                  onClick={handleTokenize}
                  disabled={isProcessing}
                  className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Tokenize Domain</span>
                      <Zap className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 2 && !tokenizationData.selectedChain) ||
                    (currentStep === 3 && !tokenizationData.tokenStandard)
                  }
                  className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

