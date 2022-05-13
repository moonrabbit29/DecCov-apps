import React from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";

class IssuerDetail extends React.Component {
  state = {
    testerAddress: "",
    institutionName: "",
    employeeNumber: "",
    contactNumber: "",
  };
  constructor(props) {
    super(props);
    this.props = props;
  }
  onInput = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };
  render() {
    const submitIssuer = (e) => {
      e.preventDefault();
      console.log(e);
      this.props.callRegisterIssuer(
        this.state.testerAddress,
        this.state.institutionName,
        this.state.employeeNumber,
        this.state.contactNumber
      );
    };
    return (
      <Row>
        <Col md={"7"} lg={"7"}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tester Address</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Alamat publik calon issuer"
                onChange={this.onInput("testerAddress")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Institusi</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nama asal institusi"
                onChange={this.onInput("institutionName")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nomor kepegawaian</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Nomor kepegawaian"
                onChange={this.onInput("employeeNumber")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                required
                type="number"
                placeholder="Contact number"
                onChange={this.onInput("contactNumber")}
              />
            </Form.Group>
            <Button type="submit" onClick={submitIssuer}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default IssuerDetail;
