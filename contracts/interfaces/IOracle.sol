pragma solidity ^0.5.6;

contract IOracle {
    function getPrice(address _tokenAddress) external view returns (uint);
}