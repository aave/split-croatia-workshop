import React from 'react';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';
import provider from '../utils/provider';

class HomeButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

  }

  componentDidMount() {
    provider.metamask()
  }

  handleClick() {
    this.props.history.push('/')
  }

  render() {

    return (
      <Button
        variant="outline-dark"
        onClick={this.handleClick}
      >
           ⇦ Back to Overview
      </Button>
    );
  }
}

export default withRouter(HomeButton)
