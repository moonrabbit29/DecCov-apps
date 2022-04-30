import React from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import Web3 from "web3";
import { retrieve_file } from "../../ipfs";
import DataTable from "./DataTable";
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    isChecked: false,
    show_exiting_data_table: false,
    is_loading: false,
    is_empty_certificates: false,
  };

  handleClose = (input) => {
    this.setState({ [input]: false });
  };

  render() {
    const Continue = (e) => {
      e.preventDefault();
      this.props.nextStep();
    };

    const checkData = async (e) => {
      e.preventDefault();
      this.setState({ is_loading: true });
      try {
        const { res, data_len } = await showExistedData();
        console.log(`res => ${res}`);
        this.setState({ is_loading: false });
        if (!res) this.setState({ is_data_valid: false });
        if (data_len == 0) {
          this.setState({ is_empty_certificates: true  });
        }
        this.setState({isChecked:true})
      } catch (err) {
        console.log(err);
      }
    };

    const showExistedData = async () => {
      const holder_id = Web3.utils.soliditySha3(this.props.values.NIK);
      const data = await this.props.values.contract.methods
        .getCertificatesByUser(holder_id)
        .call();
      if (data.length > 0) {
        //0x608c45416dc4dc37ae942296a88ca28a45c4ee6746126abe130848f1230fe650
        const modified_data = await Promise.all(
          data.map(async (e) => {
            try {
              return {
                cov_hash: e.cov_hash,
                data_address: e.data_address,
                data_detail: await retrieve_file(e.data_address),
                timestamp: e.timestamp,
              };
            } catch (error) {
              console.log(error);
              return {
                cov_hash: e.cov_hash,
                data_address: e.data_address,
                data_detail: "Unable to resolve data from stored address",
                timestamp: e.timestamp,
              };
            }
          })
        );
        this.setState({
          show_exiting_data_table: true,
          user_certificate_data: modified_data,
        });
        const vaccine_dose = modified_data.map(e=>{
          if(e.data_detail.certificate_data.type == "Vaccine")
            return e.data_detail.certificate_data.dose
        })
        console.log(vaccine_dose)
        this.props.setTakenVaccineDose(vaccine_dose)
      }
      return { res: true, data_len: data.length };
    };
    return (
      <Row>
        <Col md={"7"} lg={"7"}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nama pemilik sertifikat"
                value={this.props.values.Name}
                onChange={this.props.handleChange("Name")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>NIK</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="NIK pemilik sertifikat"
                value={this.props.values.NIK}
                onChange={this.props.handleChange("NIK")}
              />
            </Form.Group>
            <Row>
              <Col md={4} xs="auto">
                <Button onClick={checkData}>
                  {this.state.isLoading ? "Loading…" : "Check"}
                </Button>
              </Col>
              <Col md={6} xs="auto" />
              <Col md={2} xs="auto">
                <Button onClick={Continue} disabled={!this.state.isChecked}>
                  Next
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>

        <br />
        {this.state.show_exiting_data_table ? (
          <DataTable certificates_data={this.state.user_certificate_data} />
        ) : null}
        <Modal
          show={this.state.is_empty_certificates}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            onClick={() => this.handleClose("is_empty_certificates")}
          >
            <Modal.Title>
              Pasien Belum Memiliki Riwayat Vaksin/Tes Covid-19
            </Modal.Title>
          </Modal.Header>
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.handleClose("is_empty_certificates")}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    );
  }
}

export default UserDetail;
export { DataTable };
