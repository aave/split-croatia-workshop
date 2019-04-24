import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import DaiImg from '../images/asset_DAI.png';
import EthImg from '../images/asset_ETH.png';

export default class Pool extends React.Component {

  render() {

    return (
        <Container>
            <Row>
				<Col>Asset</Col>
 				<Col>Rate(APR)</Col>
				<Col>Balance</Col>
            </Row>
            <ListGroup>
				<ListGroup.Item>
                    <Link to="/Asset/DAI">
						<Row>
                			<Col><Image src={DaiImg} width="25" height="25" roundedCircle />DAI</Col>
							<Col>5.54%</Col>
							<Col>321</Col>
						</Row>
					</Link>
            	</ListGroup.Item>
            	<ListGroup.Item>
					<Link to="/Asset/ETH"> 
						<Row>
                			<Col><Image src={EthImg} width="25" height="25" roundedCircle />Ether</Col>
							<Col>1.43%</Col>
							<Col>54</Col>
						</Row>
					</Link>
				</ListGroup.Item>
            </ListGroup>
        </Container>
    );
  }
}
