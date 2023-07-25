import NFTFixedswapABI from '../../abi/NFTFixedswap.json' assert { type: 'json' };
import Base from '../Base.js';

export default class NFTFixedswap extends Base {
    constructor(provider) {
        super(provider, NFTFixedswapABI, 'NFTFixedswap');
    }

    async getPoolCount() {
        let res = await this.contract.methods.getPoolCount().call()
        return res.toString()
    }

    async getPool(index) {
        let res = await this.contract.methods.pools(index).call()
        let swapAmount0 = await this.contract.methods.swappedAmount0P(index).call()
        let swapAmount1 = await this.contract.methods.swappedAmount1P(index).call()
        let onlyBotHolder = await this.contract.methods.onlyBotHolderP(index).call()
        return {
            ...res,
            onlyBotHolder: onlyBotHolder,
            swapAmount0: swapAmount0.toString(),
            swapAmount1: swapAmount1.toString()
        }
    }

    async getPoolStatus(index) {
        return {
            isCanceled: await this.contract.methods.creatorCanceledP(index).call(),
            isSwaped: await this.contract.methods.swappedP(index).call()
        }
    }

    async isCreator(target, index) {
        let res = await this.contract.methods.isCreator(target, index).call()
        return res
    }

    async checkToken0(token) {
        let res = await this.contract.methods.checkToken0().call()
        if (res) {
            res = await this.contract.methods.token0List(token).call()
            return res
        } else {
            return true
        }
    }

    async getConfig() {
        return {
            minValue: await this.contract.methods.getMinValueOfBotHolder().call(),
            botToken: await this.contract.methods.getBotToken().call(),
            disableErc721: await this.contract.methods.getDisableErc721().call(),
            disableErc1155: await this.contract.methods.getDisableErc1155().call(),
        }
    }

    async createErc721(
        name,
        token0,
        token1,
        tokenId,
        amountTotal1,
        openAt,
        onlyBot
    ) {
        return await this.provider.executeContract(this.contract, 'createErc721', 0, [
            name,
            token0,
            token1,
            tokenId,
            amountTotal1,
            openAt,
            onlyBot
        ])
    }

    async createErc1155(
        name,
        token0,
        token1,
        tokenId,
        amountTotal0,
        amountTotal1,
        openAt,
        onlyBot
    ) {
        return await this.provider.executeContract(this.contract, 'createErc1155', 0, [
            name,
            token0,
            token1,
            tokenId,
            amountTotal0,
            amountTotal1,
            openAt,
            onlyBot
        ])
    }

    async swap(index, amount0) {
        return await this.provider.executeContract(this.contract, 'swap', 0, [index, amount0])
    }

    async cancel(index) {
        return await this.provider.executeContract(this.contract, 'cancel', 0, [index])
    }
}