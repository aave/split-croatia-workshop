
const LendingPool = artifacts.require("LendingPool");
const MockLEND = artifacts.require("MockLEND");
const MockDAI = artifacts.require("MockDAI");


const BigNumber =  require('bignumber.js').BigNumber;
const sleep = require("../helpers/truffle-contracts");

const getLendingPoolInstance = async () => {
  return await LendingPool.deployed();
}

const getMarketData = async (address) => {

  const poolInstance = await getLendingPoolInstance();
  const marketData = await poolInstance.getMarketData(address);
  return marketData;

}

contract("LendingPool", ([deployer, ...users]) => {


  it("Checks if LEND market is active", async () => {

    const LENDInstance = await MockLEND.deployed();

    const marketData = await getMarketData(LENDInstance.address);

    expect(marketData.active).to.be.equal(true);

  });

  it("Checks if DAI market is active", async () => {

    const DAIInstance = await MockDAI.deployed();

    const marketData = await getMarketData(DAIInstance.address);

    expect(marketData.active).to.be.equal(true);

  });

  it("Approves the LEND token for the main address", async() => {

    const LENDInstance = await MockLEND.deployed();
    const poolInstance = await getLendingPoolInstance();

    const allowance =  "1000000000000000000000000000"; //1 billion tokens

    const approveResult = await LENDInstance.approve(poolInstance.address, allowance); 
    
    const returnedAllowance = await LENDInstance.allowance(deployer,poolInstance.address );
    
    expect(approveResult.receipt.status).to.be.equal(true);
    expect(allowance).to.be.equal(new BigNumber(returnedAllowance).toFixed());

  });

  it("Approves the DAI token for the main address", async() => {


    const DAIInstance = await MockDAI.deployed();
    const poolInstance = await getLendingPoolInstance();

    const allowance =  "1000000000000000000000000000"; //1 billion tokens

    const approveResult = await DAIInstance.approve(poolInstance.address, allowance); 
    
    const returnedAllowance = await DAIInstance.allowance(deployer,poolInstance.address );

    expect(approveResult.receipt.status).to.be.equal(true);
    expect(allowance).to.be.equal(new BigNumber(returnedAllowance).toFixed());

  });


  it("Mints LEND on account 0 and deposits to the pool", async () => {

    const tokenAmount =  "1000000000000000000000";
    const LENDInstance = await MockLEND.deployed();
    await LENDInstance.mint(deployer,tokenAmount);

    const poolInstance = await getLendingPoolInstance();
  
    await poolInstance.deposit(LENDInstance.address,tokenAmount);

    const userData = await poolInstance.getUserData(LENDInstance.address);
        
    const marketData = await poolInstance.getMarketData(LENDInstance.address);



    expect(userData.liquidityBalance.toString()).to.be.equal(tokenAmount);
    expect(marketData.totalLiquidity.toString()).to.be.equal(tokenAmount);
    expect(marketData.availableLiquidity.toString()).to.be.equal(tokenAmount);
  });


  it("Approves the DAI token for the user[1]", async() => {


    const DAIInstance = await MockDAI.deployed();
    const poolInstance = await getLendingPoolInstance();

    const allowance =  "1000000000000000000000000000"; //1 billion tokens

    const approveResult = await DAIInstance.approve(poolInstance.address, allowance, {from: users[1]}); 
    
    const returnedAllowance = await DAIInstance.allowance(deployer,poolInstance.address, {from: users[1]} );

    expect(approveResult.receipt.status).to.be.equal(true);
    expect(allowance).to.be.equal(new BigNumber(returnedAllowance).toFixed());

  });



  it("Mints DAI on account 1 and deposits to the pool", async () => {

    const from = {from: users[1] };

    const tokenAmount =  "1000000000000000000000";

    const DAIInstance = await MockDAI.deployed();
    
    await DAIInstance.mint(users[1],tokenAmount);

    const poolInstance = await getLendingPoolInstance();
  
    await poolInstance.deposit(DAIInstance.address,tokenAmount, from );

    const userData = await poolInstance.getUserData(DAIInstance.address, from);
        
    const marketData = await poolInstance.getMarketData(DAIInstance.address, from);


    const balance = await DAIInstance.balanceOf(poolInstance.address);

    expect(userData.liquidityBalance.toString()).to.be.equal(tokenAmount);
    expect(marketData.totalLiquidity.toString()).to.be.equal(tokenAmount);
    expect(marketData.availableLiquidity.toString()).to.be.equal(tokenAmount);

  });

  it("borrows DAI with the account 0 using the LEND as collateral", async() => {

    const poolInstance = await getLendingPoolInstance();
    const DAIInstance = await MockDAI.deployed();

    await poolInstance.borrow(DAIInstance.address, "2000000000000000000");
    
    const marketData = await poolInstance.getMarketData(DAIInstance.address);
    const userData = await poolInstance.getUserData(DAIInstance.address);

    const actualDAIBalance = await DAIInstance.balanceOf(deployer);

    expect(marketData.totalLiquidity.toString()).to.be.equal("1000000000000000000000");
    expect(marketData.availableLiquidity.toString()).to.be.equal("998000000000000000000");
    expect(userData.borrowedBalance.toString()).to.be.equal("2000000000000000000");
    expect(actualDAIBalance.toString()).to.be.equal("2000000000000000000");

  });

  it("Checks the accrued interest rate", async() => {

    const poolInstance = await getLendingPoolInstance();
    const DAIInstance = await MockDAI.deployed();

    const marketData = await poolInstance.getMarketData(DAIInstance.address);

    await sleep(30000);

    //in the smart contracts we are approximating one year with one day (86400 secs)
    //considering we slept for 29 seconds as the timer could be inprecise and the calculation might be higher than expected
    const interestFloor = new BigNumber(29).div(86400).multipliedBy(new BigNumber("2000000000000000000").multipliedBy(marketData.interestRate).div(100));

    const interest = await poolInstance.calculateAccruedInterest(DAIInstance.address, deployer);

    expect(new BigNumber(interest.toString()).toNumber()).to.be.least(interestFloor.toNumber());

  });

  it("Repays the borrow", async() => {

    const poolInstance = await getLendingPoolInstance();

    const DAIInstance = await MockDAI.deployed();

    //mints 1 DAI more to the deployer address to have enough liquidity to repay

    await DAIInstance.mint(deployer,"1000000000000000000");

    await poolInstance.payback(DAIInstance.address);


    const marketData = await poolInstance.getMarketData(DAIInstance.address);
    const userData = await poolInstance.getUserData(DAIInstance.address);

    expect(marketData.totalLiquidity.toString()).to.be.equal(marketData.availableLiquidity.toString());

    expect(userData.borrowedBalance.toString()).to.be.equal("0");

  });


});
