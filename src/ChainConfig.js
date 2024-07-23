const CHAIN_RPC = {
  1: 'https://mainnet.infura.io/v3/0e47785118b2494092b1a9a9b576c2bd',
  42: 'https://kovan.infura.io/v3/0e47785118b2494092b1a9a9b576c2bd',
  56: 'https://bsc-dataseed.binance.org',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  421613: 'https://arbitrum-goerli.public.blastapi.io',
  42161: 'https://arb1.arbitrum.io/rpc',
  81457: 'https://rpc.blast.io',
};

const CHAIN_BROWSER = {
  1: 'https://etherscan.io',
  42: 'https://kovan.etherscan.io',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
  421613: 'https://goerli-rollup-explorer.arbitrum.io',
  42161: 'https://arbiscan.io',
  81457: 'https://blastscan.io',
};

const CHAIN_NAME = {
  1: 'Ethereum Chain Mainnet',
  42: 'Ethereum Chain Kovan',
  56: 'Binance Smart Chain Mainnet',
  97: 'Binance Smart Chain Testnet',
  421613: 'Arbitrum Chain Testnet',
  42161: 'Arbitrum Chain Mainnet',
  81457: 'Blast Chain Mainnet',

};

const ContractsAddr = {
  56: {
    ThirdBurgerUsdPair: '0x034772cdcd90f5baabb2da325a879d6aa6840f6e',
    DemaxQueryV1: '0xa6F21AaAdA32CA46c876D915FDEb98d9c35A122a',
    DemaxPool: '0x86A327715d707BCa24983b1145D1F6c40C5d4A74',
    DemaxPlatform: '0xB099D7dbC415bf5491B0ca6fdCcFddF8b7EDCE12', // 0x789c11212EaCA5312d4aa6d63148613e658CcFAd
    DemaxFactory: '0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256',
    DemaxQuery: '0xc2969239da155C96047D276A2D0e28Cc55892BBe',
    DemaxQuery2: '0x59138b0B399edF74B8d296B8A52FE0cC18623fDD',
    DemaxGovernance: '0x9154c2684aeF8d106babcB19Aa81d4FabF7581ec',
    DemaxDelegate: '0x3dE79b6fF181AA60bd1Cd7d2C6ea8a6099A35E60',
    DGAS: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
    WETH: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    TokenQuery: '0xe85ED3322373F1dC720B7dCCDBECFcEb871364e0',

    DemaxConfig: '0xE7F6824706aEee33542088eb2fdd2D69e37455B6',
    DemaxProjectDeploy: '0x5Bb57735352165cEaBCB50dc9b11DB5341E5C7b5',
    DemaxProjectQuery: '0x1a64489D69FB4C6638eae6Cb5D898296F8Db19cE',
    SwapFactoryForShack: '0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8',
    DemaxShackChef: '0x07dE034A0Fc0DA7a0bf703F6DcA7025bcD61BA3e',
    DemaxShackFarm: '0x744Db744da07e3adE5Ba99d1C80fa11DC5ee247D',
    DemaxShackChefQuery: '0x8E3f0E0b955C3eC50dDC2015440e74fDAa885A52',
    DemaxPricePredictionQuery: '0xc5d7389AB0218e04e1D35Cf0551357871F6E9521',
    SwitchQuery: '0xFC15d66760f8C6637b9B326cAE3DAA69bAB9C236',
    DemaxAggregator: '0xfa9cCB91d28d35E12216e43d8990D31595783600',
    DemaxAggregatorRouter: '0x0ddC12f24976168810CcBA58E4Af7389f1D564C1',
    DemaxSwapReward: '0x87E2b671bAf5779DE8b9a2c801e848599b832FFc',
    DemaxAggregatorV2: '0xe08Ab553720a46C071475838a6cC8D98D1Afb891',
    DemaxAggregatorRouterV2: '0xD51B1Ce2507CcF258f33F7E7CCdBef0bDFA1c531',
    DailyPunchIn: '0x7521e13F7365236CEc7FdC99e7C4DB8FbADEEA0B',
    ChristmasPunchIn: '0x6FFB703653FeC0d340406e8acC69a2e01d2D09B4',
    ActivityPunchIn: '0x86EeaA6EeCfE41d2CB532cFd2D5BbF602C397d08',
  },
  97: {
    ThirdBurgerUsdPair: '0x46A9A54912Bb69e2ECDC3B07B5B9841E24b2f1e1',
    DemaxQueryV1: '0x8B8B498e5cf7FCA155634911F17675D3cD1365b1',
    DemaxPool: '0xB913E531A255091edcc1c454D0f141B553918158',
    DemaxPlatform: '0x075ECEA56A9C5313E8b78D8115Df1C8943A549b7',
    DemaxGovernance: '0xeD2eA4283a673252A7cd3A3a8C88702140947909',
    DemaxQuery: '0x2940a00E5a56271aB0c2898eC41362DE3ebB2b0A',
    DemaxQuery2: '0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256',
    DemaxDelegate: '0xc73Ad485bF29EC7dC36A60A1980BE4C946167D97', // burgerswap web 0x3637Ef96D13b6fbA4fa097e7C491206eBA5E7187
    DGAS: '0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24',
    WETH: '0x7FcCaDD3e6A3F80e194CaDf13FeDF36B9BBbe98F',
    USDT: '0x8FB6a96E1A3CB6ABFd3714d49d4040cEC9bb34fC',
    TokenQuery: '0x4821d7846FE9b1b13BF4969C20b6188F9B3B30a3',

    DemaxConfig: '0xa09f3f6aD50A6069cfBda310520353132a128031',
    DemaxFactory: '0xb43Bf0457563f54d104fc2711094DFF7AAC1Abe4',
    DemaxProjectDeploy: '0xB2632a763d7E32FC895f1852D5B039199071ED60',
    DemaxProjectQuery: '0xF63cF3523c03617Dffa993c2b9d5422e1c0042d9',
    SwapFactoryForShack: '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7',
    DemaxShackChef: '0xbDA939488fe0ea657f6ACAAe8dED9e260989F9F0',
    DemaxShackFarm: '0x21f8846b668435B0Ffa9C90bB69A070B15E84138',
    DemaxShackChefQuery: '0x43ee3A6D67D92395433739dE566D46537C934052',
    SwitchQuery: '0xdf1919b8cDd0b7216eA54dE78315c737EF9BD5Ea',
    DemaxAggregator: '0xe031f198b666C125B53f731AB3e538FE117A3c2a',
    DemaxAggregatorRouter: '0x79a0235285D5705B7E3B1741f28faAD5E95fCEe3',
    DemaxSwapReward: '0x44813c261dDd10860b4f37Da21A9f120c8584Dba',
    DemaxAggregatorV2: '0x0081FD65c94E8C71074C1fd7a0edd790b579D138',
    DemaxAggregatorRouterV2: '0x096ea4fEcf149396918Ccd2Bf3d609Fc2917681A',
    AssetERC721: "0x6dA1cbc1A60989F7F16bdDe3bA2dBEA4dc8BF103",
    AssetERC1155: "0xdef9bCC7d5482d10dE8504eb4a9c772AF72B2A03",
    NFTEnglishAuction: "0x3bC83ec401888f7Facd7773070BF7605A1F00126",
    NFTFixedswap: "0x9ce7aF4Ce011e4fBc1b81F5d4C951f9a5d9B0D84",
    BurgerCommodityMarket: "0xE07A2cEE008bBA08D2B08d402026F2998704D5a3",
    DailyPunchIn: "0x7E991060244734EdC0acCEB57d676a7C25725bd1",
    ActivityPunchIn: "0xD4ce4cf2c4264479862200a254643a4141917904",
    ChristmasPunchIn: "0xcB91F4C74193D96a3618809603E739C77f753b5D",
    Props721: '0xa728ae79bAe825385B19d5ef444be96a98aEB840',
    RewardAgent: "0x3417aB7224382D42a470Ef1Cf551239eF4e5b375",
    BurgerDiamond: "0xf31c35E4080e4bF9E06356B56B7c5b76e0e2887a",
    ActivityClaim: "0xdE474e1850A7f1A96369cDa2a7b6181b45907DC1"
  },
};

const ChainSymbol = {
  WToken: {
    1: 'WETH',
    42: 'WETH',
    56: 'WBNB',
    97: 'WBNB',
    421613: 'WETH',
    42161: 'WETH',
  },
  ZeroToken: {
    1: 'ETH',
    42: 'ETH-T',
    56: 'BNB',
    97: 'BNB-T',
    421613: 'ETH',
    42161: 'ETH',
  },
};

const Tokens = {
  56: {
    BURGER: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    WETH: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    XBurger: '0xAFE24E29Da7E9b3e8a25c9478376B6AD6AD788dD',
    CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    XBurger_USDT: '',
    XBurger_BURGER: '0x25d09281680ACF2437B4A8567A3baE5C05F4A1C9',
    MDX_USDT: '',
    HMDX_USDT: '',
    WBNB_USDT: '',
    BTCB_USDT: '',
    ETH_USDT: '',
  },
  97: {
    BURGER: '0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24',
    USDT: '0xF2ED382e6A3439Be124813842200cf6702fD6ecA',
    WETH: '0x7FcCaDD3e6A3F80e194CaDf13FeDF36B9BBbe98F',
    USDC: '0xE1106e7396dEA8c298Af67C1cdd732e0f3F32361',
    BUSD: '0xCC36337919dCE00519eb7a7013C97e79cC33D14f',
    MDX: '',
    XBurger: '0xd1f461C7Ced3Bb1810B9393dB9BD2De1819fd4e5',
    XBurger_USDT: '0xf641d2b37dbcd9aeccd416027e45b1b43f2e4c11',
    XBurger_BURGER: '0x8Cb6f3717e0915c3EF1c8884f4e7edFe26009a41',
    MDX_USDT: '',
  },
};

const ShackPools = {
  56: [
    {
      name: 'BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      pid: 2,
      tokenSymbol: 'BNB',
      rewardSymbol: 'xBURGER',
    },
    {
      name: 'BTCB',
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      pid: 3,
      tokenSymbol: 'BTCB',
      rewardSymbol: 'xBURGER',
    },
    {
      name: 'ETH',
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      pid: 4,
      tokenSymbol: 'ETH',
      rewardSymbol: 'xBURGER',
    },
    {
      name: 'BUSD',
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      pid: 6,
      tokenSymbol: 'BUSD',
      rewardSymbol: 'xBURGER',
    },
    {
      name: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      pid: 7,
      tokenSymbol: 'USDT',
      rewardSymbol: 'XBurger',
    },
    {
      name: 'MDX',
      address: '0x9C65AB58d8d978DB963e63f2bfB7121627e3a739',
      pid: 0,
      tokenSymbol: 'MDX',
      rewardSymbol: 'XBurger',
    },
    {
      name: 'HMDX',
      address: '0xAEE4164c1ee46ed0bbC34790f1a3d1Fc87796668',
      pid: 1,
      tokenSymbol: 'HMDX',
      rewardSymbol: 'xBURGER',
    },
  ],
  97: [
    {
      name: 'BURGER',
      address: '0x06bF890dfF5b422c35c9683f47d2d7663f6E1c24',
      pid: 0,
      tokenSymbol: 'BURGER',
      rewardSymbol: 'XBurger',
    },
    {
      name: 'USDT',
      address: '0xF2ED382e6A3439Be124813842200cf6702fD6ecA',
      pid: 1,
      tokenSymbol: 'USDT',
      rewardSymbol: 'XBurger',
    },
  ],
};

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

export {
  CHAIN_RPC,
  CHAIN_BROWSER,
  CHAIN_NAME,
  ContractsAddr,
  ChainSymbol,
  Tokens,
  ZERO_ADDR,
  ShackPools,
};
