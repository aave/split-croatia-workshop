pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MockOracle is Ownable {
    mapping(address => uint) public prices;

    function getPrice(address _tokenAddress) external view returns (uint) {
        return prices[_tokenAddress];
    }

    function postPrice(address _tokenAddress, uint _price) public onlyOwner returns (bool) {
        prices[_tokenAddress] = _price;
        return true;
    }
}