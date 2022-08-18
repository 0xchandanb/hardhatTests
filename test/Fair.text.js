const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Fair", function () {

	let acc1;
	let acc2;
	let acc3;
	let acc4;
	let acc5;
	let fair;

	beforeEach(async function() {
		[acc1, acc2, acc3, acc4, acc5] = await ethers.getSigners();
		const Fair = await ethers.getContractFactory("Fair", acc1);
		fair = await Fair.deploy();
		await fair.deployed();
		console.log(fair.address);
	})

	it("1 should be deployed", async function() {
		expect(fair.address).to.be.properAddress
	})

	it("2 create game. positive ", async function() {
		const tx = await fair.createGame(12, 1, {value: 100})
		//const tx2 = await fair.connect(acc2).joinGame(1,1, {value: 100})
		const tx2 = await fair.getActualGames()
		// const txtx = await fair.connect(acc3).joinGame(0, 12, {value: 100})
		// const txtx2 = await fair.connect(acc4).joinGame(0, 12, {value: 100})
		// const txtx3 = await fair.connect(acc5).joinGame(0, 12, {value: 100})
		console.log(tx2 + 'fdf')
		//expect(tx2.value).to.eq(0)
	})

	// ---- ????????? -----------------------
	it("3 create game. negative ", async function() {
		const tx = await fair.createGame(2, 0, {value: 100})
		//const tx2 = await fair.connect(acc2).joinGame(1,1, {value: 100})
		const tx2 = await fair.getActualGames()
		const txtx = await fair.connect(acc3).joinGame(0, 12, {value: 100})
		const txtx2 = await fair.connect(acc4).joinGame(0, 12, {value: 100})
		const txtx3 = await fair.connect(acc5).joinGame(0, 12, {value: 100})
		console.log(tx2 + 'fdf')
		//expect(tx2.value).to.eq(0)
	})

	it("4 connect to 2 game ", async function() {
		const tx = await fair.createGame(0, 0, {value: 100})
		const txe = await fair.createGame(0, 2, {value: 100})
		//const tx2 = await fair.connect(acc2).joinGame(1,1, {value: 100})
		const tx2 = await fair.getActualGames()
		const txtx = await fair.connect(acc3).joinGame(1, 12, {value: 100})
		const txtx2 = await fair.connect(acc4).joinGame(0, 12, {value: 100})
		const txtx3 = await fair.connect(acc5).joinGame(0, 12, {value: 100})
		console.log(tx2 + 'fdf')
		//expect(tx2.value).to.eq(0)
	})

	it("getActualGames() test. positive", async function() {
		const tx = await fair.createGame(12, 4, {value: 100})
		const tx2 = await fair.getActualGames()
		console.log(tx)
		console.log(tx2[3])
		expect(tx2[3]).to.eq(0)
		expect(tx2[4]).to.eq(4)
	})

	it("getNumber() test. positive", async function() {
		const tx = await fair.createGame(12, 4, {value: 100})
		const tx2 = await fair.getNumbers(0)
		expect(tx2[0]).to.eq(12)
	})

	// ------------------ ??? -------- те я из постороннего адреса узнал заветное число
	it("getNumber() test. negative", async function() {
		const tx = await fair.createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).getNumbers(0)
		expect(tx2[0]).to.eq(12)
	})

	it("getOwner() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).getOwner(0)
		expect(tx2).to.eq(acc2.address)
	})

	it("getOwner() test. negative", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).getOwner(0)
		expect(tx2).not.to.eq(acc3.address)
	})

	//---------??? я не должен узнавать число с постороннего адреса
	it("getBet() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).getBet(0, acc2.address)
		expect(tx2).to.eq(12)
	})

	it("getBet() test. negative", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).getBet(0, acc2.address)
		expect(tx2).not.to.eq(14)
	})

	// why lacky number always equal 100 ????
	it("getUserGames() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).getUserGames(acc2.address)
		console.log(tx2)
		expect(tx2[3]).to.eq(0)
	})

	it("gamesList() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).gamesList(0)
		console.log(tx2)
		expect(tx2[1]).to.eq(false)
		expect(tx2[0]).to.eq(acc2.address)
	})

	it("biddersList() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).biddersList(0, acc2.address)
		expect(tx2[0]).to.eq(true)
		expect(tx2[1]).to.eq(12)
	})

	it("prizeList() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		const tx2 = await fair.connect(acc4).prizeList(acc2.address, 0)
		expect(tx2[0]).to.eq(false)
		expect(tx2[1]).to.eq(false)
		expect(tx2[2]).to.eq(0)
	})

	it("finishGame() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		await network.provider.send("evm_increaseTime", [13600])
		const tx2 = await fair.connect(acc2).finishGame(0)
		const tx3 = await fair.connect(acc2).prizeList(acc2.address, 0)
		expect(tx3[0]).to.eq(true)
	})

	it("claim() test. positive", async function() {
		const tx = await fair.connect(acc2).createGame(12, 4, {value: 100})
		await network.provider.send("evm_increaseTime", [13600])
		const tx2 = await fair.connect(acc2).finishGame(0)
		const tx3 = await fair.connect(acc2).claim(0)

		await expect(() => tx3).to.changeEtherBalance(acc2, 100)
	})
})
