import AssetERC721 from '../abi/AssetERC721.json' assert { type: 'json' };
import BaseInstance from './BaseInstance.js';

export default class ERC721Token extends BaseInstance {
    constructor(provider, address) {
        super(provider, AssetERC721, address);
        if (address) { this.initSubscribe(['Transfer', 'Approval']) }
    }

    async info() {
        let cache = this.provider.nfts[this.address.toLocaleLowerCase()];
        if (cache) { return cache }
        let res = {
            symbol: await this.contract.methods.symbol().call(),
            name: await this.contract.methods.name().call(),
            mode: await this.contract.methods.mode().call()
        };
        this.provider.nfts[this.address.toLocaleLowerCase()] = res;
        return res;
    }

    async totalSupply() {
        let res = await this.contract.methods.totalSupply().call()
        return res.toString()
    }

    async tokenByIndex(index) {
        let res = await this.contract.methods.tokenByIndex(index).call()
        return res.toString()
    }

    async balanceOf(owner) {
        let res = await this.contract.methods.balanceOf(owner).call()
        return res.toString()
    }

    async tokenOfOwnerByIndex(owner, index) {
        let res = await this.contract.methods.tokenOfOwnerByIndex(owner, index).call()
        return res.toString()
    }

    async tokensOfOwnerBySize(owner, cursor, size) {
        let res = await this.contract.methods.tokensOfOwnerBySize(owner, cursor, size).call()
        return res
    }

    async tokenURI(tokenId) { 
        return res = await this.contract.methods.tokenURI(tokenId).call()
    }

    async ownerOf(tokenId) {
        return res = await this.contract.methods.ownerOf(tokenId).call()
    }

    async isApprovedForAll(owner, operator) {
        return res = await this.contract.methods.isApprovedForAll(owner, operator).call()
    };

    async getApproved(tokenId) {
        return res = await this.contract.methods.getApproved(tokenId).call()
    }

    async mint(to, tokenURI) {
        if (tokenURI == null) {tokenURI = ""}
        return await this.provider.executeContract(this.contract, 'mint', 0, [to, tokenURI])
    }

     async batchMint(to, amount, tokenURIs) {
        if (tokenURIs == null) {
            tokenURIs = new Array(Number(amount)).fill("")
        }
        return await this.provider.executeContract(this.contract, 'batchMint', 0, [to, amount, tokenURIs])
    }

    async burn(tokenId) {
        return await this.provider.executeContract(this.contract, 'burn', 0, [tokenId])
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
}