import React from 'react';
import { Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import NavBar from './navBar';
import DaiImg from '../images/asset_DAI.png';
import EthImg from '../images/asset_ETH.png';

export default class Pool extends React.Component {

  render() {

    return (
        <Container>
	     <Row>
		    <NavBar />
		</Row>
             <Row>
                <Col>
		            <Row>Gross Supply</Row>
		            <Row>4545453453</Row> 
		        </Col>
                <Col>
		            <Row>Gross Borrow</Row>
		            <Row>4343242000</Row> 
		        </Col>
		        <Col>
		            <Row>Collateral Req.</Row>
		            <Row>1.5x</Row> 
		        </Col>
			    <Col>
		            <Row>Liquidation Discount</Row>
		            <Row>5.00%</Row> 
		        </Col>
			    <Col>
		            <Row>Origination Fee</Row>
		            <Row>0.025%</Row> 
		        </Col>
            </Row>
            <ListGroup>
                <ListGroup.Item>
					<Row>
						<Col><Image src={DaiImg} width="25" height="25" roundedCircle />DAI $1.00</Col>
                		<Col>
							<Row>
							    Market Liquidity
							</Row>
							<Row>
							    12732392183
							</Row>
						</Col>		
					</Row>
					<Row>
						<Col>
							<Row>
							    Available Liquidity
							</Row>
							<Row>
							    12732392183
							</Row>
						</Col>
                        <Col>
							<Row>
							    Total Borrows
							</Row>
							<Row>
							    12732392183
							</Row>
						</Col>
					</Row>
					<Row>
						<Col>
							<Row>
							    Supply APR
							</Row>
							<Row>
							    3%
							</Row>
						</Col>
                	    <Col>
							<Row>
							    Borrow APR
							</Row>
							<Row>
							    13%
							</Row>
						</Col>
					</Row>
            	</ListGroup.Item>
            	<ListGroup.Item>
					<Row>
						<Col><Image src={EthImg} width="25" height="25" roundedCircle />ETH $165.20</Col>
                		<Col>
							<Row>
							    Market Liquidity
							</Row>
							<Row>
							    12732392183
							</Row>
						</Col>		
					</Row>
					<Row>
						<Col>
							<Row>
							    Available Liquidity
							</Row>
							<Row>
							    12732392183
							</Row>
						</Col>
						<Col>
							<Row>
							    Total Borrows
							</Row>
							<Row>
							    12732392183
							</Row>
						</Col>	
					</Row>
					<Row>
						<Col>
							<Row>
							    Supply APR
							</Row>
							<Row>
							    3%
							</Row>
						</Col>
						<Col>
							<Row>
							    Borrow APR
							</Row>
							<Row>
							    13%
							</Row>
						</Col>	
					</Row>
				</ListGroup.Item>
            </ListGroup>
        </Container>
    );
  }
}
