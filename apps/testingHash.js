
const web3 = require( "web3");

const certificate_hash = web3.utils.soliditySha3(
    { t: "string", v: "Dendi" },
    { t: "string", v: "Arya" }
);

console.log(certificate_hash)