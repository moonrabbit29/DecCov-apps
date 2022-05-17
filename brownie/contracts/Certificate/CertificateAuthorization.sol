// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "./Helper.sol";

// this contract provides authorization for certificate smart contract

interface IssuerData {
    function checkIssuerExist(address issuer) external returns (bool);
}

contract CertificateAuthorization is Helper{
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

    function checkSignerIsIssuer(address sender) private returns(bool) {
        return IssuerData(_Registry).checkIssuerExist(sender);
    }

    modifier grantAccess(){
        require(checkSignerIsIssuer(msg.sender) == true);
        _;
    }
}