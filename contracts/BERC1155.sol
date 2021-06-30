pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "../OZContracts/contracts/token/ERC1155/ERC1155.sol";

contract MyERC1155Token is ERC1155("https://token-cdn-domain/1.json") {
    ERC1155 erc1155 = new ERC1155("https://token-cdn-domain/1.json");
    
    function mint(address _address, uint tokenId, uint amount) public {
        amount = amount * (10**18);
        _mint(_address, tokenId, amount, "");
    }
}
