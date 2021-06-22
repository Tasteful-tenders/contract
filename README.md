<p align="center">
    <img src="https://image.noelshack.com/fichiers/2021/24/5/1624025141-logo-black.png" width="300">
</p>

## Objective
The goal of this project is to create a decentralized auction site.

The project includes the creation of a dApp which will be divided into :
- A smart contract backend in solidity on the testnet
- A frontend part in react served via nodejs

Concerning the web application, it will also be imposed to use a MongoDB database to store customers informations.
The particularity of this application is that the exchange currency will be the ERC-20 specific to the project.
In this project it will be expected to be able to connect with your wallet, list NFT and bid.
To be able to bid, the customer will have to use the project token (TTK).
The auctions will be limited in time when created.
Once the user bet, his tokens are blocked until the end of the auction or if someone else becomes the highest bidder, in this case, the user can redeem his tokens.

Bonus:
- Replace items by NFT
- An interface for the creation of these NFT

## Our technologies

We decided to store all NFTs on IPFS and deploy our website with fleek

Front:

- React

Back:

- Smart contracts in solidity => NFTFactory.sol (ERC-721), TendersToken.sol (ERC-20), Auction.sol
- Nodejs => Express + Mongoose

Database:

- MongoDB

DevOps:

- Docker
