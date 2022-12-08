import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first
    
    let excuteCreatePool = false
    let excuteBidPool = true

    let token0 = '0xF5A0BAc3DF6a149617dD1097271B781FFb55e606'
    let availableTokenId = '1'
    let token1 = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd' // bsc test USDT

    if (excuteCreatePool) {
        // nft approve 
        let ins = new chainApi.ERC721Token(chainApi.chainWeb3, token0)
        let approveRes = await ins.approve(chainApi.nftEnglishAuction.address, availableTokenId)
        console.log('====approveRes: ', approveRes.transactionHash)

        // createERC721
        let now = (Date.now()/1000).toFixed()
        let duration = '864000'
        let createRes = await chainApi.nftEnglishAuction.createErc721(
            'TestPool1',
            token0,
            token1,
            availableTokenId,
            '1000000000000000000',
            '100000000000000000',
            '100000000000000000',
            '200000000000000000',
            now,
            duration,
            false,
        )
        console.log('====createRes: ', createRes.transactionHash)
    }

    // query poolConfig
    let poolConfig = await chainApi.nftEnglishAuction.getConfig()
    console.log('====poolConfig: ', poolConfig)

    // get pool count
    let poolCount = await chainApi.nftEnglishAuction.getPoolCount()
    console.log('====poolCount: ', poolCount)

    // get pool base info
    let index = '0'
    let poolBaseInfo = await chainApi.nftEnglishAuction.getPoolBaseInfo(index)
    console.log('====poolBaseInfo: ', poolBaseInfo)

    if (excuteBidPool) {
        // token1 approve
        let token1Ins = new chainApi.ERC20Token(chainApi.chainWeb3, token1)
        if (Number(await token1Ins.allowance(chainApi.nftEnglishAuction.address)) == 0) {
            let approveRes = await token1Ins.approve(chainApi.nftEnglishAuction.address)
            console.log('====approveRes: ', approveRes.transactionHash)
        }
        let amount1 = '200000000000000000'
        let bidRes = await chainApi.nftEnglishAuction.bid(index, amount1)
        console.log('====bidRes: ', bidRes.transactionHash)
    }

    let poolDynamicInfo = await chainApi.nftEnglishAuction.getPoolDynamicInfo(index)
    console.log('====poolDynamicInfo: ', poolDynamicInfo)
}

main();