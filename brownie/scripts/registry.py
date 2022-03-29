from brownie import Registry, network, config
from scripts.helper_script import get_account_issuer,get_account



def register_issuer(address:str,hash_data:hex) -> bool : 
   authorize_account = get_account()
   registry = Registry[-1]
   status = registry.registerIssuer(address,hash_data,{"from":authorize_account})
   return status

def main() : 
   issuer_account = get_account_issuer()
   #input random hash data
   tx = register_issuer(issuer_account,"0xabfb3b9720db61e98f482c272d29c35ca96ce19cbae73fc81eb51fda31d21161")
   print(tx.info())