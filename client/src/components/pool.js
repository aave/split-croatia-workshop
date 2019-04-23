import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

function simulateNetworkRequest() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}

export default class Pool extends React.Component {
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
				<Col>Asset</Col>
 				<Col>Rate(APR)</Col>
				<Col>Balance</Col>
            </Row>
            <ListGroup>
				<ListGroup.Item>
					<a href='#Asset/DAI'>
						<Row>
                			<Col>DAI</Col>
							<Col>5.54%</Col>
							<Col>321</Col>
						</Row>
					</a>
            	</ListGroup.Item>
            	<ListGroup.Item>
					<a href='#Assets/ETH'>
						<Row>
                			<Col>Ether</Col>
							<Col>1.43%</Col>
							<Col>54</Col>
						</Row>
					</a>
				</ListGroup.Item>
            </ListGroup>
        </Container>
    );
  }
}
