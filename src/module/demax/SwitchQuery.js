import SwitchQueryABI from '../../abi/SwitchQuery.json';
import BigNumber from "bignumber.js"
import Base from '../Base.js';

export default class SwitchQuery extends Base {
  constructor(provider) {
      super(provider, SwitchQueryABI, 'SwitchQuery');
  }

  async getTokenPrice(pair, token) {
    if (!pair || pair==this.provider.ZERO_ADDR || !token) {
      return '0'
    }

    let res = await this.contract.methods.getSwapPairReserve(pair).call()
    let d0 = new BigNumber(res.decimals0)
    let d1 = new BigNumber(res.decimals1)
    let r0 = new BigNumber(res.reserve0)
    let r1 = new BigNumber(res.reserve1)
    let offset = d0.minus(d1)
    r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
    if (token.toLocaleLowerCase() === res.token0.toLocaleLowerCase()) {
      return r1.dividedBy(r0).toFixed()
    } else {
      return r0.dividedBy(r1).toFixed()
    }
  }

  async getTokenPrice2(factory, tokenA, tokenB) {
    if(tokenA.toLocaleLowerCase() === tokenB.toLocaleLowerCase()){
      return 1
    }
    let res = await this.contract.methods.getSwapPairReserveByTokens(factory, tokenA, tokenB).call();
    let d0 = new BigNumber(res.decimals0)
    let d1 = new BigNumber(res.decimals1)
    let r0 = new BigNumber(res.reserve0)
    let r1 = new BigNumber(res.reserve1)
    let offset = d0.minus(d1)
    r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
    if (tokenB.toLocaleLowerCase() === res.token0.toLocaleLowerCase()) {
      return r1.dividedBy(r0).toFixed()
    } else {
      return r0.dividedBy(r1).toFixed()
    }
  }

  async getSwapPairReserveByTokens(factory, tokenA, tokenB) {
    return await this.contract.methods.getSwapPairReserveByTokens(factory, tokenA, tokenB).call();
  }

  async getLpValueByFactory(factory, tokenA, tokenB, amount) {
    return await this.contract.methods.getLpValueByFactory(factory, tokenA, tokenB, amount).call();
  }
      
  async queryTokenInfo(_token, _spender=null, _user=null) {
    if(!_spender) _spender = this.provider.ZERO_ADDR;
    if(!_user) _user = this.provider.getSelectedAddress();
    let res = await this.contract.methods.queryTokenInfo(_token, _user, _spender).call();
    let data = {...res};
    data.totalSupply = new BigNumber(data.totalSupply).shiftedBy(-1 * data.decimals).toFixed();
    data.balance = new BigNumber(data.balance).shiftedBy(-1 * data.decimals).toFixed();
    data.allowance = new BigNumber(data.allowance).shiftedBy(-1 * data.decimals).toFixed();
    return data;
}

  async queryTokenList(_tokens, _spender=null, _user=null) {
    if(!_spender) _spender = this.provider.ZERO_ADDR;
    if(!_user) _user = this.provider.getSelectedAddress();
    let res = await this.contract.methods.queryTokenInfo(_token, _user, _spender).call();
    let data = [];
    if(res) {
      for(let i = 0;i < res.length;i++) {
        let d = {...res[i]};
        d.totalSupply = new BigNumber(d.totalSupply).shiftedBy(-1 * d.decimals).toFixed();
        d.balance = new BigNumber(d.balance).shiftedBy(-1 * d.decimals).toFixed();
        d.allowance = new BigNumber(d.allowance).shiftedBy(-1 * d.decimals).toFixed();
        data.push(d);
      }
    }
    return data;
  }

}
