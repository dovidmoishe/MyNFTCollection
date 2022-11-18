const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  let txn = await nftContract.makeAnNFT();
  // Wait for it to be mined.
  await txn.wait();
  console.log("Minted NFT #1");

  let txn1 = await nftContract.makeAnNFT();
  // Wait for it to be mined.
  await txn1.wait();
  console.log("Minted NFT #2");

  let totalNFTsMinted = await nftContract.getTotalNFTsMintedSoFar();

  console.log(totalNFTsMinted);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
