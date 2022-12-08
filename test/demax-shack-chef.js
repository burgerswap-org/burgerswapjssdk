import chainApi from '../backend/ChainApi.js';
import DemaxShackChef from '../src/abi/DemaxShackChef.json';

async function poolList() {
    chainApi.chainWeb3.connect(); // must call connect first

    //   name: 'USDT',
    //   address: '0xF2ED382e6A3439Be124813842200cf6702fD6ecA',
    //   pid: 1,
    //   tokenSymbol: 'USDT',
    //   rewardSymbol: 'XBurger',
    //   earnSymbol: 'BNB',
    //   userBalance: '827.884817448937632165',
    //   userAmount: '8200',
    //   userReward: '136124.2699689143248068',
    //   userEarn: '0',
    //   totalStake: '29685.950840358289973271',
    //   totalStakeValue: '29685.950840358289973271',
    //   weight: '1',
    //   depositCap: '0',
    //   accShare: '0',
    //   pendingReward: '4189.65',
    //   pendingEarn: '0',
    //   pendingRewardValue: '837.93',
    //   pendingEarnValue: '0',
    //   userAllowance: '57896044618658097711785492504343953926634992332820282009328.792003956564819967',
    //   earnApr: '0.00',
    //   earnApy: '0.00',
    //   rewardApy: '88.53'

    let poolList = await chainApi.demaxShackChef.getPoolList();
    console.log('====getPoolList', poolList);
}

async function poolInfo() {
    chainApi.chainWeb3.connect(); // must call connect first

    let poolInfo = await chainApi.demaxShackChef.getPoolInfo(1);
    console.log('====poolInfo', poolInfo);
}

async function shackStatistics(){
    chainApi.chainWeb3.connect(); // must call connect first

    let shackStatistics = await chainApi.demaxShackChef.getshackStatistics();
    console.log('====shackStatistics', shackStatistics);
}

async function getPools() {
    chainApi.chainWeb3.connect(); // must call connect first

    let pools = await chainApi.demaxShackChef.getPools()
    console.log('====pools', pools)
    return pools
}

async function getPool(poolIndex) {
    chainApi.chainWeb3.connect(); // must call connect first

    let pool =  await chainApi.demaxShackChef.getPool(poolIndex)
    console.log('====pool: ', pool)

    return pool
}

async function deposit() {
    chainApi.chainWeb3.connect(); // must call connect first

    // approve to pool
    // let pool = (await getPools())[0]
    // if (Number(pool.userAllowance) == 0) {
    //     let contractName = 'DemaxShackChef'
    //     let contractAddr = chainApi.chainWeb3.getContractAddr(contractName)
    //     let tokenIns = new chainApi.ERC20Token(chainApi.chainWeb3, pool.address)
    //     let res = await tokenIns.approve(contractAddr)
    //     console.log('====approve res: ', res.transactionHash)
    // }

    // deposit into pool 0 10 BURGER
    // let amount = '10'
    // let depositRes = await chainApi.demaxShackChef.deposit(0, amount, 'BURGER')
    // console.log('====deposit res: ', depositRes.transactionHash)

    // parse event
    let txhash = "0xab6d2914a1d9e364ebfa4bde5313e83e66f6efbd4602eee961f4016f0aa2fa84"
    let receipt = await chainApi.chainWeb3.awaitTransactionMined(txhash)
    let res = chainApi.web3Util.parseEventLog(chainApi.chainWeb3.web3, DemaxShackChef, receipt , 'Deposit')
    console.log("==============deposit==============")
    console.log('user', res.returnValues.user)
    console.log('pid', res.returnValues.pid)
    console.log('amount', res.returnValues.amount)
    let poolInfo = await chainApi.demaxShackChef.shackGetPoolInfo(res.returnValues.pid)
    console.log('depositToken', poolInfo.depositToken)
}

async function withdraw() {
    chainApi.chainWeb3.connect(); 

    // withdraw from pool 0 10 BURGER
    // let amount = '10'
    // let withDrawRes = await chainApi.demaxShackChef.withdraw(0, amount)
    // console.log('====withdraw res: ', withDrawRes.transactionHash)

    // parse event
    let txhash = "0x89f59baa0e02fa71c4e803ced9eeeaa7ffdc2561ae62b8b9b32fef73e2b8a2da"
    let receipt = await chainApi.chainWeb3.awaitTransactionMined(txhash)
    let res = chainApi.web3Util.parseEventLog(chainApi.chainWeb3.web3, DemaxShackChef, receipt , 'Withdraw')
    console.log("==============withdraw==============")
    console.log('user', res.returnValues.user)
    console.log('pid', res.returnValues.pid)
    console.log('amount', res.returnValues.amount)
    let poolInfo = await chainApi.demaxShackChef.shackGetPoolInfo(res.returnValues.pid)
    console.log('depositToken', poolInfo.depositToken)
}

async function main() {
    // await getPools()
    // await getPool(0)
    await deposit()
    await withdraw()
}

main();