// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


import "./RegistryAuthorization.sol";

// this contract provides issuer data for registry smart contract

contract Issuer is RegistryAuthorization {

    event IsSuccess(
        bool value,
        bytes32 hashData,
        address issuer
        );
    
    function registerIssuer (address issuer, bytes32 _hashData) grantAccess public returns(bool success)  {
        issuerMapping[issuer] = _hashData;
        emit IsSuccess(true,_hashData,issuer);
        return true;
    }

    function verifyIssuer (address _address) public view returns(bool){
        return issuerMapping[_address]>0;
    }

}

