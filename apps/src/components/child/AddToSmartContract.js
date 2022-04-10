import React from "react";
import { Table } from "react-bootstrap";
import Web3 from "web3";
import { Modal,Button } from "react-bootstrap";
class AddToSmartContract extends React.Component {
  // ganache-cli --chain.vmErrorsOnRPCResponse true --hardfork istanbul --miner.blockGasLimit 12000000 --wallet.mnemonic brownie --server.port 8545 --account="0xf5c9a0c1c21216b57a93f0157c309093885b261c7623c138bffbf6298114798c,9629874799100000000000000000" --account="0x60f7afbcb7c2784c04be36ccfd49fc3e04da6acca0157411b87d9eaab1762596,96298
  // 74799100000000000000000"
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    holder_id: "",
    transactionHash: "",
    certificate_hash: "",
    show:false
  };
  handleClose = () => {
    this.setState({show:true})
  }
  storeCertificateData = async (e) => {
    var holder_id = Web3.utils.soliditySha3(this.props.values.NIK);
    this.setState({ holder_id: holder_id });
    var str_data = {
      name: this.props.values.Name,
      type: {
        name: this.props.values.cert_name,
        date: 1,
        dose: this.props.values.dose,
      },
    };
    //var certificate_hash = "0xd838244465d7b705adf17e52bd7ea23a1d7f45cf78c6f31e97df9caedf5120e6"
    //["bytes32","string","address"]
    console.log(JSON.stringify(str_data));
    var certificate_hash = Web3.utils.soliditySha3(
      { t: "bytes32", v: holder_id },
      { t: "string", v: JSON.stringify(str_data) },
      { t: "address", v: this.props.values.activeAccount }
    );
    this.setState({ certificate_hash: certificate_hash });
    console.log(`Certificate hash -> ${certificate_hash}`);
    var json_result = {};
    var ipfs_address =
      "0xabfb3b9720db61e98f482c272d29c35ca96ce19cbae73fc81eb51fda31d21121";
    // console.log(JSON.stringify(str_data))
    // console.log(`Certificate hash ${certificate_hash}`)
    // console.log(this.props.values.activeAccount)
    const isSuccess = await this.props.values.contract.methods
      .registerCertificate(
        certificate_hash,
        holder_id,
        JSON.stringify(str_data),
        ipfs_address
      )
      .send(
        { from: this.props.values.activeAccount },
        (error, transactionHash) => {
          if (error) {
            console.error(error);
          } else {
            this.setState({ transactionHash });
            console.log(transactionHash);
          }
        }
      )
      .once("receipt", function (receipt) {})
      .on("confirmation", function (confNumber, receipt) {})
      .on("error", function (error) {})
      .then(function (receipt) {
        console.log("EVENTS");
        console.log(receipt);
        var IsSuccess = receipt.events.IsSuccess.returnValues;
        console.log("MY EVENT");
        console.log(IsSuccess);
        // var eventDecoded = Web3.utils.hexToUtf8(myevent);
        return IsSuccess["value"] && IsSuccess["result"] == "stored"
      });

      if (isSuccess) this.setState({show:true})

    // await this.props.values.web3.eth.getTransactionReceipt(
    //   this.state.transactionHash,
    //   function (error, result) {
    //     console.log(result);
    //     return result;
    //   }
    // );
    this.props.values.contract.events
      .IsSuccess()
      .on("data", (event) => {
        console.log("here");
        console.log(event);
      })
      .on("error", console.error);
  };
  render() {
    const Previous = (e) => {
      e.preventDefault();
      this.props.prevStep();
    };
    return (
      <div className="">
        <h2>Account: {this.props.values.activeAccount}</h2> <br />
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td>Nama : </td>
              <td>{this.props.values.Name}</td>
            </tr>
            <tr>
              <td>NIK</td>
              <td>{this.props.values.NIK}</td>
            </tr>
            <tr>
              <td>Hashed NIK</td>
              <td>{this.state.holder_id}</td>
            </tr>
            <tr>
              <td>{this.props.values.type}</td>
              <td>{this.props.values.cert_name}</td>
            </tr>
            <tr>
              <td>
                {this.props.values.type == "Vaccine" ? "Dose" : "hasil tes"}
              </td>
              <td>
                {this.props.values.type == "Vaccine"
                  ? this.props.values.dose
                  : this.props.values.test_result}
              </td>
            </tr>
            <tr>
              <td>Certificate hash</td>
              <td>{this.state.certificate_hash}</td>
            </tr>
            <tr>
              <td>Transaction Hash</td>
              <td>{this.state.transactionHash}</td>
            </tr>
          </tbody>
        </Table>
        <br />
        <button onClick={Previous}>Previous</button>
        <button onClick={this.storeCertificateData}>Submit</button>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton onClick={this.handleClose}>
            <Modal.Title>Certificate result</Modal.Title>
          </Modal.Header>
          <Modal.Body>QR CODE DISINI Dibawahnya JSON file //TODO</Modal.Body>
          <Modal.Footer>
            <Button variant="primary">Finish</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddToSmartContract;
