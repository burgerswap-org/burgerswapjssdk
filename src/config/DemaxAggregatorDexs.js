const DemaxAggregatorDexs = {
    56: [
        {
            name: "PancakeSwapV2",
            id: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
        },
        {
            name: "MDEX",
            id: "0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8"
        },
        {
            name: "BiSwap",
            id: "0x858E3312ed3A876947EA49d572A7C42DE08af7EE"
        },
        {
            name: "ApeSwap",
            id: "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6"
        },
        {
            name: "BakerySwap",
            id: "0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7"
        },
        {
            name: "BabySwap",
            id: "0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da"
        },
        {
            name: "BurgerSwap",
            id: "0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256"
        },
        {
            name: "WooFiSwap",
            id: "0xea4edfEfF60B375556459e106AB57B696c202A29"
        },
        {
            name: "JulSwap",
            id: "0x553990F2CBA90272390f62C5BDb1681fFc899675"
        }
    ],
    97: [
        {
            name: "PancakeSwapV2",
            id: "0x09cD2234a6AaA9159B279655a218d268D9D9006F"
        },
        { 
            name: "MDEX",
            id: "0x64E047A35B4b9a27D3016982Ba70b6315A32e61C"
        },
        {
            name: "BiSwap",
            id: "0x3dBA57618f44f80981d5AAddD4Aa0ad29351e833"
        },
        {
            name: "ApeSwap",
            id: "0x4eB2614c2C2890c5Bd31dBb64d3C1e9eeCB9Ef36"
        },
        {
            name: "BakerySwap",
            id: "0x9bC5E5E943861915694C898145CEF38eC86A808B"
        },
        {
            name: "BabySwap",
            id: "0x6CCC14fe7c239C50A272Bb8dd1037652b3399B60"
        },
        {
            name: "BurgerSwap",
            id: "0x7EA51c334fF1b0Af2b8706D1f0F54BF16d9bB992"
        },
        {
            name: "WooFiSwap",
            id: "0xc1F485De4F94BB3B09873adA497B4DCc67fa2Ed9"
        }
    ]
}

const Flags = {
    56: {
        "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73": {
            name: "PancakeSwapV2",
            disableFlag: 1,
            disableOtherFlag: 510
        },
        "0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8": {
            name: "MDEX",
            disableFlag: 2,
            disableOtherFlag: 509
        },
        "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6": {
            name: "ApeSwap",
            disableFlag: 4,
            disableOtherFlag: 507
        },
        "0x858E3312ed3A876947EA49d572A7C42DE08af7EE": {
            name: "BiSwap",
            disableFlag: 8,
            disableOtherFlag: 503
        },
        "0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7": {
            name: "BakerySwap",
            disableFlag: 16,
            disableOtherFlag: 495
        },
        "0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da": {
            name: "BabySwap",
            disableFlag: 32,
            disableOtherFlag: 479
        },
        "0x8a1E9d3aEbBBd5bA2A64d3355A48dD5E9b511256": {
            name: "BurgerSwap",
            disableFlag: 64,
            disableOtherFlag: 447
        },
        "0xea4edfEfF60B375556459e106AB57B696c202A29": {
            name: "WooFiSwap",
            disableFlag: 128,
            disableOtherFlag: 383
        },
        "0x553990F2CBA90272390f62C5BDb1681fFc899675": {
            name: "JulSwap",
            disableFlag: 256,
            disableOtherFlag: 255
        },
    },
    97: {
        "0x09cD2234a6AaA9159B279655a218d268D9D9006F": {
            name: "PancakeSwapV2",
            disableFlag: 1,
            disableOtherFlag: 254
        },
        "0x64E047A35B4b9a27D3016982Ba70b6315A32e61C": {
            name: "MDEX",
            disableFlag: 2,
            disableOtherFlag: 253
        },
        "0x4eB2614c2C2890c5Bd31dBb64d3C1e9eeCB9Ef36": {
            name: "ApeSwap",
            disableFlag: 4,
            disableOtherFlag: 251
        },
        "0x3dBA57618f44f80981d5AAddD4Aa0ad29351e833": {
            name: "BiSwap",
            disableFlag: 8,
            disableOtherFlag: 247
        },
        "0x9bC5E5E943861915694C898145CEF38eC86A808B": {
            name: "BakerySwap",
            disableFlag: 16,
            disableOtherFlag: 239
        },
        "0x6CCC14fe7c239C50A272Bb8dd1037652b3399B60": {
            name: "BabySwap",
            disableFlag: 32,
            disableOtherFlag: 223
        },
        "0x7EA51c334fF1b0Af2b8706D1f0F54BF16d9bB992": {
            name: "BurgerSwap",
            disableFlag: 64,
            disableOtherFlag: 191
        },
        "0xc1F485De4F94BB3B09873adA497B4DCc67fa2Ed9": {
            name: "WooFiSwap",
            disableFlag: 128,
            disableOtherFlag: 127
        }
    }
}

export { DemaxAggregatorDexs, Flags }