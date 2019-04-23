pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MockLEND is ERC20 {
    string public name = "MockLEND";
    string public symbol = "LEND";
    uint public decimals = 18;
}