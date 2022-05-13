// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./RegistryAuthorization.sol";

// this contract provides issuer data for registry smart contract

contract Issuer is RegistryAuthorization {
    event IsSuccess(
        bool value,
        bytes32 hashData,
        address issuer,
        string message
    );

    function registerIssuer(address issuer, bytes32 _hashData)
        public
        grantAccess
        returns (bool success)
    {
        if (checkIssuerExist(issuer)) {
            emit IsSuccess(
                false,
                _hashData,
                issuer,
                "allready registered"
            );
            return false;
        }
        issuerMapping[issuer] = _hashData;
        emit IsSuccess(true, _hashData, issuer, "stored");
        return true;
    }

    function checkIssuerExist(address _address) public view returns (bool) {
        return issuerMapping[_address] > 0;
    }
}
