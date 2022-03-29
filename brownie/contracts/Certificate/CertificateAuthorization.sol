// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// this contract provides authorization for certificate smart contract

interface IssuerData {
    function verifyIssuer(address issuer) external returns (bool);
}

contract CertificateAuthorization {
    address private _Registry;
    mapping(address => mapping(uint256 => bool)) internal seenNonces;

    //owner mean the one who deployed this contract
    address payable private owner;

    //constructor will be inherit by child class
    constructor(address registry_sc) {
        owner = payable(msg.sender);
        _Registry = registry_sc;
    }

    //debugging code
    event DebugRegistryAddress(
        address Registry_sc
    );

    //debugging code
    function getRegistryAddress()public view returns(address){
        return _Registry;
    }

    function verifyIssuer(address sender) private returns(bool) {
        return IssuerData(_Registry).verifyIssuer(sender);
    }

    modifier grantAccess(){
        require(verifyIssuer(msg.sender) == true);
        _;
    }
}