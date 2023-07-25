import BurgerSwapRewardABI from '../../abi/BurgerSwapReward.json' assert { type: 'json' };
import ERC20Token from '../ERC20Token.js';
import BigNumber from "bignumber.js"
import Base from '../Base.js';

export default class DemaxSwapReward extends Base {
    constructor(provider) {
        super(provider, BurgerSwapRewardABI, 'DemaxSwapReward');
    }

    async getReward() {
        let rewardSymbol = "BURGER"
        let rewardAmount = "0"
        let rewardTokenAddr = await this.contract.methods.rewardToken().call()
        let rewardTokenIns = await this.getTokenIns(rewardTokenAddr)
        let rewrardTokenInfo = await rewardTokenIns.info()
        rewardSymbol = rewrardTokenInfo.symbol
        let amount = await this.contract.methods.queryReward(this.provider.account).call()
        rewardAmount = new BigNumber(amount).shiftedBy(-1 * rewrardTokenInfo.decimals).toFixed(2)
        return { rewardSymbol, rewardAmount }
    }

    async claimReward() {
        return await this.provider.executeContract(this.contract, 'claimReward', 0, [])
    }

    async getTokenIns(token) {
        let tokenIns = new ERC20Token(this.provider, token);
        return tokenIns;
    }
}