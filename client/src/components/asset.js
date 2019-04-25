import React from 'react';
import { Container, Row, Col, Image, ButtonToolbar, Button } from 'react-bootstrap';
import NavBar from './navBar';
import HomeButton from './homeButton';
import SupplyForm from './supplyForm';
import WithdrawForm from './withdrawForm';
import DaiImg from '../images/asset_DAI.png';
import EthImg from '../images/asset_ETH.png';

export default class Asset extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.toolbarClick = this.toolbarClick.bind(this);

    this.state = {
      network: 0,
      address: "",
      isSupply: true,
    };
  }

    toolbarClick() {
        this.setState({ isSupply: !this.state.isSupply })
    }

  render() {
    const { params } = this.props.match
    const { isSupply } = this.state;  

    return (
        <Container>
	        <Row>
		        <NavBar />
	        </Row>
            <Row>
                <HomeButton />               
            </Row>
            <Row>
                <Col>
                    <Row><Image src={params.simbol === "DAI"? DaiImg : EthImg} alt={params.simbol} width="25" height="25" roundedCircle /> {params.simbol} </Row>
                    <Row> Supply Balance: 29201921 </Row>
                    <Row> Interest Rate: 4.5% </Row>
                    <Row> Interest Earned: 31231.3231 {params.simbol} </Row>
                </Col>
                <Col>
                    <Row>
                        <ButtonToolbar>
                            <Button variant="dark" disabled={isSupply} onClick={this.toolbarClick} active>Supply</Button>
                            <Button variant="dark" disabled={!isSupply} onClick={this.toolbarClick} active>Withdraw</Button>
                        </ButtonToolbar>
                    </Row>
                    <Row>
                        {isSupply? <SupplyForm /> : <WithdrawForm />}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
  }
}
