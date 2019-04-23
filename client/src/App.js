import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row } from 'react-bootstrap'
import Pool from './components/pool';
import UserInfo from './components/userInfo';

export default class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Container>
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
