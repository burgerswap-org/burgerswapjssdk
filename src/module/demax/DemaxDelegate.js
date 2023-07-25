import DemaxDelegateABI from '../../abi/DemaxDelegate.json' assert { type: 'json' };
import ERC20Token from '../ERC20Token.js';
import DemaxQuery2 from './DemaxQuery2.js';
import DemaxConfig from './DemaxConfig.js'
import DemaxLP from './DemaxLP.js'
import Base from '../Base.js';
import { AddList } from '../../config/TokenMap.js';
import { convertNormalToBigNumber, calculateMultiplied, calculatePercentage } from '../../util.js';
import BigNumber from "bignumber.js";

export default class DemaxDelegate extends Base {
    constructor(provider) {
        super(provider, DemaxDelegateABI, 'DemaxDelegate');
        this.query2 = new DemaxQuery2(provider);
        this.config = new DemaxConfig(provider);
    }

    async addLiquidity(tokenA, tokenB, amountA, amountB, slip, delay) {
        let tokenAInfo = await new ERC20Token(this.provider, tokenA).info();
        let tokenBInfo = await new ERC20Token(this.provider, tokenB).info();
        let deadline = Math.floor(new Date().getTime() / 1000 + 60 * delay);
        let bigAmountA = convertNormalToBigNumber(amountA, tokenAInfo.decimals);
        let bigAmountB = convertNormalToBigNumber(amountB, tokenBInfo.decimals);
        let minAmountA = calculateMultiplied(bigAmountA, 1 - slip);
        let minAmountB = calculateMultiplied(bigAmountB, 1 - slip);

        if (this.provider.isETH(tokenA)) {
            return await this.provider.executeContract(this.contract, 'addLiquidityETH', bigAmountA, [tokenB, bigAmountB, minAmountB, minAmountA, deadline]);
        } else if (this.provider.isETH(tokenB)) {
            return await this.provider.executeContract(this.contract, 'addLiquidityETH', bigAmountB, [tokenA, bigAmountA, minAmountA, minAmountB, deadline]);
        } else {
            return await this.provider.executeContract(this.contract, 'addLiquidity', 0, [tokenA, tokenB, bigAmountA, bigAmountB, minAmountA, minAmountB, deadline]);
        }
    }

    async removeLiquidity(lpAddr, percent, slip, delay) {
        let lpInfo = await this.query2.getLiquidityInfo(lpAddr);
        let config = await this.query2.queryConfig();
        let percentage = calculatePercentage(lpInfo.balance, lpInfo.totalSupply);
        let canRemove = parseInt(lpInfo.currentBlock) >= parseInt(lpInfo.lastBlock) + (config.removeDuration || 0);
        if(!canRemove) throw new Error('can not remove, please wait until can remove');
        
        let deadline = Math.floor(new Date().getTime() / 1000 + 60 * delay);
        let removeLiquidity = calculateMultiplied(lpInfo.balance, percent);
        let amountA = parseFloat(lpInfo.reserve0) * percentage * percent;
        let amountB = parseFloat(lpInfo.reserve1) * percentage * percent;
        amountA = calculateMultiplied(amountA, 1 - slip);
        amountB = calculateMultiplied(amountB, 1 - slip);
        if (this.provider.isETH(lpInfo.token0)) {
            return await this.provider.executeContract(this.contract, 'removeLiquidityETH', 0, [lpInfo.token1, removeLiquidity, amountB, amountA, deadline]);
        } else if (this.provider.isETH(lpInfo.token1)) {
            return await this.provider.executeContract(this.contract, 'removeLiquidityETH', 0, [lpInfo.token0, removeLiquidity, amountA, amountB, deadline]);
        } else {
            return await this.provider.executeContract(this.contract, 'removeLiquidity', 0, [lpInfo.token0, lpInfo.token1, removeLiquidity, amountA, amountB, deadline]);
        }
    }

    async mintReward(lpAddr) {
        return new DemaxLP(this.provider, lpAddr).mintReward();
    }

    async getTokenList(cursor, size) {
        try {
            if ( !cursor ) cursor = 0;
            if ( !size ) size = 10;
            let tokenList = [];
            let length = size;
            if (cursor >= AddList[this.provider.chainId].length) return tokenList;
            if (cursor + size > AddList[this.provider.chainId].length) {
                length = AddList[this.provider.chainId].length - cursor
            }
            for (let i = 0; i < length; i++) {
                tokenList.push({
                    ...AddList[this.provider.chainId][i + cursor],
                    // balanceInDecimals: await new ERC20Token(this.provider, AddList[this.provider.chainId][i + cursor].address).balanceOf(this.provider.account)
                })
            }
            return {totalCount: AddList[this.provider.chainId].length, tokenList}
        } catch (error) {
            return String(error)
        }
    }

    async getAmountLiquidity(tokenA, tokenB, amountA) {
        if(this.provider.isZeroAddress(tokenA)) {
            tokenA= this.provider.getContractAddr('WETH');
        }
    
        if(this.provider.isZeroAddress(tokenB)) {
            tokenB= this.provider.getContractAddr('WETH');
        }
    
        let pairInfo = await this.query2.getPairReserveByTokens(tokenA, tokenB);
        const reserve0 = new BigNumber(pairInfo.reserve0).shiftedBy(-1 * pairInfo.decimals0);
        const reserve1 = new BigNumber(pairInfo.reserve1).shiftedBy(-1 * pairInfo.decimals1);
        let amountB = reserve0 > 0 ? (amountA * reserve1) / reserve0 : 0;
        let APerB = reserve1 > 0 ? reserve0 / reserve1 : 0;
        let BPerA = reserve0 > 0 ? reserve1 / reserve0 : 0;
        let _total = new BigNumber(reserve0).plus(amountA).toFixed();
        let percent = reserve0 > 0 ? new BigNumber(amountA).div(_total).toFixed() : 1;
        return {
            amountB: amountB,
            APerB: APerB,
            BPerA: BPerA,
            percent: percent,
        };
    }

    async getLiquidityList(user) {
        return await this.query2.queryLiquidityList(user);
    }

    async getLiquidityInfo(lpAddr, _user=null) {
        return await this.query2.getLiquidityInfo(lpAddr, _user);
    }

    async queryReward(lpAddr) {
        return await new DemaxLP(this.provider, lpAddr).queryReward();
    }
}
