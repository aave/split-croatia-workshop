import React from 'react';
import { Container, Navbar, Nav, Alert } from 'react-bootstrap';
import AaveImg from '../images/AAVE.png';

export default class NavBar extends React.Component {
    constructor(props, context) {
        super(props, context);
	this.updateMetamaskInfo = this.updateMetamaskInfo.bind(this);

        this.state = {
            network: 0,
            address: "",
        };

	if (typeof window.web3.currentProvider.publicConfigStore !== 'undefined') {
            window.web3.currentProvider.publicConfigStore.on(
                'update', updated => this.setState(
                    { 
                        address: updated.selectedAddress,
                        network: Number(updated.networkVersion)
                    })
            );
        }
    }

    updateMetamaskInfo() {
	    this.setState({ 
		    address: window.ethereum.selectedAddress,
		    network: Number(window.ethereum.networkVersion), 
	    })
    }

    componentDidMount() {
	    this.updateMetamaskInfo();	
    }

    render() {
	    const address = this.state.address;
	    const changeNetwork = this.state.network !== (42 || 0) ? true : false;
        
        return (
            <Container>
                { changeNetwork ? <Alert variant="dark">Aave Lending Pool is currently only available on Kovan Testnet</Alert> : null }  
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
			        <Nav variant="tabs" className="justify-content-center">
     			        <Nav.Link href="/" >APP </Nav.Link>
      			        <Nav.Link href="/markets" >MARKETS</Nav.Link>
    		        </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Item style={{color:'#6c757d', padding: 10}}> USD </Nav.Item>
                        <Nav.Item style={{color:'#6c757d', padding: 10}}> {address} </Nav.Item>
                    </Nav>
                </Navbar>
            </Container>
        );
    }
}
