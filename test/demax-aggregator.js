import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first

    // =======================bsc mainnet=======================
    // function getSwapInfo
    let fromTokenAddr = '0x0000000000000000000000000000000000000000' // BNB
    let destTokenAddr = '0x55d398326f99059fF775485246999027B3197955' // USDT
    let amount = "1"
    let gasPrice = 5
    console.time("1")
    let swapInfo = await chainApi.demaxAggregator.getSwapInfo(fromTokenAddr, destTokenAddr, amount, gasPrice)
    console.timeEnd("1")
    console.log('====swapInfo: ', swapInfo)

    // function getBestResult
    console.time("2")
    let bestResult = await chainApi.demaxAggregator.getBestResult(fromTokenAddr, destTokenAddr, amount, gasPrice)
    console.timeEnd("2")
    console.log('====bestResult: ', bestResult)


    // =======================bsc testnet=======================
    // let fromTokenAddr = '0x941Af07A986b92f7584e78999E73D124e823Ee0B'
    // let destTokenAddr = '0x6a6E31Bd0a803e012ad3F59A83B207F39A748Dea'
    // let amount = 10
    // let gasPrice = 20
    // let slide = 5
    // let aggregatorAddr = chainApi.chainWeb3.getContractAddr('DemaxAggregator')

    // let swapInfo = await chainApi.demaxAggregator.getBestResult(fromTokenAddr, destTokenAddr, amount, gasPrice)
    // console.log('====swapInfo: ', swapInfo)
    // console.log('====swapInfo: ', swapInfo.routesInfo.bestResult.routes)

    // let fromToken = new chainApi.ERC20Token(chainApi.chainWeb3, fromTokenAddr)
    // if (Number(await fromToken.allowance(aggregatorAddr)) == 0) {
    //     let approveRes = await fromToken.approve(aggregatorAddr)
    //     console.log('====approveRes: ', approveRes.transactionHash)
    // }


    // let swapRes = await chainApi.demaxAggregator.swap(
    //     [swapInfo.routesInfo.bestResult.routes[0].path],
    //     [swapInfo.routesInfo.bestResult.routes[0].amount],
    //     [swapInfo.routesInfo.bestResult.routes[0].returnAmount],
    //     [swapInfo.routesInfo.bestResult.routes[0].subRoutesDistribution],
    //     gasPrice,
    //     slide
    // )
    // console.log('====swapRes: ', swapRes.transactionHash)
}

main();