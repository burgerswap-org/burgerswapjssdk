import chainApi from '../backend/ChainApi.js';
import BurgerAggregatorABI from '../src/abi/BurgerAggregator.json';
import DemaxLPABI from '../src/abi/DemaxLP.json';
import ERC20TokenABI from '../src/abi/ERC20Token.json';

async function parseEventSwap() {
  chainApi.chainWeb3.connect(); // must call connect first

  // bsc testnet case
  let txHash = "0xacaf5bcc6b872955c63d59265f1f67a30dd68db9a160f991502de70eb5382c5c"
  let receipt = await chainApi.chainWeb3.awaitTransactionMined(txHash)
  let res = chainApi.web3Util.parseEventLog(chainApi.chainWeb3.web3, BurgerAggregatorABI, receipt , 'Swap')
  console.log(res)

/*
{
  eventName: 'Swap',
  transactionHash: '0xacaf5bcc6b872955c63d59265f1f67a30dd68db9a160f991502de70eb5382c5c',
  blockNumber: 18488579,
  address: 0xe031f198b666C125B53f731AB3e538FE117A3c2a,
  returnValues: Result {
    '0': '0x50700fF31F97304Eb7b0615b7c1c31D4973943E4',
    '1': '0x941Af07A986b92f7584e78999E73D124e823Ee0B',
    '2': '0x6a6E31Bd0a803e012ad3F59A83B207F39A748Dea',
    '3': '100000000000000000000',
    '4': '299170572222380405995',
    __length__: 5,
    swaper: '0x50700fF31F97304Eb7b0615b7c1c31D4973943E4',
    fromToken: '0x941Af07A986b92f7584e78999E73D124e823Ee0B',
    destToken: '0x6a6E31Bd0a803e012ad3F59A83B207F39A748Dea',
    amount: '100000000000000000000',
    returnAmount: '299170572222380405995'
  }
}
*/
}

async function parseEventAddLiquidity() {
  chainApi.chainWeb3.connect(); // must call connect first

  // bsc testnet case
  let txHash = "0xcab864e6ed88a883c621797440660e8817c791616e6cc3f241af152018517c81"
  let receipt = await chainApi.chainWeb3.awaitTransactionMined(txHash)
  let res = chainApi.web3Util.parseEventLog(chainApi.chainWeb3.web3, DemaxLPABI, receipt , 'AddLiquidity')
  console.log(res)

/*
{
  eventName: 'AddLiquidity',
  transactionHash: '0xcab864e6ed88a883c621797440660e8817c791616e6cc3f241af152018517c81',
  blockNumber: 19035661,
  address: '0x1Cf80fe91Fed5Be77D6cD23a7D62974BD588c6eA',
  returnValues: Result {
    '0': '0x50700fF31F97304Eb7b0615b7c1c31D4973943E4',
    '1': '100000000000000000000',
    '2': '100000000000000000000',
    '3': '100000000000000000000',
    __length__: 4,
    user: '0x50700fF31F97304Eb7b0615b7c1c31D4973943E4',
    amountA: '100000000000000000000',
    amountB: '100000000000000000000',
    value: '100000000000000000000'
  }
}
*/
}

async function parseEventTransfer() {
  chainApi.chainWeb3.connect(); // must call connect first

  // bsc testnet case
  let swapTxhash = "0xacaf5bcc6b872955c63d59265f1f67a30dd68db9a160f991502de70eb5382c5c"
  let swapReceipt = await chainApi.chainWeb3.awaitTransactionMined(swapTxhash)
  let swapRes = chainApi.web3Util.parseEventLogs(chainApi.chainWeb3.web3, ERC20TokenABI, swapReceipt , 'Transfer')
  console.log("swapRes: ", swapRes)

  let addLiquidityTxHash = "0xcab864e6ed88a883c621797440660e8817c791616e6cc3f241af152018517c81"
  let addReceipt = await chainApi.chainWeb3.awaitTransactionMined(addLiquidityTxHash)
  let addRes = chainApi.web3Util.parseEventLogs(chainApi.chainWeb3.web3, ERC20TokenABI, addReceipt , 'Transfer')
  console.log("addRes: ", addRes)

  let removeLiquidityTxHash = "0xcab864e6ed88a883c621797440660e8817c791616e6cc3f241af152018517c81"
  let removeReceipt = await chainApi.chainWeb3.awaitTransactionMined(removeLiquidityTxHash)
  let removeRes = chainApi.web3Util.parseEventLogs(chainApi.chainWeb3.web3, ERC20TokenABI, removeReceipt , 'Transfer')
  console.log("removeRes: ", removeRes) 

/*
*/
}

async function parseGasTokenTransfer() {
  chainApi.chainWeb3.connect(); // must call connect first

  let txhash = "0xaca4da7376b8e6d554b9b2241045fd5f3a37f0f71bf699f5cb1e6c07d3b62b4a"
  let receipt = await chainApi.chainWeb3.awaitTransactionMined(txhash)
  console.log("receipt", receipt)
}

async function main() {
  // await parseEventSwap()
  // await parseEventAddLiquidity()
  // await parseEventTransfer()
  await parseGasTokenTransfer()
}


main();