import chainApi from '../backend/ChainApi.js';
import {Tokens} from '../src/ChainConfig.js';

async function getPair(chainId) {
    chainApi.chainWeb3.connect(chainId); // must call connect first
    let res = await chainApi.demaxFactory.getPair(Tokens[chainId].BURGER,Tokens[chainId].USDT);
    console.log('getPair:', chainId, res);
}

async function existPair(chainId) {
    chainApi.chainWeb3.connect(chainId); // must call connect first
    let res = await chainApi.demaxFactory.existPair(Tokens[chainId].BURGER,Tokens[chainId].USDT);
    console.log('existPair:', chainId, res);
}

async function main() {
    await getPair(56);
    await existPair(56);
}

main();