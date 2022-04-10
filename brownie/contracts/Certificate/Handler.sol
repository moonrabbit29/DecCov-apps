// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./CertificateAuthorization.sol";
import "./Helper.sol";

contract CertificateHandler is CertificateAuthorization, Helper {

    constructor(address registrySC) CertificateAuthorization(registrySC){}
    
    function registerCertificate(
        bytes32 certificate_hash, 
        bytes32 holder_id,
        string memory payload,
        bytes32 data_address
    )
        public
        grantAccess
        returns (bool success)
    {
        if (
            isCertificateExist(certificate_hash, holder_to_certificates[holder_id]) > 0
        ) {
            emit IsSuccess(false,"already");
            return false;
        } else {
            if (!compareHash(certificate_hash, payload, holder_id)){
                emit IsSuccess(false,"failhash");
                return false;
            }
            holder_to_certificates[holder_id].push(
            COV_CERTIFICATE(certificate_hash,data_address,block.timestamp,msg.sender));
            emit IsSuccess(true,"stored");
            return true;
        }
    }

    function verifyCertificate(bytes32 certificate_hash,bytes32 holder_id) public returns(bool){
        uint256 index = isCertificateExist(certificate_hash, holder_to_certificates[holder_id]);
        if(index>0){
            emit certificateExist(
                true,
                holder_to_certificates[holder_id][index-1]
            );
            return true;
        }
        emit IsSuccess(true,"verified");
        return false;
    }


}