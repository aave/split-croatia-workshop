pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract MockDAI is ERC20Mintable {
    string public name = "MockDAI";
    string public symbol = "DAI";
    uint public decimals = 18;
}