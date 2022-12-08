import ActivityPunchInABI from '../../abi/ActivityPunchIn.json';
import Base from '../Base.js';

export default class ActivityPunchIn extends Base {
    constructor(provider) {
        super(provider, ActivityPunchInABI.abi, 'ActivityPunchIn');
    }

    async activityLength() {
        return await this.contract.methods.activityLength().call()
    }

    async activityInfo(index) {
        let info = await this.contract.methods.activityInfo(index).call()
        let successAmount = await this.contract.methods.activitySuccessAmount(index).call()
        let { startTimestamp, endTimestamp, limitAmount, rewardAmount, rewardToken } = info
        return { startTimestamp, endTimestamp, limitAmount, rewardAmount, rewardToken, successAmount }
    }

    async userInfo(index, user) {
        let userInfo = await this.contract.methods.userInfo(index, user).call()
        return { lastTimestamp: userInfo[0], amount: userInfo[1], isClaimed: userInfo[2] }
    }

    async punchIn(index) {
        return await this.provider.executeContract(this.contract, "punchIn", 0, [index])
    }
 
    async claim(index, user) {
        return await this.provider.executeContract(this.contract, "claim", 0, [index, user])
    }
} 