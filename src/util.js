import BigNumber from 'bignumber.js';

export function convertBigNumberToNormal(bigNumber, decimals = 18) {
    let result = new BigNumber(bigNumber).dividedBy(
        new BigNumber(Math.pow(10, decimals)),
    );
    return result.toFixed();
}

export function convertNormalToBigNumber(number, decimals = 18, fix = 0) {
    return new BigNumber(number)
        .multipliedBy(new BigNumber(Math.pow(10, decimals)))
        .minus(fix)
        .toFixed(0);
}

export function calculatePercentage(numerator, denominator) {
    return new BigNumber(numerator).dividedBy(new BigNumber(denominator)).toFixed();
}

export function calculateMultiplied(number1, number2) {
    return new BigNumber(number1).multipliedBy(new BigNumber(number2)).toFixed(0);
}

export function minusBigNumber(number1, number2) {
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(0);
}

export function getDeadLine(delay) {
    return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}