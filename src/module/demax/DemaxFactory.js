import DemaxFactoryABI from '../../abi/DemaxFactory.json' assert { type: 'json' };
import Base from '../Base.js';

export default class DemaxFactory extends Base {
    constructor(provider) {
        super(provider, DemaxFactoryABI, 'DemaxFactory');
    }

    async getPair(tokenA, tokenB) {
        if(this.provider.isZeroAddress(tokenA)) {
            tokenA= this.provider.getContractAddr('WETH');
        }
    
        if(this.provider.isZeroAddress(tokenB)) {
            tokenB= this.provider.getContractAddr('WETH');
        }
        return await this.contract.methods.getPair(tokenA, tokenB).call();
    }

    async existPair(tokenA, tokenB) {
        let pair = await this.getPair(tokenA, tokenB);
        return pair != '0x0000000000000000000000000000000000000000';
    }

}
