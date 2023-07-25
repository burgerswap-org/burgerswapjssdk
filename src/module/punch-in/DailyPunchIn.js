import DailyPunchInABI from '../../abi/DailyPunchIn.json';
import Base from '../Base.js';

export default class DailyPunchIn extends Base {
    constructor(provider) {
        super(provider, DailyPunchInABI.abi, 'DailyPunchIn');
    }

    async userInfo(user) {
        let userInfo = await this.contract.methods.userInfo(user).call()
        return { lastTimestamp: userInfo[0], amount: userInfo[1]}
    }
    
    async punchIn() {
        return await this.provider.executeContract(this.contract, "punchIn", 0, [])
    }
} 