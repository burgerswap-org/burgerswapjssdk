import DemaxQuery2ABI from '../../abi/DemaxQuery2.json';
import Base from '../Base.js';
import Liquidity from '../../model/liquidity.js';
import DemaxLP from './DemaxLP.js';
import { convertBigNumberToNormal, calculatePercentage } from '../../util.js';

var _demaxConfigCache = null;

export default class DemaxQuery2 extends Base {
  constructor(provider) {
    super(provider, DemaxQuery2ABI, 'DemaxQuery2');
  }

  async getToken(token) {
    return await this.contract.methods.getToken(token).call();
  }

  async queryLiquidityList(user) {
    if (!user) user = this.provider.account;

    let block = await this.provider.getBlockNumber();
    let liquidityList = [];
    let results = await this.contract.methods
      .queryLiquidityList()
      .call({ from: user });
    let pair_list = [];
    for (let i = 0; i < results.length; i++) {
      let l = results[i];
      let address = l['lp'];
      let percentage = calculatePercentage(l['balance'], l['totalSupply']);
      let canRemove = block >= parseInt(l['lastBlock']) + 0;

      let liquidity = new Liquidity(
        address,
        parseFloat(percentage),
        l['balance'],
        canRemove
      );
      liquidity.liquidityInDecimals = convertBigNumberToNormal(l['balance']);
      liquidity.pair = l['pair'];
      liquidity.delegate = l['delegate'];
      liquidity.reward = await new DemaxLP(
        this.provider,
        address
      ).queryReward();

      liquidityList.push(liquidity);
      pair_list.push(l['pair']);
    }

    results = await this.contract.methods
      .queryPairListInfo(pair_list)
      .call({ from: user });
    for (let i = 0; i < pair_list.length; i++) {
      let token0 = results.token0_list[i];
      let token1 = results.token1_list[i];
      liquidityList[i].setTokenAddress(token0, token1);
      let token0Info = await this.contract.methods
        .queryTokenItemInfo(token0)
        .call({ from: user });
      let token1Info = await this.contract.methods
        .queryTokenItemInfo(token1)
        .call({ from: user });
      let reserve0 = convertBigNumberToNormal(
        results.reserve0_list[i],
        Number(token0Info.decimal)
      );
      let reserve1 = convertBigNumberToNormal(
        results.reserve1_list[i],
        Number(token1Info.decimal)
      );
      liquidityList[i].setReserve(reserve0, reserve1);
    }

    return liquidityList;
  }

  async getLiquidityInfo(_lp, _user = null) {
    let _delegate = this.provider.getContractAddr('DemaxDelegate');
    if (!_user) _user = this.provider.account;
    return await this.contract.methods.getLiquidityInfo(_delegate, _lp, _user).call();
  }

  async getPairReserve(_pair) {
    return await this.contract.methods.getPairReserve(_pair).call();
  }

  async getPairReserveByTokens(tokenA, tokenB) {
    let res = await this.contract.methods
      .getPairReserveByTokens(tokenA, tokenB)
      .call();
    if (tokenA.toLocaleLowerCase() != res.token0.toLocaleLowerCase()) {
      return {
        token0: tokenB,
        token1: tokenA,
        decimals0: res.decimals1,
        decimals1: res.decimals0,
        reserve0: res.reserve1,
        reserve1: res.reserve0,
      };
    }
    return res;
  }

  async queryConfig() {
    if (!_demaxConfigCache) {
      _demaxConfigCache = await this.contract.methods.queryConfig().call();
    }

    let feePercent = parseFloat(_demaxConfigCache[0]) / 10000;
    let rewardPercent = parseFloat(_demaxConfigCache[5]) / 10000;
    return {
      feePercent: feePercent,
      proposalAmount: parseFloat(
        convertBigNumberToNormal(_demaxConfigCache[1])
      ),
      unstakeDuration: parseInt(_demaxConfigCache[2]),
      removeDuration: parseInt(_demaxConfigCache[3]),
      listTokenAmount: parseFloat(
        convertBigNumberToNormal(_demaxConfigCache[4])
      ),
      rewardPercent: rewardPercent,
    };
  }
}
