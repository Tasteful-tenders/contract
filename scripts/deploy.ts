// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    const NftFactory = await hre.ethers.getContractFactory("NftFactory");
    const nftFactory = await NftFactory.deploy();
    await nftFactory.deployed();

    const TendersToken = await hre.ethers.getContractFactory("TendersToken");
    const tendersToken = await TendersToken.deploy();
    await tendersToken.deployed();

    const Auction = await hre.ethers.getContractFactory("Auction");
    const auction = await Auction.deploy(nftFactory.address, tendersToken.address);
    await auction.deployed();

    console.log("NFT factory deployed to:", nftFactory.address);
    console.log("NFT factory deployed to:", tendersToken.address);
    console.log("NFT factory deployed to:", auction.address);
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
