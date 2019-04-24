const LendingPool = artifacts.require("LendingPool");
const MockOracle = artifacts.require("MockOracle");
const PriceOracleLibrary = artifacts.require("PriceOracleLibrary");

module.exports = async function(deployer) {
  await deployer;
  
  const mockOracleInstance = await MockOracle.deployed();
  
  await deployer.deploy(PriceOracleLibrary);
  await PriceOracleLibrary.deployed();

  await deployer.link(PriceOracleLibrary, [LendingPool]);

  await deployer.deploy(LendingPool, mockOracleInstance.address);
};