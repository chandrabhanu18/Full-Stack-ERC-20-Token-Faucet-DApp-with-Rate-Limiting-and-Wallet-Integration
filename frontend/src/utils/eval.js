import {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  isPaused,
  getContractAddresses,
} from './contracts'

window.__EVAL__ = {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  isPaused,
  getContractAddresses,
}

export { connectWallet, requestTokens, getBalance, canClaim, getRemainingAllowance, isPaused, getContractAddresses }
