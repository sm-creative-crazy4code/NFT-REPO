const pinataSDK = require('@pinata/sdk');
const path = require("path")
const fs= require("fs")
require("dotenv").config()

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET_KEY = process.env.PINATA_API_SECRET_KEY

const pinata = new pinataSDK({ pinataApiKey: PINATA_API_KEY, pinataSecretApiKey:  PINATA_API_SECRET_KEY });

async function storeImage(imagesFilePath){
const fullImagesPath = path.resolve(imagesFilePath)
const files= fs.readdirSync(fullImagesPath)

let reaponses=[]
console.log("uploading to ipfs")
for(fileindex in files){

    const readableFileStream = fs.createReadStream(`${fullImagesPath}/${files[fileindex]}`)
    const options = {
        pinataMetadata: {
            name: "MyCustomPuppiesNFT",
            keyvalues: {
                customKey: 'customValue',
                customKey2: 'customValue2'  
            }
        },
        
    }
    try{
        let response = await pinata.pinFileToIPFS(readableFileStream,options)
        reaponses.push(response)
    }catch(error){
        console.log(error)
    }    
}
return {reaponses, files}

}
async function storeTokenUriMetadata(metadata){
    try {
        
        const response = pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
        
    }
    
   return null
}
module.exports= {storeImage,storeTokenUriMetadata}