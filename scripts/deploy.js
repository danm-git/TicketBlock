const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // ETH TOKEN
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  console.log("ETH Token deployed to:", token.address);

  // DAN TOKEN
  const DanToken = await hre.ethers.getContractFactory("DanToken");
  const danToken = await DanToken.deploy("DanToken", "DAN");
  console.log("DanToken deployed to:", danToken.address);

  // NFTICKET
  const NFTicket = await hre.ethers.getContractFactory("NFTicket");
  const nfTicket = await NFTicket.deploy();
  console.log("NFTicket deployed to address:", nfTicket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
