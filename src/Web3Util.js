export default class Web3Util {
    constructor(web3) {
        this.web3 = web3;
    }

    init(web3) {
        this.web3 = web3;
    }

    string2bytes32(val) {
        let res = this.web3.utils.stringToHex(val)
        res = res + Array(67 - res.length).join('0')
        return res
    }

    keccak256(val) {
        return this.web3.utils.keccak256(val)
    }

    hexToBytes(val) {
        return this.web3.utils.hexToBytes(val)
    }

    hexToAscii(val) {
        return this.web3.utils.hexToAscii(val);
    }

    numberToHex(val) {
        return this.web3.utils.numberToHex(val);
    }

    getAbiEventInputs(abi, name) {
        for(let item of abi) {
            if(item.type == 'event' && item.name == name) {
                return item.inputs
            }
        }
        return null
    }

    encodeEventName(inputs, name) {
        if (inputs == null) {
            return null
        }
        let params = []
        inputs.map(o=>{
            params.push(o.type)
        })
        let funcName = name+'('+params.join(',')+')'
        let enFuncName = this.web3.utils.sha3(funcName)
        return enFuncName
    }

    encodeEventTopic(abi, name) {
        let inputs = this.getAbiEventInputs(abi, name)
        return this.encodeEventName(inputs, name)
    }

    decodeEventLog(web3, inputs, data, topics) {
        data = data.substr(2)

        let topic = topics.slice()
        topic.splice(0, 1);
        let inputData = inputs.slice()
        let result = web3.eth.abi.decodeLog(inputData, data, topic)
        return result
    }

    findEventLogs(web3, abi, receipt, names=[]) {
        let result = {
            transactionHash: receipt.transactionHash,
            blockNumber: Number(receipt.blockNumber),
            address: receipt.address,
            data: []
        }
        for(let i=0; i<names.length; i++) {
            let d = this.parseEventLog(web3, abi, receipt, names[i])
            if(d.eventName) {
                result.data.push(d);
            }
        }
        return result
    }

    findEventOneLog(web3, abi, log, names=[]) {
        let result = {
            eventName: null,
            transactionHash: log.transactionHash,
            blockNumber: Number(log.blockNumber),
            address: log.address,
            returnValues: {}
        }
        for(let i=0; i<names.length; i++) {
            result = this.parseEventOneLog(web3, abi, log, names[i])
            if(result.eventName) {
                return result;
            }
        }
        return result
    }

    parseEventOneLog(web3, abi, log, name) {
        let result = {
            eventName: null,
            transactionHash: log.transactionHash,
            blockNumber: Number(log.blockNumber),
            address: log.address,
            returnValues: {}
        }
        let inputs = this.getAbiEventInputs(abi, name)
        let topic = this.encodeEventName(inputs, name)
        if(topic == log.topics[0]) {
            result.returnValues = this.decodeEventLog(web3, inputs, log.data, log.topics)
            result.eventName = name
        }
        console.log('web3 parseEventOneLog:', log, result)
        return result
    }

    parseEventLog(web3, abi, receipt, name) {
        let result = {
            eventName: null,
            transactionHash: receipt.transactionHash,
            blockNumber: Number(receipt.blockNumber),
            address: receipt.address,
            returnValues: {}
        }
        for(let log of receipt.logs) {
            let inputs = this.getAbiEventInputs(abi, name)
            let topic = this.encodeEventName(inputs, name)
            if(topic == log.topics[0]) {
                result.eventName = name
                result.returnValues = this.decodeEventLog(web3, inputs, log.data, log.topics)
                result.address = log.address
                break
            }
        }
        return result
    }

    parseEventLogs(web3, abi, receipt, name) {
        let result = []
        for(let log of receipt.logs) {
            let inputs = this.getAbiEventInputs(abi, name)
            let topic = this.encodeEventName(inputs, name)
            if(topic == log.topics[0]) {
                result.push({
                    eventName: name,
                    returnValues: this.decodeEventLog(web3, inputs, log.data, log.topics),
                    address: log.address
                })
            }
        }
        return result
    }
}

