import {expect} from "chai";
const hre = require("hardhat");

describe("NftFactory", function() {
  it("Should return the new minted NFT", async function() {
    const NftFactory = await hre.ethers.getContractFactory("NftFactory");
    const nftFactory = await NftFactory.deploy();
    await nftFactory.deployed();

    const nftData = JSON.stringify({
      "title": "My new art",
      "ipfsHash": "this is an ipfs hash"
    });
    const newNftOwnerAddress: string = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    
    await nftFactory.mintNft(newNftOwnerAddress, nftData);
    expect(await nftFactory.ownerOf(1)).to.equal(newNftOwnerAddress);
    expect(await nftFactory.tokenURI(1)).to.equal(nftData);
  });
});
