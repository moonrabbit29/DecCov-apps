// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


contract TestingCert { 
    bytes32 private hash_data = 0x0ad8cde967ca66490ee580f1b0e0abae68581d7c17ac4497ff0f79580442bd37;
    event isTrue(
        bool isValid
    );
    function testing(string memory testaroo,string memory testaroo2) public returns(bool){
        bytes32 generated_hash = keccak256(abi.encodePacked(testaroo, testaroo2));
        emit isTrue(hash_data == generated_hash);
        return hash_data == generated_hash;
    }
}