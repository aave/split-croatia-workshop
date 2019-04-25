import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, ListGroup, Image } from "react-bootstrap";
import DaiImg from "../images/asset_DAI.png";
import LendImg from "../images/asset_LEND.png";

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
                <Col>
                  <Image src={DaiImg} width="25" height="25" roundedCircle />
                  DAI
                </Col>
                <Col>15%</Col>
                <Col>321</Col>
              </Row>
            </Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <Link to="/Asset/ETH">
              <Row>
                <Col>
                  <Image src={LendImg} width="25" height="25" roundedCircle />
                  LEND
                </Col>
                <Col>5%</Col>
                <Col>54</Col>
              </Row>
            </Link>
          </ListGroup.Item>
        </ListGroup>
      </Container>
    );
  }
}
