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


    event Deposited(address _sender, address _market, uint _amount);
    event BorrowAttempt(uint borrowAmountUSD, uint maxBorrowUSD);

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
    //uint constant SECONDS_PER_YEAR = 31557600; //this is the correct one
    uint constant SECONDS_PER_YEAR = 86400; //approximated one year to one day for testing pourposes
    uint constant TOKEN_DECIMALS = 10 ** 18;

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

    function deposit(address _market, uint _amount) public {
        
        MarketData storage marketData = marketsData[_market];

        require(marketData.active, "Market is not active");

        marketData.totalLiquidity = marketData.totalLiquidity.add(_amount);
        marketData.availableLiquidity = marketData.availableLiquidity.add(_amount);

        //calculation for the accrued interest is pourposely left out here - interest rate needs to be
        UserData storage userData = usersData[msg.sender][_market];

        userData.liquidityBalance = userData.liquidityBalance.add(_amount);


        transferERC20(_market, msg.sender, address(this), _amount);

        emit Deposited(msg.sender, _market, _amount);
    }

    function withdraw(address _market, uint _amount) public {

    }

    function borrow(address _market, uint _amount) public {

        UserData storage userData = usersData[msg.sender][_market];
        MarketData storage marketData = marketsData[_market];

        uint amountToBorrowUSD = priceOracle.getPrice(_market, _amount).div(TOKEN_DECIMALS);

        (uint currentLiquidityBalanceUSD,
        uint currentBorrowBalanceUSD) = calculateTotalUserBalancesUSD(msg.sender);

        uint maxBorrowAvailableUSD = currentLiquidityBalanceUSD.mul(100).div(BORROW_COLLATERAL_RATIO);

        emit BorrowAttempt(amountToBorrowUSD, maxBorrowAvailableUSD);

        require(
            maxBorrowAvailableUSD >= currentBorrowBalanceUSD.add(amountToBorrowUSD),
            "You can borrow a maximum of 67% in value of the available collateral."
            );

        uint marketTokenUnitPrice = priceOracle.getPrice(_market, 1);
        uint maxBorrowAvailableInTokens = maxBorrowAvailableUSD.div(marketTokenUnitPrice).mul(TOKEN_DECIMALS);

        require(
            marketData.availableLiquidity > maxBorrowAvailableInTokens,
            "The liquidity available is not enough for this borrow"
        );

        //everything is fine, so updating the status
        userData.borrowAccruedInterestUntilLastUpdate = calculateAccruedInterest(_market, msg.sender);

        userData.lastUpdated = block.timestamp;

        userData.borrowedBalance = userData.borrowedBalance.add(_amount);

        marketData.availableLiquidity = marketData.availableLiquidity.sub(_amount);

        marketData.totalBorrows = marketData.totalBorrows.add(_amount);

        ERC20(_market).transfer(msg.sender, _amount);

    }

    function payback(address _market) public {

        UserData storage userData = usersData[msg.sender][_market];
        MarketData storage marketData = marketsData[_market];

        uint accruedInterest = calculateAccruedInterest(_market, msg.sender);

        uint amountToRepay = userData.borrowedBalance.add(accruedInterest);

        marketData.totalLiquidity = marketData.totalLiquidity.add(accruedInterest);
        marketData.availableLiquidity = marketData.availableLiquidity.add(amountToRepay);
        marketData.totalBorrows = marketData.totalBorrows.sub(userData.borrowedBalance);

        userData.borrowedBalance = 0;
        userData.borrowAccruedInterestUntilLastUpdate = 0;
        userData.lastUpdated = 0;

        transferERC20(_market, msg.sender, address(this), amountToRepay);

    }

    function liquidateBorrow(address _market, address _user) public {
    }

    function addMarket(address _market, uint _interestRate) public {

        MarketData storage data = marketsData[_market];

        require(!data.active, "Market is already added");

        data.interestRate = _interestRate;
        data.active = true;

        markets.push(_market);

    }


    function getMarketData(address _market) public view returns(uint totalLiquidity, uint availableLiquidity, uint interestRate, bool active) {

        MarketData storage data = marketsData[_market];
        totalLiquidity = data.totalLiquidity;
        availableLiquidity = data.availableLiquidity;
        interestRate = data.interestRate;
        active = data.active;
    }

    function getUserData(address _market) public view returns(uint borrowedBalance, uint liquidityBalance) {

        UserData storage data = usersData[msg.sender][_market];
        borrowedBalance = data.borrowedBalance;
        liquidityBalance = data.liquidityBalance;

    }


    function calculateTotalUserBalancesUSD(address _userAddress) public view returns (uint totalLiquidityBalance, uint totalBorrowBalance) {

        for(uint i = 0; i < markets.length; i++){

            UserData storage data = usersData[_userAddress][markets[i]];

            /* earned interest is pourposely lef out from the calculations here - exercise for the students */
            totalLiquidityBalance = totalLiquidityBalance.add(priceOracle.getPrice(markets[i], data.liquidityBalance)).div(TOKEN_DECIMALS);

            totalBorrowBalance = totalBorrowBalance.add(priceOracle.getPrice(markets[i], data.borrowedBalance)).div(TOKEN_DECIMALS);

            totalBorrowBalance = totalBorrowBalance.add(
                priceOracle.getPrice(
                    markets[i],calculateAccruedInterest(
                        markets[i],
                        _userAddress
                    )
                )
            ).div(TOKEN_DECIMALS);
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
            "Transfer of the ERC20 failed"
            );
    }
    
}