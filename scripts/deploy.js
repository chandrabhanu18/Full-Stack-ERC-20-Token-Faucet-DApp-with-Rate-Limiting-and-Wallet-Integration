const { ethers } = require("hardhat");

async function main() {
  // 1. Get deployer signer (CORRECT)
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // 2. Deploy Token
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(
    "Faucet Token",
    "FCT",
    ethers.parseEther("1000000")
  );
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // 3. Deploy Faucet
  const TokenFaucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await TokenFaucet.deploy(tokenAddress);
  await faucet.waitForDeployment();

  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // 4. Set faucet as minter
  const tx = await token.setMinter(faucetAddress);
  await tx.wait();

  console.log("Faucet set as token minter");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
