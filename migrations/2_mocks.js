const MockOracle = artifacts.require("MockOracle");
const MockDAI = artifacts.require("MockDAI");
const MockLEND = artifacts.require("MockLEND");

module.exports = async function(deployer, network, accounts) {
  await deployer;
  let instanceMockDAI;
  if (!process.env.MOCK_DAI_ADDRESS_KOVAN || network === "development") {
    await deployer.deploy(MockDAI);
    instanceMockDAI = await MockDAI.deployed();

    await instanceMockDAI.mint(accounts[0],"1000000000000000000000000000");

  } else {
    instanceMockDAI = await MockDAI.at(process.env.MOCK_DAI_ADDRESS_KOVAN)
  }

  let instanceMockLEND;
  if (!process.env.MOCK_DAI_ADDRESS_KOVAN || network === "development") {
    await deployer.deploy(MockLEND);
    instanceMockLEND = await MockLEND.deployed();

    await instanceMockLEND.mint(accounts[0],"1000000000000000000000000000");

  } else {
    instanceMockLEND = await MockLEND.at(process.env.MOCK_LEND_ADDRESS_KOVAN)
  }

  await deployer.deploy(MockOracle);
  const instanceMockOracle = await MockOracle.deployed();
  await instanceMockOracle.postPrice(instanceMockDAI.address, 100); // In cents
  await instanceMockOracle.postPrice(instanceMockLEND.address, 1); // In cents



};
