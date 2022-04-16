import React from "react";
import UserDetails from "./child/UserDetails";
import CertificateType from "./child/CertificateType";
import AddToSmartContract from "./child/AddToSmartContract";
import getWeb3 from "../Web3Handler";
import Certificate from "../contracts/Certificate.json";
import MyImageCaptureComponent from "./child/CapturePhoto";
////"deployment" :
//{"address": "0x16752Eb174Ce2B3036f428f67ED304Dea80fF847", "chainid": "4", "blockHeight": 10477515}
class RegisterCertificate extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    activeAccount: "Anonymous",
    isLoginAccount: false,
    buffer: null,
    dataToUpload: "",
    ipfsHash: "",
    hashToCheck: "",
    transactionHash: "",
    step: 1,
    Name: "",
    NIK: "",
    type: "Vaccine",
    cert_name: "",
    test_result: "",
    dose: "",
    imageDataURL: "",
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
        alert(`You are offline, connect to metamask to continue.`);
      }
    }, 500);
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  changeState = (input, value) => {
    this.setState({ [input]: value });
  };

  resetState = () => {
    this.setState({ ...this.state });
  };

  render() {
    const { step } = this.state;
    const {
      Name,
      NIK,
      type,
      cert_name,
      test_result,
      dose,
      web3,
      accounts,
      contract,
      activeAccount,
      buffer,
      dataToUpload,
      ipfsHash,
      hashToCheck,
      transactionHash,
      imageDataURL,
    } = this.state;
    const values = {
      Name,
      NIK,
      type,
      cert_name,
      test_result,
      dose,
      web3,
      accounts,
      contract,
      activeAccount,
      buffer,
      dataToUpload,
      ipfsHash,
      hashToCheck,
      transactionHash,
      imageDataURL,
    };
    if (
      this.state.isLoginAccount === false &&
      values.activeAccount === "Anonymous"
    ) {
      return <h1>PROCESSING</h1>;
    } else {
      switch (step) {
        case 1:
          return (
            <UserDetails
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              values={values}
              handleChange={this.handleChange}
            />
          );
        case 2:
          return (
            <CertificateType
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              values={values}
              handleChange={this.handleChange}
            />
          );
        case 3:
          return (
            <>
              <MyImageCaptureComponent
                values={values}
                changeState={this.changeState}
                handleChange={this.handleChange}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
              />
              ;
            </>
          );
        case 4:
          return (
            <AddToSmartContract
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              values={values}
              handleChange={this.handleChange}
            />
          );
        default:
          return <p>Error occured</p>;
      }
    }
  }
}

export default RegisterCertificate;
