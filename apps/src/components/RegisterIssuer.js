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
    showRevertedTransaction:false
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
    const upload_data = await addFile(
      JSON.stringify({
        institution_name: institution_name,
        employee_number: employee_number,
        contact_number: contact_number,
      })
    );
    await this.state.contract.methods
      .registerIssuer(issuer_address, upload_data)
      .send(
        { from: this.state.activeAccount },
        (error, transactionHash) => {
          if (error) {
          } else {
            this.setState({ transactionHash });
          }
        }
      )
      .once("receipt", function (receipt) {})
      .on("confirmation", function (confNumber, receipt) {})
      .on("error", function (error) {
        if (error['message'].includes(`"message":"revert"`)) {
          this.setState({showRevertedTransaction:true})
        }
      })
      .then((receipt) => {
        console.log(receipt)
        const IsSuccess = receipt.events.IsSuccess.returnValues;
        const succes = IsSuccess["value"] && IsSuccess["message"] == "stored";
        if (succes) {
          this.setState({ showModal: true });
        }
      });
  };
  componentDidMount = async () => {
    this.props.setToLoading(true);
    const web3 = await getWeb3();
    // const networkId = await web3.eth.net.getId();
    // console.log(`networkId -> ${networkId}`);
    const deployedNetwork = "0x4258BA34260905EFBCb468528623789FE885aD59";
    //const deployedNetwork = Certificate.deployment.address;
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

  render() {
    return (
      <>
        <IssuerDetail
          callRegisterIssuer={this.callRegisterIssuer}
        />
        <SuccessRegisterIssuer 
          showModal={this.state.showModal}
          handleClose={this.handleClose}
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
