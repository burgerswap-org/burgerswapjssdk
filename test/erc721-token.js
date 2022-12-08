import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first

    let contractAddr = '0xb25ABa4106ff5844C4d7153CA268e91991974942'
    let ins = new chainApi.ERC721Token(chainApi.chainWeb3, contractAddr)

    let info = await ins.info()
    console.log('====info: ', info)

    // let tokenURI = "test/tokenURI"
    // let mintRes = await ins.mint(chainApi.chainWeb3.account, tokenURI)
    // console.log('====mint txhash', mintRes.transactionHash)

    // let emptyTokenURI = ""
    // let mintRes1 = await ins.mint(chainApi.chainWeb3.account, emptyTokenURI)
    // console.log('====mint txhash', mintRes1.transactionHash)

    // let tokenURIS = ["test/tokenURI", "test/tokenURI", "test/tokenURI"]
    // let batchMintRes = await ins.batchMint(chainApi.chainWeb3.account, 3, tokenURIS)
    // console.log('====batchMintRes txhash: ', batchMintRes.transactionHash)

    let batchMintRes = await ins.batchMint(chainApi.chainWeb3.account, 3)
    console.log('====batchMintRes txhash: ', batchMintRes.transactionHash)

    // let balance = await ins.balanceOf(chainApi.chainWeb3.account)
    // console.log('====balance: ', balance)

    // let cursor = '0'
    // let size = '100'
    // let tokenIds = await ins.tokensOfOwnerBySize(chainApi.chainWeb3.account, cursor, size)
    // console.log('====tokenIds: ', tokenIds)
}

main();