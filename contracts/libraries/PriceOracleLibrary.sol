
pragma solidity ^0.5.2;

library PriceOracleLibrary {

    function getPrice(address _self, address _currency, uint _amount) external view returns(uint);
}