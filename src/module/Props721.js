import ABI from '../abi/Props721.json';
import Base from './Base.js';

export default class Props721 extends Base {
    constructor(provider) {
        super(provider, ABI.abi, 'Props721');
    }

    async info() {
        let cache = this.provider.nfts[this.address.toLocaleLowerCase()];
        if (cache) { return cache }
        let res = {
            symbol: await this.contract.methods.symbol().call(),
            name: await this.contract.methods.name().call(),
            baseURI: await this.contract.methods.baseURI().call(),
            suffix: await this.contract.methods.suffix().call()
        };
        this.provider.nfts[this.address.toLocaleLowerCase()] = res;
        return res;
    }

    async balanceOf(user) {
        let res = await this.contract.methods.balanceOf(user).call()
        return res.toString()
    }

    async tokenURI(tokenId) {
        return await this.contract.methods.tokenURI(tokenId).call()
    }

    async ownerOf(tokenId) {
        return await this.contract.methods.ownerOf(tokenId).call()
    }

    async isApprovedForAll(owner, operator) {
        return res = await this.contract.methods.isApprovedForAll(owner, operator).call()
    };

    async getApproved(tokenId) {
        return res = await this.contract.methods.getApproved(tokenId).call()
    }

    async mint(
        expiryTime,
        orderId,
        propId,
        consumeAmount,
        signature
    ) {
        return await this.provider.executeContract(this.contract, 'mint', 0, [expiryTime, orderId, propId, consumeAmount, signature])
    }

    async burn(tokenId, consumeAmount, signature) {
        return await this.provider.executeContract(this.contract, 'burn', 0, [tokenId, consumeAmount, signature])
    }

    async approve(to, tokenId) {
        return await this.provider.executeContract(this.contract, 'approve', 0, [to, tokenId])
    }

    async setApprovalForAll(operator, approved) {
        return await this.provider.executeContract(this.contract, 'setApprovalForAll', 0, [operator, approved])
    }

    async transferFrom(from, to, tokenId) {
        return await this.provider.executeContract(this.contract, 'transferFrom', 0, [from, to, tokenId])
    }

    // only dev
    async setSinger(signer) {
        return await this.provider.executeContract(this.contract, 'setSigner', 0, [signer])
    }
}