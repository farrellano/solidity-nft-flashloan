const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("FlashLoan", () => {
  beforeEach(async () => {
    //Setup accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    //Load accounts
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const FlashLoanReceiver = await ethers.getContractFactory(
      "FlashLoanReceiver"
    );
    const Token = await ethers.getContractFactory("Token");
    //Deploy token
    token = await Token.deploy("Fas Token", "FAST", "1000000");

    //Deploy flash loan pool
    flashLoan = await FlashLoan.deploy(token.address);

    //Approve tokens before depositing
    let transaction = await token
      .connect(deployer)
      .approve(flashLoan.address, tokens(1000000));
    await transaction.wait();

    // Deposit tokens into the pool
    transaction = await flashLoan
      .connect(deployer)
      .depositTokens(tokens(1000000));
  });

  describe("Deployment", () => {
    it("sends tokens to the flash loan pool contract", async () => {
      expect(await token.balanceOf(flashLoan.address)).to.equal(
        tokens(1000000)
      );
    });
  });
});
