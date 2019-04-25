import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import AaveImg from "../images/AAVE.png";

class NavBar extends React.Component {
  render() {
    return (
      <Container>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <img
              alt="AAVE"
              src={AaveImg}
              width="90"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          {/* <Nav variant="tabs">
            <Nav.Link href="/">Dashboard </Nav.Link>
            <Nav.Link href="/markets">Markets</Nav.Link>
          </Nav> */}
        </Navbar>
      </Container>
    );
  }
}

export default withRouter(NavBar);
