import SpaceId from "../src/module/web3-name/SpaceId.js";

async function main() {
    const spaceId = new SpaceId();

    // ResolveName
    let account = '0xde6867baef8d7079e787daf3422710c56945cc30'
    let name = await spaceId.resolveName(account, ['burger']);
    console.log(name)

    account = '0x1b5ea3b86c2d0526ef17b658ec1571e8e710f6ee'
    name = await spaceId.resolveName(account, ['bnb']);
    console.log(name)
}

main();