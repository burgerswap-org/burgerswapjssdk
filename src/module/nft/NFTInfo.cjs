const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');

class NFTInfo {
  constructor(moralisKey) {
    (async () => {
      await Moralis.start({ apiKey: moralisKey });
    })();
  }

  async getNFTImages(chainId, account, nftAddress, cursor) {
    let result = {
      hasNext: false,
      cursor: null,
      nftImgs: []
    }

    let chain = chainId == 56 ? EvmChain.BSC : EvmChain.ETHEREUM;

    const nftResponse = await Moralis.EvmApi.nft.getWalletNFTs({
      address: account,
      chain,
      tokenAddresses: [nftAddress],
      limit: 50,
      cursor: cursor
    });

    if (nftResponse.pagination.total == 0) return result;
    result.hasNext = nftResponse.hasNext()
    if (result.hasNext) result.cursor = nftResponse.pagination.cursor;

    let moralisIPFSPrefix = "https://ipfs.moralis.io:2053/ipfs/"
    for (let i = 0; i < nftResponse.jsonResponse.result.length; i++) {
      let tokenId = nftResponse.jsonResponse.result[i].token_id;
      let image = JSON.parse(nftResponse.jsonResponse.result[i].metadata).image;
      if (image.startsWith('ipfs://')) {
        image = image.replace('ipfs://', moralisIPFSPrefix)
      }
      result.nftImgs.push({ tokenId, image });
    }

    return result;
  }

  async getNFTMetadata(chainId, nftAddress, tokenId) {
    let chain = chainId == 56 ? EvmChain.BSC : EvmChain.ETHEREUM;
    const response = await Moralis.EvmApi.nft.getNFTMetadata({
      address: nftAddress,
      chain,
      tokenId,
    });

    return response;
  }
}

module.exports = { NFTInfo };
