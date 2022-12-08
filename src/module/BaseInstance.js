export default class BaseInstance {
    constructor(provider, abi, address) {
        this.address = address;
        this.provider = provider;
        this.abi = abi;
        this.subscribes = [];
        this.subscriptions = [];
        if(address) {
            this.contract = this.provider.getContract(this.abi, address);
        } 
    }

    initSubscribe(eventNames=[]) {
        let subscription = this.provider.web3.eth.subscribe('logs', {
            fromBlock: 'latest',
            address: this.address
        }, (error, result) => {
            if (!error) {
                let eventLog = this.provider.web3Util.findEventOneLog(this.provider.web3, this.abi, result, eventNames);
                this.subscribes.forEach((cb)=>{
                    console.log('initSubscribe subscribe', eventLog);
                    cb(this.address, eventLog);
                })
            }
        });
        this.subscriptions.push(subscription);
    }

    subscribe(cb) {
        if(!this.subscribes.includes(cb)) {
            console.log('initSubscribe subscribe')
            this.subscribes.push(cb);
        }
    }

    unsubscribe() {
        this.subscriptions.forEach((subscription)=>{
            subscription.unsubscribe(function(error, success){
                if(success)
                    console.log('Successfully unsubscribed!');
            });
        })
    }
}