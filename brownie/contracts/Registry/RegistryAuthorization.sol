// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// this contract provides authorization for registry smart contract


contract RegistryAuthorization {

    address payable public owner;
    mapping(address => bool ) internal authorize_user;
    
    mapping (address=>bytes32) issuerMapping; //TODO change to ipfs address

    constructor() payable {
        owner = payable(msg.sender);
    }

    //grant authorization only for authorize user to perform issuer registration. 
    modifier grantAccess{
        require(msg.sender == owner || authorize_user[msg.sender]);
        _;
    }

    //grant authorization for issuer.
    modifier grantAccessIssuer {
        require(issuerMapping[msg.sender] > 0);
        _;
    }

    function registerAuthorizeUser(address _address) public grantAccess returns(bool success) {
        if(!(authorize_user[_address]==true)){
            authorize_user[_address] = true;
            return true;
        }else{
            return false;
        }
    }
}