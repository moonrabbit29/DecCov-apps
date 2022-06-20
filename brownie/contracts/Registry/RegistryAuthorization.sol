// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// this contract provides authorization for registry smart contract


contract RegistryAuthorization {

    address payable public owner;
    
    mapping (address=>bytes32) issuerMapping;

    constructor() payable {
        owner = payable(msg.sender);
    }

    //grant authorization only for authorize user to perform issuer registration. 
    modifier grantAccess{
        require(msg.sender == owner);
        _;
    }


    // function registerAuthorizeUser(address _address) public grantAccess returns(bool success) {
    //     if(!(authorize_user[_address]==true)){
    //         authorize_user[_address] = true;
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    function checkIsRegulator(address _address)  public view returns (bool){
         return _address == owner;
    }
}