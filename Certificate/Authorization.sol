// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// this contract provides authorization for certificate smart contract

interface IssuerData {
    function verifyIssuer(address issuer) external view returns (bool);
}

contract Authorization {
    address private _Registry = 0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99; //this address is hardcoded 

    //owner mean the one who deployed this contract
    address payable private owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function verifyIssuer(address sender) private view returns(bool) {
        return IssuerData(_Registry).verifyIssuer(sender);
    }

    modifier grantAccess(){
        require(verifyIssuer(msg.sender) == true);
        _;
    }
}