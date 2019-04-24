import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default class WithdrawForm extends React.Component {
  render() {

    return (
	<Form>
	  <Form.Group as={Row} controlId="CompundBalance">
	    <Form.Label>
	      Compund Balance
	    </Form.Label>
	    <Col>
	      <Form.Control plaintext readOnly defaultValue="43222.544" />
	    </Col>                                                                                                                                                                       
          </Form.Group>                                                                                                                                                                    
          <Form.Group as={Row} controlId="formWithdraw">                                                                                                                         
            <Form.Control type="text" placeholder="Amount in DAI" />                                                                                                                     
          </Form.Group>                                                                                                                                                                    
          <Button variant="dark" type="submit">
	    WITHDRAW
	  </Button>                                                                                                                                                                        
        </Form>  
    );
  }
}
