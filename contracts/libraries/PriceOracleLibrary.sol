
pragma solidity ^0.5.2;

import "../interfaces/IOracle.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


library PriceOracleLibrary {

    using SafeMath for uint;

    function getPrice(address _self, address _currency, uint _amount) external view returns(uint) {

        uint price = IOracle(_self).getPrice(_currency);

        return price.mul(_amount);
    }
}