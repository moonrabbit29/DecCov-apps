// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Data {

    struct COV_CERTIFICATE {
        bytes32 cov_certificate_identifier;
        bytes32 certificate_data;
        uint256 timestamp;
    }
    mapping(bytes32 => COV_CERTIFICATE[]) internal holder_to_certificates;

}