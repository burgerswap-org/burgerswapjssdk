import BigNumber from "bignumber.js";
import ERC20Token from './module/ERC20Token.js';
import ERC721Token from './module/ERC721Token.js';
import ERC1155Token from './module/ERC1155Token.js';
import DemaxAggregatorV2 from './module/demax/DemaxAggregatorV2.js';
import DemaxAggregatorRouterV2 from './module/demax/DemaxAggregatorRouterV2.js';
import DemaxSwapReward from './module/demax/DemaxSwapReward.js';
import DemaxDelegate from './module/demax/DemaxDelegate.js';
import DemaxQuery2 from './module/demax/DemaxQuery2.js';
import DemaxShackChef from './module/demax/DemaxShackChef.js';
import DemaxShackChefQuery from './module/demax/DemaxShackChefQuery.js';
import DemaxLp from "./module/demax/DemaxLP.js";
import DemaxFactory from './module/demax/DemaxFactory.js';
import SwitchQuery from "./module/demax/SwitchQuery.js";
import BurgerCommodityMarket from './module/demax/BurgerCommodityMarket.js';
import NFTEnglishAuction from './module/nft/NFTEnglishAuction.js';
import NFTFixedswap from './module/nft/NFTFixedswap.js';
import DailyPunchIn from "./module/punch-in/DailyPunchIn.js";
import ActivityPunchIn from "./module/punch-in/ActivityPunchIn.js";
import ChristmasPunchIn from "./module/punch-in/ChristmasPunchIn.js";
import Props721 from "./module/Props721.js";
import RewardAgent from "./module/raffle/RewardAgent.js"
import BurgerDiamond from "./module/raffle/BurgerDiamond.js"

export default class ChainMain {
  constructor(chainWeb3) {
    this.BigNumber = BigNumber;
    this.chainWeb3 = chainWeb3;
    this.web3Util = chainWeb3.web3Util;
    this.ERC20Token = ERC20Token;
    this.ERC721Token = ERC721Token;
    this.ERC1155Token = ERC1155Token;
    this.DemaxLp = DemaxLp;
    this.demaxAggregator = new DemaxAggregatorV2(chainWeb3);
    this.demaxAggregatorRouter = new DemaxAggregatorRouterV2(chainWeb3);
    this.demaxSwapReward = new DemaxSwapReward(chainWeb3);
    this.demaxDelegate = new DemaxDelegate(chainWeb3);
    this.demaxQuery2 = new DemaxQuery2(chainWeb3);
    this.demaxShackChef = new DemaxShackChef(chainWeb3);
    this.demaxShackChefQuery = new DemaxShackChefQuery(chainWeb3);
    this.demaxFactory = new DemaxFactory(chainWeb3);
    this.switchQuery = new SwitchQuery(chainWeb3);
    this.burgerCommodityMarket = new BurgerCommodityMarket(chainWeb3);
    this.nftEnglishAuction = new NFTEnglishAuction(chainWeb3);
    this.nftFixedswap = new NFTFixedswap(chainWeb3);
    this.dailyPunchIn = new DailyPunchIn(chainWeb3);
    this.activityPunchIn = new ActivityPunchIn(chainWeb3);
    this.christmasPunchIn = new ChristmasPunchIn(chainWeb3);
    this.props721 = new Props721(chainWeb3);
    this.rewardAgent = new RewardAgent(chainWeb3);
    this.burgerDiamond = new BurgerDiamond(chainWeb3);
  }
}
