// import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
// import { ParticleProvider } from "@particle-network/provider";

const auth = require("@particle-network/auth")
const provider = require("@particle-network/provider")

const pn = new auth.ParticleNetwork({
    projectId: "642051a9-9a72-4386-8561-0bc24fdc4478",
    clientKey: "crFGCOsLvF09N2BaaGufCVe7Lxb3YUwmHsXGx7mI",
    appId: "d9d43649-4d3e-4800-89a9-e5b28d77b8ff",
    chainName: "BSC", //optional: current chain name, default Ethereum.
    chainId: 97, //optional: current chain id, default 1.
    // wallet: {   //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
    //   displayWalletEntry: true,  //show wallet entry when connect particle.
    //   defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
    //   supportChains: [{ id: 56, name: "BSC"}, { id: 97, name: "BSC"}], // optional: web wallet support chains.
    //   customStyle: {}, //optional: custom wallet style
    // }
  });
  
const particleProvider = new provider.ParticleProvider(pn.auth);
  //if you need support solana chain
//   const solanaWallet = new SolanaWallet(pn.auth);
  
const _ParticleNetwork = {particleProvider, pn};
export default _ParticleNetwork