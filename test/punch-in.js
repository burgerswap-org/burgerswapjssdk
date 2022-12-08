import chainApi from '../backend/ChainApi.js';

async function main() {
    chainApi.chainWeb3.connect();

    //================== ActivityPunchIn ==================
    // activityLength
    let length = await chainApi.activityPunchIn.activityLength()
    console.log("====length:", length)

    // activityInfo
    let index = 0
    let info = await chainApi.activityPunchIn.activityInfo(index)
    console.log("====info:", info)

    // userInfo
    let user = "0x04978cCbB8e078cbdD1BbE3E237BA2547b752369"
    let userInfo = await chainApi.activityPunchIn.userInfo(index, user)
    console.log("====userInfo:", userInfo)

    //================== ChrismasPunchIn ==================
    // userTimestamps
    let cuser = "0x07fF0ed51ABAf0ebeF2dDdabB463A0E17235de46"
    let userTimestamps = await chainApi.christmasPunchIn.userTimestamps(cuser)
    console.log("====userTimestamps:", userTimestamps)

    // isUserClaimed
    let isClaimed = await chainApi.christmasPunchIn.isUserClaimed(cuser)
    console.log("====isClaimed:", isClaimed)
}

main()