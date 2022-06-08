import React from "react";
import { Modal } from "react-bootstrap";

class TransactionReverted extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
      }
    render(){
        return (
            <Modal
            dialogClassName="custom-dialog"
            show={this.props.showRevertedTransaction}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton onClick={() => this.props.CloseTransactionReverted}>
              <Modal.Title>Transaksi Gagal, Pastikan akun yang digunakan memiliki akses yang dibutuhkan</Modal.Title>
            </Modal.Header>
          </Modal>
        )
    }
}

export default TransactionReverted