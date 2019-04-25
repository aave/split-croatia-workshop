import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import RowHeader from "./rowHeader";
import ActionButton from "./actionButton";
import {
  getUserDataLendingPool,
  getDAIBalance,
  getLENDBalance,
  getAvailableAmountToBorrow,
  getLENDAllowance,
  LendingPoolGanacheAddress,
  approveLENDTransfer,
  defaultApprovalAmount,
  getDAIAllowance,
  approveDAITransfer,
  depositLiquidity,
  MockLendAddress,
  defaultDepositAmount,
  MockDAIAddress,
  borrow
} from "../utils/contracts";

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "Loading",
      balanceDAI: "Loading",
      balanceLEND: "Loading",
      liquidityBalance: "Loading",
      borrowedBalance: "Loading",
      availableAmountToBorrow: "Loading"
    };
  }

  async componentDidMount() {
    const address = (await window.web3.eth.getAccounts())[0];
    const balanceDAI = await getDAIBalance(window.web3, address);
    const balanceLEND = await getLENDBalance(window.web3, address);
    const allowanceLEND = await getLENDAllowance(
      window.web3,
      address,
      LendingPoolGanacheAddress
    );
    console.log("LEND allowance :", allowanceLEND);
    const allowanceDAI = await getDAIAllowance(
      window.web3,
      address,
      LendingPoolGanacheAddress
    );
    console.log("DAI allowance :", allowanceDAI);
    const lendingPoolUserData = await getUserDataLendingPool(
      window.web3,
      address
    );
    const liquidityBalance = lendingPoolUserData.liquidityBalance;
    const borrowedBalance = lendingPoolUserData.borrowedBalance;
    const availableAmountToBorrow = getAvailableAmountToBorrow(
      liquidityBalance,
      borrowedBalance
    );
    this.setState({
      address,
      balanceDAI,
      balanceLEND,
      liquidityBalance,
      borrowedBalance,
      availableAmountToBorrow
    });
  }

  render() {
    const {
      address,
      balanceDAI,
      balanceLEND,
      borrowedBalance,
      liquidityBalance,
      availableAmountToBorrow
    } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <RowHeader>Your address</RowHeader>
            <Row>{address}</Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <RowHeader>Your DAI balance</RowHeader>
            <Row>{balanceDAI} DAI</Row>
          </Col>
          <Col>
            <RowHeader>Your LEND balance</RowHeader>
            <Row>{balanceLEND} LEND</Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <RowHeader>Liquidity Balance</RowHeader>
            <Row>{liquidityBalance} USD</Row>
          </Col>
          <Col>
            <RowHeader>Borrowed Balance</RowHeader>
            <Row>{borrowedBalance} USD</Row>
          </Col>
          <Col>
            <RowHeader>Available to Borrow</RowHeader>
            <Row>{availableAmountToBorrow} USD</Row>
          </Col>
        </Row>
        <Row>
          <Col>
            {(address === "Loading" && "Loading") || (
              <ActionButton
                text="Approve LEND"
                onClick={() =>
                  approveLENDTransfer(
                    window.web3,
                    address,
                    LendingPoolGanacheAddress,
                    defaultApprovalAmount
                  )
                }
              />
            )}
          </Col>
          <Col>
            {(address === "Loading" && "Loading") || (
              <ActionButton
                text="Deposit DAI"
                onClick={() =>
                  depositLiquidity(
                    window.web3,
                    address,
                    MockDAIAddress,
                    defaultDepositAmount
                  )
                }
              />
            )}
          </Col>
          <Col>
            {(address === "Loading" && "Loading") || (
              <ActionButton
                text="Borrow LEND"
                onClick={() =>
                  borrow(
                    window.web3,
                    address,
                    MockLendAddress,
                    defaultDepositAmount
                  )
                }
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {(address === "Loading" && "Loading") || (
              <ActionButton
                text="Approve DAI"
                onClick={() =>
                  approveDAITransfer(
                    window.web3,
                    address,
                    LendingPoolGanacheAddress,
                    defaultApprovalAmount
                  )
                }
              />
            )}
          </Col>
          <Col>
            {(address === "Loading" && "Loading") || (
              <ActionButton
                text="Deposit LEND"
                onClick={() =>
                  depositLiquidity(
                    window.web3,
                    address,
                    MockLendAddress,
                    defaultDepositAmount
                  )
                }
              />
            )}
          </Col>
          <Col>
            {(address === "Loading" && "Loading") || (
              <ActionButton
                text="Borrow DAI"
                onClick={() =>
                  borrow(
                    window.web3,
                    address,
                    MockDAIAddress,
                    defaultDepositAmount
                  )
                }
              />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
