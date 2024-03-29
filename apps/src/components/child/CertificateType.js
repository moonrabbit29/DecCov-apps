import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

function VaccineTypeList() {
  return (
    <>
      <option>Sinnovac</option>
      <option>AstraZeneca</option>
      <option>Sinopharm</option>
      <option>Pfizer</option>
    </>
  );
}

function CovidTestList() {
  return (
    <>
      <option>PCR</option>
      <option>Rapid Antigen</option>
      <option>Genose</option>
    </>
  );
}

function TestResultList() {
  return (
    <>
      <option>Positif</option>
      <option>Negatif</option>
    </>
  );
}

function VaccineDoseList(esisting_vacine_dose) {
  if (!esisting_vacine_dose)
    return (
      <>
        <option>1</option>
      </>
    );
  else{
   // console.log(esisting_vacine_dose[esisting_vacine_dose.length - 1])
    return (
      <>
        <option>
          {esisting_vacine_dose}
        </option>
      </>
    );
  }
}
class CertificateType extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    certificate_data_type: "",
    is_data_submited: false,
  };

  componentDidMount = async () => {
    const vaccine_dose = parseInt(this.props.values.TakenVaccineDose!==null ? 
      this.props.values.TakenVaccineDose[this.props.values.TakenVaccineDose.length - 1]:0)+1
    console.log(vaccine_dose)
    console.log(`isnan -> ${isNaN(vaccine_dose)}`)
    const count_vacine_dose = isNaN(vaccine_dose) ? 0 : vaccine_dose
    console.log(count_vacine_dose)
    this.setState({vaccine_dose : count_vacine_dose})
    setInterval(() => {
      if (
        this.props.values.cert_name &&
        this.props.values.type &&
        (this.props.values.test_result || this.props.values.dose)
      ) {
        this.setState({ is_data_submited: true });
      }
    }, 100);
  };

  render() {
    const Continue = (e) => {
      e.preventDefault();
      this.props.nextStep();
    };
    const Previous = (e) => {
      e.preventDefault();
      this.props.prevStep();
    };

    return (
      <Row>
        <Col md={"7"} lg={"7"}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                placeholder="Vaccine/Tes"
                onChange={this.props.handleChange("type")}
              >
                <option>Vaccine</option>
                <option>Covid Test</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                {this.props.values.type === "Vaccine" ? "Vaksin" : "Tes Covid"}{" "}
                :
              </Form.Label>
              <Form.Select
                type="text"
                placeholder={
                  this.props.values.type === "Vaccine"
                    ? "Jenis vaksin"
                    : "Jenis Tes"
                }
                value={this.props.values.cert_name}
                onChange={this.props.handleChange("cert_name")}
                onClick={this.props.handleChange("cert_name")}
              >
                {this.props.values.type === "Vaccine"
                  ? VaccineTypeList()
                  : CovidTestList()}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                {this.props.values.type === "Vaccine" ? "Dosis" : "Hasil tes"}
              </Form.Label>
              <Form.Select
                type="text"
                placeholder={
                  this.props.values.type === "Vaccine" ? "Dosis" : "Hasil tes"
                }
                value={
                  this.props.values.type === "Vaccine"
                    ? this.props.values.dose
                    : this.props.values.test_result
                }
                onChange={this.props.handleChange(
                  this.props.values.type === "Vaccine" ? "dose" : "test_result"
                )}
                onClick={this.props.handleChange(
                  this.props.values.type === "Vaccine" ? "dose" : "test_result"
                )}
              >
                {this.props.values.type === "Vaccine"
                  ? (this.state.vaccine_dose <= 3 ? 
                  VaccineDoseList(this.state.vaccine_dose) : <option disabled>Sudah dosis ketiga</option>)
                  : TestResultList()}
              </Form.Select>
            </Form.Group>
            {this.props.values.type === "Vaccine" ? <></> : 
              <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Masa berlaku tes</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Hari"
                value={this.props.values.testExpiryDate}
                onChange={this.props.handleChange("testExpiryDate")}
              />
            </Form.Group>
            }
            <Row>
              <Col md={4} xs="auto">
                <Button onClick={Previous}>Previous</Button>
              </Col>
              <Col md={6} xs="auto" />
              <Col md={2} xs="auto">
                <Button
                  onClick={Continue}
                  disabled={!this.state.is_data_submited}
                >
                  Next
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default CertificateType;
