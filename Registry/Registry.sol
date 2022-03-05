// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Registry {
    
    address payable public owner;
    address[] private authorize_user;

    mapping (address=>bytes32) publicKeyMapping;
    mapping (address=>bytes32) issuerMapping; //TODO change to ipfs address
    
    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }

    function register_issuer (address issuer, bytes32 publicKey,bytes32 _hashData) onlyOwner public returns(bool success)  {
        publicKeyMapping[issuer]=publicKey;
        issuerMapping[issuer] = _hashData;
        return true;
    }

    function verifyIssuer (address _address) public view returns(bool){

        return(issuerMapping[_address] > 0);
    }

    //todo return address of ipfs metadata
    // function getIsuserData(address _address) public view returns (bytes32){
    //     return ;
    // }

    function revoke_registration (bytes32 _oldHashData,bytes32 _hashData)  public {
        require (issuerMapping[msg.sender]==_oldHashData,"You are not the owner");
        issuerMapping[msg.sender] = _hashData;
    }
}