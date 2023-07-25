import DemaxConfigABI from '../../abi/DemaxConfig.json' assert { type: 'json' };
import BigNumber from "bignumber.js"
import Base from '../Base.js';

var _demaxConfigCache = null;

export default class DemaxConfig extends Base {
    constructor(provider) {
        super(provider, DemaxConfigABI, 'DemaxConfig');
    }
      
    async queryConfig() {
        if(!_demaxConfigCache) {
            _demaxConfigCache = await this.contract.methods.queryConfig().call();
        }
        
        let feePercent = parseFloat(_demaxConfigCache[0]) / 10000;
        let rewardPercent = parseFloat(_demaxConfigCache[5]) / 10000;
        return {
            feePercent: feePercent,
            proposalAmount: parseFloat(convertBigNumberToNormal(_demaxConfigCache[1])),
            unstakeDuration: parseInt(_demaxConfigCache[2]),
            removeDuration: parseInt(_demaxConfigCache[3]),
            listTokenAmount: parseFloat(convertBigNumberToNormal(_demaxConfigCache[4])),
            rewardPercent: rewardPercent
        }
    }
}
