import React from "react";
import QrScanner from "qr-scanner";
import getWeb3 from "../Web3Handler";
import Web3 from "web3";
import Certificate from "../contracts/CertificateRegistry.json";
import addFile, { retrieve_file, turnIntoBuffer } from "../ipfs";
import { DataTable } from "./child/UserDetails";
import { Row, Button, Col } from "react-bootstrap";
import InputPin from "./child/InputPinForDecrypt";
import { decryptData } from "../crypt";

class VerifyCertificate extends React.Component {
  state = {
    imageDataURL: "",
    currentCamera: 0,
    contract: "",
    web3: "",
    showData: false,
    qrResult: "",
    enterPin: false,
    pin: "",
  };

  // called after receiving input for decrypting certificate data
  changePin = (pin) => {
    console.log(pin);
    this.setState({ pin: pin, enterPin: false });
    console.log(`after change -> ${this.state.pin}`);
    console.log(this.state.qrResult);
    this.verifyCertificate(this.state.qrResult);
  };

  componentDidMount = async () => {
    this.props.setToLoading(true);
    const web3 = await getWeb3();
    // const networkId = await web3.eth.net.getId();
    // console.log(`networkId -> ${networkId}`);
    const deployedNetwork = "0x7a1aF4891a8177E4361AB0C731e07712B253b2B2";
    //const deployedNetwork = Certificate.deployment.address;
    const instance = new web3.eth.Contract(Certificate.abi, deployedNetwork);
    this.setState({ web3, contract: instance });
    this.initializeQRScanner();
    setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        this.setState({ accounts });
        if (this.state.activeAccount !== accounts[0]) {
          var active = await accounts[0];
          this.setState({ activeAccount: active });
          this.setState({ transactionHash: "" });
          this.setState({ isLoginAccount: true });
          this.props.setToLoading(false);
        } else if (!accounts[0]) {
          this.props.setToLoading(true);
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
        (result) => {
          console.log(JSON.parse(result.data).user_data);
          console.log(result.data);
          this.setState({ qrResult: JSON.parse(result.data), enterPin: true });
          this.qrScanner.stop();
        },
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
    const ipfs_data = JSON.parse(
      decryptData(await retrieve_file(data_address), this.state.pin)
    );
    const image_data = await retrieve_file(ipfs_data.image);
    return [image_data, ipfs_data];
  };

  verifyCertificate = async (qr_code_data) => {
    // {
    //   name: user_data.name,
    //   holder_id: user_data.holder_id,
    //   certificate_data: user_data.certificate_data,
    // };
    try {
      const certificate_hash = await addFile(
        JSON.stringify({
          holder_id: qr_code_data.user_data.holder_id,
          certificate_data: qr_code_data.certificate_data,
        })
      );
      console.log(certificate_hash);
      const user_id = Web3.utils.soliditySha3(qr_code_data.user_data.holder_id)
      console.log(`Holder id -> ${qr_code_data.user_data.holder_id}`)
      console.log(`user id -> ${user_id}`)
      const certificate_in_sc = await this.state.contract.methods
        .verifyCertificate(certificate_hash, user_id)
        .call();
      console.log("looking for this");
      console.log(certificate_in_sc);
      const [image, certificate_data] = await this.getDataFromIPFS(
        certificate_in_sc[1].certificate_data
      );
      console.log(`image -> ${image}`)
      const decrypted_image = decryptData(image, this.state.pin);
      console.log(`decrypted image -> ${decrypted_image}`)
      const final_certificate_data = {
        data_detail: certificate_data,
        ...certificate_in_sc[1],
      };

      this.setState({
        showData: true,
        imageDataURL: decrypted_image,
        certificate_data: final_certificate_data,
      });
    } catch (err) {
      console.log(err);
      alert("ERROR PLEASE CONTACT TECHNICIAN");
      this.resetState();
      window.location.reload();
    }
  };

  render() {
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
        <InputPin enterPin={this.state.enterPin} changePin={this.changePin} />
      </Row>
    );
    return <>{playerORImage}</>;
  }
}

export default VerifyCertificate;
