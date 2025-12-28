Faucet DApp — Submission
--------------------------
-Project: ERC20 Faucet DApp with rate limits, tests, frontend, Docker.
-Location: repository root.

Getting started
------------------
- Install dependencies (project root):

RUn these commands in bash
npm install
npm run build --prefix frontend


Run tests

bash commands
npx hardhat test


Run Dockerized frontend

1. Copy `.env.example` to `.env` and fill values (RPC URL, deployed addresses).
2. Start services:

bash command
docker compose up --build -d


3. Check health: `http://localhost:3002/health` (or mapped host port in `docker-compose.yml`).

Deploy to Sepolia (optional)

- Provide `VITE_RPC_URL` and a deployer private key in environment and run the deploy script in `scripts/deploy.js` (requires Hardhat configuration and network setup). Do NOT commit private keys.

What I updated for submission
- Consolidated `frontend/Dockerfile` (curl installed for healthchecks).
- `docker-compose.yml` port remapped for local testing; remove or change as needed.
- Added this `README.md` and `.env.example` is present.

Remaining manual steps (you must do)
- Provide Sepolia RPC and private key for on-chain deployment and verification.
- Add screenshots or a short demo video and link them in `SUBMISSION.md`.

If you want, I can now: (A) populate `.env` with your provided values, (B) run Sepolia deploy if you supply RPC + private key, or (C) add screenshots and a short `SUBMISSION.md` template. Reply with which.
Token Faucet DApp
--------------------
This repository contains a complete decentralized application (DApp) implementing an ERC-20 token and a rate-limited faucet with a React frontend and Docker deployment.

Quick Start
-----------
1. Install deps for contracts:

bash commands

cd contracts
npm install
npx hardhat test


2. Build and run frontend with Docker:

bash commands

cp .env.example .env
docker compose up --build


Frontend will be available at http://localhost:3002 and health endpoint at /health

Notes
- Contracts are in `contracts/Token.sol` and `contracts/TokenFaucet.sol`.
- Tests are in `contracts/test/TokenFaucet.test.js` and can be run with `npx hardhat test`.
- Deployment script `scripts/deploy.js` writes `deployments.json` when run via Hardhat.
- Frontend exposes the evaluation interface on `window.__EVAL__` with the required functions.
Web3 Token Faucet (Sepolia)
----------------------------
This project is a simple Web3 ERC-20 token faucet deployed on the Sepolia testnet.  
Users can connect their wallet and request test tokens with protection against abuse.

The application includes smart contracts, a React frontend, and runs fully using Docker.



these are the Features
----------------------
- Wallet connection using MetaMask  
- Request ERC-20 faucet tokens  
- Cooldown between token claims  
- Lifetime claim limit per wallet  
- Token balance display  
- Clear error handling  
- Fully Dockerized setup with health check  


Tech Stack
------------

- Solidity + Hardhat  
- OpenZeppelin Contracts  
- React (Vite) + Ethers.js  
- Docker & Docker Compose  


Deployed Contracts (Sepolia)
----------------------------

FaucetToken:
-----------  
  `0x472E5b6BD51870843F4b6bf9eeb551C523eB3590`

TokenFaucet:
-----------  
  `0x48C665980a9130b3F6bF70C1D2eBdfF12BbE0780`

Contracts are verified using Sourcify.

Run with Docker
----------------
Build and start the app
-----------------------

run this in git bash: 
docker compose up --build


Open the app
-------------
http://localhost:3002


Health check
------------
http://localhost:3002/health


Expected response:
-----------------
OK



How to Use
------------
1. Install MetaMask  
2. Switch to Sepolia testnet  
3. Connect wallet  
4. Click Request Tokens button

If a transaction fails, it may be due to cooldown or lifetime limits. This is expected behavior.



Project Status
--------------
- Contracts deployed and tested  
- Frontend connected to blockchain  
- Docker setup completed  
- Ready for final submission  

