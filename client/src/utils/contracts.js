import LendingPool from "../../../build/contracts/LendingPool.json";
import MockDAI from "../../../build/contracts/MockDAI.json";
import MockLEND from "../../../build/contracts/MockLEND.json";
import BigNumber from "bignumber.js";

export const MockLendAddress = "0xa77937EdAc142C5EC240CAB578946546F65D73e4";
export const MockDAIAddress = "0xf973A2Fc1ABF6C21F97559c96D3587957f1d637E";
const LendingPoolABI = LendingPool.abi;
const MockDAIABI = MockDAI.abi;
const MockLENDABI = MockLEND.abi;
export const LendingPoolGanacheAddress =
  "0x70Ce9aCbD94dEbbFA11bF95E7Bdd75AfB0169504";

export const defaultGasPrice = "2000000000";
export const defaultGasLimit = 400000;
export const defaultApprovalAmount = "1000000000000000000000000";
export const defaultDepositAmount = "4000000000000000000000";
export const defaultBorrowAmount = "2000000000000000000000";

export const centsToDollars = amount =>
  new BigNumber(amount).dividedBy(100).toFixed(2, BigNumber.ROUND_CEIL);

export const getLendingPoolInstance = async web3 =>
  await new web3.eth.Contract(LendingPoolABI, LendingPoolGanacheAddress);

export const getMockLENDInstance = async web3 =>
  await new web3.eth.Contract(MockLENDABI, MockLendAddress);

export const getMockDAIInstance = async web3 =>
  await new web3.eth.Contract(MockDAIABI, MockDAIAddress);

export const getDAIBalance = async (web3, address) => {
  const rawBalance = await (await (await getMockDAIInstance(
    web3
  )).methods.balanceOf(address)).call();
  return web3.utils.fromWei(rawBalance.toString());
};

export const getLENDBalance = async (web3, address) => {
  const rawBalance = await (await (await getMockLENDInstance(
    web3
  )).methods.balanceOf(address)).call();
  return web3.utils.fromWei(rawBalance.toString());
};

export const getUserDataLendingPool = async (web3, userAddress) => {
  const lendingPoolInstance = await getLendingPoolInstance(web3);
  const rawUserData = await lendingPoolInstance.methods
    .calculateTotalUserBalancesUSD(userAddress)
    .call();
  const liquidityBalance = centsToDollars(
    rawUserData.totalLiquidityBalance.toString()
  );
  const borrowedBalance = centsToDollars(
    rawUserData.totalBorrowBalance.toString()
  );
  return {
    liquidityBalance,
    borrowedBalance
  };
};

export const getAvailableAmountToBorrow = (liquidityBalance, borrowedAmount) =>
  new BigNumber(liquidityBalance)
    .minus(borrowedAmount)
    .dividedBy(1.5)
    .toString();

export const depositLiquidity = async (
  web3,
  userAddress,
  tokenAddress,
  amount
) => {
  const lendingPoolInstance = await getLendingPoolInstance(web3);
  const resultTransaction = await lendingPoolInstance.methods.deposit(
    tokenAddress,
    amount
  );

  resultTransaction.send({
    from: userAddress,
    gasPrice: defaultGasPrice,
    value: 0,
    gas: defaultGasLimit
  });
};

export const borrow = async (web3, userAddress, tokenAddress, amount) => {
  const lendingPoolInstance = await getLendingPoolInstance(web3);
  const resultTransaction = await lendingPoolInstance.methods.borrow(
    tokenAddress,
    amount
  );

  resultTransaction.send({
    from: userAddress,
    gasPrice: defaultGasPrice,
    value: 0,
    gas: defaultGasLimit
  });
};

export const approveLENDTransfer = async (web3, userAddress, to, amount) => {
  const mockLENDInstance = await getMockLENDInstance(web3);
  const resultTransaction = await mockLENDInstance.methods.approve(to, amount);

  resultTransaction.send({
    from: userAddress,
    gasPrice: defaultGasPrice,
    value: 0,
    gas: defaultGasLimit
  });
};

export const getLENDAllowance = async (web3, userAddress, to) => {
  const mockLENDInstance = await getMockLENDInstance(web3);
  const rawAllowance = await mockLENDInstance.methods
    .allowance(userAddress, to)
    .call();
  return web3.utils.fromWei(rawAllowance.toString());
};

export const approveDAITransfer = async (web3, userAddress, to, amount) => {
  const mockDAIInstance = await getMockDAIInstance(web3);
  const resultTransaction = await mockDAIInstance.methods.approve(to, amount);

  resultTransaction.send({
    from: userAddress,
    gasPrice: defaultGasPrice,
    value: 0,
    gas: defaultGasLimit
  });
};

export const getDAIAllowance = async (web3, userAddress, to) => {
  const mockDAIInstance = await getMockDAIInstance(web3);
  const rawAllowance = await mockDAIInstance.methods
    .allowance(userAddress, to)
    .call();
  return web3.utils.fromWei(rawAllowance.toString());
};
