import ERC20TokenABI  from '../abi/ERC20Token.json' assert { type: 'json' };
import BigNumber from "bignumber.js";
import BaseInstance from './BaseInstance.js';

export default class ERC20Token extends BaseInstance {
    constructor(provider, address) {
        super(provider, ERC20TokenABI, address);
        if (address) {
            this.initSubscribe(['Transfer', 'Approval']);
        }

    }

    async balanceOf(user) {
        if (!user) {
            user = this.provider.account;
        }
        let _token = await this.info();
        let res = '0'
        if (this.provider.isZeroAddress(this.address)) {
            res = await this.provider.web3.eth.getBalance(user);
        } else {
            res = await this.contract.methods.balanceOf(user).call();
        }
        return new BigNumber(res).shiftedBy(-1 * _token.decimals).toFixed();
    }

    async info() {
        let cache = this.provider.tokens[this.address.toLocaleLowerCase()];
        if (cache) {
            return cache;
        }
        let res = {};
        if (this.provider.isZeroAddress(this.address)) {
            res = {
                symbol: this.provider.getZeroSymbol(),
                totalSupply: 0,
                decimals: 18
            };
        } else {
            res = {
                symbol: await this.contract.methods.symbol().call(),
                totalSupply: await this.contract.methods.totalSupply().call(),
                decimals: await this.contract.methods.decimals().call()
            };
        }
        this.provider.tokens[this.address.toLocaleLowerCase()] = res;
        return res;
    }

    async approve(spender) {
        // console.log('approve:', token, spender)
        if (!spender) {
            throw new Error('Illegal approve');
        }

        let total = await this.contract.methods.totalSupply().call();
        // console.log('total:', total);
        return await this.provider.executeContract(this.contract, 'approve', 0, [spender, total]);
    }

    async allowance(spender) {
        // console.log('allowance:', spender, this.provider.account);
        if (this.provider.isZeroAddress(this.address)) {
            return new BigNumber(10).shiftedBy(30).toFixed();
        }
        let _token = await this.info();
        let res = await this.contract.methods.allowance(this.provider.account, spender).call();
        return new BigNumber(res).shiftedBy(-1 * _token.decimals).toFixed();
    }

    async transfer(to, amount) {
        let _token = await this.info()
        amount = new BigNumber(amount).shiftedBy(1 * _token.decimals).toFixed();
        if (this.provider.isZeroAddress(this.address)) {
            await this.provider.executeContract(null, 'transfer', amount, []);
        }
        return await this.provider.executeContract(this.contract, 'transfer', 0, [to, amount]);
    }
}