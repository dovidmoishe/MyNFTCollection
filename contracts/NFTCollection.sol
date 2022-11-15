// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("FreshmanNFT", "LW3FRESHMAN") {
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
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    "ewogICAgIm5hbWUiOiAiRnJlc2htYW5ORlQiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmb3IgYSBMZWFybldlYjMgRnJlc2htYW4gR3JhZHVhdGUiLAogICAgImltYWdlIjogImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIQnlaWE5sY25abFFYTndaV04wVW1GMGFXODlJbmhOYVc1WlRXbHVJRzFsWlhRaUlIWnBaWGRDYjNnOUlqQWdNQ0F6TlRBZ016VXdJajRLSUNBZ0lEeHpkSGxzWlQ0dVltRnpaU0I3SUdacGJHdzZJSGRvYVhSbE95Qm1iMjUwTFdaaGJXbHNlVG9nYzJWeWFXWTdJR1p2Ym5RdGMybDZaVG9nTVRSd2VEc2dmVHd2YzNSNWJHVStDaUFnSUNBOGNtVmpkQ0IzYVdSMGFEMGlNVEF3SlNJZ2FHVnBaMmgwUFNJeE1EQWxJaUJtYVd4c1BTSmliR0ZqYXlJZ0x6NEtJQ0FnSUR4MFpYaDBJSGc5SWpVd0pTSWdlVDBpTlRBbElpQmpiR0Z6Y3owaVltRnpaU0lnWkc5dGFXNWhiblF0WW1GelpXeHBibVU5SW0xcFpHUnNaU0lnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJK1RHVmhkMjVYWldJeklFWnlaWE5vYldGdUlFZHlZV1IxWVhSbFBDOTBaWGgwUGdvOEwzTjJaejQ9Igp9"
                )
            );
    }
}
