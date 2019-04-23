export const LendingPoolABI = require("../build/contracts/LendingPool.json")
  .abi;
export const defaultKovanAddress = process.env.DEPLOYMENT_ADDRESS_KOVAN;
export const defaultKovanPrivateKey = process.env.PRIVATE_KEY_KOVAN;
export const defaultKovanMnemonic = process.env.MNEMONIC_KOVAN;
export const defaultGasPrice = "2000000000";
export const defaultGasLimit = 400000;
export const infuraKovanUrl = process.env.INFURA_URL_KOVAN;
export const lendingPoolKovanAddress = process.env.LENDING_POOL_ADDRESS_KOVAN;
export const defaultSendTxParams = {
  from: sybilAddress,
  gasPrice: defaultKovanAddress,
  value: 0,
  gas: defaultGasLimit
};