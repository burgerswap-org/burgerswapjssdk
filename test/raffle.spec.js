import chainApi from '../backend/ChainApi.js';
import BigNumber from 'bignumber.js';

async function main() {
    chainApi.chainWeb3.connect();

    let executeInfo = true;
    let executeClaim = false;
    let executeExchange = false;
    let executeClaimERC20 = false;

    // consoume token approve
    let consumeTokenAddr = "0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24" // bsc-test Burger
    let consumeToken = new chainApi.ERC20Token(chainApi.chainWeb3, consumeTokenAddr)
    let allowance = await consumeToken.allowance(chainApi.rewardAgent.address)
    console.log('allowance:', allowance.toString())
    if (new BigNumber(allowance).eq(0)) {
        await consumeToken.approve(chainApi.rewardAgent.address)
    }

    /// =====================BurgerDiamond===================
    // info
    if (executeInfo) {
        console.log("============split line============")
        let info = await chainApi.burgerDiamond.info()
        console.log("res:", info)
    }

    // claim BurgerDiamond
    if (executeClaim) {
        console.log("============split line============")
        let amount = new BigNumber(10)
        let orderId = new BigNumber(111)
        let txId = new BigNumber(111)
        let operation = new BigNumber(0)
        let message = chainApi.chainWeb3.web3.utils.soliditySha3(
            { t: "address", v: chainApi.chainWeb3.account },
            { t: "uint256", v: amount },
            { t: "uint256", v: orderId },
            { t: "uint8", v: operation },
            { t: "address", v: chainApi.burgerDiamond.address }
        );
        let claimSig = chainApi.chainWeb3.web3.eth.accounts.sign(
            message,
            chainApi.chainWeb3.config.WalletPrivateKeys[0]
        );
        let claimRes = await chainApi.burgerDiamond.claim(amount, orderId, txId, claimSig.signature)
        console.log('txhash:', claimRes.transactionHash)
        let balance = await chainApi.burgerDiamond.balanceOf(chainApi.chainWeb3.account)
        console.log("balance:", balance.toString())
    }

    // exchange BurgerDiamond
    if (executeExchange) {
        console.log("============split line============")
        let amount = new BigNumber(5)
        let orderId = new BigNumber(111)
        let txId = new BigNumber(111)
        let operation = new BigNumber(1)
        let message = chainApi.chainWeb3.web3.utils.soliditySha3(
            { t: "address", v: chainApi.chainWeb3.account },
            { t: "uint256", v: amount },
            { t: "uint256", v: orderId },
            { t: "uint8", v: operation },
            { t: "address", v: chainApi.burgerDiamond.address }
        );
        let exchangeSig = chainApi.chainWeb3.web3.eth.accounts.sign(
            message,
            chainApi.chainWeb3.config.WalletPrivateKeys[0]
        );
        let exchangeRes = await chainApi.burgerDiamond.exchange(amount, orderId, txId, exchangeSig.signature)
        console.log('txhash:', exchangeRes.transactionHash)
        let balance = await chainApi.burgerDiamond.balanceOf(chainApi.chainWeb3.account)
        console.log("balance:", balance.toString())
    }

    /// =====================RewardAgent=====================
    // claimERC20
    if (executeClaimERC20) {
        console.log("============split line============")
        let to = "0x146dCB8a374f642c13d51412D15CF78Ce598d23F"
        let orderId = new BigNumber(1)
        let txId = new BigNumber(1)
        let amount = new BigNumber(10).shiftedBy(18)
        let message = chainApi.chainWeb3.web3.utils.soliditySha3(
            { t: "address", v: to },
            { t: "address", v: consumeTokenAddr },
            { t: "uint256", v: amount },
            { t: "uint256", v: orderId },
            { t: "address", v: chainApi.rewardAgent.address }
        );
        let claimERC20Sig = chainApi.chainWeb3.web3.eth.accounts.sign(
            message,
            chainApi.chainWeb3.config.WalletPrivateKeys[0]
        );
        let claimERC20Res = await chainApi.rewardAgent.claimERC20(to, consumeTokenAddr, amount, orderId, txId, claimERC20Sig.signature)
        console.log('txhash:', claimERC20Res.transactionHash)
        let balance = await consumeToken.balanceOf(to)
        console.log('balance:', balance.toString())
    }
}

main()