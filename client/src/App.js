import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import { Container, Row } from "react-bootstrap";
import NavBar from "./components/navBar";
import UserInfo from "./components/userInfo";
import Market from "./components/market";
import provider from "./utils/provider";
import Notfound from "./components/notFound";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  disableLoading = () => this.setState({ loading: false });

  async componentDidMount() {
    provider.metamask(this.disableLoading);
  }

  render() {
    const { loading } = this.state;

    return (
      <Router>
        <Container fluid>
          <Row>
            <NavBar />
          </Row>
          {(loading && "LOADING") || (
            <>
              <Switch>
                <Route exact path="/" component={UserInfo} />
                <Route path="/markets" component={Market} />
                <Route component={Notfound} />
              </Switch>
            </>
          )}
        </Container>
      </Router>
    );
  }
}
