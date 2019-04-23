import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function simulateNetworkRequest() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

export default class Asset extends React.Component {
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
                
            </Row>
            <Row>
                <Col>Available Liquidity: 700</Col>
            </Row>
            <Row>
                <Col>Total Borrows: 300</Col>
            </Row>
            <Row>
                <Col> Interest Rate: 4</Col>
            </Row>
        </Container>
    );
  }
}
