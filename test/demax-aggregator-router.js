import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first

    // bsc mainnet test case
    let burger = '0xae9269f27437f0fcbc232d39ec814844a51d6b8f'
    let usdt = '0x55d398326f99059fF775485246999027B3197955'
    let busd = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    let bnb = '0x0000000000000000000000000000000000000000'

    // query burger price
    console.time("1")
    let burgerPrice = await chainApi.demaxAggregatorRouter.getRate(burger, usdt, 0)
    console.log('====burger price: ', burgerPrice)
    console.timeEnd("1")
    /*
    ====burger price:  1.1984
    1: 528.758ms
    */

    // query bnb price
    console.time("2")
    let bnbPrice = await chainApi.demaxAggregatorRouter.getRate(bnb, usdt, 0)
    console.log('====bnb price: ', bnbPrice)
    console.timeEnd("2")
    /*
    ====bnb price:  400.8581
    2: 148.221ms
    */

    // query busd price
    console.time("3")
    let busdPrice = await chainApi.demaxAggregatorRouter.getRate(busd, usdt, 0)
    console.log('====busd price: ', busdPrice)
    console.timeEnd("3")
    /*
    ====busd price:  1.0034
    3: 272.907ms
    */
}

main();