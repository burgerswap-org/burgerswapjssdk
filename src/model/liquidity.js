class Liquidity {
    constructor(address, percent, liquidity, canRemove) {
        this.address = address;
        this.percent = percent;
        this.liquidity = liquidity;
        this.canRemove = canRemove;
    }

    setTokenAddress(token0, token1) {
        this.token0 = token0;
        this.token1 = token1;
    }

    setReserve(reserve0, reserve1) {
        this.reserve0 = reserve0;
        this.reserve1 = reserve1;
    }

    setReward(reward, lastBlock) {
        this.reward = reward;
        this.lastBlock = lastBlock;
    }

    setApr(fee, mint) {
        this.aprFee = fee;
        this.aprMining = mint;
    }
}

export default Liquidity