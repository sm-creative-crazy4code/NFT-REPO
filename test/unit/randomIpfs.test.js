const { inputToConfig } = require("@ethereum-waffle/compiler");
const { assert, expect } = require("chai");
const { ethers } = require("ethers");
const { networks } = require("../../hardhat.config");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(networks.name)
  ? describe.skip()
  : describe("Random NFT Contract", () => {
      let deployer, randomIpfsNft, vrfCoordinatorV2;
      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        await ethers.fixtures(["RandomIpfsNft", "VRFCoordinatorV2Mock"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft");
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      });

      describe("constructor",()=>{
        it ("intializes the correct parameters", async()=>{
         const dogUri = await randomIpfsNft.gettokenURI(0)
         assert(dogUri.includes("ipfs://"))

        }) })

        describe("requestNft",async()=>{

          it("gets reverted when not supplied with enough eth", async()=>{
               await expect( randomIpfsNft.requestNft()).to.be.revertedWith(RandomIpfsNft__insufficientETH)
              })

          it("it emits an event and starts of request random words",async()=>{
            const fee = await randomIpfsNft.getMintFee()
            await expect(randomIpfsNft.requestNft({value:fee.tostring()})).to.emit("NftRequested")

          })
        })

     describe("fulfillRandomWords",()=>{
     it("it mints an nft after a random number is retruned", async()=>{
     await new Promise(async(resolve,reject)=>{
        randomIpfsNft.once("NftNinted", async()=>{
         try {
          const tokenUri = await randomIpfsNft.gettokenURI("0")
          const tokenCounter = await randomIpfsNft.getTokenCounter()
          assert.equal(tokenUri.toString().includes("ipfs://"),true)
          assert.equal(tokenCounter.toString(),"1")
          resolve
         } catch (e) {
          console.log(e)
          reject(e)}
        })

        try{
        const fee = await randomIpfsNft.getMintFee()
        const requestNftResponse = await randomIpfsNft.requestNft({value:fee.toString()})
        const requestNftReceipt = await requestNftResponse.wait(1)
        await vrfCoordinatorV2Mock.fulfillRandomWords(
          requestNftReceipt.events[1].args.requestId,
          randomIpfsNft.address
        )}catch(e){
          console.log(e)
          reject(e)
           }
        })
       })
   })



   describe("getBreedFromModdedRng",()=>{
     

    it("should return a pug if moddedrng is less than 10", async()=>{
      const expectedBreed = await randomIpfsNft.getBreedFromModdedRng(6)
      assert.equal(expectedBreed,0)
      })
      it("should return a shiba if moddedrng is less than 10 - 39", async()=>{
        const expectedBreed = await randomIpfsNft.getBreedFromModdedRng(16)
        assert.equal(expectedBreed,1)
        })
        it("should return a st breanrd if moddedrng is less than 40- 99", async()=>{
          const expectedBreed = await randomIpfsNft.getBreedFromModdedRng(66)
          assert.equal(expectedBreed,2)
          })

          it("should revert with outofbound error if mod rng  greater than 99" ,async()=>{
            await expect(randomIpfsNft.getBreedFromModdedRng(100)).to.be.revertedWith("RandomIpfsNft__boundOverflow(")


          })


   })


    });