require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

const INFURA_URL = "https://rinkeby.infura.io/v3/18026257ca224817b0a46c34a66383be";
const PRIVATE_KEY = "8fd6a27adfa506207495b6d9ac22bc92374fcd3b90c0e69b80c90ae6bf0f4a8b";

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});



// task("accounts", "Prints accounts", async (_, { web3 }) => {
//   console.log(await web3.eth.getAccounts());
// });

//module.exports = {};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    rinkeby:{
      url: INFURA_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};

