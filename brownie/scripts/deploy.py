from pydoc import importfile
from brownie import Registry, network, config, Certificate
from scripts.helper_script import get_account
from brownie.network.gas.strategies import LinearScalingStrategy


def deploy_registry_sc() -> str :
   account = get_account()
   print(account)
   sc_address = Registry.deploy(
        {"from": account}, publish_source=config["networks"][network.show_active()].get("verify"))
   return sc_address

def deploy_certificate_sc(regstry_sc_address:str) -> str : 
   account = get_account()
   sc_address = Certificate.deploy(regstry_sc_address,{"from": account}, publish_source=config["networks"][network.show_active()].get("verify"))
   return sc_address

def main() :
   registry_sc_address = deploy_registry_sc()
   certificate_sc_address = deploy_certificate_sc(registry_sc_address)