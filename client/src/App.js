import React from 'react';
import './App.css';
import { Container, Row } from 'react-bootstrap'
import NavBar from './components/navBar';
import Pool from './components/pool';
import UserInfo from './components/userInfo';

export default class App extends React.Component {

    render() {
        return (
            <Container>
		        <Row>
		            <NavBar />
		        </Row>
                <Row>
                    <UserInfo />
                </Row>
                <Row>
                    <Pool />
                </Row>
            </Container>
        )   
    }
}
