import { ethers } from 'ethers'

export const TOKEN_ADDRESS = process.env.VITE_TOKEN_ADDRESS || "0x472E5b6BD51870843F4b6bf9eeb551C523eB3590";
export const FAUCET_ADDRESS = process.env.VITE_FAUCET_ADDRESS || "0x48C665980a9130b3F6bF70C1D2eBdfF12BbE0780";

export const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

export const FAUCET_ABI = [
  "function requestTokens() external",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)",
  "function isPaused() view returns (bool)",
  "function lastClaimAt(address) view returns (uint256)",
  "function totalClaimed(address) view returns (uint256)",
];

function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum)
  }
  const rpc = process.env.VITE_RPC_URL || import.meta.env.VITE_RPC_URL
  if (!rpc) throw new Error('No RPC available: set VITE_RPC_URL or use a wallet')
  return new ethers.providers.JsonRpcProvider(rpc)
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error("No injected wallet found (window.ethereum)");
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (!accounts || accounts.length === 0) throw new Error("No accounts returned from wallet");
    return accounts[0];
  } catch (err) {
    throw new Error("Wallet connection failed: " + (err.message || err));
  }
}

export async function requestTokens() {
  if (!window.ethereum) throw new Error("No injected wallet found (window.ethereum)");
  try {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);
    const tx = await faucet.requestTokens();
    const receipt = await tx.wait();
    return receipt.transactionHash || tx.hash || "";
  } catch (err) {
    const msg = err?.reason || err?.message || String(err);
    throw new Error("requestTokens failed: " + msg);
  }
}

export async function getBalance(address) {
  try {
    const provider = getProvider();
    const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
    const bal = await token.balanceOf(address);
    return bal.toString();
  } catch (err) {
    throw new Error("getBalance failed: " + (err.message || err));
  }
}

export async function canClaim(address) {
  try {
    const provider = getProvider();
    const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, provider);
    const ok = await faucet.canClaim(address);
    return Boolean(ok);
  } catch (err) {
    throw new Error("canClaim failed: " + (err.message || err));
  }
}

export async function getRemainingAllowance(address) {
  try {
    const provider = getProvider();
    const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, provider);
    const rem = await faucet.remainingAllowance(address);
    return rem.toString();
  } catch (err) {
    throw new Error("getRemainingAllowance failed: " + (err.message || err));
  }
}

export async function getContractAddresses() {
  return { token: TOKEN_ADDRESS, faucet: FAUCET_ADDRESS };
}

export default {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses,
};
