const { assert } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");



!developmentChains.includes(network)?
describe.skip : 
describe("basicNFT unit testd",function(){
    let deployer,basicNFT
  beforeEach(async()=>{
     let accounts = await ethers.getSigner()
     deployer= accounts[0]
     await  deployments.fixture(["basicnft"])
     basicNFT= await ethers.getContract("BasicNFT")
},

   describe("constructor",()=>{
    it("should initialise the correct parameters", async()=>{
      const name = await basicNFT.name()
      const symbol = await basicNFT.symbol()
      const tokenCounter = await basicNFT.getTokenCounter()

      assert.equal(name,"Doggie")
      assert.equal(symbol,"DOG")
      assert.equal(tokenCounter.toString(),"0")



    })
   }),

   describe("mintNft", () => {
    beforeEach(async()=>{

        const txResponse = await basicNFT.mintNft()
        await txResponse.wait(1)


    }) 



 it("allows to mint nfts and updates the correct patameters",async()=>{
    const tokenCounter = await basicNFT.getTokenCounter()
    const tokenUri = await basicNFT.tokenUri(0)

    assert.equal(tokenCounter.toString(),"1")
    assert.equal(tokenUri, await basicNFT.TOKEN_URI())

 })
it ("set the correct balance and owner of nft",async()=>{
    const deployerAddress= await deployer.address
    const balance = await basicNFT.balanceOf(deployerAddress)
    const owner = await basicNFT.ownerOf("1")
    
    assert.equal(balance.toString(), "1")
    assert.equal(owner, deployerAddress)




})
    })



)


}


)