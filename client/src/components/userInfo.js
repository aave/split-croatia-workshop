import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RowHeader from "./rowHeader";
import DepositButton from "./depositButton";

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: "LOADING"
    };
  }

  async componentDidMount() {
    this.setState({ userAddress: await window.web3.eth.getAccounts() });
  }

  render() {
    const { userAddress } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <RowHeader>Your address</RowHeader>
            <Row>{userAddress}</Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <RowHeader>Liquidity Balance</RowHeader>
            <Row>1000 USD</Row>
          </Col>
          <Col>
            <RowHeader>Borrowed Balance</RowHeader>
            <Row>3000 USD</Row>
          </Col>
          <Col>
            <RowHeader>Available to Borrow</RowHeader>
            <Row>150 USD</Row>
          </Col>
        </Row>
        <Row>
          <Col>
            You can borrow any asset, as long as you maintain a Supply Balance
            1.5x your Borrow Balance
          </Col>
        </Row>
        <Row>
          <Col>
            <DepositButton />
          </Col>
        </Row>
      </Container>
    );
  }
}
