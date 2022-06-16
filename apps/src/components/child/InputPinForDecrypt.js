import React from "react";
import { Form } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";

class InputPin extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
      pin_1:""
  }
  
  submitPin = (e) => {
    e.preventDefault()
    console.log(`PIN -> ${this.state.pin_1}`)
    this.props.changePin(this.state.pin_1)
  }

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
   // console.log(e.target.value)
  }

  render() {
    return (
      <Modal
        dialogClassName="custom-dialog"
        show={this.props.enterPin}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <h3>PIN / Password Milik Pasien</h3>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>PIN / Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Pin/Password"
                onChange={this.handleChange("pin_1")}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={this.submitPin}
            >
              Sumbit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
}

export default InputPin;