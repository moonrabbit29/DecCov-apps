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
        uint256 index = isCertificateExist(certificate_hash, holder_to_certificates[holder_id]);
        if (index > 0) {
            emit IsSuccess(false,"already");
            emit certificateExist(
                true,
                holder_to_certificates[holder_id][index-1]
            );
            return false;
        } else {
            if (!compareHash(certificate_hash, payload, holder_id)){
                emit IsSuccess(false,"failhash");
                return false;
            }
            uint256 timestamp = block.timestamp;
            holder_to_certificates[holder_id].push(
            COV_CERTIFICATE(certificate_hash,data_address,timestamp,msg.sender));
            emit IsSuccess(true,"stored");
            emit timestampEvent(timestamp);
            return true;
        }
    }

    function verifyCertificate(bytes32 certificate_hash,bytes32 holder_id) public view returns(bool,COV_CERTIFICATE memory){
        uint256 index = isCertificateExist(certificate_hash, holder_to_certificates[holder_id]);
        if(index>0){
            return (true,holder_to_certificates[holder_id][index-1]);
        }
        return (false,holder_to_certificates[holder_id][index-1]);
    }

    function getCertificatesByUser(bytes32 holder_id) 
        public
        view
        returns(COV_CERTIFICATE[] memory certificate_data)
    {
        return holder_to_certificates[holder_id];
    }


}