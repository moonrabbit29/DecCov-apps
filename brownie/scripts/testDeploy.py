from brownie import TestingCert, network, config
from scripts.helper_script import get_account

def main() : 
    account = get_account()
    # print(account)
    # sc_address = TestingCert.deploy(
    #     {"from": account}, publish_source=config["networks"][network.show_active()].get("verify"))
    # return sc_address
    testingCert = TestingCert[-1]
    result = testingCert.testing("Dendi","Arya",{"from":account})
    print(result)
