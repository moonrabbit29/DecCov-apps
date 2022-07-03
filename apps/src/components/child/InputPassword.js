import React from "react";
import { Form } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";

class InputPassword extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
      is_pin_same:"no input",
      pin_1:"",
      pin_2:"",
  }
  submitPin = (e) => {
      console.log(e)
    e.preventDefault()
    if(this.state.pin_1 != this.state.pin_2 ){
      this.setState({is_pin_same:false})
    }else{
        this.props.changeState("pin",this.state.pin_1)
        this.props.changeState("enter_pin",false)
    }
  }

  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  }

  render() {
    return (
      <Modal
        dialogClassName="custom-dialog"
        show={this.props.enter_pin}
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
                {this.state.is_pin_same===false && <span className='err'>Pin yang dimasukkan harus sama</span>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Input kembali PIN / Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Pin/Password"
                onChange={this.handleChange("pin_2")}
              />
              {this.state.is_pin_same===false && <span className='err'>Pin yang dimasukkan harus sama</span>}
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

export default InputPassword;
