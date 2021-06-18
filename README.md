<p align="center">
    <img src="https://image.noelshack.com/fichiers/2021/24/5/1624025141-logo-black.png" width="300">
</p>

## Objective
The goal of this project is to create a decentralized auction site.

The project includes the creation of a dApp which will be divided into :
- A smart contract backend in solidity on the testnet network
- A frontend part in react served via nodejs

Concerning the web application, it will also be imposed to use a MongoDB database to store customer information.
The particularity of this application is that the exchange currency will be the ERC-20 specific to the project.
In this project it will be expected to be able to create an account, to be able to propose items to be to bid on, as well as to bid on other items.
To be able to bid, the customer will have to have previously acquired the token of the project.
The bids will be limited in time from their creation.
Once the user has bid, these tokens will be blocked until the end of the auction.

Bonus:
- Replace items by NFT
- An interface for the creation of these NFT

## Our technologies

We decide to store all nft on IPFS and deploy our website with fleek

Front:

- React

Back:

- Solidity for the NFTFactory(ERC-721) storage and the Auction(ERC-20)
- Framework Mongoose ( Typescript )

Database:

- MongoDB

DevOps:

- Docker ( Mongo & React )
