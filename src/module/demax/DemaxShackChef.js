import DemaxShackChefABI from '../../abi/DemaxShackChef.json';
import Base from '../Base.js';
import BigNumber from 'bignumber.js'
import ERC20Token from '../ERC20Token.js';
import {ShackPools, Tokens, ContractsAddr} from '../../ChainConfig.js';
import DemaxShackChefQuery from './DemaxShackChefQuery.js';
import DemaxQuery2 from './DemaxQuery2.js';
import SwitchQuery from './SwitchQuery.js';
export default class DemaxShackChef extends Base {
    constructor(provider) {
        super(provider, DemaxShackChefABI, 'DemaxShackChef');
        this.pools = {};
        this.shackStatistics = {
            tvl: '--',
            earn: '--',
        }
        this._shackChefData = null;
        this._earnTokens = {};
        this.query2 = new DemaxQuery2(provider);
        this.switchQuery = new SwitchQuery(provider);
        this.shackChefQuery = new DemaxShackChefQuery(provider);
    }

    getTokenAddress(name) {
        let addr = Tokens[this.provider.getNetworkVersion()][name];
        if(!addr) throw('not found token address');
        return addr;
    }

    async deposit(pid, amount, tokenSymbol) {
        amount = new BigNumber(amount).shiftedBy(18).toFixed();
        let value = 0
        if (this.provider.getZeroSymbol() == tokenSymbol) {
            value = amount
        }
        return await this.provider.executeContract(this.contract, 'deposit', value, [pid, amount])
    }

    async withdraw(pid, amount) {
        amount = new BigNumber(amount).shiftedBy(18).toFixed()
        return await this.provider.executeContract(this.contract, 'withdraw', 0, [pid, amount])
    }

    async pendingReward(pid) {
        return await await this.contract.methods.pendingReward(pid, this.this.provider.getSelectedAddress()).call()
    }

    async pendingEarn(pid) {
        return await await this.contract.methods.pendingEarn(pid, this.this.provider.getSelectedAddress()).call()
    }

    async harvest(pid) {
        return await this.provider.executeContract(this.contract, 'harvest', 0, [pid])
    }

    

    async getshackStatistics() {
        let pools = ShackPools[this.provider.chainId]
        await this.shackChefData()
        for(let d of pools){
            d.earnApy = '--'
            d.earnApr = '--'
            d.rewardApy = '--'
            d.earnSymbol = '--'
            d.userAllowance = '0'
            d.userBalance = '--'
            d.userAmount = '--'
            d.userReward = '--'
            d.userEarn = '--'
            d.totalStake = '--'
            d.totalStakeValue = '--'
            d.pendingReward = '--'
            d.pendingEarn = '--'
            d.pendingRewardValue = '--'
            d.pendingEarnValue = '--'
            d.weight = '--'
            d.depositCap = '--'
            d.accShare = '--'
            this.pools[d.pid] = d
            await this.getPool(d.pid)
        }
        
        return {shackStatistics: this.shackStatistics, pools}
    }

    async getPools() {
        let pools = ShackPools[this.provider.chainId]
        await this.shackChefData()
        pools.forEach(async (d)=>{
            d.earnApy = '--'
            d.earnApr = '--'
            d.rewardApy = '--'
            d.earnSymbol = '--'
            d.userAllowance = '0'
            d.userBalance = '--'
            d.userAmount = '--'
            d.userReward = '--'
            d.userEarn = '--'
            d.totalStake = '--'
            d.totalStakeValue = '--'
            d.pendingReward = '--'
            d.pendingEarn = '--'
            d.pendingRewardValue = '--'
            d.pendingEarnValue = '--'
            d.weight = '--'
            d.depositCap = '--'
            d.accShare = '--'
            this.pools[d.pid] = d
            this.getPool(d.pid)
        })
        return pools
    }

    async getPool(pid) {
        let info = await this.shackGetPoolInfo(pid)
        await this.saveEarnTokens(info)
      
        let shackChefData = await this.shackChefData()
        if(!this.pools.hasOwnProperty(pid)) this.pools[pid] = {};
      
        this.pools[pid].earnSymbol = info.earnTokenSymbol
        this.pools[pid].userBalance = new BigNumber(info.userBalance).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        this.pools[pid].userAmount = new BigNumber(info.userAmount).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        this.pools[pid].userReward = new BigNumber(info.userReward).shiftedBy(-1*shackChefData.rewardTokenDecimals).toFixed()
        this.pools[pid].userEarn = new BigNumber(info.userEarn).shiftedBy(-1*this._earnTokens[info.earnToken].decimals).toFixed()
        this.pools[pid].totalStake = new BigNumber(info.totalStake).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        this.pools[pid].totalStakeValue = new BigNumber(info.totalStakeValue).shiftedBy(-18).toFixed()
        this.pools[pid].weight = info.weight
      
        this.pools[pid].depositCap = new BigNumber(info.depositCap).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        this.pools[pid].accShare = new BigNumber(info.accShare).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        this.pools[pid].pendingReward = new BigNumber(info.pendingReward).shiftedBy(-1*shackChefData.rewardTokenDecimals).toFixed()
        this.pools[pid].pendingEarn = new BigNumber(info.pendingEarn).shiftedBy(-1*this._earnTokens[info.earnToken].decimals).toFixed()
        this.pools[pid].pendingRewardValue = new BigNumber(info.pendingRewardValue).shiftedBy(-18).toFixed()
        this.pools[pid].pendingEarnValue = new BigNumber(info.pendingEarnValue).shiftedBy(-18).toFixed()
        this.pools[pid].userAllowance = new BigNumber(info.userAllowance).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        this.pools[pid].earnApr = new BigNumber(info.earnApr).dividedBy(100).toFixed(2)
        // apy = (1 + apr / 365 * 24 * 6) ^（365 * 24 * 6） - 1
        let earnApy = Math.pow(1+parseFloat(info.earnApr)/(10000* 365 * 24), 365 * 24) - 1
        this.pools[pid].earnApy = new BigNumber(earnApy).multipliedBy(100).toFixed(2)
        this.pools[pid].rewardApy = await this.shackPoolRewardApr(this.pools[pid], shackChefData)
        this._shackUpdateVal()
        this._updateEarnTokenUserBalance(this._earnTokens[info.earnToken].address, info.depositToken, pid)
        // console.log('getPool:', this.pools[pid])
        return this.pools[pid]
    }

    async getTokenPrice(pair, token) {
        if (!pair || pair==this.provider.ZERO_ADDR || !token) {
          return '0'
        }

        try {
            let res = await this.query2.getPairReserve(pair);
            let d0 = new BigNumber(res.decimals0)
            let d1 = new BigNumber(res.decimals1)
            let r0 = new BigNumber(res.reserve0)
            let r1 = new BigNumber(res.reserve1)
            let offset = d0.minus(d1)
            r1 = r1.multipliedBy(new BigNumber(10).pow(offset))
            if (token.toLocaleLowerCase() === res.token0.toLocaleLowerCase()) {
                return r1.dividedBy(r0).toFixed()
            } else {
                return r0.dividedBy(r1).toFixed()
            }
        } catch(e) {
            console.error('invalid pair, except:', pair, e);
            return '0';
        }
    }

    async getBurgerPrice() {
        let pair = this.provider.getContractAddr('ThirdBurgerUsdPair')
        let token = this.getTokenAddress('BURGER').toLocaleLowerCase();
        return await this.getTokenPrice(pair, token)
    }

    async xBurgerPrice() {
        let xBurgerBURGER = await this.getTokenPrice(this.getTokenAddress('XBurger_BURGER'), this.getTokenAddress('XBurger'))
        let burgerUsdt = await this.getBurgerPrice()
        let price = new BigNumber(xBurgerBURGER).multipliedBy(burgerUsdt).toFixed(2)
        // console.log('xBurgerPrice:', xBurgerBURGER, burgerUsdt, price)
        return price
      }

    async shackChefData(force = false) {
        let data = {
            rewardPrice: 0,
            rewardToken: '',
            mintPerBlock: 0,
            totalAllocPoint: 1,
            rewardTotal: 0,
            rewardTotalValue: 0,
            rewardTokenDecimals: 18,
            rewardTokenSymbol: ''
        }
        if(!this._shackChefData || force) {
            data.rewardPrice = await this.xBurgerPrice()
            let info = await this.shackChefQuery.getChefInfo()
            Object.assign(data, info)
            data.rewardTotal = new BigNumber(data.rewardTotal).shiftedBy(-1*data.rewardTokenDecimals).toFixed()
            data.rewardTotalValue = new BigNumber(data.rewardTotalValue).shiftedBy(-18).toFixed()
            // console.log('shackChefData:', data)
            this._shackChefData = data
        }
        return this._shackChefData
    }

    async shackPoolRewardApr(poolData, shackChefData) {
        if (shackChefData.mintPerBlock == 0 || shackChefData.totalAllocPoint == 0 || shackChefData.rewardPrice == 0) {
            // console.log('poolRewardApr param is 0 ', shackChefData, poolData.totalStake, shackChefData.rewardPrice)
            return '0'
        }

        let aYearAmount = new BigNumber(shackChefData.mintPerBlock).shiftedBy(-1 * shackChefData.rewardTokenDecimals).div(this.provider.getBlockSpanTime()).multipliedBy(24 * 3600 * 365)
        aYearAmount = aYearAmount.multipliedBy(poolData.weight).div(shackChefData.totalAllocPoint)
        let earned = aYearAmount.multipliedBy(shackChefData.rewardPrice)
        if (poolData.totalStakeValue > 0) {
            // console.log('poolRewardApr earned is ', poolData.tokenSymbol+'/'+poolData.baseSymbol, earned.toFixed(), shackChefData.rewardPrice)
            return earned.div(new BigNumber(poolData.totalStakeValue)).multipliedBy(100).toFixed(2)
        }
        // console.log('poolRewardApr earned is 0 ', poolData.tokenSymbol+'/'+poolData.baseSymbol, earned.toFixed(), shackChefData.rewardPrice, aYearAmount.toFixed())
        return earned.toFixed(2)
    }

    async shackGetPoolInfo(pid) {
        return await this.shackChefQuery.getPoolInfo(pid, this.provider.getSelectedAddress())
    }

    async saveEarnTokens(info) {
        if(this._earnTokens.hasOwnProperty(info.earnToken)) {
            return
        }
        this._earnTokens[info.earnToken] = {
            address: info.earnToken,
            decimals: info.earnTokenDecimals,
            symbol: info.earnTokenSymbol,
            total: '0',
            totalValue: '0',
        }

        let res = await this.shackChefQuery.getEarnInfo(info.earnInToken)
        this._earnTokens[info.earnToken].total = new BigNumber(res.total).shiftedBy(-1* this._earnTokens[info.earnToken].decimals).toFixed()
        this._earnTokens[info.earnToken].totalValue = new BigNumber(res.totalValue).shiftedBy(-18).toFixed()
    }

    async _shackUpdateVal() {
        let shackChefData = await this.shackChefData()
        let earnTokensTotal = new BigNumber(shackChefData.rewardTotalValue)
        let pendingEarnTotal = new BigNumber(0)
        let shackTvl = new BigNumber(0)
        for(let i in this.pools) {
          let d = this.pools[i]
          if(d.totalStakeValue != '--') {
            shackTvl = shackTvl.plus(new BigNumber(d.totalStakeValue))
            pendingEarnTotal = pendingEarnTotal.plus(d.pendingRewardValue).plus(d.pendingEarnValue)
          }
        }
        for(let k in this._earnTokens) {
        //   console.log('_shackUpdateVal  _earnTokens tvl:', k, this._earnTokens[k].totalValue)
          earnTokensTotal = earnTokensTotal.plus(this._earnTokens[k].totalValue)
        }
      
        this.shackStatistics.tvl = shackTvl.toFixed(2)
        this.shackStatistics.earn = earnTokensTotal.plus(pendingEarnTotal).toFixed(2)
        // console.log('_shackUpdateVal  ---shackStatistics:', this.shackStatistics)
    }

    async tokenBalanceOf(token, user) {
        let ins = new ERC20Token(this.provider, token);
        return await ins.balanceOf(user);
    }

    async _updateEarnTokenUserBalance(earnToken, depositToken, excludePid = -1) {
        let earnTokenInPools = {};
        earnToken = earnToken.toLocaleLowerCase()
        depositToken = depositToken.toLocaleLowerCase()
        if (earnToken.toLocaleLowerCase() == depositToken.toLocaleLowerCase()) {
            if (!earnTokenInPools.hasOwnProperty(earnToken.toLocaleLowerCase())) {
                earnTokenInPools[earnToken.toLocaleLowerCase()] = []
            }
            if (!earnTokenInPools[earnToken.toLocaleLowerCase()].includes(excludePid)) {
                earnTokenInPools[earnToken.toLocaleLowerCase()].push(excludePid)
            }
        }
        if (earnTokenInPools.hasOwnProperty(earnToken)) {
            for (let i in earnTokenInPools[earnToken]) {
                let pid = earnTokenInPools[earnToken][i]
                if (pid != excludePid) {
                    this.pools[pid].userBalance = (await this.tokenBalanceOf(this.pools[pid].address, this.this.provider.getSelectedAddress())).toFixed()
                }
            }
        }
    }


    /**  April Add Sync Function */
    /**  April Add Sync Function */
    /**  April Add Sync Function */
    
    async getPoolList() {
        let pools = ShackPools[this.provider.chainId]
        return pools;
    }

    async getPoolInfo(pid) {
        let poolInfo = ShackPools[this.provider.chainId].find(item => item.pid == pid);
        let info = await this.shackGetPoolInfo(pid)
        await this.saveEarnTokens(info)
      
        let shackChefData = await this.shackChefData()
      
        poolInfo.earnSymbol = info.earnTokenSymbol
        poolInfo.userBalance = new BigNumber(info.userBalance).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        poolInfo.userAmount = new BigNumber(info.userAmount).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        poolInfo.userReward = new BigNumber(info.userReward).shiftedBy(-1*shackChefData.rewardTokenDecimals).toFixed()
        poolInfo.userEarn = new BigNumber(info.userEarn).shiftedBy(-1*this._earnTokens[info.earnToken].decimals).toFixed()
        poolInfo.totalStake = new BigNumber(info.totalStake).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        poolInfo.totalStakeValue = new BigNumber(info.totalStakeValue).shiftedBy(-18).toFixed()
        poolInfo.weight = info.weight;
      
        poolInfo.depositCap = new BigNumber(info.depositCap).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        poolInfo.accShare = new BigNumber(info.accShare).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        poolInfo.pendingReward = new BigNumber(info.pendingReward).shiftedBy(-1*shackChefData.rewardTokenDecimals).toFixed()
        poolInfo.pendingEarn = new BigNumber(info.pendingEarn).shiftedBy(-1*this._earnTokens[info.earnToken].decimals).toFixed()
        poolInfo.pendingRewardValue = new BigNumber(info.pendingRewardValue).shiftedBy(-18).toFixed()
        poolInfo.pendingEarnValue = new BigNumber(info.pendingEarnValue).shiftedBy(-18).toFixed()
        poolInfo.userAllowance = new BigNumber(info.userAllowance).shiftedBy(-1*info.depositTokenDecimals).toFixed()
        poolInfo.earnApr = new BigNumber(info.earnApr).dividedBy(100).toFixed(2)
        // apy = (1 + apr / 365 * 24 * 6) ^（365 * 24 * 6） - 1
        let earnApy = Math.pow(1+parseFloat(info.earnApr)/(10000* 365 * 24), 365 * 24) - 1
        poolInfo.earnApy = new BigNumber(earnApy).multipliedBy(100).toFixed(2)
        poolInfo.rewardApy = await this.shackPoolRewardApr(poolInfo, shackChefData)
        let usdt = await this.switchQuery.getTokenPrice2(ContractsAddr[this.provider.chainId].SwapFactoryForShack, poolInfo.address, Tokens[this.provider.chainId].USDT)
        // this._shackUpdateVal()
        poolInfo.tokenForUSDTPrice = usdt;
        poolInfo.tokenForUSDT = new BigNumber(poolInfo.userAmount).multipliedBy(usdt).toFixed(8);
        poolInfo.userBalance = await this.updateEarnTokenUserBalance(this._earnTokens[info.earnToken].address, info.depositToken, poolInfo)
        return poolInfo
    }

    async updateEarnTokenUserBalance(earnToken, depositToken, poolInfo) {
        let earnTokenInPools = {}, excludePid = poolInfo.pid, userBalance = poolInfo.userBalance;
        earnToken = earnToken.toLocaleLowerCase()
        depositToken = depositToken.toLocaleLowerCase()
        if (earnToken.toLocaleLowerCase() == depositToken.toLocaleLowerCase()) {
            if (!earnTokenInPools.hasOwnProperty(earnToken.toLocaleLowerCase())) {
                earnTokenInPools[earnToken.toLocaleLowerCase()] = []
            }
            if (!earnTokenInPools[earnToken.toLocaleLowerCase()].includes(excludePid)) {
                earnTokenInPools[earnToken.toLocaleLowerCase()].push(excludePid)
            }
        }
        if (earnTokenInPools.hasOwnProperty(earnToken)) {
            for (let i in earnTokenInPools[earnToken]) {
                let pid = earnTokenInPools[earnToken][i]
                if (pid != excludePid) {
                    userBalance = (await this.tokenBalanceOf(poolInfo.address, this.this.provider.getSelectedAddress())).toFixed();
                }
            }
        }
        return userBalance
    }
}
