const LendingPool = artifacts.require("LendingPool");
const MockOracle = artifacts.require("MockOracle");

module.exports = async function(deployer) {
  await deployer;
  const mockOracleInstance = await MockOracle.deployed();
  await deployer.deploy(LendingPool, mockOracleInstance.address);
};