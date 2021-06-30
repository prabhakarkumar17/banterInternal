const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Banter Coin', () => {
    let creator, buyer, banterContractAddress;
    var banter = 0, erc20 = 0, erc1155 = 0;

    beforeEach(async() => {
            
            
    });

    describe('Deploying of Smart Contract', () => {
        it('Should successfully deploy Smart Contract', async () => {
            const banterMainContractAbi = await ethers.getContractFactory('BanterMainContract');
            const erc1155Abi = await ethers.getContractFactory('MyERC1155Token');
            const erc20Abi = await ethers.getContractFactory('MyERC20Token');

            erc20 = await erc20Abi.deploy();
            banter = await banterMainContractAbi.deploy();
            erc1155 = await erc1155Abi.deploy();

            banterContractAddress = banter.address;
            console.log(banter.address);

            [creator, buyer, _] = await ethers.getSigners();
            console.log(`Creator : ${creator.address} and Buyer : ${buyer.address}`);
        });
    })
    
    describe('Giving initial BNT coins', () => {
        it('Buyer should be minted with initial BNT', async () => {
            await erc20.initialBNT(buyer.address);
            const buyerBalance = await erc20.balanceOf(buyer.address);
            console.log(`Balance : ${buyerBalance}`);            
        });
    })

    describe('Creating creator coin', () => {
        it('Should create creator coin of desired ordered', async () => {
            await banter.createCoin(creator.address, 1000);
            [values] = await banter.balanceOfCreator(creator.address);
            console.log(`Creator details are : Token id - ${values[0]} & Balance - ${values[1]}`);
        });
    })

    describe('Giving approval to the contract', () => {
        it('Should give approval to the smart contract', async() => {
            await banter.approveToken(banterContractAddress, 50);
            console.log(await banter.allowanceBNT(buyer.address, banterContractAddress));
        })
    })

    describe('Purchasing of creator coin', () => {
        it('Should purchase successfully', async() => {
            await banter.buyCoins(buyer.address, 0, 20, 0);
        })
    })
})