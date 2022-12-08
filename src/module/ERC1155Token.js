import AssetERC1155 from '../abi/AssetERC1155.json';
import BaseInstance from './BaseInstance.js';

export default class ERC1155Token extends BaseInstance {
    constructor(provider, address) {
        super(provider, AssetERC1155, address);
        if (address) { this.initSubscribe(['Transfer', 'Approval']) }
    }

    async tokenURI(id) {
        return await this.contract.methods.tokenURI(id).call()
    }

    async balanceOf(account, id) {
        let res = await this.contract.methods.balanceOf(account, id).call()
        return res
    }

    async balanceOfBatch(accounts, ids) {
        let res = await this.contract.methods.balanceOfBatch(accounts, ids).call()
        return res
    }

    async isApprovedForAll(account, operator) {
        return await this.contract.methods.isApprovedForAll(account, operator).call()
    }

    async setApprovalForAll(operator, approved) {
        return await this.provider.executeContract(this.contract, 'setApprovalForAll', 0, [operator, approved])
    }

    async safeTransferFrom(from, to, id, amount) {
        return await this.provider.executeContract(this.contract, 'safeTransferFrom', 0, [from, to, id, amount, ''])
    }

    async safeBatchTransferFrom(from, to, ids, amounts) {
        return await this.provider.executeContract(this.contract, 'safeTransferFrom', 0, [from, to, ids, amounts, ''])
    }

    async mint(account, amount, tokenURI) {
        if (tokenURI == null) {tokenURI = ""}
        return await this.provider.executeContract(this.contract, 'mint', 0, [account, amount, tokenURI])
    }

    async mintAmount(account, id, amount) {
        return await this.provider.executeContract(this.contract, 'mintAmount', 0, [account, id, amount])
    }

    async batchMint(to, tokenIdAmount, amounts, tokenURIs) {
        if (tokenURIs == null) {
            tokenURIs = new Array(tokenIdAmount.length).fill("")
        }
        return await this.provider.executeContract(this.contract, 'batchMint', 0, [to, tokenIdAmount, amounts, tokenURIs])
    }

    async burn(account, id, amount) {
        return await this.provider.executeContract(this.contract, 'burn', 0, [account, id, amount])
    }
}