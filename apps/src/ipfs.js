import { create } from 'ipfs-http-client'
var buffer = require('buffer/').Buffer
const bs58 = require('bs58')

const ipfs = create({url:'http://127.0.0.1:5001',protocol:'http'})
//const ipfs = create('https://ipfs.infura.io:5001/api/v0')
//const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
const turnIntoBuffer = (e) => buffer.from(e)

// Convert a hex string to a byte array
// reference : https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes32
// reference : https://stackoverflow.com/questions/14603205/how-to-convert-hex-string-into-a-bytes-array-and-a-bytes-array-in-the-hex-strin
const hexToBytes = hex => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16))
    return bytes
}

//stored content ALWAYS in json
const addFile = async (buffer)=>{
   return ipfs.add(buffer).then(
        result => {
            const address = result.path 
            const decoded_address = bs58.decode(address)
            const hex_str =  Buffer.from(decoded_address).toString('hex')
            return "0x" + hex_str.slice(4)
        }
    )
}

const retrieve_file = async (hex) => {
    //https://blog.logrocket.com/using-node-js-http-proxy-ipfs-content/
    const full_hex = "1220" + hex.slice(2)
    const bytes = hexToBytes(full_hex)
    const file_address = bs58.encode(bytes).toString()
    const data = ipfs.cat(file_address)
    let contents = ""
    for await (const i of data ){
        contents += new TextDecoder().decode(i)
    }
    contents = contents.replace(/\0/g, "")
    return JSON.parse(contents)
}

export default addFile;
export {retrieve_file}
export {turnIntoBuffer}
