import React, { useEffect, useState } from 'react'
import './App.css'
import { connectWallet, getBalance, canClaim, getRemainingAllowance, requestTokens } from './utils/eval'

export default function App() {
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState('0')
  const [eligible, setEligible] = useState(false)
  const [remaining, setRemaining] = useState('0')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    // noop
  }, [])

  function clearMessage(after = 4000) {
    if (!after) return
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, after)
  }

  async function handleConnect() {
    try {
      const addr = await connectWallet()
      setAddress(addr)
      const bal = await getBalance(addr)
      setBalance(bal)
      setEligible(await canClaim(addr))
      setRemaining(await getRemainingAllowance(addr))
    } catch (err) {
      setMessage(err.message || String(err))
      setMessageType('error')
      clearMessage(6000)
    }
  }

  async function handleRequest() {
    if (!address) {
      setMessage('Connect your wallet first')
      setMessageType('error')
      clearMessage()
      return
    }

    // Re-check eligibility
    const isEligible = await canClaim(address)
    setEligible(isEligible)
    if (!isEligible) {
      const rem = await getRemainingAllowance(address)
      setRemaining(rem)
      setMessage(`Cannot claim yet. Try again in ${rem}`)
      setMessageType('error')
      clearMessage()
      return
    }

    setLoading(true)
    try {
      const txHash = await requestTokens()
      setMessage('Tokens requested — tx: ' + txHash)
      setMessageType('success')
      // refresh balance and eligibility
      const bal = await getBalance(address)
      setBalance(bal)
      setEligible(await canClaim(address))
      setRemaining(await getRemainingAllowance(address))
    } catch (err) {
      setMessage(err.message || String(err))
      setMessageType('error')
    }
    setLoading(false)
    clearMessage()
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Token Faucet</h1>

        {message && (
          <div className={`banner ${messageType === 'error' ? 'error' : 'success'}`}>{message}</div>
        )}

        <div style={{ marginBottom: 12 }}>
          <button onClick={handleConnect}>{address ? 'Connected: ' + address.slice(0, 8) + '...' : 'Connect Wallet'}</button>
        </div>

        {address && (
          <div>
            <p><strong>Token balance:</strong> {balance}</p>
            <p><strong>Eligible to claim:</strong> {String(eligible)}</p>
            <p><strong>Remaining allowance:</strong> {remaining}</p>
            <div style={{ marginTop: 10 }}>
              <button className="request" onClick={handleRequest} disabled={!eligible || loading}>{loading ? 'Processing...' : 'Request Tokens'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

