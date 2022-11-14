// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("SoccerBallNFT", "SOCCER") {
        console.log("This is my NFT contract. Whoa!");
    }

    function makeAnNFT() public {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        _tokenIds.increment();
    }

    function tokenURI(uint256 itemId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(itemId));
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            itemId,
            msg.sender
        );
        return "https://jsonkeeper.com/b/VA2N";
    }
}
