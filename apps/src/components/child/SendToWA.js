import { Form,Button } from "react-bootstrap";
import React from "react";
import { saveAs } from 'file-saver';

class SendToWa extends React.Component {
  state = {
    number: "",
  };
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  }
  send_handle= ()=> {
    //const blob = new Blob([this.props.certificate_qr_code],{type: "text/plain;charset=utf-8"})
    let dateObj = new Date();

    let currentDate = (dateObj.getUTCFullYear()) + "/" + (dateObj.getMonth() + 1)+ "/" + (dateObj.getUTCDate());
    saveAs(this.props.certificate_qr_code, `${this.props.NIK}-${this.props.type}-${currentDate}.jpg`);
    const win = window.open(
      `https://wa.me/${this.state.number}?text=Sertifikat%20${this.props.type}%20atas%20nama%20${this.props.name}%20dengan%20NIK%20${this.props.NIK}`,
      "_blank"
    );
    win.focus();
  }
  render() {
    return (
      <Form>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Nomor whatsApp</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nomor WhatsApp"
            onChange={this.handleChange("number")}
          />
        </Form.Group>
        <Button onClick={this.send_handle}>Send to whatsapp</Button>
      </Form>
    );
  }
}

export default SendToWa
