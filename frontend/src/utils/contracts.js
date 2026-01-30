import { ethers } from "ethers";

/**
 * Vite-safe environment variables
 */
const RPC_URL =
  import.meta.env.VITE_RPC_URL ||
  "https://sepolia.infura.io/v3/1699da5a063f49af9734cbca14ce8645";

export const TOKEN_ADDRESS =
  import.meta.env.VITE_TOKEN_ADDRESS ||
  "0x1C8Fa14a5F4439E2E25e5eD0794178f0a883CC1a";

export const FAUCET_ADDRESS =
  import.meta.env.VITE_FAUCET_ADDRESS ||
  "0xa22899c9261eB4b49877Fa3513A069D44494912f";

/**
 * ABIs
 */
export const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

export const FAUCET_ABI = [
  "function requestTokens()",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)",
  "function isPaused() view returns (bool)",
  "function lastClaimAt(address) view returns (uint256)",
  "function totalClaimed(address) view returns (uint256)",
];

/**
 * Provider helper — ETHERS v6
 * Always returns a provider, fallback to RPC if no wallet
 */
function getProvider() {
  // MetaMask / injected wallet
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      return new ethers.BrowserProvider(window.ethereum);
    } catch (err) {
      console.warn("Failed to create BrowserProvider:", err);
    }
  }

  // Fallback RPC provider (read-only)
  if (!RPC_URL) {
    throw new Error("No RPC available. Set VITE_RPC_URL.");
  }

  return new ethers.JsonRpcProvider(RPC_URL);
}

/**
 * Wallet connection (EIP-1193)
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found (window.ethereum)");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned from wallet");
    }

    return accounts[0];
  } catch (err) {
    throw new Error("connectWallet failed: " + (err?.message || err));
  }
}

/**
 * Request tokens from faucet
 */
export async function requestTokens() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found (window.ethereum)");
  }

  try {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const faucet = new ethers.Contract(
      FAUCET_ADDRESS,
      FAUCET_ABI,
      signer
    );

    const tx = await faucet.requestTokens();
    const receipt = await tx.wait();

    return receipt.hash;
  } catch (err) {
    const reason = err?.reason || err?.data?.message || err?.message || String(err);
    throw new Error(
      "requestTokens failed: " + reason
    );
  }
}

/**
 * Token balance
 */
export async function getBalance(address) {
  try {
    const provider = getProvider();
    const token = new ethers.Contract(
      TOKEN_ADDRESS,
      TOKEN_ABI,
      provider
    );

    const bal = await token.balanceOf(address);
    return bal.toString();
  } catch (err) {
    throw new Error(
      "getBalance failed: " + (err?.message || err)
    );
  }
}

/**
 * Faucet eligibility
 */
export async function canClaim(address) {
  try {
    const provider = getProvider();
    const faucet = new ethers.Contract(
      FAUCET_ADDRESS,
      FAUCET_ABI,
      provider
    );

    return Boolean(await faucet.canClaim(address));
  } catch (err) {
    throw new Error(
      "canClaim failed: " + (err?.message || err)
    );
  }
}

/**
 * Remaining lifetime allowance
 */
export async function getRemainingAllowance(address) {
  try {
    const provider = getProvider();
    const faucet = new ethers.Contract(
      FAUCET_ADDRESS,
      FAUCET_ABI,
      provider
    );

    const remaining = await faucet.remainingAllowance(address);
    return remaining.toString();
  } catch (err) {
    throw new Error(
      "getRemainingAllowance failed: " +
        (err?.message || err)
    );
  }
}

/**
 * Evaluation helper (CRITICAL)
 */
export async function getContractAddresses() {
  return {
    token: TOKEN_ADDRESS,
    faucet: FAUCET_ADDRESS,
  };
}

export default {
  connectWallet,
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses,
};
