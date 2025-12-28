const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const Token = await ethers.getContractFactory('Token');
  const MAX_SUPPLY = ethers.utils.parseUnits('1000000', 18);
  const token = await Token.deploy('FaucetToken', 'FTK', MAX_SUPPLY);
  await token.deployed();
  console.log('Token deployed to:', token.address);

  const Faucet = await ethers.getContractFactory('TokenFaucet');
  const faucet = await Faucet.deploy(token.address);
  await faucet.deployed();
  console.log('Faucet deployed to:', faucet.address);

  // grant minter
  const tx = await token.setMinter(faucet.address);
  await tx.wait();

  const deployments = {
    token: token.address,
    faucet: faucet.address,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
  };

  fs.writeFileSync('deployments.json', JSON.stringify(deployments, null, 2));
  console.log('Wrote deployments.json');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
