// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "./Handler.sol";

contract Certificate is CertificateHandler {
   constructor(address registrySC) CertificateHandler(registrySC) {}
}