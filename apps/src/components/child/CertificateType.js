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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                        placeholder="Vaccine/Tes" 
                        value={this.props.values.Name} 
                        onChange={this.props.handleChange('cert_name')}
                    >
                        <option>Vaccine</option>
                        <option>Covid Test</option>    
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Hasil tes</Form.Label>
                    <Form.Control  
                        type="text" 
                        placeholder="Hasil Tes" 
                        value={this.props.values.result} 
                        onChange={this.props.handleChange('result')}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Dosis</Form.Label>
                    <Form.Control
                        required  
                        type="text" 
                        placeholder="Dosis" 
                        value={this.props.values.dose} 
                        onChange={this.props.handleChange('dose')}
                    />
                </Form.Group>
                <button onClick={ Previous }>Previous</button>
                <button onClick={ Continue }>Next</button>
            
            </Form>
        )
    }
}

export default CertificateType