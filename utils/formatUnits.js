// This function intends to replace the ethers.js formatUnits function
function formatUnits(value, decimals) {
    if (decimals === 0) {
        return value;
    }
    const ten = BigInt(10);
    const valueBigInt = BigInt(value);
    const decimalsBigInt = BigInt(decimals);
    const tenPowered = ten ** decimalsBigInt;
    const result = valueBigInt / tenPowered;
    return result;
}
export { formatUnits };
