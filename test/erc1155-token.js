import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first

    let contractAddr = '0xF34dFB50b76B028559822CB07fbFEf5F889C3fAb'
    let ins = new chainApi.ERC1155Token(chainApi.chainWeb3, contractAddr)

    let amount = '10'
    let tokenURI = "test/tokenURI"
    let mintRes = await ins.mint(chainApi.chainWeb3.account, amount, tokenURI)
    console.log('====mint txhash', mintRes.transactionHash)

    let tokenId = '0'
    amount = '10'
    let mintAmountRes = await ins.mintAmount(chainApi.chainWeb3.account, tokenId, amount)
    console.log('====mint txhash', mintAmountRes.transactionHash)

    let tokenIdAmount = '4'
    let amounts = ['10', '10', '10', '10']
    let tokenURIs = ['', '', '', '']
    let batchMintRes = await ins.batchMint(chainApi.chainWeb3.account, tokenIdAmount, amounts, tokenURIs)
    console.log('====batchMintRes txhash: ', batchMintRes.transactionHash)

    let accounts = [
        chainApi.chainWeb3.account,
        chainApi.chainWeb3.account,
        chainApi.chainWeb3.account,
        chainApi.chainWeb3.account,
        chainApi.chainWeb3.account
    ]
    let ids = ['0', '1', '2', '3', '4']
    let balance = await ins.balanceOfBatch(accounts, ids)
    console.log('====balance: ', balance)
}

main();