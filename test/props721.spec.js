import chainApi from '../backend/ChainApi.js';
import BigNumber from 'bignumber.js';

async function main() {
    chainApi.chainWeb3.connect();

    let executeInfo = false;
    let executeOwnerOf = false;
    let executeTokenURI = false;
    let executeSetSiger = false;
    let executeMint = false;
    let executeBurn = false;

    // consoume token approve
    let consumeTokenAddr = "0xF2ED382e6A3439Be124813842200cf6702fD6ecA" // bsc-test USDT
    let consumeToken = new chainApi.ERC20Token(chainApi.chainWeb3, consumeTokenAddr)
    let allowance = await consumeToken.allowance(chainApi.props721.address)
    if (new BigNumber(allowance).eq(0)) {
        await consumeToken.approve(chainApi.props721.address)
    }

    // info
    if (executeInfo) {
        console.log("============split line============")
        let info = await chainApi.props721.info()
        console.log("res:", info)
    }

    // setSigner
    if (executeSetSiger) {
        console.log("============split line============")
        let setSignerRes = await chainApi.props721.setSinger(chainApi.chainWeb3.account)
        console.log("txhash:", setSignerRes.transactionHash)
    }

    // mint
    if (executeMint) {
        console.log("============split line============")
        let expiryTime = new BigNumber(Math.floor(Date.now() / 1000)).plus(86400)
        let seed = new BigNumber(111)
        let consumeAmount = new BigNumber(1).shiftedBy(18)
        let message = chainApi.chainWeb3.web3.utils.soliditySha3(
            { t: "address", v: chainApi.chainWeb3.account },
            { t: "uint256", v: expiryTime },
            { t: "uint256", v: seed },
            { t: "uint256", v: consumeAmount },
            { t: "address", v: chainApi.props721.address }
        );
        let mintSig = chainApi.chainWeb3.web3.eth.accounts.sign(
            message,
            chainApi.chainWeb3.config.WalletPrivateKeys[0]
        );
        let mintRes = await chainApi.props721.mint(expiryTime, seed, consumeAmount, mintSig.signature)
        console.log('txhash:', mintRes.transactionHash)
    }

    // ownerOf
    if (executeOwnerOf) {
        console.log("============split line============")
        let tokenId = new BigNumber(1)
        let owner = await chainApi.props721.ownerOf(tokenId)
        console.log("res:", owner)
    }

    // tokenURI
    if (executeTokenURI) {
        console.log("============split line============")
        let tokenId = new BigNumber(1)
        let uri = await chainApi.props721.tokenURI(tokenId)
        console.log("res:", uri)
    }

    // burn
    if (executeBurn) {
        console.log("============split line============")
        let tokenId = new BigNumber(1)
        let consumeAmount = new BigNumber(1).shiftedBy(18)
        let message = chainApi.chainWeb3.web3.utils.soliditySha3(
            { t: "uint256", v: tokenId },
            { t: "uint256", v: consumeAmount },
            { t: "address", v: chainApi.props721.address }
        );
        let burnSig = chainApi.chainWeb3.web3.eth.accounts.sign(
            message,
            chainApi.chainWeb3.config.WalletPrivateKeys[0]
        );
        let burnRes = await chainApi.props721.burn(tokenId, consumeAmount, burnSig.signature)
        console.log('txhash:', burnRes.transactionHash)
    }
}

main()