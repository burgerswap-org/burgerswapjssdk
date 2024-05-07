import SpaceId from "../src/module/web3-name/SpaceId.js";

async function main() {
    const spaceId = new SpaceId();

    // ResolveName
    let account = '0xee06b1d6c7cacd7b509d72cdd77c64e6a8bf0071'
    let name = await spaceId.resolveName(account, ['burger']);
    console.log(name)

    account = '0xee06b1d6c7cacd7b509d72cdd77c64e6a8bf0071'
    name = await spaceId.resolveName(account, ['bnb']);
    console.log(name)
}

main();