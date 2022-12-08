import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first

    // instance nft 
    let contractAddr = '0xF5A0BAc3DF6a149617dD1097271B781FFb55e606'
    let ins = new chainApi.ERC721Token(chainApi.chainWeb3, contractAddr)
    
    // query poolConfig
    let poolConfig = await chainApi.nftFixedswap.getConfig()
    console.log('====poolConfig: ', poolConfig)

    // nft approve available tokenIds [2, 3, 4, 5]
    let tokenId = '2'
    let approveRes = await ins.approve(chainApi.nftFixedswap.address, tokenId)
    console.log('====approveRes: ', approveRes.transactionHash)

    // createERC721
    let token0 = contractAddr
    let token1 = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd' // bsc test USDT
    let createRes = await chainApi.nftFixedswap.createErc721(
        'TestPool1',
        token0,
        token1,
        tokenId,
        '1000000000000000000',
        '1645611075',
        false,
    )
    console.log('====createRes: ', createRes.transactionHash)

    // get pool count
    let poolCount = await chainApi.nftFixedswap.getPoolCount()
    console.log('====poolCount: ', poolCount)
    
    // get pool info
    let index = '0'
    let pool = await chainApi.nftFixedswap.getPool(index)
    console.log('====pool: ', pool)
}

main();