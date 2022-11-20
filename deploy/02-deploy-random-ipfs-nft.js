const {ethers,network,getNamedAccounts} = require("hardhat")
const {developmentChains, networkConfig}= require("../helper-hardhat-config")
const{verify}= require("../utils/verify")
const{storeImage,storeTokenUriMetadata} = require("../utils/uploadToPinata")
require("dotenv").config()

const imagesLocation ="./images/randomNft"
const metadataTemplate={
    name:"",
    description:"",
    attributes:[{
        trait_type:"cuteness",
        value:100,

    }],



}
let tokenUris=[
    'ipfs://QmaGB1JRsagrNwh8D3w4u1QCAjXFcw7om2bTXrVH8FUW2v',
    'ipfs://QmeUhds4cx6X3hX6sxY7dMh9paKUaMfPHbvDvD6qEN923N',
    'ipfs://QmRvKeyT3Th5aSENrNEjFUaxC596sMJBzAWHmt4EwK8R4R'
  ]

  const FUND_VALUE="1000000000000000000000"

  
module.exports= async function({getNamedAccounts,deployments}){
    const {deploy,log}= deployments
    const {deployer}=await getNamedAccounts()
    const chainId= network.config.chainId
    
    if(process.env.UPLOAD_TO_PINATA=="true"){
        tokenUris= await handelTokenuri()
    }
   

      
    
    let vrfCoordinatorV2address,subscriptionId,vrfCoordinatorV2Mock
    if(developmentChains.includes(network.name)){
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId,FUND_VALUE)

    }else{
       vrfCoordinatorV2address= networkConfig[chainId].vrfCoordinatorV2
       subscriptionId = networkConfig[chainId].subscriptionId
    }

log("===============================================================")

const args= [vrfCoordinatorV2address,
             subscriptionId,
             networkConfig[chainId].gasLane,
             networkConfig[chainId].callbackGasLimit,
             networkConfig[chainId].mintFee,
             tokenUris,
             ]
/**
 * deploying "RandomIpfsNft" (tx: 0x1b63b52360079696343ab645bb4e31d0d957936c1edd4cef20545539daa09b64)...: 
 * deployed at 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 with 3465887 gas
 */


const randomIpfsNft = await deploy("RandomIpfsNft",{
    from:deployer,
    args:args,
    log:true,
    waitConfirmations:network.config.blockConfirmations || 1

})

log("=========================================================")

if(!developmentChains.includes(network.name) && process.env.ETHER_SCAN_API){
    log("Verifying......")
    await verify(randomIpfsNft.address,args)
}

log("==========================================================")


async function handelTokenuri(){
// store image in ipfs 
tokenUris=[]
const {reaponses:imageUploadResponses,files}=await storeImage(imagesLocation)
// Creating the metadata
let imageUploadResponseIndex
for(imageUploadResponseIndex in imageUploadResponses){
    let tokenUriMetaData = {...metadataTemplate}
    tokenUriMetaData.name = "adorable dogs"
    tokenUriMetaData.description= "a collection of random adorable puppies nfts"
    tokenUriMetaData.image=`ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
    console.log(`Uploading doggies...`)
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetaData)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
}
// store metadata  in ipfs
console.log("Token URIs uploaded! They are:")
console.log(tokenUris)
return tokenUris

}



}
module.exports.tags = ["all", "randomipfs", "main"]

/**
//  *  'ipfs://QmaGB1JRsagrNwh8D3w4u1QCAjXFcw7om2bTXrVH8FUW2v',  
//  * 'ipfs://QmeUhds4cx6X3hX6sxY7dMh9paKUaMfPHbvDvD6qEN923N', 
//  *  'ipfs://QmRvKeyT3Th5aSENrNEjFUaxC596sMJBzAWHmt4EwK8R4R'
 * 
 */

/**
 Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0x40f0cf481577f865868cbf7389a33208795f8c04854496287ab891a9e86009ad)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 2543096 gas
deploying "MockV3Aggregator" (tx: 0xdab167934570703e5ef43bb71045c618dbfb53cdc384d41e6e6a7fd9a9916462)...: deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 with 558433 gas
Mocks Deployed!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
You are deploying to a local network, you'll need a local network running to interact
Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
========================================================================================
deploying "BasicNFT" (tx: 0x37579b8201e6d9e610cf1bf63f7c7321f55fe4e159fef4a1edd0563bcf7f6dbf)...: deployed at 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 with 2120608 gas
===============================================================
deploying "RandomIpfsNft" (tx: 0x1b63b52360079696343ab645bb4e31d0d957936c1edd4cef20545539daa09b64)...: deployed at 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9 with 3465887 gas
=========================================================
==========================================================* 
 * 
 * 

 */