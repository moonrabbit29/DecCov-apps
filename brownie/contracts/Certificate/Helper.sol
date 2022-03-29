// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Data.sol";

contract Helper is Data{
   
   event IsSuccess(bool value);
   event isFailed(bool value);
   event certificateExist(
      bool is_exist,
      COV_CERTIFICATE certificate_data
   );
    //function will return index + 1 if data is present in certificates storage.
   function isCertificateExist(
        bytes32 hash_data,
        COV_CERTIFICATE[] memory arrayCOVTranscript
    ) internal pure returns(uint256){
        for (uint256 i = 0; i < arrayCOVTranscript.length; i++) {
            if (arrayCOVTranscript[i].cov_hash == hash_data) {
                return i+1;
            }
        }
        // returning 0 mean not found.
        return 0;
    }

    function compareHash(bytes32 certificateHash, string memory payload, bytes32 holderID) internal view returns(bool){
        bytes32 generated_hash = keccak256(abi.encodePacked(holderID, payload , msg.sender));
        return generated_hash == certificateHash;
    }

    //unused function 
    // function verifySignature(bytes32 holderID,bytes32 certificateHash,bytes memory signature,uint256 nonce) 
    // internal 
    // returns(bool){
    //     // This recreates the message hash that was signed on the client.
    //     bytes32 hash = keccak256(abi.encodePacked(holderID, certificateHash, msg.sender, nonce));
    //     bytes32 messageHash = hash.toEthSignedMessageHash();

    //     // Verify that the message's signer is the owner of the order
    //     address signer = messageHash.recover(signature);
    //     emit CompareHash(signer,msg.sender,hash);
    //     //require(signer == msg.sender);

    //     require(!seenNonces[signer][nonce]);
    //     seenNonces[signer][nonce] = true;  

    //     return true;
    // }
}