import Web3Provider from './Web3Provider.js';
import ChainMain from "../src/ChainMain.js";

let chainWeb3 = new Web3Provider();
var chainApi = new ChainMain(chainWeb3);
export default chainApi;