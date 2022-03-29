from brownie import Certificate,accounts
from web3 import Web3
from scripts.helper_script import get_account_issuer
from eth_account.messages import encode_defunct

def generate_hash(holder_id : str,certificate_data:dict, issuer) :
   hodler_id_hash = Web3.solidityKeccak(["string"],[holder_id]).hex()
   print(f"Holder id L {hodler_id_hash}")
   print(f"issuer : {issuer.address}")
   certificate_hash = Web3.solidityKeccak(["bytes32","string","address"],[hodler_id_hash,str(certificate_data),issuer.address]).hex()
   print(f"certificate hash -> {str(certificate_hash)}")
   return certificate_hash,hodler_id_hash
   
#parameter is just an example of certificate data
def register_certificate (
   certificate_data:dict = {"name" : "Dennjiroo","vaccine_type":"Sinovac","date":"22-02-2022"},
   holder_id_example:str = "612312312312313123",
   ipfs_address = "0xabfb3b9720db61e98f482c272d29c35ca96ce19cbae73fc81eb51fda31d21121"
   ) -> bool : 
   account = get_account_issuer()
   certificate_hash,holder_id_hash = generate_hash(holder_id_example,certificate_data,account)
   certificate = Certificate[-1]
   result = certificate.registerCertificate(certificate_hash,holder_id_hash,str(certificate_data),ipfs_address,{"from":account})

   return result

def verify_certificate(
   certificate_data:dict = 
   {"name" : "Dennjiroo","certificate_data":
      {"type":"vaccine",
         "vaccine_type":{
            "name" : "Sinovac","dose":1},
      "date":"22-02-2022"}},
   holder_id_example = "612312312312313123"
   ) :
   account = get_account_issuer()
   certificate_hash,holder_id_hash = generate_hash(holder_id_example,certificate_data,account)
   certificate = Certificate[-1]
   result = certificate.verifyCertificate(certificate_hash,holder_id_hash,{"from":account})
   return result


def main() -> bool :
   tx = register_certificate()
   tx2 = verify_certificate()
   print(f"{tx.info()} \n {tx2.info()}")

