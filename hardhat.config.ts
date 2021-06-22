import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
require('dotenv').config()

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
module.exports = {
  networks: {
    hardhat: {
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/ad32d2ff617944acab6e1c62de8bf632",
      accounts: [process.env.account]
    }
  },
  solidity: "0.8.0",
};

