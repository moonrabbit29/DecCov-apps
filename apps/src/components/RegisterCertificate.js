import React from "react";
import UserDetails from "./child/UserDetails";
import CertificateType from "./child/CertificateType";
import AddToSmartContract from "./child/AddToSmartContract";
import getWeb3 from "../Web3Handler";
import Certificate from "../contracts/CertificateRegistry.json";
import MyImageCaptureComponent from "./child/CapturePhoto";
import {verifyMessage,check_address,signMessage} from "../AuthWeb3"
////"deployment" :
//{"address": "0x16752Eb174Ce2B3036f428f67ED304Dea80fF847", "chainid": "4", "blockHeight": 10477515}
class RegisterCertificate extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    web3: null,
    accounts: null,
    contract: null,
    activeAccount: "Anonymous",
    isLoginAccount: false,
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
    TakenVaccineDose: null,
    gender: "L",
    //homeAddress: "",
    age: 0,
    testExpiryDate:"",
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
    const accounts = await web3.eth.getAccounts();
    const isIssuer = await check_address(accounts[0],web3)
    if (!isIssuer) {
      alert("You don't have acces to this feature")
      window.location.href = "/";
      return
    }
    const [signature,message] = await signMessage(accounts[0],web3)
    console.log(`Signature -> ${signature}`)
    console.log(`message -> ${message}`)
    const isValidSignature = await verifyMessage(message,accounts[0],signature,web3)

    if(isValidSignature!=='Verified'){
      alert("You can't prove ownership of this account")
      window.location.href = "/";
    }

    setInterval(async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        this.setState({ accounts });
        if (this.state.activeAccount !== accounts[0] && this.state.activeAccount==="Anonymous") {
          var active = await accounts[0];
          this.setState({ activeAccount: active });         
          this.setState({ transactionHash: "" });
          this.setState({ isLoginAccount: true });
          this.props.setToLoading(false);
        }else if(!accounts[0]){
          this.props.setToLoading(true);
        }else if(this.state.activeAccount !== accounts[0]){
          window.location.reload();
        }
      } catch (error) {
        //alert(error);
        alert(`Something went wrong, make sure metamask run correctly`);
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

  genderEncoding = (input) => (e) => {
    const genderCode = {
        'Laki - Laki' : 'L',
        'Perempuan' : 'p'
    }
    this.setState({gender:genderCode[e.target.value]})
  }

  changeState = (input, value) => {
    this.setState({ [input]: value });
  };

  resetState = () => {
    this.setState({ ...this.state });
  };

  setTakenVaccineDose = (data) => {
    this.setState({ TakenVaccineDose: data });
  };

  setloading = (msg,isLoading) => {
    this.props.setToLoading(isLoading)
    this.props.setLoadingText(msg)
  }

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
      transactionHash,
      imageDataURL,
      TakenVaccineDose,
      gender,
      //homeAddress,
      age,
      testExpiryDate
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
      transactionHash,
      imageDataURL,
      TakenVaccineDose,
      gender,
      //homeAddress,
      age,
      testExpiryDate
    };
    switch (step) {
      case 1:
        return (
          <UserDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            values={values}
            handleChange={this.handleChange}
            setTakenVaccineDose={this.setTakenVaccineDose}
            genderEncoding={this.genderEncoding}
          />
        );
      case 2:
        return (
          <CertificateType
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            values={values}
            handleChange={this.handleChange}
            resetState={this.resetState}
            setTakenVaccineDose={this.setTakenVaccineDose}
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
          </>
        );
      case 4:
        return (
          <AddToSmartContract
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            values={values}
            handleChange={this.handleChange}
            setToLoading={this.setloading}
          />
        );
      default:
        return <p>Error occured</p>;
    }
  }
}

export default RegisterCertificate;
