import Web3 from "web3";
import BigNumber from "bignumber.js";
import Web3Util from '../src/Web3Util.js';
import ethUtils from "ethereumjs-util";
import sigUtil from 'eth-sig-util';
import fs from "fs";
import {
    CHAIN_RPC,
    CHAIN_BROWSER,
    CHAIN_NAME,
    ContractsAddr,
    ChainSymbol
} from '../src/ChainConfig.js'

function transactionReceiptAsync(web3, hash, resolve, reject) {
    web3.eth.getTransactionReceipt(hash).then(receipt => {
        if (!receipt) {
            setTimeout(function () {
                transactionReceiptAsync(web3, hash, resolve, reject)
            }, 1000);
        } else {
            if (receipt && !receipt.status) {
                reject(receipt)
            } else {
                resolve(receipt)
            }
        }
    }).catch(reject)
}

export default class Web3Provider {
    constructor() {
        this.ZERO_ADDR = '0x0000000000000000000000000000000000000000';
        this.web3 = null;
        this.web3Util = new Web3Util(Web3);
        this.chainId = 0;
        this.account = '';
        this.tokens = [];
        this.nfts = [];
        this.apiModules = [];
        this.config = null;
        this.loadConfig();
    }

    loadConfig() {
        let _path = new URL('.config.json', import.meta.url);
        if(fs.existsSync(_path)) {
            let rawData = fs.readFileSync(_path);
            this.config = JSON.parse(rawData.toString());
        }
    }

    connect(chainId=0) {
        if(!this.config) {
            console.error('no config, fail to connect');
            throw new Error('no config, fail to connect');
        }
        if(!chainId) {
            chainId = this.config.ChainID;
        }
        this.chainId = chainId;
        try {
            const rpc = CHAIN_RPC[chainId];
            this.web3 = new Web3(rpc);
        } catch(e) {
            console.error('Web3 except: ', chainId, CHAIN_RPC[chainId], e);
            throw(e);
        }
        for(let i=0; i<this.config.WalletPrivateKeys.length; i++) {
            this.web3.eth.accounts.wallet.add(this.config.WalletPrivateKeys[i]);
        }
        this.account = this.web3.eth.accounts.wallet[0].address.toLowerCase();
        this.initModules(chainId);
    }
    
    registerModule(module) {
        this.apiModules.push(module);
    }

    initModules(chainId) {
        for (let module of this.apiModules) {
            module.initialize(chainId);
        }
        for (let module of this.apiModules) {
            module.initAfter();
        }
    }
    
    async awaitTransactionMined(hash) {
        let web3 = this.web3;
        return new Promise(function (resolve, reject) {
            transactionReceiptAsync(web3, hash, resolve, reject);
        })
    }

    async executeContract(contract, methodName, value, params, gasPrice) {
        console.log('executeContract:', methodName, value, params)
        if (!value) {
            value = 0
        }
        value = this.web3Util.numberToHex(value)
        let transParams = {
            from: this.account,
            value: value,
        };
        const gas = await contract.methods[methodName](...params).estimateGas(transParams);
        if (gas) {
            transParams['gas'] = gas;
        }
        if (gasPrice) {
            transParams['gasPrice'] = gasPrice;
        }
        return await contract.methods[methodName](...params).send(transParams);
    }

    async sign(msg) {
        let wmsg = Web3.utils.utf8ToHex(msg);
        return await this.web3.eth.sign(wmsg, this.account);
    }

    verifySignature(msg, signature) {
        return this.web3.eth.accounts.recover(msg, signature);
    }

    verifySignTypedData(account, msg, signature) {
        this.typedSignatureHash(msg);
        let recovered = sigUtil.recoverTypedSignatureLegacy({ data: msg, sig: signature });
        if (ethUtils.toChecksumAddress(recovered) === ethUtils.toChecksumAddress(account)) {
            return true;
        }

        return false;
    }

    typedSignatureHash(typedData) {
        const error = new Error('Expect argument to be non-empty array')
        if (typeof typedData !== 'object' || !typedData.length) throw error

        const data = typedData.map(function (e) {
            return e.type === 'bytes' ? ethUtils.toBuffer(e.value) : e.value
        })
        const types = typedData.map(function (e) {
            return e.type
        })
        const schema = typedData.map(function (e) {
            if (!e.name) throw error
            return e.type + ' ' + e.name
        })
    }

    async getGasPrice() {
        let gasPrice = await this.web3.eth.getGasPrice();
        // gasPrice = new BigNumber(gasPrice).multipliedBy(config.GasPriceRate).toFixed(0);
        return new BigNumber(gasPrice).toFixed(0);
    }

    async getBlockNumber() {
        let res = await this.web3.eth.getBlockNumber();
        return Number(res);
    }

    getBlockSpanTime() {
        if (this.chainId == 1) {
            return 13.5;
        }
        return 3;
    }

    getBlockToTimes(start, end) {
        let now = new Date().getTime();
        let spanTime = (Number(end) - Number(start)) * this.getBlockSpanTime();
        return now + parseInt(spanTime * 1000);
    }

    async getNowToEndBlockTime(block) {
        let currentBlock = await this.getBlockNumber();
        return this.getBlockToTimes(currentBlock, block);
    }

    getBlockNumbers(blockNumber, blockTime, targetTime) {
        let diff = (targetTime - blockTime) / 1000 / this.getBlockSpanTime();
        return Number(blockNumber) + parseInt(diff);
    }

    getBlockNumberCount(blockTime, targetTime) {
        return parseInt((targetTime - blockTime) / 1000 / this.getBlockSpanTime());
    }

    getSelectedAddress() {
        return this.account;
    }

    getNetworkVersion() {
        return this.chainId
    }

    getContract(abi, address) {
        if (!abi || !address) {
            throw ('Illegal getContract address:', address);
        }
        return new this.web3.eth.Contract(abi, address)
    }

    getContractAddr(name) {
        return ContractsAddr[this.getNetworkVersion()][name]
    }

    getZeroSymbol() {
        return ChainSymbol.ZeroToken[this.getNetworkVersion()]
    }

    getWSymbol() {
        return ChainSymbol.WToken[this.getNetworkVersion()]
    }

    isZeroAddress(addr) {
        return addr == this.ZERO_ADDR;
    }

    isWETH(addr) {
        return addr == ContractsAddr[this.getNetworkVersion()]['WETH'].toLocaleLowerCase();
    }

    isETH(addr) {
        return this.isZeroAddress(addr) || this.isWETH(addr);
    }
}
