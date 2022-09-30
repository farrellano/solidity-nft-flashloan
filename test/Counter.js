const { expect } = require("chai");

describe("Counter", () => {
  let counter;

  beforeEach(async () => {
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy("My counter", 1);
  });

  describe("Deployment", () => {
    it("stores the count", async () => {
      const count = await counter.getCount();
      expect(count).to.equal(1);
    });

    it("sets the initial name", async () => {
      const name = await counter.getName();
      expect(name).to.equal("My counter");
    });
  });

  describe("Counting", () => {
    it("increment", async () => {
      let trx = await counter.increment();
      await trx.wait();

      expect(await counter.getCount()).to.equal(2);
    });

    it("decrement", async () => {
      let trx = await counter.decrement();
      await trx.wait();

      expect(await counter.getCount()).to.equal(0);

      await expect(counter.getCount()).to.be.reverted;
    });
  });
});
