import React from "react";
import getWeb3 from "../Web3Handler";
import Registry from "../contracts/Registry.json";
import IssuerDetail from "./child/IssuerDetails";
import SuccessRegisterIssuer from "./child/SuccessRegisterIssuer"
import addFile from "../ipfs";
import TransactionReverted from "./child/TransactionReverted";

class RegisterIssuer extends React.Component {
  state = {
    accounts: "",
    contract: "",
    activeAccount: "",
    transactionHash: "",
    showModal: false,
    showRevertedTransaction:false,
    registerIssuerMessage:"",
    issuer_address:"",
    institution_name:"",
    employee_number:"",
    contact_number:""
  };

  closeTransactionReverted = () => {
    this.setState({showRevertedTransaction:false})
    window.location.reload();
  }  

  handleClose = () => {
    this.setState({showModal:false})
  }

  callRegisterIssuer = async (
    issuer_address,
    institution_name,
    employee_number,
    contact_number
  ) => {

    const mark_start="mark_start"
    performance.mark(mark_start)
    this.setState({
      issuer_address:issuer_address,
      institution_name:institution_name,
      employee_number:employee_number,
      contact_number:contact_number
    })
    this.setloading("Processing your request",true)
    const mark1 = "mark1"
    const mark2 = "mark2"
    const mark3= "mark3"
    const mark_final = "mark_final"
    performance.mark(mark1)
    const upload_data = await addFile(
      JSON.stringify({
        institution_name: institution_name,
        employee_number: employee_number,
        contact_number: contact_number,
      })
    );
    performance.mark(mark2)
    await this.state.contract.methods
      .registerIssuer(issuer_address, upload_data)
      .send(
        { from: this.state.activeAccount },
        (error, transactionHash) => {
          if (error) {
          this.setloading("There is an error in your request, please retry",true)
          } else {
            this.setState({ transactionHash });
          }
        }
      )
      .once("receipt", function (receipt) {})
      .on("confirmation", function (confNumber, receipt) {})
      .on("error", function (error) {
        this.setloading("",false)
        if (error['message'].includes(`"message":"revert"`)) {
          this.setState({showRevertedTransaction:true})
        }
      })
      .then((receipt) => {
        performance.mark(mark3)
        this.setloading("",false)
        console.log(receipt)
        const IsSuccess = receipt.events.IsSuccess.returnValues;
        const succes = IsSuccess["value"] && IsSuccess["message"] == "stored";
        console.log(IsSuccess["message"])
        if (succes) {
          this.setState({registerIssuerMessage:"succes register issuer"})
          this.setState({ showModal: true });
        }else{
          this.setState({registerIssuerMessage:"Issuer allready registered"})
          this.setState({ showModal: true });
        }
      });
      performance.mark(mark_final)
      performance.measure("measure issuer identiy upload",mark1,mark2)
      performance.measure("measure registry transaction",mark2,mark3)
      performance.measure("measure total time",mark_start,mark_final)
      console.log(performance.getEntriesByType("measure"));
  };
  componentDidMount = async () => {
    this.props.setToLoading(true);
    const web3 = await getWeb3();
    // const networkId = await web3.eth.net.getId();
    // console.log(`networkId -> ${networkId}`);
    //const deployedNetwork = "0x4258BA34260905EFBCb468528623789FE885aD59";
    const deployedNetwork = Registry.deployment.address;
    const instance = new web3.eth.Contract(Registry.abi, deployedNetwork);
    this.setState({ web3, contract: instance });
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
  setloading = (msg,isLoading) => {
    this.props.setToLoading(isLoading)
    this.props.setLoadingText(msg)
  }
  render() {
    return (
      <>
        <IssuerDetail
          callRegisterIssuer={this.callRegisterIssuer}
        />
        <SuccessRegisterIssuer 
          showModal={this.state.showModal}
          handleClose={this.handleClose}
          message={this.state.registerIssuerMessage}
          issuer_address={this.state.issuer_address}
          institution_name={this.state.institution_name}
          employee_number={this.state.employee_number}
          contact_number={this.state.contact_number}
        />

        <TransactionReverted 
          CloseTransactionReverted={this.closeTransactionReverted}
          showRevertedTransaction={this.state.showRevertedTransaction}
        />
      </>
    );
  }
}

export default RegisterIssuer;
