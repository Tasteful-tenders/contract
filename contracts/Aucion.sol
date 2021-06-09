//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./NftFactory.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Aucion {
    
    IERC721 public immutable nftFactory;
    IERC20 public immutable tendersToken;
    
    using SafeMath for uint256;
    
    struct Tender {
        address owner;
        uint startPrice;
        uint endDate;
        address higherBidder;
    }
    
    // nftId to Bidder amount
    mapping(uint => mapping(address => uint)) bidders;
    
    // Associate nftId to Tender
    mapping(uint => Tender) public tenders;
    uint[] public nftIds;
    
    event AddNFT(uint indexed _nftId, uint indexed _startprice, uint indexed _enddate);
    
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
    function addNFT(uint _nftId, uint _startprice, uint _enddate) external {
        require(_enddate < block.timestamp + 1 weeks);
        
        nftFactory.transferFrom(msg.sender, address(this), _nftId);
        require(nftFactory.ownerOf(_nftId) == address(this));
        
        nftIds.push(_nftId);
        tenders[_nftId] = Tender({ 
            owner: msg.sender,
            startPrice: _startprice,
            endDate: _enddate, 
            higherBidder: address(0)
        });
        
        emit AddNFT(_nftId, _startprice, _enddate);
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
    function refund(uint _nftId) external {
        Tender memory tender = tenders[_nftId];
        require(tender.higherBidder != address(0));
        require(tender.higherBidder != msg.sender);
        
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
    
    function bid() external {
        
    }
    
}