pragma solidity ^0.5.2;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./libraries/PriceOracleLibrary.sol";

/***********************
@title LendingPool contract
@author Aave
@notice This is a simple lending pool contract to learn the basics of how a decentralized liquidity fund works

************************/

contract LendingPool is Ownable {

    using SafeMath for uint;
    using PriceOracleLibrary for address;


    /***********************
    @title UserBalance structure
    @author Aave
    @notice the structure stores the information related to all the users of the pool.

    ************************/

    struct UserData {

        uint borrowedBalance;
        uint liquidityBalance;
        uint borrowAccruedInterestUntilLastUpdate;
        uint lastUpdated;

        
    }

    /***********************
    @title MarketBalance structure
    @author Aave
    @notice the structure stores the information related to the markets of the pool.
    @dev the interestRate is expressed in percentage (so if 5, it means 5% or 5/100 for calculations)
    ************************/

    struct MarketData {

        uint totalLiquidity;
        uint availableLiquidity;
        uint totalBorrows;
        uint interestRate;
        bool active;
    }

    uint constant ERC20_APPROVAL_AMOUNT = 1000000000*1 ether;
    uint constant BORROW_COLLATERAL_RATIO = 150; 
    uint constant SECONDS_PER_YEAR = 31557600;

    address priceOracle;

    mapping(address => mapping(address => UserData)) usersData;

    mapping(address => MarketData) marketsData;
    address[] markets;

    constructor(address _priceOracle) public {
        priceOracle = _priceOracle;
    }

    /***********************
    @author Aave
    @notice The approve function allows the protocol to witghdraw ERC20 from the user wallet
    ************************/

    function approve(address _market) public {

        require(ERC20(_market).approve(address(this), ERC20_APPROVAL_AMOUNT), "Approval of the contract failed");
    }


    /***********************
    @author Aave
    @notice The approve function allows the protocol to witghdraw ERC20 from the user wallet
    ************************/

    function deposit(address _market, uint _amount) public {
        
        MarketData storage marketData = marketsData[_market];

        require(marketData.active, "Market is not active");

        marketData.totalLiquidity.add(_amount);
        marketData.availableLiquidity.add(marketData.totalBorrows);

        //calculation for the accrued interest is pourposely left out here - interest rate needs to be
        UserData storage userData = usersData[msg.sender][_market];

        userData.liquidityBalance.add(_amount);

        transferERC20(_market, msg.sender, address(this), _amount);              
    }

    function withdraw(address _market, uint _amount) public {

    }

    function borrow(address _market, uint _amount) public {

        UserData storage userData = usersData[msg.sender][_market];
        MarketData storage marketData = marketsData[_market];

        uint amountToBorrowUSD = priceOracle.getPrice(_market, _amount);

        (uint currentBorrowBalanceUSD,
        uint currentLiquidityBalanceUSD) = calculateTotalUserBalancesUSD(msg.sender);

        uint maxBorrowAvailableUSD = currentLiquidityBalanceUSD.mul(100).div(BORROW_COLLATERAL_RATIO);

        require(
            maxBorrowAvailableUSD >= currentBorrowBalanceUSD.add(amountToBorrowUSD),
            "You can borrow a maximum of 67% in value of the available collateral"
            );
        
        uint marketTokenUnitPrice = priceOracle.getPrice(_market, 1);
        uint maxBorrowAvailableInTokens = maxBorrowAvailableUSD.div(marketTokenUnitPrice);

     
        require(
            marketData.availableLiquidity > maxBorrowAvailableInTokens,
            "The liquidity available is not enough for this borrow"
        );

        require(
            _amount <= maxBorrowAvailableInTokens,
            "The liquidity balance is not enough to cover for the borrow"
        );
        
        //everything is fine, so updating the status
        userData.borrowAccruedInterestUntilLastUpdate = calculateAccruedInterest(_market, msg.sender);  

        userData.borrowedBalance = userData.borrowedBalance.add(_amount);   
        
        marketData.availableLiquidity = marketData.availableLiquidity.sub(_amount);

        marketData.totalBorrows = marketData.totalBorrows.add(_amount);

        transferERC20(_market, address(this), msg.sender, _amount);

    }

    function payback(address _market) public {

        UserData storage userData = usersData[msg.sender][_market];

        uint accruedInterest = calculateAccruedInterest(_market, msg.sender);

        uint amountToRepay = userData.borrowedBalance.add(accruedInterest);

        userData.borrowedBalance = 0;
        userData.borrowAccruedInterestUntilLastUpdate = 0;
        userData.lastUpdated = 0;

        transferERC20(_market, msg.sender, address(this), amountToRepay);

    }       

    function liquidateBorrow(address _market, address _user) public {
       
    }

    function addMarket(address _market) public onlyOwner {
        
        MarketData storage data = marketsData[_market];

        require(!data.active, "Market is already added");

        data.active = true;

        markets.push(_market);

    } 


    function getMarketData(address _market) public view returns(uint _totalLiquidity, uint _interestRate, bool _active) {

        MarketData storage data = marketsData[_market];
        _totalLiquidity = data.totalLiquidity;
        _interestRate = data.interestRate;
        _active = data.active;
    }

    function getUserData(address _market) public view returns(uint _borrowedBalance, uint _liquidityBalance) {
       
        UserData storage data = usersData[msg.sender][_market];
        _borrowedBalance = data.borrowedBalance;
        _liquidityBalance = data.liquidityBalance;

    }


    function calculateTotalUserBalancesUSD(address _userAddress) public view returns (uint _totalLiquidityBalance, uint _totalBorrowBalance) {

        for(uint i = 0; i < markets.length; i++){

            UserData storage data = usersData[_userAddress][markets[i]];

            /* earned interest is pourposely lef out from the calculations here - exercise for the students */            
            _totalLiquidityBalance = _totalLiquidityBalance.add(priceOracle.getPrice(markets[i], data.liquidityBalance));

            _totalBorrowBalance = _totalBorrowBalance.add(priceOracle.getPrice(markets[i], data.borrowedBalance));

            _totalBorrowBalance = _totalBorrowBalance.add(calculateAccruedInterest(markets[i], _userAddress));
        }        
    }


    function calculateAccruedInterest(address _market, address _userAddress) public view returns(uint) {
        
        UserData storage userData = usersData[_userAddress][_market];
        MarketData storage marketData = marketsData[_market];

        //using timestamp for simplicity - a more strict implementation would need to use block.timestamp
        uint timePassed = block.timestamp - userData.lastUpdated;

        uint yearlyInterestInCurrency = userData.borrowedBalance.mul(marketData.interestRate).div(100);

        uint accruedInterest = userData.borrowAccruedInterestUntilLastUpdate.add(yearlyInterestInCurrency.mul(timePassed).div(SECONDS_PER_YEAR));

        return accruedInterest;     
        
    }

    function transferERC20(address _token, address _from, address _to, uint _amount) internal {

        require(
            ERC20(_token).transferFrom(
                _from, 
                _to, 
                _amount),
            "Approval of the contract failed"
            );
    }
    
}