import NFTEnglishAuctionABI from '../../abi/NFTEnglishAuction.json' assert { type: 'json' };
import Base from '../Base.js';

export default class NFTEnglishAuction extends Base {
    constructor(provider) {
        super(provider, NFTEnglishAuctionABI, 'NFTEnglishAuction');
    }

    async getPoolCount() {
        let res = await this.contract.methods.getPoolCount().call()
        return res.toString()
    }

    async getPoolBaseInfo(index) {
        let res = await this.contract.methods.pools(index).call()
        let onlyBotHolder = await this.contract.methods.onlyBotHolderP(index).call()
        let reserveAmount1 = await this.contract.methods.reserveAmount1P(index).call()
        return {
            ...res,
            onlyBotHolder,
            reserveAmount1
        }
    }

    async getPoolDynamicInfo(index) {
        let creatorClaimed = await this.contract.methods.creatorClaimedP(index).call()
        let currentBidder = await this.contract.methods.currentBidderP(index).call()
        let bidderClaimed = await this.contract.methods.myClaimedP(currentBidder, index).call()
        let currentBidderAmount1 = await this.contract.methods.currentBidderAmount1P(index).call()
        let bidCount = await this.contract.methods.bidCountP(index).call()
        let currentBidderAmount = await this.contract.methods.currentBidderAmount(index).call()
        return {
            bidCount,
            currentBidder,
            currentBidderAmount1,
            currentBidderAmount,
            creatorClaimed,
            bidderClaimed
        }
    }

    async creatorClaimedPool(index) {
        let res = await this.contract.methods.creatorClaimedP(index).call()
        return res
    }

    async currentBidderPool(index) {
        let res = await this.contract.methods.currentBidderP(index).call()
        return res
    }

    async currentBidderAmount1Pool(index) {
        let res = await this.contract.methods.currentBidderAmount1P(index).call()
        return res
    }

    async bidCountPool(index) {
        let res = await this.contract.methods.bidCountP(index).call()
        return res
    }

    async currentBidderAmount(index) {
        let res = await this.contract.methods.currentBidderAmount(index).call()
        return res
    }

    async isCreator(target, index) {
        let res = await this.contract.methods.isCreator(target, index).call()
        return res
    }

    async myBidderAmount1Pool(user, index) {
        let res = await this.contract.methods.myBidderAmount1P(user, index).call()
        return res
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
        amountMax1,
        amountMin1,
        amountMinIncr1,
        amountReserve1,
        openAt,
        duration,
        onlyBot
    ) {
        return await this.provider.executeContract(this.contract, 'createErc721', 0, [
            name,
            token0,
            token1,
            tokenId,
            amountMax1,
            amountMin1,
            amountMinIncr1,
            amountReserve1,
            openAt,
            duration,
            onlyBot
        ])
    }

    async createErc1155(
        name,
        token0,
        token1,
        tokenId,
        tokenAmount0,
        amountMax1,
        amountMin1,
        amountMinIncr1,
        amountReserve1,
        openAt,
        duration,
        onlyBot
    ) {
        return await this.provider.executeContract(this.contract, 'createErc1155', 0, [
            name,
            token0,
            token1,
            tokenId,
            tokenAmount0,
            amountMax1,
            amountMin1,
            amountMinIncr1,
            amountReserve1,
            openAt,
            duration,
            onlyBot
        ])
    }

    async bid(index, amount1) {
        return await this.provider.executeContract(this.contract, 'bid', 0, [index, amount1])
    }

    async cancel(index) {
        return await this.provider.executeContract(this.contract, 'cancel', 0, [index])
    }
    
    async claim(index) {
        return await this.provider.executeContract(this.contract, 'claim', 0, [index])
    }
}