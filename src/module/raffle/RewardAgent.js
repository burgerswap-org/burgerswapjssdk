import RewardAgentABI from '../../abi/RewardAgent.json';
import Base from '../Base.js';

export default class RewardAgent extends Base {
    constructor(provider) {
        super(provider, RewardAgentABI.abi, 'RewardAgent');
    }
 
    // function claimERC20(address,address,uint256,uint64,bytes memory)
    async claimERC20(token, amount, orderId, signature) {
        return await this.provider.executeContract(this.contract, "claimERC20", 0, [this.provider.account, token, amount, orderId, signature])
    }
} 