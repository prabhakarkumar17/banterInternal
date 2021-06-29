pragma solidity ^0.8.0;

import "./BERC20.sol";
import "./BERC1155.sol";

contract BanterMainContract is MyERC20Token, MyERC1155Token{
    
    //ERC20 erc20 = ERC20(0x8431717927C4a3343bCf1626e7B5B1D31E240406);
    //ERC1155 erc1155 = ERC1155(0x9C9fF5DE0968dF850905E74bAA6a17FED1Ba042a);
    
    uint tokenId; //For total no. of tokens created
    
    mapping(uint => uint) public supply; //tokenId => supply(no. of coins associated with that particular id)
    mapping(address => uint) buyerDetail; //buyerAddress => no of coins purchased
    mapping(address => bool) isPreviouslyCreated; //for come again and create
    mapping(address => uint) findTokenId; //To find out the respective token id
    
    /*modifier onlyCreator {
        require(msg.sender == coinCreatorAddress);
        _;
    } */ 
    
    function createCoin(address coinCreatorAddress, uint amount) public {
        require(coinCreatorAddress != address(0), "Creator should not hold zero Address");
        
        if(isPreviouslyCreated[coinCreatorAddress]){
            uint _tokenId = findTokenId[coinCreatorAddress];
            _mint(coinCreatorAddress, _tokenId, amount, "");
            supply[_tokenId] += amount;
        } else {
            _mint(coinCreatorAddress, tokenId, amount, "");
            supply[tokenId] += amount;
            isPreviouslyCreated[coinCreatorAddress] = true;
            findTokenId[coinCreatorAddress] = tokenId;
            tokenId++;
        }
    }
    
    function buyCoins(address buyerAddress, uint _tokenId, uint amount) public returns(string memory){
        require(buyerAddress != address(0), "Buyer should hold valid address");
        require(supply[_tokenId] != 0, "Token id doesn't exist");
        
        uint price = calculatePrice(tokenId);
        //require(price == banterCoinAmount, "Amount of Banter Coin Mismatch");
        
        transferFrom(buyerAddress, address(this), price); //ERC20
        _mint(buyerAddress, _tokenId, amount, ""); //ERC1155
        
        supply[_tokenId] += amount;
        buyerDetail[buyerAddress] += amount;
        
        return "Token Purchased Successfully";
    }
    
    function fetchBuyerHoldings(address _buyerAddress) public view returns(uint){
        return buyerDetail[_buyerAddress];
    }
    
    function calculatePrice(uint _tokenId) private view returns(uint){
    	uint supplyOfToken = supply[_tokenId]; 
        uint price = (((3 * supplyOfToken)^2))/1000;
        return price;
    }
}
