import ActivityClaimABI from '../../abi/ActivityClaim.json';
import Base from '../Base.js';

export default class ActivityClaim extends Base {
    constructor(provider) {
        super(provider, ActivityClaimABI.abi, 'ActivityClaim');
    }

    async userLastClaimTime(user) {
        return await this.contract.methods.userLastClaimTime(user).call()
    }
 
    async claim(datetime, signature, txId) {
        return await this.provider.executeContract(this.contract, "claim", 0, [datetime, signature, txId])
    }
} 