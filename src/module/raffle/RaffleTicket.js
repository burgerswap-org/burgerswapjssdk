import RaffleTicketABI from '../../abi/RaffleTicket.json';
import BigNumber from 'bignumber.js';
import Base from '../Base.js';
import ERC20Token from '../ERC20Token.js';

export default class RaffleTicket extends Base {
  constructor(provider) {
    super(provider, RaffleTicketABI.abi, 'RaffleTicket');
    this.token = new ERC20Token(provider, this.address)
  }

  async balanceOf(user) {
    return await this.token.balanceOf(user);
  }

  async info() {
    return await token.info();
  }

  async allowance(spender) {
    return this.token.allowance(spender);
  }

  async approve(spender, amount) {
    return await this.provider.executeContract(this.contract, 'approve', 0, [spender,amount]);
  }

  async transfer(to, amount) {
    return await this.token.transfer(to, amount);
  }

  async claim(amount, orderId, signature) {
    return await this.provider.executeContract(this.contract, 'claim', 0, [amount, orderId, signature]);
  }

  async exchange(amount) {
    return await this.provider.executeContract(this.contract, 'exchange', 0, [amount]);
  }
}
