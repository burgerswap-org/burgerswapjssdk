import DemaxShackChefQueryABI from '../../abi/DemaxShackChefQuery.json' assert { type: 'json' };
import Base from '../Base.js';

export default class DemaxShackChefQuery extends Base {
    constructor(provider) {
        super(provider, DemaxShackChefQueryABI, 'DemaxShackChefQuery');
    }

    async getPair(_factory, _token0, _token1) {
        return await this.contract.methods.getPair(_factory, _token0, _token1).call();
    }

    async getCurrentRate(_factory, _tokenIn, _amount) {
        return await this.contract.methods.getCurrentRate(_factory, _tokenIn, _amount).call();
    }

    async getEarnInfo(token) {
        return await this.contract.methods.getEarnInfo(token).call();
    }

    async getChefInfo() {
        return await this.contract.methods.getChefInfo().call();
    }

    async getPoolInfo(_pid, _user) {
        if(!_user) {
            _user = this.provider.getSelectedAddress();
        }
        return await this.contract.methods.getPoolInfo(_pid, _user).call();
    }

    async iteratePoolInfoList(_user, _start, _end) {
        return await this.contract.methods.iteratePoolInfoList(_user, _start, _end).call();
    }
}
