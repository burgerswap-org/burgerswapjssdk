import DemaxAggregatorABI from '../../abi/BurgerAggregator.json';
import ERC20Token from '../ERC20Token.js';
import DemaxAggregatorRouter from './DemaxAggregatorRouter.js';
import BigNumber from "bignumber.js"
import Base from '../Base.js';
import { Tokens } from '../../ChainConfig.js'
import { DemaxAggregatorDexs, Flags } from '../../config/DemaxAggregatorDexs.js'

export default class DemaxAggregator extends Base {
    constructor(provider) {
        super(provider, DemaxAggregatorABI, 'DemaxAggregator');

        this.defaultMainParts = 10
        this.defaultSubParts = 50
        this.OneParts = 1
        this.defaultFlags = 0
        this.defaultDTEPTGP = 0 // defaultDestTokenEthPriceTimesGasPrice
        this.defaultMinReturn = 0
        this.defaultGasPrice = 20 // Gwei
        this.aggregatorRouter = new DemaxAggregatorRouter(provider)
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
            let flag = Flags[this.provider.chainId][dexs[i].id].disableOtherFlag;
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

    async getSwapInfoOld(fromToken, destToken, amount, gasPrice, mode) {
        let fromTokenIns = await this._getTokenIns(fromToken);
        let fromTokenInfo = await fromTokenIns.info();
        let destTokenIns = await this._getTokenIns(destToken);
        let destTokenInfo = await destTokenIns.info();
        let dexs = DemaxAggregatorDexs[this.provider.chainId];
        if (!gasPrice) gasPrice = this.defaultGasPrice;

        let userInfo = {
            fromTokenAllowance: "0"
        }
        let swapInfo = {
            fromTokenTotalValue: "0",
            destTokenTotalValue: "0",
            returnAmount: "0",
            decrease: false,
            priceImpect: "0",
            transactionFee: "0"
        }

        let bestResult = await this._getResult(
            fromToken,
            destToken,
            amount,
            this.defaultMainParts,
            this.defaultFlags,
            this.defaultSubParts,
            this.defaultFlags,
            fromTokenInfo,
            destTokenInfo,
            mode
        );
        let results = []
        for (let i = 0; i < dexs.length; i++) {
            let flag = Flags[this.provider.chainId][dexs[i].id].disableOtherFlag;
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
                mode
            );
            results[i].protocal = dexs[i].name;
        }

        let fromTokenPrice = await this.aggregatorRouter.getRate(fromToken, Tokens[this.provider.chainId].USDT, this.defaultFlags);
        let destTokenPrice = await this.aggregatorRouter.getRate(destToken, Tokens[this.provider.chainId].USDT, this.defaultFlags);
        let fromTokenTotalValue = new BigNumber(fromTokenPrice).multipliedBy(amount)
        let destTokenTotalValue = new BigNumber(destTokenPrice).multipliedBy(new BigNumber(bestResult.toTokenAmount));
        let priceImpect = 0;
        if (fromTokenTotalValue > 0 && fromTokenTotalValue.gt(destTokenTotalValue)) {
            priceImpect = fromTokenTotalValue.minus(destTokenTotalValue).multipliedBy(100).dividedBy(fromTokenTotalValue).toFixed(2);
        }
        let transactionFee = new BigNumber(bestResult.gasUnitsConsumed).multipliedBy(gasPrice).shiftedBy(-1 * 9);
        let destTokenToGasTokenPrice = await this.aggregatorRouter.getRate(destToken, "0x0000000000000000000000000000000000000000", this.defaultFlags);
        let fee = new BigNumber(bestResult.feeAmount).multipliedBy(destTokenToGasTokenPrice).shiftedBy(-1 * destTokenInfo.decimals);
        transactionFee = fee.plus(transactionFee).toFixed(6);

        userInfo = {
            fromTokenAllowance: await fromTokenIns.allowance(this.address),
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
            userInfo: userInfo,
            swapInfo: swapInfo,
            routesInfo: {
                bestResult: bestResult,
                results: results
            }
        };
    }

    async getBestResult(fromToken, destToken, amount, gasPrice) {
        return await this._getBestResult(fromToken, destToken, amount, gasPrice)
    }

    async getBestResultOld(fromToken, destToken, amount, gasPrice, mode) {
        let fromTokenIns = await this._getTokenIns(fromToken);
        let fromTokenInfo = await fromTokenIns.info();
        let destTokenIns = await this._getTokenIns(destToken);
        let destTokenInfo = await destTokenIns.info();
        if (!gasPrice) gasPrice = this.defaultGasPrice;
        let bestResult = await this._getResult(fromToken, destToken, amount, this.defaultMainParts, this.defaultFlags, this.defaultSubParts, this.defaultFlags, fromTokenInfo, destTokenInfo, mode);

        let fromTokenPrice = await this.aggregatorRouter.getRate(fromToken, Tokens[this.provider.chainId].USDT, this.defaultFlags);
        let fromTokenTotalValue = new BigNumber(fromTokenPrice).multipliedBy(amount)
        let destTokenPrice = await this.aggregatorRouter.getRate(destToken, Tokens[this.provider.chainId].USDT, this.defaultFlags);
        let destTokenTotalValue = new BigNumber(destTokenPrice).multipliedBy(new BigNumber(bestResult.toTokenAmount));
        let priceImpect = 0;
        if (fromTokenTotalValue > 0 && fromTokenTotalValue.gt(destTokenTotalValue)) {
            priceImpect = fromTokenTotalValue.minus(destTokenTotalValue).multipliedBy(100).dividedBy(fromTokenTotalValue).toFixed(2);
        }
        let transactionFee = new BigNumber(bestResult.gasUnitsConsumed).multipliedBy(gasPrice).shiftedBy(-1 * 9);
        let destTokenToGasTokenPrice = await this.aggregatorRouter.getRate(destToken, "0x0000000000000000000000000000000000000000", this.defaultFlags);
        let fee = new BigNumber(bestResult.feeAmount).multipliedBy(destTokenToGasTokenPrice).shiftedBy(-1 * destTokenInfo.decimals);
        transactionFee = fee.plus(transactionFee).toFixed(6);
        let swapInfo = {
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

        // let flags = this.defaultFlags;
        // if (destToken.toLocaleLowerCase() == Tokens[this.provider.chainId].BURGER.toLocaleLowerCase()) {
        //     flags = Flags[this.provider.chainId]["0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256"].disableFlag
        // }
        
        // disable burgerswap bakeryswap dex
        let flags = Flags[this.provider.chainId]["0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256"].disableFlag + Flags[this.provider.chainId]["0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7"].disableFlag
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
        }

        let mainRes = await this.aggregatorRouter.getRoutesDistribution(fromToken, destToken, mainParts, mainFlags, mode);
        let mainRoutes = mainRes.routes;
        let mainDistribution = mainRes.distribution;
        console.log(mainRes)
        let sigleDistribution = new BigNumber(0);
        let multiIndex = []

        for (let i = 0; i < mainRoutes.length; i++) {
            if (mainDistribution[i] == 0) continue;
            if (mainRoutes[i][1] == "0x0000000000000000000000000000000000000000"
                || mainRoutes[i][1] == mainRoutes[i][0]
                || mainRoutes[i][1] == mainRoutes[i][2]
                || (String(mainRoutes[i][1]).toLocaleLowerCase() == Tokens[this.provider.chainId].WETH.toLocaleLowerCase() && (mainRoutes[i][0] == "0x0000000000000000000000000000000000000000" || mainRoutes[i][2] == "0x0000000000000000000000000000000000000000"))
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
        result.destTokenPriceBaseFromToken = new BigNumber(1).div(result.fromTokenPriceBaseDestToken).toFixed();
        result.toTokenAmount = new BigNumber(result.toTokenAmount).shiftedBy(-1 * destTokenInfo.decimals).toFixed();
        
        return result;
    }

    async _getExpectedReturnWithGas(fromToken, destToken, amount, parts, flags, destTokenEthPriceTimesGasPrice) {
        let tokenIns = await this._getTokenIns(fromToken);
        let tokenInfo = await tokenIns.info();
        let res = await this.contract.methods.getExpectedReturnWithGas(
            fromToken,
            destToken,
            new BigNumber(amount).shiftedBy(1 * tokenInfo.decimals).toFixed(),
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
        let res = await this.contract.methods.getExpectedReturnWithGasMulti(
            tokens,
            new BigNumber(amount).shiftedBy(1 * tokenInfo.decimals).toFixed(),
            parts,
            flags,
            destTokenEthPriceTimesGasPrice
        ).call();

        let routes = [];
        for (let i = 1; i < tokens.length; i++) {
            let stepRoute = []
            for (let j = 0; j < res.distribution.length; j++) {
                if (Number(res.distribution[j]) == 0) continue;
                let obj = {
                    fromTokenAddress: tokens[i - 1],
                    toTokenAddress: tokens[i],
                    part: (res.distribution[j] >> (8 * (i - 1))) & 0xFF,
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
}
