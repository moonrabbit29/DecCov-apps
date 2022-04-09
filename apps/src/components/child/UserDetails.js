import React  from "react"
import { Form } from 'react-bootstrap';

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render(){
        const Continue = e => {
            e.preventDefault();
            this.props.nextStep();
        }
        return(
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nama</Form.Label>
                    <Form.Control  
                        required
                        type="text" 
                        placeholder="Nama pemilik sertifikat" 
                        value={this.props.values.Name} 
                        onChange={this.props.handleChange('Name')}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>NIK</Form.Label>
                    <Form.Control  
                        required
                        type="text" 
                        placeholder="NIK pemilik sertifikat" 
                        value={this.props.values.NIK} 
                        onChange={this.props.handleChange('NIK')}
                    />
                </Form.Group>
                <button onClick={ Continue }>Next</button>
            </Form>
        )
    }
}

export default UserDetail