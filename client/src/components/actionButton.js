import React from "react";
import Button from "react-bootstrap/Button";

export default class ActionButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isLoading: false
    };
  }

  async handleClick() {
    const { onClick } = this.props;
    this.setState({ isLoading: true });
    await onClick();
    this.setState({ isLoading: false });
  }

  render() {
    const { isLoading } = this.state;
    const { text } = this.props;

    return (
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? this.handleClick : null}
      >
        {isLoading ? "Waiting Confirmation…" : text}
      </Button>
    );
  }
}
