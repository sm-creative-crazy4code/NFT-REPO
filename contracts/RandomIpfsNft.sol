// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "hardhat/console.sol";

error RandomIpfsNft__boundOverflow();
error RandomIpfsNft__insufficientETH();
error RandomIpfsNft__transferFailed();

contract RandomIpfsNft is VRFConsumerBaseV2,ERC721URIStorage,Ownable{

// type breed

enum Breed{
    PUB,
    SHIBA_INU,
    ST_BRENARD
}


  
VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
uint64 private immutable i_subscriptionId;
uint32 private immutable i_callbackGasLimit;
bytes32 i_gaslane;
uint16 private constant REQUEST_CONFIRMATIONS=3;
uint32 private constant NUM_WORDS=1;
// vrf helper
mapping (uint256=>address) public s_requestIdToSender;

// event
event NftRequested( uint indexed requestid, address requestor );
event NftMinte( Breed Dogbreed,address minter);


//token counter
uint256 public  s_tokenCounter;
uint256 internal constant MAX_CHANCE_VALUE =100;
string[] internal s_dogTokenUris;
uint256 internal immutable i_mintFee;


constructor(
address vrfCoordinatorV2,
uint64 subscriptionId,
bytes32 gaslane,
uint32 callbackGasLimit, 
uint256 mintFee,
string[3] memory dogTokensUris)
VRFConsumerBaseV2(vrfCoordinatorV2)ERC721("Random IPFS NFT","RIN")
{
i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
i_subscriptionId=subscriptionId;
i_callbackGasLimit=callbackGasLimit;
i_gaslane= gaslane;
i_mintFee=mintFee;




}

    function requestNft() public payable returns (uint256 requesId){
    if(msg.value<i_mintFee ){
        revert RandomIpfsNft__insufficientETH();
    }
    requesId=i_vrfCoordinator.requestRandomWords(
        i_gaslane,
        i_subscriptionId,
        REQUEST_CONFIRMATIONS,
        i_callbackGasLimit,
        NUM_WORDS
  );
    s_requestIdToSender[requesId]= msg.sender;
    emit NftRequested(requesId,msg.sender);
}
 
/**@notice request randomo words occur in 2 transaction request and fulfill
here as chainlink node calls the fulfill random words and here as we are 
as we call safemnint function inside the fulfill random words the chainlink node will 
be actually minting the nft hence we will create a mapping for requst ids and call for 
same request ids as we call the  requests nft  function
    moddedRngs= between 0 to 99
    if moddedrngd between 0  to 10 =>pug;
    between 10 to 30=> shiba
    between 30-100= sts*/

function fulfillRandomWords( uint256 requesId,uint256[] memory randomWords)internal override{
    address dogOwner=s_requestIdToSender[requesId];
    uint256 newTokenid= s_tokenCounter;
    uint256 moddedRngs = randomWords[0]% MAX_CHANCE_VALUE;
    Breed Dogbreed = getBreedFromModdedRng(moddedRngs);
    s_tokenCounter+=s_tokenCounter;
    _safeMint(dogOwner,newTokenid);
    _setTokenURI(newTokenid,s_dogTokenUris[uint256(Dogbreed)]);
    emit NftMinte(Dogbreed,dogOwner);
}


function getBreedFromModdedRng(uint256 moddedrng) public pure returns(Breed){
    uint256 cumulativeSum=0;
    uint256[3] memory chanceArray = getChanceArray();
    for(uint256 i = 0; i< chanceArray.length; i++){
        if(moddedrng >= cumulativeSum && moddedrng< cumulativeSum+chanceArray[i]){
          return Breed(i);
        }
        cumulativeSum+=chanceArray[i];
    }

    revert RandomIpfsNft__boundOverflow();

}
    

/**@dev creating chances for each of the dog nft
so as to make these dog different rareities
 */

 function getChanceArray() public pure returns (uint256[3] memory){
// index 0 has 10 percent chance of happening and 1 has 20(30-10) and s o on
 return [10,30,MAX_CHANCE_VALUE];

 }

 function withdraw() public onlyOwner{
    uint256 amount = address(this).balance;
    (bool success,)= payable(msg.sender).call{value:amount}("");
    if(!success){
        revert  RandomIpfsNft__transferFailed();
    }


 }

 function getMintFee() public view  returns (uint256){
    return i_mintFee;
    
    }
    


    function getTokenCounter() public view  returns (uint256){
        return s_tokenCounter;
        
        }
            


function gettokenURI(uint256 index) public view  returns (string memory){
return s_dogTokenUris[index];

}


}