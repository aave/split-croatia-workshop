import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Navbar, Nav, Alert } from 'react-bootstrap';
import AaveImg from '../images/AAVE.png';
import metamask from '../utils/provider';
import { providers } from 'ethers';

class NavBar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            network: false,
        };
    }
    componentWillMount() {
        metamask();
        let provider = new providers.Web3Provider(window.web3.currentProvider);
        provider.getNetwork().then(currentNetwork => this.setState({ network: currentNetwork.name !== "kovan" ? true : false }) );
    }

    render() {

        return (
            <Container>
                { this.state.network ? <Alert variant="dark">Aave Lending Pool is currently only available on Kovan Testnet</Alert> : null }  
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="https://aave.com/">
		    	        <img
        		            alt="AAVE"
        		            src={AaveImg}
        		            width="90"
        		            height="30"
        		            className="d-inline-block align-top"
      		            />
			        </Navbar.Brand>
			        <Nav variant="tabs" className="justify-content-end">
     			        <Nav.Link href="/" >APP </Nav.Link>
      			        <Nav.Link href="/markets" >MARKETS</Nav.Link>
    		        </Nav>
                </Navbar>
            </Container>
        );
    }
}

export default withRouter(NavBar)
