import Web3 from "web3";
import CustomEthereumProvider from "../ethereum-provider/CustomEthereumProvider";
import {
  defaultKovanAddress,
  defaultKovanPrivateKey,
  LendingPoolABI,
  infuraKovanUrl,
  lendingPoolKovanAddress
} from "../config/config";

export const getWeb3WithCustomProvider = () =>
  new Web3(
    new CustomEthereumProvider(
      defaultKovanAddress,
      defaultKovanPrivateKey || "0x",
      infuraKovanUrl
    )
  );

export const getInstanceLendingPool = async () => {
  const web3 = getWeb3WithCustomProvider();
  return await new web3.eth.Contract(LendingPoolABI, lendingPoolKovanAddress);
};

export const getCurrentPriceOracleWeb3 = async instanceOracleContractWeb3 => {
  return (await instanceOracleContractWeb3.methods
    .getPrice()
    .call()).toString();
};
