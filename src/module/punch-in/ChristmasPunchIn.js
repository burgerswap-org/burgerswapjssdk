import ABI from '../../abi/ChristmasPunchIn.json' assert { type: 'json' };
import Base from '../Base.js';

export default class ChristmasPunchIn extends Base {
    constructor(provider) {
        super(provider, ABI.abi, 'ChristmasPunchIn');
    }

    async userTimestamps(user) {
        return await this.contract.methods.userTimestamps(user).call()
    }

    async isUserClaimed(user) {
        return await this.contract.methods.isUserClaimed(user).call()
    }

    async punchIn() {
        return await this.provider.executeContract(this.contract, "punchIn", 0, [])
    }

    async claim(to, signature, txId) {
        return await this.provider.executeContract(this.contract, "claim", 0, [to, signature, txId])
    }
}