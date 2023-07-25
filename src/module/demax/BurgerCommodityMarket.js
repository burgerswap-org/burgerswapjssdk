import BurgerCommodityMarketABI from '../../abi/BurgerCommodityMarket.json';
import BigNumber from "bignumber.js";
import ERC20Token from '../ERC20Token.js';
import Base from '../Base.js';

export default class BurgerCommodityMarket extends Base {
    constructor(provider) {
        super(provider, BurgerCommodityMarketABI, 'BurgerCommodityMarket');
        this.payToken = '';
    }

    async payToken() {
        if(!this.payToken) this.payToken = await this.contract.methods.payToken().call();
        return this.payToken;
    }

    async payTokenInfo() {
        let _payToken = await this.payToken();
        return await new ERC20Token(this.provider, _payToken).info();;
    }

    async getOrderStatus(_sn) {
        return await this.contract.methods.orders(_sn).call();
    }

    async buy(_payToken, _deadline, _sn, _amount, _signature) {
        let value = '0';
        if(this.provider.isZeroAddress(_payToken)) {
            value = amount;
        }
        return await this.provider.executeContract(this.contract, 'buy', value, [_deadline, _sn, _amount, _signature]);
    }

    async buyBatch(_payToken, _deadline, _sns, _amounts, _signatures) {
        let value = '0';
        let bAmount = new BigNumber('0');
        if(this.provider.isZeroAddress(_payToken)) {
            _amounts.forEach((d)=>{
                bAmount = bAmount.plus(new BigNumber(d));
            })
            value = bAmount.toFixed();
        }
        return await this.provider.executeContract(this.contract, 'buyBatch', value, [_deadline, _sns, _amounts, _signatures]);
    }

    /**
     *@param data:
    [
        {
            "payToken": "",
            "deadline": "",
            "sn": "",
            "amount": "",
        }
    ]
     */
    
    async sign(data) {
        let url = '/marketapi/commoditymarket/sign?chainId='+ this.provider.chainId;
        let res = await fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })

        let text = await res.text();
        return JSON.parse(text);
    }
}