import {hre, expect} from "./constant";
import {BigNumber} from "ethers";

describe("Tasteful-tenders", function () {
    let nftFactory, auction, tendersToken;
    let owner, addr1, addr2, addrs;

    before(async function () {
        [owner, addr1, addr2, ...addrs] = await hre.ethers.getSigners();

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

    describe("NftFactory", function () {
        it("Should return the new minted NFT", async function () {
            const nftData = JSON.stringify({
                "title": "My new art",
                "ipfsHash": "this is an ipfs hash"
            });

            await nftFactory.mintNft(owner.address, nftData);
            expect(await nftFactory.ownerOf(1)).to.equal(owner.address);
            expect(await nftFactory.tokenURI(1)).to.equal(nftData);
        });
    });

    describe('Auction', function () {
        it("Should list an NFT", async function () {
            const nftId: number = 1;
            const startPrice: number = 150;
            //(now + ~~1 week in ms) then converted to solidity timestamp with / 1000
            const endDate: number = Math.round((new Date().getTime() + (604000 * 1000)) / 1000);

            await nftFactory.approve(auction.address, nftId);

            await auction.addNFT(nftId, startPrice, endDate);

            const tenders: any = await auction.tenders(nftId);

            expect(await auction.nftIds(0)).to.equal(nftId);
            expect(tenders.owner).to.equal(owner.address);
        });

        it("Should bid on the auction", async function () {
            const nftId: number = 1;
            const bidPrice: number = 200;

            await tendersToken.approve(auction.address, bidPrice);

            await auction.bid(nftId, bidPrice);
            const tenders: any = await auction.tenders(nftId);

            expect(tenders.highestBidder).to.equal(owner.address);
            expect(tenders.highestBid).to.equal(bidPrice);
        });

        it("Should refund if not highest bidder anymore", async function () {
            const nftId: number = 1;
            const newBidPrice: number = 500;

            //@ts-ignore
            await tendersToken.transfer(addr1.address, newBidPrice);

            await tendersToken.connect(addr1).approve(auction.address, newBidPrice);
            await auction.connect(addr1).bid(nftId, newBidPrice);
            await auction.refund(nftId);

            expect(BigNumber.from(await tendersToken.balanceOf(owner.address))).to.equal(BigNumber.from(await tendersToken.totalSupply()).sub(BigNumber.from(newBidPrice)));
        });

        it("Should claim the nft after winning the auction", async function () {
            const nftId: number = 1;

            //increase the block.timestamp by one week
            await hre.waffle.provider.send('evm_increaseTime', [604800]);
            await hre.waffle.provider.send('evm_mine');

            await auction.connect(addr1).claim(nftId);

            expect(await nftFactory.ownerOf(nftId)).to.equal(addr1.address);
        });

        it("Should cancel the auction", async function () {
            const nftData = JSON.stringify({
                "title": "My new art",
                "ipfsHash": "this is an ipfs hash"
            });

            await nftFactory.mintNft(owner.address, nftData);

            const nftId: number = 2;
            const startPrice: number = 150;
            //(now + ~~2 week in ms) then converted to solidity timestamp with / 1000
            const endDate: number = Math.round((new Date().getTime() + (604000 * 1000)*2) / 1000);

            await nftFactory.approve(auction.address, nftId);

            await auction.addNFT(nftId, startPrice, endDate);

            await auction.cancel(nftId);

            expect(await nftFactory.ownerOf(nftId)).to.equal(owner.address);
        });
    });

});
