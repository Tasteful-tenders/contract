// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {hre} from "./index";

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    const nftFactory: string = '0x709685A2c2AA3ea02b791Fc58bc02DE422e5d438';
    const tendersToken: string = '0x281bfbf5c670ad11Ace3eF5c4BE81D5ddFF0737d';

    // We get the contract to deploy
    const Auction = await hre.ethers.getContractFactory("Auction");
    const auction = await Auction.deploy(nftFactory, tendersToken);
    await auction.deployed();

    console.log("Auction deployed to:", auction.address);
    console.log("Owner of the contracts:", (await hre.ethers.getSigners())[0].address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
