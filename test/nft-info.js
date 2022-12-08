import { NFTInfo } from '../src/module/NFTInfo.cjs';

async function main() {
  let morilisApiKey = 'There should be your moralis api key'
  let ins = new NFTInfo(morilisApiKey);

  let zeroAccount = "0x07fF0ed51ABAf0ebeF2dDdabB463A0E17235de46"
  // BAYC
  let baycTokenId = 4483
  let baycAccount = "0x54BE3a794282C030b15E43aE2bB182E14c409C5e"
  let baycAddr = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"

  let baycMetadata = await ins.getNFTMetadata(0, baycAddr, baycTokenId)
  console.log(baycMetadata)

  let result = await ins.getNFTImages(0, baycAccount, baycAddr);
  console.log(result)

  // Moonbird
  let moonbirdTokenId = 8340
  let moonbirdAccount = "0x9ec8e8f64ec6bb47d944b4b830130b5fcf2da182"
  let moonbirdAddr = "0x23581767a106ae21c074b2276d25e5c3e136a68b"

  let moonbirdMetadata = await ins.getNFTMetadata(0, moonbirdAddr, moonbirdTokenId)
  console.log(moonbirdMetadata)

  let result2 = await ins.getNFTImages(0, moonbirdAccount, moonbirdAddr);
  console.log(result2)

  // Halo
  let haloTokenId = 300
  let haloAddr = "0x9d20cff2db7e1c23c3fc6ef000ea0f36b428e3f5"
  
  let haloMetadata = await ins.getNFTMetadata(0, haloAddr, haloTokenId)
  console.log(haloMetadata)

  // Lifeform
  let lifeformTokenId = 109370
  let lifeformAddr = "0xa2b2a7774e29f13e17f95b0fc9c0722e7be36e49"

  let lifeformMetadata = await ins.getNFTMetadata(56, lifeformAddr, lifeformTokenId)
  console.log(lifeformMetadata)
}

main();
