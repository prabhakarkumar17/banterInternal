pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

import "../OZContracts/contracts/token/ERC20/ERC20.sol";

contract MyERC20Token is ERC20("BANTER", "BNT") {
    
    ERC20 erc20 = new ERC20("BANTER", "BNT");
    function initialBNT(address buyer) public {
        _mint(buyer, 5000 * 10 ** (erc20.decimals()));
    }
    
    function approveBNT(address owner, address spender, uint amount) public {
        _approve(owner, spender, amount);
    }
}