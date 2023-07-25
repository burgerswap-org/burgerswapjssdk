import AggregatorRouterABI from '../abi/AggregatorRouter.json' assert { type: 'json' };
import BigNumber from "bignumber.js"
import Base from './Base.js';
import {Tokens} from '../ChainConfig.js';

export default class DemaxAggregatorRouter extends Base {
    constructor(provider) {
        super(provider, AggregatorRouterABI, 'DemaxAggregatorRouter');
        this.offset = 18;
        this.times = 100;
    }

    async getTokenIns(token) {
        let tokenIns = new ERC20Token(this.provider, token);
        return tokenIns;
    }

    async getRoutesDistribution(fromToken, destToken, parts, flags, mode) {
        if (parts != 1 && parts != 10 && parts != 20) parts = 10;
        if (!mode) mode = 0; // default max return amount mode
        let res = await this.contract.methods.getRoutesDistribution(fromToken, destToken, flags).call();
        let distribution;
        if (mode == 1) {
            distribution = this.getSingleDistribution(res.distribution, parts);
        } else {
            distribution = this.getMultiDistribution(res.distribution, parts, this.times);
        }
        return { routes: res.routes, distribution: distribution };
    }

    async getRate(fromToken, destToken, flags) {
        if (fromToken.toLocaleLowerCase() == destToken.toLocaleLowerCase()) return new BigNumber(1).toFixed(4);
        let stableTokens = [
            Tokens[this.provider.chainId].USDT.toLocaleLowerCase(),
            Tokens[this.provider.chainId].BUSD.toLocaleLowerCase(),
            Tokens[this.provider.chainId].USDC.toLocaleLowerCase()
        ]
        if (stableTokens.includes(fromToken.toLocaleLowerCase()) && stableTokens.includes(destToken.toLocaleLowerCase())) {
            return new BigNumber(1).toFixed(4);
        }
        let res = await this.contract.methods.getRate(fromToken, destToken, flags).call();
        return new BigNumber(res).shiftedBy(-1 * this.offset).toFixed(4);
    }

    getSingleDistribution(distribution, parts) {
        let res = new Array(distribution.length);
        res.fill(0)
        let maxIndex = 0;
        for (let i = 1; i < distribution.length; i++) {
            maxIndex = new BigNumber(distribution[i]).gt(new BigNumber(distribution[maxIndex])) ? i : maxIndex;
        }
        res[maxIndex] = parts;
        return res
    }

    getMultiDistribution(distribution, parts, times) {
        let res = new Array(distribution.length);
        res.fill(0)
        if (parts == 1) {
            let max = Number(distribution[0])
            let index = 0;
            for (let i = 0; i < distribution.length; i++) {
                if (max < Number(distribution[i])) {
                    index = i
                }
            }
            res[index] = 1;
        } else {
            let partsLeft = parts;
            let line = 5 * times / 10;
            for (let i = 0; i < distribution.length; i++) {
                let a = Number(distribution[i]) * parts / times;
                let b = Number(distribution[i]) * parts % times > line;
                a = b ? Math.round(a) : Math.floor(a);
                if (i != distribution.length - 1) {
                    partsLeft = partsLeft - a;
                } else {
                    a = partsLeft;
                }
                res[i] = a;
            }
        }
        return res
    }
}