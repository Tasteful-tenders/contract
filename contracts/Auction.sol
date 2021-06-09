//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./NftFactory.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Auction {
    
    IERC721 public immutable nftFactory;
    IERC20 public immutable tendersToken;
    
    using SafeMath for uint256;
    
    struct Tender {
        address owner;
        uint256 startPrice;
        uint256 endDate;
        address highestBidder;
        uint256 highestBid;
    }
    
    // nftId to Bidder amount
    mapping(uint256 => mapping(address => uint256)) bidders;
    
    // Associate nftId to Tender
    mapping(uint256 => Tender) public tenders;
    uint256[] public nftIds;
    
    event logAddNFT(uint256 indexed _nftId, uint256 indexed _startprice, uint256 indexed _enddate);
    event logBid(uint256 indexed _nftId, uint256 indexed _bid);
    
    constructor(IERC721 _NftFactory, IERC20 _tendersToken) {
        nftFactory = _NftFactory;
        tendersToken = _tendersToken;
    }
    
    /**
     * 
     * addNFT
     * 
     * 
     * 
     * Ajouter en front un approve avant le transfer
     * 
     */
    function addNFT(uint256 _nftId, uint256 _startprice, uint256 _enddate) external {
        require(_enddate < block.timestamp + 1 weeks);
        
        nftFactory.transferFrom(msg.sender, address(this), _nftId);
        require(nftFactory.ownerOf(_nftId) == address(this));
        
        nftIds.push(_nftId);
        tenders[_nftId] = Tender({ 
            owner: msg.sender,
            startPrice: _startprice,
            endDate: _enddate, 
            highestBidder: address(0),
            highestBid: 0
        });
        
        emit logAddNFT(_nftId, _startprice, _enddate);
    }
    
    /**
     * 
     * refund
     * 
     * Refund your money if you're not the higher bidder
     * 
     * 
     * 
     */
    function refund(uint256 _nftId) external {
        Tender memory tender = tenders[_nftId];
        require(tender.highestBidder != address(0));
        require(tender.highestBidder != msg.sender);
        
        tendersToken.transfer(msg.sender, bidders[_nftId][msg.sender]);
    }
    
    /**
     * 
     * claim
     * 
     * Claim your NFT
     * 
     * 
     * 
     */
    function claim() external {
        //high bidder et + price mini transfer
    }
    
    
    /**
     * Cancel auction and send back nft if no bid
     */
    function cancel(uint256 _nftId) external {
        require(tenders[_nftId].highestBidder == address(0), 'Auction: Can not cancel auction if someone already bidded');
        require(tenders[_nftId].owner == address(msg.sender), 'Auction: Only the owner can cancel the auction');
        nftFactory.transferFrom(address(this), msg.sender, _nftId);
        require(nftFactory.ownerOf(_nftId) == address(msg.sender), 'Auction: new owner should be msg.sender, transfer probably failed');
        
    }
    
    
    /**
     * Bid on an auction
     */
    function bid(uint256 _nftId, uint256 _bid) external {
        Tender memory tender = tenders[_nftId];
        require(tender.startPrice < _bid, 'Auction: Bid should be higher then the start price');
        require(tender.highestBid < _bid, 'Auction: Bid should be higher than the last one');
        
        uint256 nextContractBalance = tendersToken.balanceOf(address(this)).add(_bid);
        tendersToken.transferFrom(msg.sender, address(this), _bid);
        require(nextContractBalance == tendersToken.balanceOf(address(this)), 'Auction: Balance not updated correctly, transfer probably failed');
        
        tenders[_nftId].highestBidder = msg.sender;
        tenders[_nftId].highestBid = _bid;
        
        emit logBid(_nftId, _bid);
    }
    
}
