const { expect } = require("chai");
const { ethers } = require("hardhat");
const ethersLib = require('ethers');

describe("Token + Faucet", function () {
  let Token, token, Faucet, faucet;
  let owner, user1, user2;

  const NAME = "FaucetToken";
  const SYMBOL = "FTK";

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    Token = await ethers.getContractFactory("Token");
    const MAX_SUPPLY = "1000000000000000000000000"; // 1,000,000 * 1e18
    // Deploy token and determine its address robustly
    token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY);
    const tokenAddress = token.address || token.target || (token.deployTransaction && token.deployTransaction.contractAddress) || null;
    // Fallback: if still null, try reading from receipt
    if (!tokenAddress && token.deployTransaction) {
      const receipt = await token.deployTransaction.wait();
      // receipt.contractAddress may exist
      tokenAddress = receipt.contractAddress || receipt.to || null;
    }

    if (!tokenAddress) throw new Error('Could not determine token address after deploy');

    Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy(tokenAddress);
    const faucetAddress = faucet.address || faucet.target || (faucet.deployTransaction && faucet.deployTransaction.contractAddress) || null;
    if (!faucetAddress) {
      const fRec = await faucet.deployTransaction.wait();
      if (fRec && fRec.contractAddress) {
        // set faucetAddress
      }
    }

    // Ensure we have usable contract instances via getContractAt
    const tokenContract = await ethers.getContractAt('Token', tokenAddress);
    const faucetAddressFinal = faucet.address || faucet.target || (faucet.deployTransaction && faucet.deployTransaction.contractAddress);
    // Grant faucet minter role using stable contract instance
    await tokenContract.connect(owner).setMinter(faucetAddressFinal);
    console.log('faucet instance address:', faucet.address)

    // (moved above to use getContractAt)
  });

  it("allows a user to claim tokens successfully", async function () {
    const tx = await faucet.connect(user1).requestTokens();
    await tx.wait();

    const balance = await ethers.provider.getBalance(user1.address).catch(()=>undefined);
    const tokenBal = await token.balanceOf(user1.address);
    expect(tokenBal).to.equal("1000000000000000000000");
  });

  it("enforces cooldown between claims", async function () {
    await faucet.connect(user1).requestTokens();
    await expect(faucet.connect(user1).requestTokens()).to.be.revertedWith("Faucet: cooldown active");

    // increase time by 24 hours
    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await expect(faucet.connect(user1).requestTokens()).to.not.be.reverted;
  });

  it("enforces lifetime limit", async function () {
    // Each claim is 1000, lifetime limit 10000 -> 10 claims allowed
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
      await ethers.provider.send("evm_mine");
      await faucet.connect(user1).requestTokens();
    }

    // advance time so cooldown is satisfied for the next claim
    await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    // Debug: show timestamps and lastClaimAt
    const block = await ethers.provider.getBlock('latest');
    const last = await faucet.lastClaimAt(user1.address);
    console.log('block timestamp:', block.timestamp.toString(), 'lastClaimAt:', last.toString());

    // 11th claim should fail due to lifetime limit
    await expect(faucet.connect(user1).requestTokens()).to.be.revertedWith("Faucet: lifetime limit reached");
  });

  it("only owner can pause/unpause", async function () {
    await expect(faucet.connect(user1).setPaused(true)).to.be.reverted;
    await faucet.connect(owner).setPaused(true);
    expect(await faucet.isPaused()).to.equal(true);
    await expect(faucet.connect(user1).requestTokens()).to.be.revertedWith("Faucet: paused");
  });

  it("emits TokensClaimed and FaucetPaused events", async function () {
    await expect(faucet.connect(owner).setPaused(true)).to.emit(faucet, "FaucetPaused").withArgs(true);
    await faucet.connect(owner).setPaused(false);
    await expect(faucet.connect(user2).requestTokens()).to.emit(faucet, "TokensClaimed");
  });
});
