import chainApi from '../backend/ChainApi.js';
import DemaxLPABI from '../src/abi/DemaxLP.json';
import {Tokens} from '../src/ChainConfig.js';

async function getTokenList() {
    chainApi.chainWeb3.connect(); // must call connect first

    let tokenList = await chainApi.demaxDelegate.getTokenList(0, 2)
    console.log('====tokenList: ', tokenList)
}

async function getLiquidityList() {
    chainApi.chainWeb3.connect(); // must call connect first

    let liquidityList = await chainApi.demaxDelegate.getLiquidityList();
    console.log('====liquidityList: ', liquidityList)
}

async function calculate() {
    chainApi.chainWeb3.connect(); // must call connect first

    let tokenA = "0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24"
    let tokenB = "0xF2ED382e6A3439Be124813842200cf6702fD6ecA"
    let amountA = "100"
    let liquidityResult = await chainApi.demaxDelegate.getAmountLiquidity(tokenA, tokenB, amountA)
    console.log('====liquidityResult: ', liquidityResult)
}

async function addLiquidity() {
    chainApi.chainWeb3.connect();

    let txhash = "0xcab864e6ed88a883c621797440660e8817c791616e6cc3f241af152018517c81"
    let receipt = await chainApi.chainWeb3.awaitTransactionMined(txhash)
    let res = chainApi.web3Util.parseEventLog(chainApi.chainWeb3.web3, DemaxLPABI, receipt , 'AddLiquidity')
    console.log("==============addLiquidity==============")
    console.log("lp: ", res.address)
    console.log('amountA', res.returnValues.amountA)
    console.log('amountB', res.returnValues.amountB)
    let lpIns = new chainApi.DemaxLp(chainApi.chainWeb3, res.address)
    let tokens = await lpIns.tokens()
    console.log('tokenA: ', tokens.tokenA)
    console.log('tokenB: ', tokens.tokenB)
}

async function removeLiquidity() {
    chainApi.chainWeb3.connect();

    let txhash = "0x0db82eb42cc0e86ea8d51245b5d582ce80cd2397845cb59d91ee7c6b4ab7e7e7"
    let receipt = await chainApi.chainWeb3.awaitTransactionMined(txhash)
    let res = chainApi.web3Util.parseEventLog(chainApi.chainWeb3.web3, DemaxLPABI, receipt , 'RemoveLiquidity')
    console.log("==============removeLiquidity==============")
    console.log("lp: ", res.address)
    console.log('amountA', res.returnValues.amountA)
    console.log('amountB', res.returnValues.amountB)
    let lpIns = new chainApi.DemaxLp(chainApi.chainWeb3, res.address)
    let tokens = await lpIns.tokens()
    console.log('tokenA: ', tokens.tokenA)
    console.log('tokenB: ', tokens.tokenB)
}

async function getAmountLiquidity(chainId) {
    chainApi.chainWeb3.connect(chainId); // must call connect first
    let res = await chainApi.demaxDelegate.getAmountLiquidity('0x0000000000000000000000000000000000000000',Tokens[chainId].USDT,'1000000000000000000');
    console.log('getAmountLiquidity:', chainId, res);
}

async function main() {
    await getAmountLiquidity(56);
}

main();