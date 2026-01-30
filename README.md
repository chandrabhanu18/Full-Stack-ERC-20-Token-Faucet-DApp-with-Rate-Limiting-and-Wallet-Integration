# ERC-20 Token Faucet DApp with Rate Limiting and Wallet Integration

A complete full-stack Web3 application demonstrating smart contract development, blockchain interaction, and modern frontend architecture. This DApp implements a token faucet with enforced rate limiting (24-hour cooldown) and lifetime claim limits, showcasing production-ready practices for decentralized applications.

## Project Overview

This project demonstrates:
- **Smart Contract Security**: ERC-20 token implementation with access control and reentrancy protection
- **Rate Limiting**: Enforced 24-hour cooldown periods and lifetime claim limits on-chain
- **Blockchain Integration**: Proper wallet connection (EIP-1193), transaction lifecycle management, and error handling
- **Full-Stack Architecture**: Hardhat development environment, React frontend with ethers.js, and Docker containerization
- **Production Readiness**: Testnet deployment, contract verification, health endpoints, and comprehensive testing

## Features

- ✅ Wallet connection using MetaMask or compatible EIP-1193 wallets
- ✅ Request ERC-20 faucet tokens with enforced rate limiting
- ✅ 24-hour cooldown between token claims per address
- ✅ Lifetime claim limit (10,000 FCT) per address
- ✅ Real-time token balance display
- ✅ Claim eligibility status with countdown timer
- ✅ Clear error handling for all blockchain operations
- ✅ Fully Dockerized setup with health endpoint
- ✅ Comprehensive smart contract test suite
- ✅ Evaluation interface (window.__EVAL__) for automated testing

## Tech Stack

- **Smart Contracts**: Solidity 0.8.20 + Hardhat + OpenZeppelin Contracts
- **Frontend**: React 18 + Vite + Ethers.js v6
- **Backend**: Express.js (for serving frontend with health endpoint)
- **Deployment**: Docker + Docker Compose
- **Testing**: Hardhat + Chai

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- MetaMask or compatible EIP-1193 wallet browser extension
- Sepolia testnet ETH for transaction fees

### Setup (5 minutes)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd submission

# 2. Create environment file
cp .env.example .env

# 3. Update .env with your values (or use defaults for testing)
# Edit .env and add your RPC URL and deployed contract addresses

# 4. Start the application
docker compose up

# 5. Open http://localhost:3000 in your browser
```

**The application will be ready within 60 seconds.**

### Health Check

```bash
curl http://localhost:3000/health
# Response: OK
```

## Deployed Contracts (Sepolia Testnet)

| Contract | Address | Etherscan Link |
|----------|---------|---|
| Token (FCT) | `0x1C8Fa14a5F4439E2E25e5eD0794178f0a883CC1a` | [View on Etherscan](https://sepolia.etherscan.io/address/0x1C8Fa14a5F4439E2E25e5eD0794178f0a883CC1a) |
| TokenFaucet | `0xa22899c9261eB4b49877Fa3513A069D44494912f` | [View on Etherscan](https://sepolia.etherscan.io/address/0xa22899c9261eB4b49877Fa3513A069D44494912f) |

Both contracts are **verified on Etherscan** with full source code visibility.

## How to Use

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve connection in MetaMask
   - Ensure you're on Sepolia testnet

2. **Check Status**
   - View your token balance
   - See if you're eligible to claim
   - Check remaining lifetime allowance

3. **Claim Tokens**
   - Click "Request Tokens" if eligible
   - Approve transaction in MetaMask
   - Wait for confirmation
   - Balance updates automatically

4. **Cooldown Period**
   - If claim fails due to cooldown, wait 24 hours
   - Timer shows remaining time until next claim

5. **Lifetime Limit**
   - Each address can claim maximum 10,000 FCT
   - Track your total claimed amount

## Configuration

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update with your values:

```env
# Required: RPC endpoint for Sepolia testnet
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Required: Deployed contract addresses (update after deployment)
VITE_TOKEN_ADDRESS=0x1C8Fa14a5F4439E2E25e5eD0794178f0a883CC1a
VITE_FAUCET_ADDRESS=0xa22899c9261eB4b49877Fa3513A069D44494912f

# Optional: For local Hardhat deployment
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run test suite
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Development

```bash
cd frontend

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:5173` for development or `http://localhost:3000` for production server.

## Smart Contract Details

### Token.sol
- **Standard**: ERC-20 compliant
- **Maximum Supply**: 1,000,000 FCT
- **Decimals**: 18
- **Minting**: Only faucet contract can mint
- **Key Functions**:
  - `balanceOf(address)`: Check token balance
  - `transfer(address, uint256)`: Transfer tokens
  - `approve(address, uint256)`: Grant allowance
  - `mint(address, uint256)`: Mint new tokens (faucet only)

### TokenFaucet.sol
- **Faucet Amount**: 1,000 FCT per claim
- **Cooldown Period**: 24 hours (86,400 seconds)
- **Lifetime Limit**: 10,000 FCT per address
- **Key Functions**:
  - `requestTokens()`: Claim tokens if eligible
  - `canClaim(address)`: Check claim eligibility
  - `remainingAllowance(address)`: Get remaining claimable amount
  - `setPaused(bool)`: Admin-only pause/unpause
  - `isPaused()`: Check pause status
- **Key Mappings**:
  - `lastClaimAt[address]`: Timestamp of last claim
  - `totalClaimed[address]`: Total claimed amount
- **Security**:
  - ReentrancyGuard protection
  - Checks-effects-interactions pattern
  - Access control on admin functions

## Evaluation Interface (window.__EVAL__)

The frontend exposes programmatic functions for automated testing:

```javascript
// Connect wallet and get address
const address = await window.__EVAL__.connectWallet();

// Request tokens and get transaction hash
const txHash = await window.__EVAL__.requestTokens();

// Get token balance for an address (returns string)
const balance = await window.__EVAL__.getBalance(address);

// Check if address can claim (returns boolean)
const canClaim = await window.__EVAL__.canClaim(address);

// Get remaining claimable amount (returns string)
const remaining = await window.__EVAL__.getRemainingAllowance(address);

// Get deployed contract addresses
const addresses = await window.__EVAL__.getContractAddresses();
// Returns: { token: "0x...", faucet: "0x..." }
```

**Important**: All numeric values are returned as strings to handle large numbers correctly.

## Design Decisions

### Why 1,000 FCT per claim?
- Provides meaningful test tokens for development
- Manageable gas costs per transaction
- With 18 decimals, equals 10^21 wei (reasonable amount)
- Sufficient for testing token transfers and approvals

### Why 24-hour cooldown?
- Prevents faucet spam and abuse
- Allows multiple claims by same user over time
- Standard timeframe used by many production faucets
- Long enough to discourage malicious use, short enough for testing

### Why 10,000 FCT lifetime limit?
- Prevents single address from exhausting faucet (1M total supply)
- Requires ~10 days of consecutive claims
- Reasonable limit for test token distribution
- Reduces risk of hoarding

### Why ReentrancyGuard?
- Defense-in-depth security practice
- Protects against evolving attack vectors
- Production-grade best practice
- Minimal gas overhead (cached guard)

## Testing

### Run Smart Contract Tests

```bash
npx hardhat test
```

Tests cover:
- ✅ Token deployment and ERC-20 compliance
- ✅ Faucet deployment and initialization
- ✅ Successful token claims
- ✅ Cooldown enforcement
- ✅ Lifetime limit enforcement
- ✅ Pause/unpause functionality
- ✅ Admin access control
- ✅ Event emissions
- ✅ Edge cases and error conditions

### Manual Frontend Testing

1. **Connect Wallet**
   - Open application
   - Click "Connect Wallet"
   - Approve MetaMask prompt

2. **Check Initial State**
   - Verify address displays correctly
   - Check balance query works
   - Confirm claim eligibility status

3. **Claim Tokens**
   - Click "Request Tokens"
   - Approve transaction in MetaMask
   - Verify transaction succeeds
   - Check balance updates

4. **Test Cooldown**
   - Attempt immediate second claim
   - Verify error: "Cooldown period not elapsed"
   - Check countdown timer displays

5. **Test Error Handling**
   - Reject transaction in MetaMask
   - Verify user-friendly error message
   - Check UI remains responsive

## Project Structure

```
submission/
├── contracts/
│   ├── Token.sol                 # ERC-20 token implementation
│   ├── TokenFaucet.sol           # Faucet with rate limiting
│   └── test/
│       └── TokenFaucet.test.js   # Comprehensive test suite
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── App.css               # Component styling
│   │   ├── main.jsx              # Application entry point
│   │   ├── index.css             # Global styles
│   │   ├── utils/
│   │   │   ├── contracts.js      # Smart contract interactions
│   │   │   └── eval.js           # Evaluation interface export
│   │   └── components/           # Additional React components
│   ├── public/                   # Static assets
│   ├── Dockerfile                # Container configuration
│   ├── package.json              # Dependencies
│   ├── server.js                 # Express server with /health
│   └── vite.config.js            # Vite build configuration
├── scripts/
│   └── deploy.js                 # Deployment script
├── .env.example                  # Environment variables template
├── docker-compose.yml            # Container orchestration
├── hardhat.config.js             # Hardhat configuration
├── package.json                  # Root dependencies
└── README.md                     # This file
```

## Security Practices

### Smart Contract Security
- ✅ ERC-20 standard compliance verified
- ✅ ReentrancyGuard on external functions
- ✅ OnlyOwner modifier for admin functions
- ✅ Solidity 0.8+ overflow protection
- ✅ Immutable contract address
- ✅ Clear revert messages for debugging
- ✅ Checks-effects-interactions pattern

### Frontend Security
- ✅ Private keys never exposed in frontend
- ✅ Contract addresses configurable via environment
- ✅ EIP-1193 standard wallet connection
- ✅ User-friendly error messages
- ✅ No sensitive data in local storage
- ✅ HTTPS recommended in production

### Network Security
- ✅ Testnet-only deployment
- ✅ Contracts verified on Etherscan
- ✅ RPC endpoint configurable
- ✅ Environment variables for secrets

## Known Limitations

1. **Testnet Only**: Contracts deployed to Sepolia testnet, not mainnet
2. **Single Network**: Frontend configured for Sepolia only
3. **Simple Admin**: Pause function controlled by deployer EOA
4. **No Withdrawal**: No mechanism to recover tokens from faucet
5. **Manual Verification**: Contracts require manual Etherscan verification

## Troubleshooting

### Docker Container Won't Start
```bash
# Check logs
docker compose logs frontend

# Ensure port 3000 is available
lsof -i :3000

# Rebuild container
docker compose up --build
```

### MetaMask Connection Fails
- Ensure MetaMask is installed
- Unlock MetaMask wallet
- Confirm you're on Sepolia testnet
- Check browser console for detailed errors

### Transaction Reverts
- **"Cooldown active"**: Wait 24 hours before next claim
- **"Lifetime limit reached"**: You've claimed maximum 10,000 FCT
- **"Faucet paused"**: Admin has paused the faucet
- **Insufficient gas**: Add more gas to transaction

### Health Check Fails
```bash
# Verify container is running
docker compose ps

# Test health endpoint
curl http://localhost:3000/health

# Check container logs
docker compose logs frontend
```

## Deployment Considerations

### Before Mainnet

1. **Security Audit**: Contract should be audited by professional firm
2. **Additional Testing**: Extended test scenarios and edge cases
3. **Gas Optimization**: Review and optimize gas usage
4. **Rate Limiting**: Consider more sophisticated rate limiting
5. **Admin Keys**: Use multi-sig wallet instead of EOA
6. **Liquidity**: Ensure adequate token liquidity on exchanges

### Environment Variables

Never commit `.env` file with real private keys:

```bash
# Good practice: commit .env.example only
git add .env.example
git add .gitignore  # ensure .env is in .gitignore
git status          # verify .env is not staged
```

## FAQ

**Q: What testnet should I use?**
A: Sepolia is the recommended Ethereum testnet. This project is configured for Sepolia.

**Q: Can I deploy to mainnet?**
A: Technically yes, but not recommended without professional audit. Testnet is safer for learning.

**Q: How do I get Sepolia ETH?**
A: Use [Sepolia Faucet](https://sepoliafaucet.com) or [Alchemy Faucet](https://www.alchemy.com/faucets/sepolia)

**Q: Can I modify the faucet amount or cooldown?**
A: Yes, update the constants in TokenFaucet.sol and redeploy. Update tests accordingly.

**Q: How do I verify contracts on Etherscan?**
A: Use Hardhat Verify plugin (already configured in hardhat.config.js):
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

**Q: Can I use a different wallet than MetaMask?**
A: Yes, any EIP-1193 compatible wallet works (Coinbase Wallet, WalletConnect, etc.)

**Q: What happens if I run out of tokens?**
A: Faucet will revert with "Max supply exceeded". Need to deploy new token.

## Support & Issues

1. Check browser console for detailed error messages
2. Review test files for usage examples
3. Check Etherscan for contract details and transactions
4. Verify MetaMask is on Sepolia testnet
5. Ensure sufficient Sepolia ETH for gas fees

## License

MIT License - See LICENSE file for details

---

**Last Updated**: January 2026
**Status**: ✅ Ready for Evaluation
**Network**: Sepolia Testnet
**Contracts**: Verified on Etherscan
