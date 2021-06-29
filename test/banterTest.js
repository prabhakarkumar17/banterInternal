const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Banter Coin', () => {
    let creator, buyer;
    var banter = 0, erc20 = 0, erc1155 = 0;

    beforeEach(async() => {
        const banterMainContractAbi = await ethers.getContractFactory('BanterMainContract');
        const erc20Abi = await ethers.getContractFactory('MyERC20Token');
        const erc1155Abi = await ethers.getContractFactory('MyERC1155Token');

        banter = await banterMainContractAbi.deploy();
        erc20 = await erc20Abi.deploy();
        erc1155 = await erc1155Abi.deploy();

        [creator, buyer, _] = await ethers.getSigners();
        console.log(`Creator : ${creator.address} and Buyer : ${buyer.address}`);
    });

    describe('Deployment', () => {
        it('Buyer should be minted with initial BNT', async () => {
            await erc20.initialBNT(buyer.address);
            const buyerBalance = await erc20.balanceOf(buyer.address);
            expect(await erc20.balanceOf()).to.equal(buyerBalance)
        });
    })

    describe('Transaction', () => {
        it('Should create creator coin of desired ordered', async () => {
            await banter.createCoin(creator, 1000);
            const balanceOfCreator = await banter.balanceOf(creator, 0);
            expect(balanceOfCreator).to.equal(1000);            
        });
    })
})