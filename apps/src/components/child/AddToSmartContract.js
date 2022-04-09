import React  from "react"
import { Form } from 'react-bootstrap';

class AddToSmartContract extends React.Component {
//ganache-cli --chain.vmErrorsOnRPCResponse true --hardfork istanbul --miner.blockGasLimit 12000000 --wallet.mnemonic brownie --server.port 8545 
//--account="0xf5c9a0c1c21216b57a93f0157c309093885b261c7623c138bffbf6298114798c,9629874799100000000000000000
constructor(props) {
    super(props);
    this.props = props;
    console.log(this.props)
    }
    storeCertificateData = async(e) => {
        var certificate_hash = "0xd838244465d7b705adf17e52bd7ea23a1d7f45cf78c6f31e97df9caedf5120e6"
        var holder_id = "0x5a792dc02071d61f624e9f7a1501553c844a43b20298a98b77644bbdd0708b6e"
        var str_data = {"name" : "Dennjiroo","vaccine_type":"Sinovac","date":"22-02-2022"}
        var ipfs_address = "0xabfb3b9720db61e98f482c272d29c35ca96ce19cbae73fc81eb51fda31d21121"
        console.log(JSON.stringify(str_data))
        console.log(`Certificate hash ${certificate_hash}`)
        console.log(this.props.values.activeAccount)
        console.log(this.props.values.contract)
        this.props.values.contract.methods.registerCertificate(
            certificate_hash, 
            holder_id,
            JSON.stringify(str_data),
            ipfs_address
          ).send({from: this.props.values.activeAccount}, (error, transactionHash) => {
            if(error) {
              console.error(error);
            } else {
              this.setState({transactionHash});
            }
          });
    }
    render(){
       return(
        <div className="">
            <h2>Account: {this.props.values.activeAccount}</h2> <br />
            <button onClick={this.storeCertificateData}>
                Submit
            </button>
        </div>
       )
    }
}

export default AddToSmartContract