// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract BasicNFT is ERC721{

//we will use the  tokencounter as tokenid 
 uint256 private s_tokenCounter;
 string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";



    constructor() ERC721("Doggie","DOG"){
       s_tokenCounter=0;
    }

     /** @dev this is technically an nft but it has nothing about its description
     tokenuri tells exactly how the token will look like which returns an url which
      which returns a jason having an image feild which actually points to what the nft actually looks like 
    */


    function mintNft() public returns (uint256){
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter=s_tokenCounter+1;
        return s_tokenCounter;

    }

   
   /**@dev overriding this tokenuri function in order to get the tokenuri
*/

   function tokenURI(uint256 /*tokenId*/) public pure override returns(string memory){
    return TOKEN_URI;
   }

   

    /** @dev getter function
    */
   function getTokenCounter() public view returns (uint256){
    return s_tokenCounter;}


}

