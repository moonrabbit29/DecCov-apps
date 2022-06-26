import Registry from "./contracts/Registry.json";


var bops = require('bops')

// var web3
// var deployedNetwork
// var contract

// (async ()=>{
//     web3 = await getWeb3()
//     deployedNetwork = Registry.deployment.address;
//     contract = new web3.eth.Contract(Registry.abi, deployedNetwork);
// }) ()
const genRand = () => {
    return Math.random().toString(36).substring(2,10);
  }

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
const signMessage = async (address,web3)=>{
    const message = genRand()
    try {
        const from = address;
        console.log('from : ' + from);
        let prefix = "\x19Ethereum Signed Message:\n" + message.length
        let msgHash1 = web3.utils.sha3(prefix+message)
        console.log('msg : ' + msgHash1);
        //await sleep(10000)
        const sign = await web3.eth.sign(msgHash1, address)
        console.log('sign : ' + sign);
        return [sign,message];
    } catch (err) {
        console.error(err);
        return "error"
    }
}

const check_address_regulator = async(address,web3)=>{
    //const deployedNetwork =  Registry.deployment.address;
    const deployedNetwork = "0x4258BA34260905EFBCb468528623789FE885aD59"
    const contract = new web3.eth.Contract(Registry.abi, deployedNetwork);
    const isExist = await contract.methods.checkIsRegulator(address).call()
    console.log(isExist)
    return isExist
}

const check_address = async (address,web3)=>{
    //const deployedNetwork = Registry.deployment.address;
    const deployedNetwork = "0x4258BA34260905EFBCb468528623789FE885aD59"
    const contract = new web3.eth.Contract(Registry.abi, deployedNetwork);
    const isExist = await contract.methods.checkIssuerExist(address).call()
    console.log(isExist)
    return isExist
}

const verifyMessage = async (message,accounts,signature,web3) => {
    try {
        const from = accounts;
        let prefix = "\x19Ethereum Signed Message:\n" + message.length
        let msg = web3.utils.sha3(prefix+message)
        console.log(`HERE -> ${msg}`)
        console.log(web3.eth.accounts.recover)
        const recoveredAddr = web3.eth.accounts.recover(message, signature);
        console.log('recoveredAddr : ' + recoveredAddr);
        if (recoveredAddr.toLowerCase() === from.toLowerCase()) {
            console.log(`Successfully ecRecovered signer as ${recoveredAddr}`);
            return `Verified`;
        } else {
            console.log(
                `Failed to verify signer when comparing ${recoveredAddr} to ${from}`,
            );
            return `Not Verified`;
        }
    } catch (err) {
        console.error(err);
    }
}

export { verifyMessage };
export { check_address };
export { signMessage };
export {check_address_regulator}