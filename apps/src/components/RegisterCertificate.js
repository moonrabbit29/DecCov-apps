import React from "react";
import UserDetails from "./child/UserDetails";
import CertificateType from "./child/CertificateType";
import AddToSmartContract from "./child/AddToSmartContract";
import ipfs from "../ipfs";
import getWeb3 from "../Web3Handler";
import Certificate from "../contracts/Certificate.json";

class RegisterCertificate extends React.Component {
  constructor(props) {
    super(props);
  }
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
    type: "",
    cert_name: "",
    result: "",
    dose: "",
  };
  componentDidMount = async () => {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    console.log(`networkId -> ${networkId}`);
    const deployedNetwork = "0x7a1af4891a8177e4361ab0c731e07712b253b2b2";
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
   },500)
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

  render() {
    const { step } = this.state;
    const {
      Name,
      NIK,
      type,
      cert_name,
      result,
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
    } = this.state;
    const values = {
      Name,
      NIK,
      type,
      cert_name,
      result,
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
    };
    if (this.state.isLoginAccount === false && values.activeAccount==="Anonymous") {
      console.log(`${values.activeAccount}`);
      return (<h1>PROCESSING</h1>);
    } else {
      //console.log(`render after value complete, isLogin -> ${this.state.isLoginAccount} ${this.state.activeAccount} -> ${values.activeAccount}`)
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
