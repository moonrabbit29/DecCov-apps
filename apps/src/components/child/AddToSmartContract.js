import React from "react";
import { Table } from "react-bootstrap";
import Web3 from "web3";
import { Modal, Button } from "react-bootstrap";
import Qrcode from "qrcode";
import addFile from "../../ipfs";
import { turnIntoBuffer, retrieve_file } from "../../ipfs";

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
    show: false,
    qrURL: "",
    show_already_exist: false,
    existed_data: {
      name: "",
      nik: "",
      certificate_data: {},
      issuer_address: "",
    },
  };

  handleClose = (input) => {
    this.setState({ [input]: false });
  };

  storeCertificateData = async (e) => {
    const holder_id = Web3.utils.soliditySha3(this.props.values.NIK);
    const image = await addFile(
      turnIntoBuffer(JSON.stringify(this.props.values.imageDataURL))
    );
    this.setState({ holder_id: holder_id });
    const certificate_data =
      this.props.values.type === "Vaccine"
        ? {
            type: this.props.values.type,
            name: this.props.values.cert_name,
            dose: this.props.values.dose,
          }
        : {
            type: this.props.values.type,
            name: this.props.values.cert_name,
            result: this.props.values.test_result,
          };
    const user_data = {
      name: this.props.values.Name,
      holder_id: holder_id,
      image: image,
      certificate_data: certificate_data,
      issuer_address: this.props.values.activeAccount,
    };
    //var certificate_hash = "0xd838244465d7b705adf17e52bd7ea23a1d7f45cf78c6f31e97df9caedf5120e6"
    //["bytes32","string","address"]
    const str_certificate_data = JSON.stringify(user_data.certificate_data);
    const opts = {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#010599FF",
        light: "#FFBF60FF",
      },
    };
    const certificate_hash = Web3.utils.soliditySha3(
      { t: "bytes32", v: holder_id },
      { t: "string", v: JSON.stringify(user_data.certificate_data) }
    );
    this.setState({ certificate_hash: certificate_hash });

    //ipfs daemon --writable
    const ipfs_address_for_certificate = await addFile(
      turnIntoBuffer(JSON.stringify(
        {
          holder_id:holder_id,
          image: image,
          certificate_data: certificate_data,
          issuer_address: this.props.values.activeAccount,
        }
      ))
    );
    console.log(`ipfs_address ${ipfs_address_for_certificate}`);
    await this.props.values.contract.methods
      .registerCertificate(certificate_hash, holder_id, str_certificate_data, ipfs_address_for_certificate)
      .send(
        { from: this.props.values.activeAccount },
        (error, transactionHash) => {
          if (error) {
          } else {
            this.setState({ transactionHash });
          }
        }
      )
      .once("receipt", function (receipt) {})
      .on("confirmation", function (confNumber, receipt) {})
      .on("error", function (error) {})
      .then(
        async function (receipt) {
          const IsSuccess = receipt.events.IsSuccess.returnValues;
          const succes = IsSuccess["value"] && IsSuccess["result"] == "stored";
          if (succes) {
            this.setState({ show: true });
            const timestamp =
              receipt.events.timestampEvent.returnValues["timestamp"];
            user_data["timestamp"] = timestamp;
            const qrCodeData = {
              name : user_data.name,
              holder_id : user_data.holder_id,
              certificate_data : user_data.certificate_data
            }
            Qrcode.toDataURL(
              JSON.stringify(qrCodeData),
              opts,
              function (err, url) {
                if (err) console.log(err);
                this.setState({ qrURL: url });
              }.bind(this)
            );
          } else {
            if (IsSuccess["result"] == "already") {
              const certificate = receipt.events.certificateExist.returnValues;
              const timestamp = new Date(
                parseInt(certificate.certificate_data.timestamp) * 1000
              );
              const recorded_timestamp = new Date(timestamp.toDateString());
              const recorded_data = certificate.certificate_data.data_address;
              console.log(recorded_data);
              const stored_meta_data = await retrieve_file(recorded_data);
              console.log(stored_meta_data);
              this.setState({
                show_already_exist: true,
                recorded_timestamp: recorded_timestamp.toString(),
                existed_data: stored_meta_data,
              });
            }
          }
        }.bind(this)
      );
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
          <Modal.Header closeButton onClick={() => this.handleClose("show")}>
            <Modal.Title>Certificate result</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>QR CERTIFICATE</h3>
            <img src={this.state.qrURL} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.handleClose("show")}>
              Finish
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.show_already_exist}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            onClick={() => this.handleClose("show_already_exist")}
          >
            <Modal.Title>Existing Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Data already exist with this information</h3>
            <Table striped bordered hover responsive>
              <tbody>
                <tr>
                  <td>COV Hash : </td>
                  <td>{this.state.certificate_hash}</td>
                </tr>
                <tr>
                  <td>COV issuer : </td>
                  <td>{this.state.existed_data.issuer_address}</td>
                </tr>
                <tr>
                  <td>Timestamp : </td>
                  <td>{this.state.recorded_timestamp}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.handleClose("show_already_exist")}
            >
              Finish
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddToSmartContract;
