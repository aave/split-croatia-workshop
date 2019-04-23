pragma solidity ^0.5.2;


import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/***********************
@title LendingPool contract
@author Aave
@notice This is a simple lending pool contract to learn the basics of how a decentralized liquidity fund works

************************/

contract LendingPool is Ownable {

    using SafeMath for uint;


    /***********************
    @title UserBalance structure
    @author Aave
    @notice the structure stores the information related to all the users of the pool.

    ************************/

    struct UserData {

        uint borrowedBalance;
        uint liquidityBalance;
    }

    /***********************
    @title MarketBalance structure
    @author Aave
    @notice the structure stores the information related to the markets of the pool.

    ************************/

    struct MarketData {

        uint totalLiquidity;
        uint interestRate;
        bool active;
    }

    uint constant ERC20_APPROVAL_AMOUNT = 1000000000*1 ether;
    uint constant BORROW_COLLATERAL_RATIO = 150; 

    address priceOracle;

    mapping(address => UserData) usersData;
    mapping(address => MarketData) marketsData;


    constructor(address _priceOracle) public {
        priceOracle = _priceOracle;
    }

    function approve(address _market) public {

        require(ERC20(_market).approve(address(this), ERC20_APPROVAL_AMOUNT), "Approval of the contract failed");
    }

    function deposit(address _market, uint _amount) public {
        
        MarketData storage marketData = marketsData[_market];

        marketData.totalLiquidity.add(_amount);

        UserData storage userData = usersData[msg.sender];

        userData.liquidityBalance.add(_amount);

        require(
            ERC20(_market).transferFrom(
                msg.sender, 
                address(this), 
                _amount),
            "Approval of the contract failed"
            );                        
    }

    function withdraw(address _market, uint _amount) public {

    }

    function borrow(address _market, uint _amount) public {

    }

    function payback(address _market, uint _amount) public {

    }       

    function addMarket(address _market) public onlyOwner {
        
        MarketData storage data = marketsData[_market];

        require(!data.active, "Market is already added");

        data.active = true;

    } 


    function getMarketData(address _market) public view returns(uint _totalLiquidity, uint _interestRate, bool _active) {

        MarketData storage data = marketsData[_market];
        _totalLiquidity = data.totalLiquidity;
        _interestRate = data.interestRate;
        _active = data.active;
    }

    function getUserData(address _market) public view returns(uint _borrowedBalance, uint _liquidityBalance) {
       
        UserData storage data = usersData[_market];
        _borrowedBalance = data.borrowedBalance;
        _liquidityBalance = data.liquidityBalance;

    }
    
}