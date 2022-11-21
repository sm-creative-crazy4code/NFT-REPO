const {network,getNamedAccounts, ethers} = require("hardhat")
const {developmentChains, networkConfig}= require("../helper-hardhat-config")
const{verify}= require("../utils/verify")
const fs= require("fs")
require("dotenv").config()

module.exports= async function({getNamedAccounts,deployments}){
    const {deploy,log}= deployments
    const {deployer}=await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUSDPricefeedAddress
  
if(developmentChains.includes(network.name)){
    ethUSDPricefeed = await ethers.getContract("MockV3Aggregator")
    ethUSDPricefeedAddress= ethUSDPricefeed.address
}else{

    ethUSDPricefeedAddress = networkConfig[chainId].ethUsdPriceFeed
}

const sadSvg = await fs.readFileSync("./images/dynamicNft/sad.svg",{encoding: "utf8"})
const happySvg = await fs.readFileSync("./images/dynamicNft/happy.svg",{encoding: "utf8"})

args=[ethUSDPricefeedAddress,sadSvg,happySvg]

log("=====================================================================================")

const DynamicSvgNft= await deploy("DynamicSvgNft",{
    from:deployer,
    args:args,
    log:true,
    waitConfirmations:network.config.blockConfirmations || 1
})
log("========================================================================================")


if(!developmentChains.includes(network.name) && process.env.ETHER_SCAN_API){
    log("Verifying......")
    await verify(DynamicSvgNft.address,args)
}

}


module.exports.tags = ["all", "dynamicSvg", "main"]