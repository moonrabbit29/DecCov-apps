// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Data {
    
    struct COV_CERTIFICATE {
        bytes32 CovHash;
        uint256 Timestamp;
    }

    mapping(bytes32 => COV_CERTIFICATE[]) internal holderToCertificate;

}