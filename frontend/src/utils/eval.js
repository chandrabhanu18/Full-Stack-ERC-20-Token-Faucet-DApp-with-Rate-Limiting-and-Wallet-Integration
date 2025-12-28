import {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses,
} from './contracts'

window.__EVAL__ = {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses,
}

export { connectWallet, requestTokens, getBalance, canClaim, getRemainingAllowance, getContractAddresses }
