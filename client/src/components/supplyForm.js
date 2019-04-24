import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default class SupplyForm extends React.Component {
  render() {

    return (
	<Form>
	  <Form.Group as={Row} controlId="formWalletBalance">
	    <Form.Label>
	      Wallet Balance
	    </Form.Label>
	    <Col>
	      <Form.Control plaintext readOnly defaultValue="54534.545435" />
	    </Col>                                                                                                                                                                       
          </Form.Group>                                                                                                                                                                    
          <Form.Group as={Row} controlId="formSupplyContribution">                                                                                                                         
            <Form.Control type="text" placeholder="Amount in DAI" />                                                                                                                     
          </Form.Group>                                                                                                                                                                    
          <Button variant="dark" type="submit">
	    SUPPLY
	  </Button>                                                                                                                                                                        
        </Form>  
    );
  }
}
