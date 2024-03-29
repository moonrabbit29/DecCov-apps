// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./CertificateAuthorization.sol";

contract CertificateHandler is CertificateAuthorization {
    constructor(address registrySC) CertificateAuthorization(registrySC) {}

    function registerCertificate(
        bytes32 certificate_hash,
        bytes32 holder_id,
        bytes32 data_address
    ) public grantAccess returns (bool success) {
        uint256 index = isCertificateExist(
            certificate_hash,
            holder_to_certificates[holder_id]
        );
        if (index - 1 > 0) {
            emit IsSuccess(false, "already");
            emit certificateExist(
                true,
                holder_to_certificates[holder_id][index - 1]
            );
            return false;
        } else {
            uint256 timestamp = block.timestamp;
            holder_to_certificates[holder_id].push(
                COV_CERTIFICATE(
                    certificate_hash,
                    data_address,
                    msg.sender,
                    timestamp
                )
            );
            emit IsSuccess(true, "stored");
            emit timestampEvent(timestamp);
            return true;
        }
    }

    function verifyCertificate(bytes32 certificate_hash, bytes32 holder_id)
        public
        view
        returns (bool, COV_CERTIFICATE memory)
    {
        uint256 index = isCertificateExist(
            certificate_hash,
            holder_to_certificates[holder_id]
        );
        if (index - 1 > 0) {
            return (true, holder_to_certificates[holder_id][index - 1]);
        }
        return (false, holder_to_certificates[holder_id][index - 1]);
    }

    function getCertificatesByUser(bytes32 holder_id)
        public
        view
        returns (COV_CERTIFICATE[] memory certificate_data)
    {
        return holder_to_certificates[holder_id];
    }
}
