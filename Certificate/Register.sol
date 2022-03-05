// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Authorization.sol";
import "./Data.sol";

contract Register is Authorization, Data {
    
    function isCertificateExist(
        bytes32 hash_data,
        COV_CERTIFICATE[] memory arrayCOVTranscript
    ) private pure returns (bool) {
        for (uint256 i = 0; i < arrayCOVTranscript.length; i++) {
            if (arrayCOVTranscript[i].CovHash == hash_data) {
                return true;
            }
        }
        return false;
    }

    event IsSuccess(bool value);

    function registerCertificate(bytes32 certificateHash, bytes32 holderID)
        public
        grantAccess
        returns (bool success)
    {
        if (
            isCertificateExist(certificateHash, holderToCertificate[holderID])
        ) {
            emit IsSuccess(false);
            return false;
        } else {
            holderToCertificate[holderID].push(
                COV_CERTIFICATE(certificateHash, block.timestamp)
            );
            emit IsSuccess(true);
            return true;
        }
    }
}