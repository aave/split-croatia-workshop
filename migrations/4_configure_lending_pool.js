const LendingPool = artifacts.require("LendingPool");
const MockDAI = artifacts.require("MockDAI");
const MockLEND = artifacts.require("MockLEND");

module.exports = async function(deployer) {
  await deployer;
  
  const lendingPoolInstance = await LendingPool.deployed();
  
  const mockDAIInstance = await MockDAI.deployed();
  const mockLENDInstance = await MockLEND.deployed();
  
  console.log("Lending pool address: ", lendingPoolInstance.address, "DAI Address: ", mockDAIInstance.address, "LEND address: ", mockLENDInstance.address);

  console.log("Adding DAI market...");

  await lendingPoolInstance.addMarket(mockDAIInstance.address, 15);

  console.log("Adding LEND market...");
  
  await lendingPoolInstance.addMarket(mockLENDInstance.address, 5);

};