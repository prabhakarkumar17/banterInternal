pragma solidity ^0.8.0;

import "./BERC20.sol";
import "./BERC1155.sol";

contract BanterMainContract {
        
        MyERC20Token erc20 = new MyERC20Token();
        MyERC1155Token erc1155 = new MyERC1155Token();
    
    uint tokenId; //For total no. of tokens created
    
    mapping(uint => uint) public supply; //tokenId => supply(no. of coins associated with that particular id)
    mapping(address => uint) buyerDetail; //buyerAddress => no of coins purchased
    mapping(address => bool) isPreviouslyCreated; //for come again and create
    mapping(address => uint) findTokenId; //To find out the respective token id
    
    /*modifier onlyCreator {
        require(msg.sender == coinCreatorAddress);
        _;
    } */ 
    
    function balanceOfCreator(address creatorAddress) public view returns(uint, uint) {
        uint _tok = findTokenId[creatorAddress];
        uint totalHoldings = supply[_tok];
        
        return (_tok, totalHoldings);
    } 
    
    function initialBNTDeposit(address _buyerAddress) public {
        erc20.initialBNT(_buyerAddress);
    }
    
    function BNTBalance(address bntAddress) public view returns(uint){
        uint bal = erc20.balanceOf(bntAddress);
        return (bal);
    }
    
    function createCoin(address coinCreatorAddress, uint amount) public {
        require(coinCreatorAddress != address(0), "Creator should not hold zero Address");
        
        amount = amount * (10**18);
        if(isPreviouslyCreated[coinCreatorAddress]){
            uint _tokenId = findTokenId[coinCreatorAddress];
            erc1155.mint(coinCreatorAddress, _tokenId, amount);
            supply[_tokenId] += amount;
        } else {
            erc1155.mint(coinCreatorAddress, tokenId, amount); //100
            supply[tokenId] += amount;
            isPreviouslyCreated[coinCreatorAddress] = true;
            findTokenId[coinCreatorAddress] = tokenId;
            tokenId++;
        }
    }
    
    /* function approveToken(address spender, uint amount) public {
        amount = amount * (10**erc20.decimals());
        erc20.approveBNT(msg.sender, spender, amount);
    }
    
    function allowanceBNT(address owner, address spender) public view returns(uint){
        uint allowanceBalance = erc20.allowance(owner, spender);
        return allowanceBalance;
    } */
    
    function buyCoins(address buyerAddress, uint _tokenId, uint amount, uint banterCoinAmount) public returns(string memory){
        require(buyerAddress != address(0), "Buyer should hold valid address");
        require(supply[_tokenId] != 0, "Token id doesn't exist");
        
        uint price = calculatePrice(_tokenId);
        //require(price == banterCoinAmount, "Amount of Banter Coin Mismatch");
        amount = amount * 10**18;
        
        erc20.transferFrom(buyerAddress, address(this), (price * 10**18)); //ERC20
        erc1155.mint(buyerAddress, _tokenId, amount); //ERC1155
        
        supply[tokenId] += amount;
        buyerDetail[buyerAddress] += amount;
        
        return "Token Purchased Successfully";
    }
    
    function fetchBuyerHoldings(address _buyerAddress) public view returns(uint){
        return buyerDetail[_buyerAddress];
    }
    
    function calculatePrice(uint tokenId) private returns(uint){
    	uint supplyOfToken = supply[tokenId]; 
    	supplyOfToken = supplyOfToken/(10**18);
        uint price = ((3 * (supplyOfToken)^2))/1000;
        return price;
    }
}