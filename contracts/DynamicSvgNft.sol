// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract DynamicSvgNft is ERC721, Ownable {
  uint256 private s_tokenCounter;
  string private i_sad_svgURI;
  string private i_happy_svgURI;
  string private constant BASE64_ENCODED_SVG_PREFIX ="data:image/svg+xml;base64,";
  AggregatorV3Interface internal immutable i_pricefeed;
  mapping (uint256=>int256) public s_tokenidToHighValue;


  event CreateNFT(uint256 indexed tokenId,int256 highValue);

  constructor(
    address priceFeedAddress,
    string memory sad_svg,
    string memory happy_svg
  ) ERC721("Dynamic SVG Nft", "DSN") {
    s_tokenCounter = 0;
    i_sad_svgURI = svgToImgUri(sad_svg);
    i_happy_svgURI =svgToImgUri(happy_svg);
    i_pricefeed= AggregatorV3Interface(priceFeedAddress);
  }
   
  /**@dev svg code cannot be passed directly on chain and hence creating a function to convert svg to uri by base64 encoding*/

  function svgToImgUri(string memory svg) public pure returns (string memory ) {
    string memory svgBase64Encoded = Base64.encode(
      bytes(string(abi.encodePacked(svg)))
    );
    return
      string(abi.encodePacked(BASE64_ENCODED_SVG_PREFIX, svgBase64Encoded));
  }


/**@notice this allows the minter to set the high value
   below which the nft image will chage
   to impliment this as each minter will have a unique high 
   value we will use mapping
 */
  function mintNft(int256 highValue) public {
    s_tokenidToHighValue[s_tokenCounter]= highValue;
    s_tokenCounter = s_tokenCounter + 1;
    _safeMint(msg.sender, s_tokenCounter);
    


    emit CreateNFT(s_tokenCounter,highValue);
  }

  /**@dev similar to as we are getting a prefix for images base64 code the function
     below returns the prrefix for json
 */

  function _baseURI() internal pure override returns (string memory) {
    return "data:application/json;base64";
  }

  /**@dev here we are not only needing the uri but we need the metadata as well .we need ot to return a jsom object that 
     has an image feild having the necessary uri and that will locate the image
     steps to achieve this
     base64 encode the image ===>stick url into json====>base64 encode json to achieve json uri!!!!
     the fumction below just gives the base64 hash
*/
  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    require(_exists(tokenId), "uri query for non-existent token");
     (,int256 price, , , )= i_pricefeed.latestRoundData();
     string memory imageURI = i_sad_svgURI ;
     if(price >= s_tokenidToHighValue[tokenId]){
        imageURI = i_happy_svgURI ;
     }


    return
      string(
        abi.encodePacked(
          _baseURI(),
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                name(),
                '","description:"An NFT that changes based on the chainlink price feed",',
                '"attributes":["trait_type":"coolness", "value":100],"image": "',
                imageURI,
                '"}'
              )
            )
          )
        )
      );
  }
}
