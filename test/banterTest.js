const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Banter Coin', () => {
    let creator, buyer, banterContractAddress;
    var banter = 0, erc20 = 0, erc1155 = 0;

    beforeEach(async() => {
            const banterMainContractAbi = await ethers.getContractFactory('BanterMainContract');
            const erc1155Abi = await ethers.getContractFactory('MyERC1155Token');
            const erc20Abi = await ethers.getContractFactory('MyERC20Token');

            erc20 = await erc20Abi.deploy();
            banter = await banterMainContractAbi.deploy();
            erc1155 = await erc1155Abi.deploy();

            banterContractAddress = banter.address;
            //console.log(banter.address);

            [creator, buyer, _] = await ethers.getSigners();
            console.log(`Creator : ${creator.address} and Buyer : ${buyer.address}`);
    });

    /* describe('Deploying of Smart Contract', () => {
        it('Should successfully deploy Smart Contract', async () => {
            
        });
    }) */

    describe('Giving initial BNT coins', () => {
        it('Buyer should be minted with initial BNT', async () => {
            await banter.initialBNTDeposit(buyer.address);
            var buyerBalance = await banter.BNTBalance(buyer.address);
            expect(buyerBalance).to.be.equal('5000000000000000000000');            
            console.log(`Balance : ${buyerBalance}`);            
        });
    })

    describe('Giving approval to the contract', () => {
        it('Should give approval to the smart contract for coin purchasing', async() => {
            await banter.approveToken(banterContractAddress, 1000);
            var allowance = await banter.allowanceBNT(buyer.address, banterContractAddress);
            expect(allowance).to.be.equal('1000000000000000000000');
            console.log(`BNT Tokens allowed to contract is ${allowance}`);
        })
    })

    describe('Creating creator coin', () => {
        it('Should create creator coin of amount ordered', async () => {
            await banter.createCoin(creator.address, 10000);
            [tokenId, initialAmountOfTokensHold] = await banter.balanceOfCreator(creator.address);
            expect(initialAmountOfTokensHold).to.be.equal('10000000000000000000000');
            console.log(`Creator details are : Token id - ${tokenId} & Balance - ${initialAmountOfTokensHold}`);
        });
    })

    describe('Purchasing of creator coin', () => {
        it('Should purchase successfully', async() => {
            expect(await banter.allowanceBNT(buyer.address, banterContractAddress)).to.be.greaterThanOrEqual('100000000000000000000'); //Greater than tokens allowed
            expect(await banter.BNTBalance(buyer.address)).to.be.greaterThanOrEqual('100000000000000000000'); //Greater than price to be paid
            expect(await banter.balanceOfCreator(creator.address)).to.be.greaterThanOrEqual('100000000000000000000');//Creator coin should be greater that amount ordered
            await banter.buyCoins(buyer.address, 0, 100, 0);
            expect(await banter.BNTBalance(buyer.address)).to.be.equal('4970000000000000000000');
            expect(await banter.BNTBalance(banterContractAddress)).to.be.equal('30000000000000000000');
            expect(await banter.balanceOfCreator(creator.address)).to.be.equal('10100000000000000000000');
            expect(await banter.balanceOfCreator(buyer.address)).to.be.equal('100000000000000000000');
        })
    })
})