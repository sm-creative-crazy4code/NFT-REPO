const {network,getNamedAccounts} = require("hardhat")
const {developmentChains}= require("../helper-hardhat-config")
const{verify}= require("../utils/verify")
require("dotenv").config()

module.exports= async function({getNamedAccounts,deployments}){
    const {deploy,log}= deployments
    const {deployer}=await getNamedAccounts()
    log("========================================================================================")
    const args= []
    const basicNFT= await deploy("BasicNFT",{
        from:deployer,
        args:args,
        log:true,
        waitConfirmations:network.config.blockConfirmations || 1,
    })


    if(!developmentChains.includes(network.name)&& process.env.ETHER_SCAN_API){
   log("Verifying.....")
   await verify(basicNFT.address,args)
    }

}

/**deploying "BasicNFT" (tx: 0xdecfc77a12b84c6c655ee832d79c9d794ea42449fc4d2f4ad1e44f20c8841ce2)...: deployed at ith 2120608 gas */