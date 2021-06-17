import { Signer } from "ethers";
import { hre, expect } from "./constant";

describe("Auction deployment", function() {
    let nftFactory, auction, tendersToken;
    let owner, addr1, addr2, addrs;

    beforeEach(async function() {
        [owner, addr1, addr2, ...addrs] =  await hre.ethers.getSigners();

        const NftFactory = await hre.ethers.getContractFactory("NftFactory");
        nftFactory = await NftFactory.deploy();
        await nftFactory.deployed();

        const TendersToken = await hre.ethers.getContractFactory("TendersToken");
        tendersToken = await TendersToken.deploy();
        await tendersToken.deployed();

        const Auction = await hre.ethers.getContractFactory("Auction");
        auction = await Auction.deploy(nftFactory.address, tendersToken.address);
        await auction.deployed();
    });

    it("NFT has been correctly push in the array", async function() {
        const nftId: number = 2;
        const startprice: number = 150;
        const enddate: number = 49678;

        const nftIds: number[] = await auction.nftIds();

        await auction.addNFT(nftId, startprice, enddate);
        expect(nftIds[nftIds.length -1]).to.equal(2);
    });

    it("Contract is the ntf's owner", async function() {
        const nftId: number = 3;
        const startprice: number = 150;
        const enddate: number = 49678;

        const tenders: any = await auction.tenders();
        
        await auction.addNFT(nftId, startprice, enddate);
        expect(tenders[nftId].owner).to.equal(auction.address);
    });

    it("Transfer NFT to new owner", async function() {

    });

    it("Bid added on the auction", async function() {

    });

    it("Auction canceled", async function() {

    });

});