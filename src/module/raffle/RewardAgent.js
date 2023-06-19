import RewardAgentABI from '../../abi/RewardAgent.json';
import Base from '../Base.js';

export default class RewardAgent extends Base {
    constructor(provider) {
        super(provider, RewardAgentABI.abi, 'RewardAgent');
    }
 
    // function claimERC20(address,address,uint256,uint64,bytes memory)
    async claimERC20(to, token, amount, orderId, signature) {
        if (!to) {
            to = this.provider.account;
        }
        return await this.provider.executeContract(this.contract, "claimERC20", 0, [to, token, amount, orderId, signature])
    }
} 