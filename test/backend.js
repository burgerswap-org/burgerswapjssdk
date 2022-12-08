import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect(); // must call connect first
    
    console.log('DemaxQuery2 address:', chainApi.chainWeb3.getContractAddr('DemaxQuery2'));

    let tokenInfo = await chainApi.demaxQuery2.getToken(chainApi.chainWeb3.getContractAddr('DGAS'));
    console.log('token info:', tokenInfo);

    let pair = await chainApi.demaxQuery2.getPairReserve(chainApi.chainWeb3.getContractAddr('ThirdBurgerUsdPair'));
    console.log('pair info:', pair);

    let chefInfo = await chainApi.demaxShackChefQuery.getChefInfo();
    console.log('ChefInfo:', chefInfo);

    let info =  await chainApi.demaxShackChefQuery.getPoolInfo(0);
    console.log('pool info:', info);
    
    let pool = await chainApi.demaxShackChef.getPool(0);
    console.log('pool:', pool);
}

main();