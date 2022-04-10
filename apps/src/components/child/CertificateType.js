import React  from "react"
import { Form } from 'react-bootstrap';
class CertificateType extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    state = {
        certificate_data_type:''
    }

    render(){
        const Continue = e => {
            e.preventDefault();
            this.props.nextStep();
        }
        const Previous  = e=>{
            e.preventDefault();
            this.props.prevStep();
        }
        return(
            <Form>
                <Form.Group className="mb-3" >
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                        placeholder="Vaccine/Tes" 
                        onChange={this.props.handleChange('type')}
                    >
                        <option>Vaccine</option>
                        <option>Covid Test</option>    
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{this.props.values.type==="Vaccine" ? "Vaksin" : "Tes Covid"} :</Form.Label>
                    <Form.Control  
                        type="text" 
                        placeholder={this.props.values.type==="Vaccine" ? "Jenis vaksin" : "Jenis Tes"} 
                        value={this.props.values.cert_name} 
                        onChange={this.props.handleChange('cert_name')}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{this.props.values.type==="Vaccine" ? "Dosis" :"Hasil tes"}</Form.Label>
                    <Form.Control  
                        type="text" 
                        placeholder={this.props.values.type==="Vaccine" ? "Dosis" :"Hasil tes"}
                        value={this.props.values.type==="Vaccine" ? this.props.values.dose : this.props.values.test_result} 
                        onChange={this.props.handleChange(this.props.values.type==="Vaccine" ? 'dose' : 'test_result')}
                    />
                </Form.Group>
                <button type="submit" onClick={ Previous }>Previous</button>
                <button type="submit" onClick={ Continue }>Next</button>
            </Form>
        )
    }
}

export default CertificateType