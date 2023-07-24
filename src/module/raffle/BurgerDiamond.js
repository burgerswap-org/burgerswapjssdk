import ABI from '../../abi/BurgerDiamond.json';
import Base from '../Base.js';
import ERC20Token from '../ERC20Token.js';

export default class BurgerDiamond extends Base {
  // token = null;

  constructor(provider) {
    super(provider, ABI.abi, 'BurgerDiamond');
  }

  async balanceOf(user) {
    let token = new ERC20Token(this.provider, this.address)
    return await token.balanceOf(user);
  }

  async info() {
    let token = new ERC20Token(this.provider, this.address)
    return await token.info();
  }

  async allowance(spender) {
    let token = new ERC20Token(this.provider, this.address)
    return token.allowance(spender);
  }

  async approve(spender, amount) {
    return await this.provider.executeContract(this.contract, 'approve', 0, [spender, amount]);
  }

  async transfer(to, amount) {
    let token = new ERC20Token(this.provider, this.address)
    return await token.transfer(to, amount);
  }

  async claim(amount, orderId, txId, signature) {
    return await this.provider.executeContract(this.contract, 'claim', 0, [amount, orderId, txId, signature]);
  }

  async exchange(amount, orderId, txId, signature) {
    return await this.provider.executeContract(this.contract, 'exchange', 0, [amount, orderId, txId, signature]);
  }
}
