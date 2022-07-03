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
import _ from "lodash";

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
    //console.log(pin);
    this.setState({ pin: pin, enterPin: false });
    // console.log(`after change -> ${this.state.pin}`);
    // console.log(this.state.qrResult);
    this.verifyCertificate(this.state.qrResult);
  };

  componentDidMount = async () => {
    this.props.setToLoading(true);
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    if (networkId != 4) {
      alert("Currently we only have servis in rinkeby network")
    }
    // const networkId = await web3.eth.net.getId();
    // console.log(`networkId -> ${networkId}`);
    //const deployedNetwork = "0x7a1aF4891a8177E4361AB0C731e07712B253b2B2";
    const deployedNetwork = Certificate.deployment.address;
    const instance = new web3.eth.Contract(Certificate.abi, deployedNetwork);
    this.setState({ web3, contract: instance });
    this.initializeQRScanner();
    setInterval(async () => {
      try {
        const networkId = await web3.eth.net.getId();
        if (networkId != 4) {
          alert("Currently we only have servis in rinkeby network")
        }
        // console.log("deployed network")
        // console.log(deployedNetwork)
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
          // console.log(JSON.parse(result.data));
          // console.log(result.data);
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
    //  console.log(error);
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
    const data_from_ipfs = await retrieve_file(data_address)
    console.log("ecnrypted data -> ")
    console.log(data_from_ipfs)
    try {
      const ipfs_data = JSON.parse(
        decryptData(data_from_ipfs, this.state.pin)
      );
      console.log(JSON.stringify(ipfs_data))
      console.log(ipfs_data)
      const image_data = ipfs_data.image;
      return [image_data, ipfs_data];
    } catch (error) {
      console.log(`Error -> ${error}`)
      throw new Error('Error Decrypting data!')
    }
  };

  setloading = (msg,isLoading) => {
    this.props.setToLoading(isLoading)
    this.props.setLoadingText(msg)
  }

  verifyCertificate = async (qr_code_data) => {
    this.setloading("Processing certificate",true)
    const mark_beginning = "mark_beginning"
    const finish_verify = "mark_finish"
    performance.mark(mark_beginning)
    // {
    //   name: user_data.name,
    //   holder_id: user_data.holder_id,
    //   certificate_data: user_data.certificate_data,
    // };
    try {
      const certificate_hash = await addFile(
        JSON.stringify({
          holder_id: qr_code_data.holder_id,
          certificate_data: qr_code_data.certificate_data,
        })
      );
      // console.log(certificate_hash);
      // for testing performance
      const mark_start = "mark_start"
      const mark_verify_certificate = "mark1"
      const mark_download_data_from_ipfs = "mark2"
      performance.mark(mark_start)
      const user_id = Web3.utils.soliditySha3(qr_code_data.holder_id)
      const certificate_in_sc = await this.state.contract.methods
        .verifyCertificate(certificate_hash, user_id)
        .call();
      performance.mark(mark_verify_certificate)
      // console.log("looking for this");
      // console.log(certificate_in_sc);
      const [image, certificate] = await this.getDataFromIPFS(
        certificate_in_sc[1].certificate_data
      );
      performance.mark(mark_download_data_from_ipfs)
      qr_code_data["image"] = image;

      // check if stored data same with data in qrcode
      // console.log(`diff -> ${_.isEqual(qr_code_data,certificate)}`)

      // console.log(`image -> ${image}`)
      // const decrypted_image = decryptData(image, this.state.pin);
      //console.log(`decrypted image -> ${decrypted_image}`)
      const final_certificate_data = {
        data_detail: certificate,
        ...certificate_in_sc[1],
      };

      this.setState({
        showData: true,
        imageDataURL: image,
        certificate_data: final_certificate_data,
      });
      this.setloading("",false)
      performance.mark(finish_verify)
      performance.measure("measure certificate hash validation", mark_start, mark_verify_certificate);
      performance.measure("measure certificate read time ipfs", mark_verify_certificate, mark_download_data_from_ipfs);
      performance.measure("measure total process time",mark_beginning,finish_verify)
     // console.log(performance.getEntriesByType("measure"));
    } catch (err) {
      //console.log(err);
      alert("Tidak dapat membaca sertifikat, pastikan sertifikat anda benar");
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
