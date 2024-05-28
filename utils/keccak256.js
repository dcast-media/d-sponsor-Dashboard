import sha3 from 'js-sha3';
function keccak256(data) {
    return '0x' + sha3.keccak_256(data);
}

export default keccak256;
