// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Data.sol";

contract Helper is Data{
   
   event IsSuccess(bool value,string result);
   event isFailed(bool value);
   event certificateExist(
      bool is_exist,
      COV_CERTIFICATE certificate_data
   );
   event getCertificate(
       bool is_exist,
       COV_CERTIFICATE[] certificate_data
   );
   event timestampEvent(
       uint256 timestamp
   );
    //function will return index + 1 if data is present in certificates storage.
   function isCertificateExist(
        bytes32 hash_data,
        COV_CERTIFICATE[] memory arrayCOVTranscript
    ) internal pure returns(uint256){
        for (uint256 i = 0; i < arrayCOVTranscript.length; i++) {
            if (arrayCOVTranscript[i].cov_certificate_identifier == hash_data) {
                return i+1;
            }
        }
        // returning 0 mean not found.
        return 0;
    }

    function compareHash(bytes32 certificateHash, string memory payload, bytes32 holderID) internal pure returns(bool){
        bytes32 generated_hash = keccak256(abi.encodePacked(holderID, payload));
        return generated_hash == certificateHash;
    }
}