const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("RealState", () => {
  let realState, escrow;
  let deployer, seller;
  let nftID = 1;
  let purchasePrice = ether(100);
  let escrowAmout = ether(20);
  beforeEach(async () => {
    //  Setup Contracts
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];
    inspector = accounts[2];
    lender = accounts[3];

    const RealState = await ethers.getContractFactory("RealEstate");
    const Escrow = await ethers.getContractFactory("Escrow");

    //  Deploy contracts
    realState = await RealState.deploy();
    escrow = await Escrow.deploy(
      realState.address,
      nftID,
      purchasePrice,
      escrowAmout,
      seller.address,
      buyer.address,
      inspector.address,
      lender.address
    );

    // Seller Approves NFT
    trx = await realState.connect(seller).approve(escrow.address, nftID);
    await trx.wait();
  });

  describe("Deployment", async () => {
    it("sends nft to the seller / deployer", async () => {
      expect(await realState.ownerOf(nftID)).to.equal(seller.address);
    });
  });

  describe("Selling real state", async () => {
    let balance, transaction;

    it("execute a successful trx", async () => {
      // expects seller to be nft before the sale
      expect(await realState.ownerOf(nftID)).to.equal(seller.address);

      //check escrow balance
      balance = await escrow.getBalance();
      console.log("escrow balance", ethers.utils.formatEther(balance));

      //buyer deposits earnest
      transaction = await escrow
        .connect(buyer)
        .depositEarnest({ value: ether(21) });
      await transaction.wait();
      console.log("Buyer deposits earnest money");

      //check escrow balance
      balance = await escrow.getBalance();
      console.log("escrow balance", ethers.utils.formatEther(balance));

      //Inspector update status
      transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(true);
      await transaction.wait();
      console.log("Innspector update status");

      // Buyyer approve sale
      transaction = await escrow.connect(buyer).approveSale();
      await transaction.wait();
      console.log("Buyer approve sale");

      // Seller approve sale
      transaction = await escrow.connect(seller).approveSale();
      await transaction.wait();
      console.log("Seller approve sale");

      transaction = await lender.sendTransaction({
        to: escrow.address,
        value: ether(80),
      });

      // Lender funds sale
      transaction = await lender.sendTransaction({
        to: escrow.address,
        value: ether(80),
      });

      // Lender approve sale
      transaction = await escrow.connect(lender).approveSale();
      await transaction.wait();
      console.log("Lender approve sale");

      //Finalize sale
      trx = await escrow.connect(buyer).finalizeSale();
      await trx.wait();
      console.log("Buyer finalize sale");

      // Expects buyer to be ft owner after the sale
      expect(await realState.ownerOf(nftID)).to.equal(buyer.address);

      //Expect seller to receive funds
      balance = await ethers.provider.getBalance(seller.address);
      console.log("Seller balance: ", ethers.utils.formatEther(balance));
      expect(balance).to.be.above(ether(10180));
    });
  });
});
