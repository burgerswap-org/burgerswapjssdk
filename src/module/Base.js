export default class Base {
    constructor(provider, abi, name) {
        this.provider = provider;
        this.abi = abi;
        this.name = name;
        this.address = '';
        provider.registerModule(this);
    }

    initialize() {
        // console.log('Base initialize:', this.name);
        try {
            this.address = this.provider.getContractAddr(this.name);
            if(this.address) {
                this.contract = this.provider.getContract(this.abi, this.address);
                // console.log('Base initialize address:', this.name, this.address);
            } else {
                console.error('Base initialize address:', this.name, this.address);
            }
        } catch(e) {
            console.error('fail to init contract:', this.name, e);
        }
    }

    initAfter() {}
}