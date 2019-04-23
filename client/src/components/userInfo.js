import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function simulateNetworkRequest() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

export default class UserInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isLoading: false,
    };
  }

  handleClick() {
    this.setState({ isLoading: true }, () => {
      simulateNetworkRequest().then(() => {
        this.setState({ isLoading: false });
      });
    });
  }

  render() {
    //const { isLoading } = this.state;

    return (
        <Container>
            <Row>
                <Col>
		            <Row>Supply Balance</Row>
		            <Row>1000</Row> 
		        </Col>
                <Col>
		            <Row>Borrow Balance</Row>
		            <Row>3000</Row> 
		        </Col>
		        <Col>
		            <Row>Available to Borrow</Row>
		            <Row>150</Row> 
		        </Col>
            </Row>
            <Row>
                You can borrow any asset, as long as you maintain a Supply Balance 1.5x your Borrow Balance
            </Row>
        </Container>
    );
  }
}
