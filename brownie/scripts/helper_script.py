from brownie import network, config, accounts
#import Web3

def get_account()->str:
    if network.show_active() == "development" or network.show_active()=="local-test":
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key_deployer"])

def get_account_issuer(a=0)->str : 
   if network.show_active() == "development" or network.show_active()=="local-test":
        return accounts[1+a]
   else:
        return accounts.add(config["wallets"]["from_key_issuer"])

def get_account_issuer_nonce()->int :
   if network.show_active() == "development":
        return accounts[1].nonce
   elif network.show_active() == "ganache-local" : 
       from brownie.network import accounts
       account = accounts.add(config["wallets"]["development_issuer"])
       return account.nonce
   else:
        return 1
