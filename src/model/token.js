class Token {
    constructor(address, symbol, totalSupply, balance, allowance, allowance_gov, decimals, status) {
        this.address = address;
        this.symbol = symbol;
        this.totalSupply = totalSupply;
        this.balance = balance;
        this.decimals = decimals;
        this.allowance = allowance;
        this.allowance_gov = allowance_gov;
        this.status = status;
    }
}

export default Token