import { createWeb3Name } from '@web3-name-sdk/core';

export default class SpaceId {
    constructor() {
        this.web3name = createWeb3Name();
    }

    async resolveName(account, TldList) {
        if (!TldList) {
            TldList = ['burger'];
        }

        const name = await this.web3name.getDomainName({
            address: account,
            queryTldList: TldList,
        })

        return name;
    }
}