import React from "react";
import { Form, Table } from "react-bootstrap";
import Web3 from "web3";
import { retrieve_file } from "../../ipfs";

class DataTableContent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <>
        <tr>
          <td>COV Hash : </td>
          <td>{this.props.hash}</td>
        </tr>
        <tr>
          <td>COV issuer : </td>
          <td>{this.props.issuer}</td>
        </tr>
        <tr>
          <td>Timestamp : </td>
          <td>{this.props.timestamp}</td>
        </tr>
      </>
    );
  }
}
class VaccineData extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <>
        <tr>
          <td>Jenis Vaksin: </td>
          <td>{this.props.data.name}</td>
        </tr>
        <tr>
          <td>Dosis : </td>
          <td>{this.props.data.dose}</td>
        </tr>
      </>
    );
  }
}

class TestData extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <>
        <tr>
          <td>Jenis tes: </td>
          <td>{this.props.data.name}</td>
        </tr>
        <tr>
          <td> Hasil tes : </td>
          <td>{this.props.data.result}</td>
        </tr>
      </>
    );
  }
}
class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <>
        {this.props.certificates_data.map((element, index) => {
          return (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>Certificate Data</tr>
              </thead>
              <tbody>
                <DataTableContent
                  key={index}
                  hash={element.cov_hash}
                  timestamp={new Date(
                    parseInt(element.timestamp) * 1000
                  ).toDateString()}
                  issuer={
                    element.data_detail.issuer_address
                      ? element.data_detail.issuer_address
                      : element.data_detail
                  }
                />
                {element.data_detail.certificate_data.type === "Vaccine" ? (
                  <VaccineData 
                    data={element.data_detail.certificate_data}
                  />
                ) : (
                  <TestData
                    data = {element.data_detail.certificate_data}
                  />
                )}
              </tbody>
            </Table>
          );
        })}
      </>
    );
  }
}
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    show_exiting_data_table: false,
  };

  render() {
    const Continue = (e) => {
      e.preventDefault();
      this.props.nextStep();
    };
    const showExistedData = async (e) => {
      e.preventDefault();
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
        console.log(modified_data);
        this.setState({
          show_exiting_data_table: true,
          user_certificate_data: modified_data,
        });
      }
    };
    return (
      <>
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
          <button onClick={Continue}>Next</button>
          <button onClick={showExistedData}>Check</button>
        </Form>
        <br />
        {this.state.show_exiting_data_table ? (
          <DataTable certificates_data={this.state.user_certificate_data} />
        ) : null}
      </>
    );
  }
}

export default UserDetail;
