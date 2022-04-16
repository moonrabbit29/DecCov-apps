from scripts.deploy import main as deploy
from scripts.certificate import main as register_certificate
from scripts.registry import main as register_issuer

def main() :
   deploy()
   register_issuer()
   # register_certificate()