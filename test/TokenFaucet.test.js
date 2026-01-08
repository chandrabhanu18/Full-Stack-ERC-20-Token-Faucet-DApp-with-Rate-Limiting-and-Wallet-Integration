const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Faucet", function () {
  let token, faucet, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(
      "Faucet Token",
      "FCT",
      ethers.parseEther("1000000")
    );

    const Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy(await token.getAddress());

    await token.setMinter(await faucet.getAddress());
  });

  it("allows token claim", async function () {
    await faucet.connect(user).requestTokens();
    const balance = await token.balanceOf(user.address);
    expect(balance).to.be.gt(0);
  });

  it("blocks claim during cooldown", async function () {
    await faucet.connect(user).requestTokens();
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Faucet: cooldown active");
  });

  it("admin can pause faucet", async function () {
    await faucet.setPaused(true);
    await expect(
      faucet.connect(user).requestTokens()
    ).to.be.revertedWith("Faucet: paused");
  });
});
