import React from "react";
import QrScanner from "qr-scanner";
import getWeb3 from "../Web3Handler";
import Web3 from "web3";
import Certificate from "../contracts/Certificate.json";
import { retrieve_file } from "../ipfs";
import { DataTable } from "./child/UserDetails";
import { Row, Button, Col } from "react-bootstrap";

class VerifyCertificate extends React.Component {
  state = {
    imageDataURL: "",
    currentCamera: 0,
    contract: "",
    web3: "",
    showData: false,
  };

  componentDidMount = async () => {
    const web3 = await getWeb3();
    // const networkId = await web3.eth.net.getId();
    // console.log(`networkId -> ${networkId}`);
    const deployedNetwork = "0x7a1aF4891a8177E4361AB0C731e07712B253b2B2";
    //const deployedNetwork = Certificate.deployment.address;
    const instance = new web3.eth.Contract(Certificate.abi, deployedNetwork);
    this.setState({ web3, contract: instance });
    setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        this.setState({ accounts });
        if (this.state.activeAccount !== accounts[0]) {
          var active = await accounts[0];
          this.setState({ activeAccount: active });
          this.setState({ dataToUpload: null });
          this.setState({ buffer: null });
          this.setState({ fileName: "" });
          this.setState({ ipfsHash: "" });
          this.setState({ hashToCheck: "" });
          this.setState({ transactionHash: "" });
          this.setState({ isLoginAccount: true });
        }
      } catch (error) {
        this.resetState();
        alert(`You are offline, connect to metamask to continue.`);
      }
    }, 500);
  };
  qrScanner = () => {};
  initializeQRScanner = async () => {
    try {
      this.qrScanner = new QrScanner(
        this.player ? this.player : "",
        (result) =>
          this.verifyCertificate(JSON.parse(result.data)).then(
            this.qrScanner.stop()
          ),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      const cameraList = await QrScanner.listCameras(true);
      if (cameraList.length < 1) alert("Kamera tidak ditemukan");
      this.qrScanner.setCamera(cameraList[this.state.currentCamera].id);
      this.qrScanner.start();
    } catch (error) {
      console.log(error);
      this.qrScanner.stop();
      this.resetState();
    }
  };
  stopQRScanner = async (result = "") => {
    this.qrScanner.stop();
  };

  switchCamera = async () => {
    const cameraList = await QrScanner.listCameras(true);
    if (this.state.currentCamera + 1 < cameraList.length) {
      await this.qrScanner.stop();
      this.setState({ currentCamera: this.state.currentCamera + 1 });
      await this.qrScanner.setCamera(cameraList[this.state.currentCamera].id);
      await this.qrScanner.start();
    } else {
      await this.qrScanner.stop();
      this.setState({ currentCamera: 0 });
      await this.qrScanner.setCamera(cameraList[this.state.currentCamera].id);
      await this.qrScanner.start();
    }
  };

  resetState = () => {
    this.setState({ ...this.state });
  };

  getDataFromIPFS = async (data_address) => {
    const ipfs_data = await retrieve_file(data_address);
    const image_data = await retrieve_file(ipfs_data.image);
    return [image_data, ipfs_data];
  };

  verifyCertificate = async (qr_code_data) => {
    try {
      const certificate_hash = Web3.utils.soliditySha3(
        { t: "bytes32", v: qr_code_data.holder_id },
        { t: "string", v: JSON.stringify(qr_code_data.certificate_data) }
      );
      const certificate_in_sc = await this.state.contract.methods
        .verifyCertificate(certificate_hash, qr_code_data.holder_id)
        .call();
      const [image, certificate_data] = await this.getDataFromIPFS(
        certificate_in_sc[1].data_address
      );
      const final_certificate_data = {
        data_detail: certificate_data,
        ...certificate_in_sc[1],
      };
      //TODO validate data ipfs == data qr code.
      this.setState({
        showData: true,
        imageDataURL: image,
        certificate_data: final_certificate_data,
      });
    } catch (err) {
      alert("ERROR PLEASE CONTACT TECHNICIAN");
      this.resetState();
    }
  };

  render() {
    this.initializeQRScanner();
    const playerORImage = Boolean(this.state.imageDataURL) ? (
      <Row>
        <Col>
          <img src={this.state.imageDataURL} alt="cameraPic" />
        </Col>
        <DataTable certificates_data={[this.state.certificate_data]} />
      </Row>
    ) : (
      <Row>
        <Col md="4" xs="4"></Col>
        <Col md="4" xs="2">
          <video
            width="320"
            height="240"
            ref={(refrence) => {
              this.player = refrence;
            }}
            autoPlay
          ></video>
        </Col>
        <Col md="4" xs="4"></Col>
        {/* <Col>
          <img
            width="120"
            height="120"
            src="/qr_icon.png"
            onClick={}
          />
        </Col> */}
        <Col md="5" xs="5"></Col>
        <Col md="2" xs="2">
          <Button onClick={this.switchCamera}>Switch Camera</Button>
        </Col>
        <Col md="5" xs="5"></Col>
      </Row>
    );
    return <>{playerORImage}</>;
  }
}

export default VerifyCertificate;
