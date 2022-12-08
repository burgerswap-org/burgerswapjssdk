import BurgerAggregatorV2ABI from '../../abi/BurgerAggregatorV2.json';
import DexIzumiswap400ABI from '../../abi/DexIzumiswap400.json';
import DexIzumiswap2000ABI from '../../abi/DexIzumiswap2000.json';
import ERC20Token from '../ERC20Token.js';
import DemaxAggregatorRouterV2 from './DemaxAggregatorRouterV2.js';
import BigNumber from "bignumber.js"
import Base from '../Base.js';
import { Tokens, ZERO_ADDR } from '../../ChainConfig.js'
import { DemaxAggregatorDexs } from '../../config/DemaxAggregatorDexsV2.js'

export default class DemaxAggregatorV2 extends Base {
    constructor(provider) {
        super(provider, BurgerAggregatorV2ABI, 'DemaxAggregatorV2');
        this.defaultMainParts = 10
        this.defaultSubParts = 25
        this.OneParts = 1
        this.defaultFlags = 0
        this.defaultDTEPTGP = 0 // defaultDestTokenEthPriceTimesGasPrice
        this.defaultMinReturn = 0
        this.defaultGasPrice = 20 // Gwei
        this.aggregatorRouter = new DemaxAggregatorRouterV2(provider)
    }

    async getGasPrice() {
        let current = await this.provider.getGasPrice();
        let standard = new BigNumber(current).shiftedBy(-1 * 9);
        let low = standard.multipliedBy(8).dividedBy(10);
        let fast = standard.multipliedBy(12).dividedBy(10);
        return { low: low.toFixed(), standard: standard.toFixed(), fast: fast.toFixed() }
    }

    async getSwapInfo(fromToken, destToken, amount, gasPrice) {
        let fromTokenIns = await this._getTokenIns(fromToken);
        let fromTokenInfo = await fromTokenIns.info();
        let destTokenIns = await this._getTokenIns(destToken);
        let destTokenInfo = await destTokenIns.info();
        let dexs = DemaxAggregatorDexs[this.provider.chainId];
        if (!gasPrice) gasPrice = this.defaultGasPrice;

        let bestResult = await this._getBestResult(fromToken, destToken, amount, gasPrice);
        let results = []
        for (let i = 0; i < dexs.length; i++) {
            if (this.provider.chainId == 56 && (i == 8 || i == 11)) continue;
            let flag = dexs[i].disableOtherFlag;
            results[i] = await this._getResult(
                fromToken,
                destToken,
                amount,
                this.OneParts,
                flag,
                this.OneParts,
                flag,
                fromTokenInfo,
                destTokenInfo,
                1
            );
            results[i].protocal = dexs[i].name;
        }

        return {
            userInfo: { fromTokenAllowance: await fromTokenIns.allowance(this.address) },
            swapInfo: bestResult.swapInfo,
            routesInfo: {
                bestResult: bestResult.routesInfo.bestResult,
                results: results
            }
        };
    }

    async getBestResult(fromToken, destToken, amount, gasPrice) {
        return await this._getBestResult(fromToken, destToken, amount, gasPrice)
    }

    async approveToAggregator(token) {
        let ins = await this._getTokenIns(token);
        let res = await ins.approve(this.address);
        return res;
    }

    async swap(routes, amounts, returnAmounts, distributions, gasPrice, slidePoint) {
        if (routes.length != amounts.length && amounts.length != distributions.length) return;
        let contracts = [];
        let datas = [];
        let value = "0";
        for (let i = 0; i < routes.length; i++) {
            contracts[i] = this.address
            if (routes[i][0] == "0x0000000000000000000000000000000000000000") {
                value = new BigNumber(value).plus(amounts[i]).toFixed()
            }
            let minReturn = this.defaultMinReturn;
            if (slidePoint) {
                minReturn = new BigNumber(returnAmounts[i]).multipliedBy(1e3 - slidePoint).div(1e3).toFixed(0);
            }
            if (routes[i].length == 2) {
                datas[i] = this.contract.methods.swap(
                    routes[i][0],
                    routes[i][1],
                    amounts[i],
                    minReturn,
                    distributions[i],
                    this.defaultFlags
                ).encodeABI();
            } else {
                datas[i] = this.contract.methods.swapMulti(
                    routes[i],
                    amounts[i],
                    minReturn,
                    distributions[i],
                    new Array(routes[i].length - 1).fill(this.defaultFlags)
                ).encodeABI();
            }
        }
        let res = await this.provider.executeContract(
            this.contract,
            'multicall',
            value,
            [datas],
            '0x' + new BigNumber(gasPrice).shiftedBy(1 * 9).toString(16)
        );
        return res;
    }

    async _getBestResult(fromToken, destToken, amount, gasPrice) {
        let fromTokenIns = await this._getTokenIns(fromToken);
        let fromTokenInfo = await fromTokenIns.info();
        let destTokenIns = await this._getTokenIns(destToken);
        let destTokenInfo = await destTokenIns.info();
        if (!gasPrice) gasPrice = this.defaultGasPrice;
        let fromTokenPrice = await this.aggregatorRouter.getRate(fromToken, Tokens[this.provider.chainId].USDT, this.defaultFlags);
        let fromTokenTotalValue = new BigNumber(fromTokenPrice).multipliedBy(amount)
        let destTokenPrice = await this.aggregatorRouter.getRate(destToken, Tokens[this.provider.chainId].USDT, this.defaultFlags);
        let destTokenToGasTokenPrice = await this.aggregatorRouter.getRate(destToken, "0x0000000000000000000000000000000000000000", this.defaultFlags);

        let flags = this.defaultFlags;
        let resultMulti = await this._getResult(
            fromToken,
            destToken,
            amount,
            this.defaultMainParts,
            flags,
            this.defaultSubParts,
            flags,
            fromTokenInfo,
            destTokenInfo
        );
        let returnValueMulti = new BigNumber(destTokenToGasTokenPrice).multipliedBy(new BigNumber(resultMulti.toTokenAmount));
        let transactionFeeValueMulti = new BigNumber(resultMulti.gasUnitsConsumed).multipliedBy(gasPrice).shiftedBy(-1 * 9);

        let resultSingle = await this._getResult(
            fromToken,
            destToken,
            amount,
            this.defaultMainParts,
            flags,
            this.defaultSubParts,
            flags,
            fromTokenInfo,
            destTokenInfo,
            1
        );
        let returnValueSingle = new BigNumber(destTokenToGasTokenPrice).multipliedBy(new BigNumber(resultSingle.toTokenAmount));
        let transactionFeeValueSingle = new BigNumber(resultSingle.gasUnitsConsumed).multipliedBy(gasPrice).shiftedBy(-1 * 9);

        let bestResult = resultSingle
        let transactionFee = transactionFeeValueSingle
        if (returnValueMulti.minus(transactionFeeValueMulti).gt(returnValueSingle.minus(transactionFeeValueSingle))) {
            bestResult = resultMulti
            transactionFee = transactionFeeValueMulti
        }
        let destTokenTotalValue = new BigNumber(destTokenPrice).multipliedBy(new BigNumber(bestResult.toTokenAmount));
        let priceImpect = 0;
        if (fromTokenTotalValue > 0 && fromTokenTotalValue.gt(destTokenTotalValue)) {
            priceImpect = fromTokenTotalValue.minus(destTokenTotalValue).multipliedBy(100).dividedBy(fromTokenTotalValue).toFixed(2);
        }
        let fee = new BigNumber(bestResult.feeAmount).multipliedBy(destTokenToGasTokenPrice).shiftedBy(-1 * destTokenInfo.decimals);
        transactionFee = fee.plus(transactionFee).toFixed(6);

        let swapInfo = {
            fromTokenTotalValue: "0",
            destTokenTotalValue: "0",
            returnAmount: "0",
            decrease: false,
            priceImpect: "0",
            transactionFee: "0"
        }
        swapInfo = {
            fromTokenTotalValue: fromTokenTotalValue.toFixed(),
            destTokenTotalValue: destTokenTotalValue.toFixed(),
            returnAmount: bestResult.toTokenAmount,
            decrease: destTokenTotalValue.lt(fromTokenTotalValue),
            priceImpect: priceImpect,
            transactionFee: transactionFee
        }

        return {
            swapInfo: swapInfo,
            routesInfo: { bestResult: bestResult }
        };
    }

    async _getResult(
        fromToken,
        destToken,
        amount,
        mainParts,
        mainFlags,
        subParts,
        subFlags,
        fromTokenInfo,
        destTokenInfo,
        mode
    ) {
        let result = {
            routes: [],
            toTokenAmount: "0",
            toTokenEthAmount: "0",
            feeAmount: "0",
            gasUnitsConsumed: "0",
            fromTokenPriceBaseDestToken: '0',
            destTokenPriceBaseFromToken: '0',
            subParts: this.defaultSubParts
        }
        let mainRes = await this.aggregatorRouter.getRoutesDistribution(fromToken, destToken, mainParts, mainFlags, mode);
        let mainRoutes = mainRes.routes;
        let mainDistribution = mainRes.distribution;
        let sigleDistribution = new BigNumber(0);
        let multiIndex = []

        for (let i = 0; i < mainRoutes.length; i++) {
            if (mainDistribution[i] == 0) continue;
            if (mainRoutes[i][1] == ZERO_ADDR
                || mainRoutes[i][1] == mainRoutes[i][0]
                || mainRoutes[i][1] == mainRoutes[i][2]
                || (String(mainRoutes[i][1]).toLocaleLowerCase() == Tokens[this.provider.chainId].WETH.toLocaleLowerCase() && (mainRoutes[i][0] == ZERO_ADDR || mainRoutes[i][2] == ZERO_ADDR))
            ) {
                sigleDistribution = sigleDistribution.plus(mainDistribution[i])
            } else {
                multiIndex.push(i)
            }
        }

        // handle A-B route
        if (sigleDistribution.gt(0)) {
            let stepAmount = new BigNumber(amount).multipliedBy(sigleDistribution).dividedBy(mainParts);
            let stepRes = await this._getExpectedReturnWithGas(fromToken, destToken, stepAmount.toFixed(), subParts, subFlags, this.defaultDTEPTGP);
            result.routes.push({
                amount: stepAmount.shiftedBy(1 * fromTokenInfo.decimals).toFixed(),
                returnAmount: stepRes.returnAmount,
                part: sigleDistribution.toNumber(),
                path: [fromToken, destToken],
                subRoutes: stepRes.routes,
                subRoutesDistribution: stepRes.routesDistribution
            });
            result.toTokenAmount = new BigNumber(stepRes.returnAmount).toFixed();
            result.feeAmount = new BigNumber(stepRes.feeAmount).toFixed();
            result.gasUnitsConsumed = new BigNumber(stepRes.gasAmount).toFixed();
        }

        // handle A-C-B route
        for (let i = 0; i < multiIndex.length; i++) {
            let stepAmount = new BigNumber(amount).multipliedBy(mainDistribution[multiIndex[i]]).dividedBy(mainParts);
            let stepRes = await this._getExpectedReturnWithGasMulti(
                mainRoutes[multiIndex[i]],
                stepAmount.toFixed(),
                [subParts, subParts],
                [subFlags, subFlags],
                [0, 0]
            );
            result.routes.push({
                amount: stepAmount.shiftedBy(1 * fromTokenInfo.decimals).toFixed(),
                returnAmount: stepRes.returnAmount,
                part: mainDistribution[multiIndex[i]],
                path: mainRoutes[multiIndex[i]],
                subRoutes: stepRes.routes,
                subRoutesDistribution: stepRes.routesDistribution
            });
            result.toTokenAmount = new BigNumber(result.toTokenAmount).plus(stepRes.returnAmount).toFixed();
            result.feeAmount = new BigNumber(result.feeAmount).plus(stepRes.feeAmount).toFixed();
            result.gasUnitsConsumed = new BigNumber(result.gasUnitsConsumed).plus(stepRes.gasAmount).toFixed();
        }

        result.fromTokenPriceBaseDestToken = await this.aggregatorRouter.getRate(fromToken, destToken, mainFlags);
        if (new BigNumber(result.fromTokenPriceBaseDestToken).gt(0)) {
            result.destTokenPriceBaseFromToken = new BigNumber(1).div(result.fromTokenPriceBaseDestToken).toFixed();
        } else {
            result.destTokenPriceBaseFromToken = "0";
        }
        result.toTokenAmount = new BigNumber(result.toTokenAmount).shiftedBy(-1 * destTokenInfo.decimals).toFixed();

        return result;
    }

    async _getExpectedReturnWithGas(fromToken, destToken, amount, parts, flags, destTokenEthPriceTimesGasPrice) {
        let tokenIns = await this._getTokenIns(fromToken);
        let tokenInfo = await tokenIns.info();
        let amountBig = new BigNumber(amount).shiftedBy(1 * tokenInfo.decimals).toFixed()
        flags = await this._updateFlags(flags, fromToken, destToken, amountBig) // For aggregator v3
        let res = await this.contract.methods.getExpectedReturnWithGas(
            fromToken,
            destToken,
            amountBig,
            parts,
            flags,
            destTokenEthPriceTimesGasPrice
        ).call();
        let routes = [];
        let stepRoute = []
        for (let i = 0; i < res.distribution.length; i++) {
            if (Number(res.distribution[i]) == 0) continue;
            let obj = {
                fromTokenAddress: fromToken,
                toTokenAddress: destToken,
                part: res.distribution[i],
                market: DemaxAggregatorDexs[this.provider.chainId][i],
                meta: {
                    fromTokenAddress: fromToken,
                    toTokenAddress: destToken
                }
            };
            stepRoute.push(obj);
        }
        routes.push(stepRoute);

        return {
            returnAmount: res.returnAmount,
            gasAmount: res.estimateGasAmount,
            feeAmount: res.feeAmount,
            routes: routes,
            routesDistribution: res.distribution
        }
    }

    async _getExpectedReturnWithGasMulti(tokens, amount, parts, flags, destTokenEthPriceTimesGasPrice) {
        let tokenIns = await this._getTokenIns(tokens[0]);
        let tokenInfo = await tokenIns.info();
        let amountBig = new BigNumber(amount).shiftedBy(1 * tokenInfo.decimals).toFixed();
        let flags0 = await this._updateFlags(flags[0], tokens[0], tokens[1], amountBig) // Select the max liquidity pool dex.
        let flags1 = await this._updateFlags(flags[1], tokens[1], tokens[2], new BigNumber(1000).shiftedBy(18).toFixed()) // Select the max liquidity pool dex.
        let res = await this.contract.methods.getExpectedReturnWithGasMulti(
            tokens,
            amountBig,
            parts,
            [flags0, flags1],
            destTokenEthPriceTimesGasPrice
        ).call();

        let routes = [];
        for (let i = 1; i < tokens.length; i++) {
            let stepRoute = []
            for (let j = 0; j < res.distribution.length; j++) {
                let part = (res.distribution[j] >> (8 * (i - 1))) & 0xFF
                if (Number(part) == 0) continue;
                let obj = {
                    fromTokenAddress: tokens[i - 1],
                    toTokenAddress: tokens[i],
                    part: part,
                    market: DemaxAggregatorDexs[this.provider.chainId][j],
                    meta: {
                        fromTokenAddress: tokens[i - 1],
                        toTokenAddress: tokens[i],
                        toTokenAmount: new BigNumber(res.returnAmounts[res.returnAmounts.length - 1]).toFixed()
                    }
                };
                stepRoute.push(obj);
            }
            routes.push(stepRoute);
        }

        return {
            returnAmount: res.returnAmounts[res.returnAmounts.length - 1],
            feeAmount: res.feeAmount,
            gasAmount: res.estimateGasAmount,
            routes: routes,
            routesDistribution: res.distribution
        }
    }

    async _swap(fromToken, desToken, amount, returnAmount, distribution, flags, slidePoint) {
        let minReturn = this.defaultMinReturn;
        if (slidePoint) {
            minReturn = new BigNumber(returnAmount).multipliedBy(1e3 - slidePoint).div(1e3).toFixed(0);
        }
        let value = 0;
        if (fromToken == "0x0000000000000000000000000000000000000000") value = amount;
        let res = await this.provider.executeContract(this.contract, 'swap', value, [fromToken, desToken, amount, minReturn, distribution, flags]);
        return res
    }

    async _swapMulti(tokens, amount, returnAmount, distribution, flags, slidePoint) {
        let minReturn = this.defaultMinReturn;
        if (slidePoint) {
            minReturn = new BigNumber(returnAmount).multipliedBy(1e3 - slidePoint).div(1e3).toFixed(0);
        }
        let value = 0;
        if (tokens[0] == "0x0000000000000000000000000000000000000000") value = amount;
        let res = await this.provider.executeContract(this.contract, 'swapMulti', value, [tokens, amount, minReturn, distribution, flags]);
        return res
    }

    async _getTokenIns(token) {
        return new ERC20Token(this.provider, token);
    }

    async _updateFlags(flags, fromToken, destToken, amount) {
        if (this.provider.chainId != 56 || flags != 0) return flags;
        let dexIzumiswap400 = this.provider.getContract(DexIzumiswap400ABI, "0x4FAB37351584bACcFdCB78029749E0877F7c1685")
        let dexIzumiswap2000 = this.provider.getContract(DexIzumiswap2000ABI, "0xFB8Dd7c4737667b256F25afaC6493152c1aE7c28")
        // flags = DemaxAggregatorDexs[56][6].disableFlag + DemaxAggregatorDexs[56][8].disableFlag + DemaxAggregatorDexs[56][9].disableFlag + DemaxAggregatorDexs[56][10].disableFlag + DemaxAggregatorDexs[56][11].disableFlag
        flags = DemaxAggregatorDexs[56][8].disableFlag + DemaxAggregatorDexs[56][9].disableFlag + DemaxAggregatorDexs[56][10].disableFlag + DemaxAggregatorDexs[56][11].disableFlag
        let reserve400
        let reserve2000
        if (fromToken.toLocaleLowerCase() == ZERO_ADDR) fromToken = Tokens[56].WETH
        if (destToken.toLocaleLowerCase() == ZERO_ADDR) destToken = Tokens[56].WETH
        if (fromToken.toLocaleLowerCase() < destToken.toLocaleLowerCase()) {
            reserve400 = (await dexIzumiswap400.methods.getReserves(fromToken, destToken).call()).reserveA
            reserve2000 = (await dexIzumiswap2000.methods.getReserves(fromToken, destToken).call()).reserveA
        } else if (destToken.toLocaleLowerCase() < fromToken.toLocaleLowerCase()) {
            reserve400 = (await dexIzumiswap400.methods.getReserves(fromToken, destToken).call()).reserveB
            reserve2000 = (await dexIzumiswap2000.methods.getReserves(fromToken, destToken).call()).reserveB
        }
        let max = BigNumber.max(new BigNumber(amount), new BigNumber(reserve400), new BigNumber(reserve2000))
        if (max.eq(new BigNumber(reserve400))) {
            // console.log('enable fee 400 pool')
            flags = flags - DemaxAggregatorDexs[56][9].disableFlag
        } else if (max.eq(new BigNumber(reserve2000))) {
            // console.log('enable fee 2000 pool')
            flags = flags - DemaxAggregatorDexs[56][10].disableFlag
        }
        return flags;
    }
}
